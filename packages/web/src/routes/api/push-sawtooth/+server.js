import { json, error } from '@sveltejs/kit';
import { createHash } from 'crypto';
import { CryptoFactory, createContext } from 'sawtooth-sdk-js/signing';
import { Secp256k1PrivateKey } from 'sawtooth-sdk-js/signing/secp256k1';
import { protobuf } from 'sawtooth-sdk-js';

import { SAWTOOTH_PRIVATE_KEY, SAWTOOTH_URL } from '$env/static/private';

const hash = (x) => createHash('sha512').update(x).digest('hex');

const GRAPE_FAMILY = 'grape';
const GRAPE_NAMESPACE = hash(GRAPE_FAMILY).substring(0, 6);

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ fetch, url, locals }) => {
	if (!url.searchParams.get('id')) throw error(500, 'error: missing parameter "id"');
	if (isNaN(url.searchParams.get('id'))) throw error(500, 'error: "id" is not number');

	const id = Number(url.searchParams.get('id'));
	const {
		data: { json: payload },
		error: err
	} = await locals.supabase
		.from('eliability_jsons')
		.select('json')
		.eq('eliability_id', id)
		.single();

	if (err) {
		throw error(500, err.message);
	}

	const res = await sawtooth_write(`push|${JSON.stringify(payload)}`);

	if (res.status !== 202) {
		throw error(500, 'error writing to sawtooth state');
	}

	return json({ success: true, payload });
};

/**
 * @param {string} payload
 * @returns Payload
 */
const sawtooth_write = async (payload) => {
	const context = createContext('secp256k1');
	const privateKey = Secp256k1PrivateKey.fromHex(SAWTOOTH_PRIVATE_KEY);
	const signer = new CryptoFactory(context).newSigner(privateKey);
	const publicKey = signer.getPublicKey().asHex();
	const address = GRAPE_NAMESPACE + hash(publicKey).substring(0, 64);
	const encoder = new TextEncoder();
	const payloadBytes = encoder.encode(payload);

	const transactionHeaderBytes = protobuf.TransactionHeader.encode({
		familyName: GRAPE_FAMILY,
		familyVersion: '1.0',
		inputs: [address],
		outputs: [address],
		signerPublicKey: publicKey,
		nonce: '' + Math.random(),
		batcherPublicKey: publicKey,
		dependencies: [],
		payloadSha512: hash(payloadBytes)
	}).finish();

	const transaction = protobuf.Transaction.create({
		header: transactionHeaderBytes,
		headerSignature: signer.sign(transactionHeaderBytes),
		payload: payloadBytes
	});

	const transactions = [transaction];

	const batchHeaderBytes = protobuf.BatchHeader.encode({
		signerPublicKey: publicKey,
		transactionIds: transactions.map((e) => e.headerSignature)
	}).finish();

	const batchSignature = signer.sign(batchHeaderBytes);

	const batch = protobuf.Batch.create({
		header: batchHeaderBytes,
		headerSignature: batchSignature,
		transactions: transactions
	});

	const batchListBytes = protobuf.BatchList.encode({
		batches: [batch]
	}).finish();

	const res = await fetch(`${SAWTOOTH_URL}/batches`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/octet-stream' },
		body: batchListBytes
	});

	return res;
};
