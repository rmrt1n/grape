/**
 * @typedef {{
 *   companyId: number;
 *   name: string;
 * }} Company
 * 
 * @typedef {('plantation' | 'mill' | 'crusher' | 'refinery')} SiteType
 *
 * @typedef {{
 *   siteId: number;
 *   name: string;
 *   location: string;
 *   type: SiteType; 
 * }} Site
 *
 * @typedef {('ffb' | 'cpo' | 'pk' | 'cpko' | 'rpo' | 'rpko')} BatchType
 *
 * @typedef {{
 *   batchId: number;
 *   weight: number;
 *   createdAt: Date;
 *   eliability: Eliability;
 * }} Batch
 *
 * @typedef {{
 *   emissionId: number;
 *   emissionValue: number;
 *   scope: number;
 * }} Emission
 *
 * @typedef {{
 *   eliabilityId: number;
 *   recipient: Site;
 *   directEmissions: number;
 *   totalEmissions: number;
 *   emissions: Emission[];
 * }} Eliability
 *
 * @typedef {{
 *   batchId: number;
 *   eliabilityId: number;
 *   siteName: string;
 *   directEmissions: number;
 *   totalEmissions: number;
 *   emissions: Emission[];
 *   parents: EliabilityTree[];
 * }} EliabilityTree
 */


/** 
 * @param {{
 *  site_id: number;
 *  name: string;
 *  location: string;
 *  type: SiteType;
 * }} RawSite
 * @returns Site
 */
export const fmtSite = ({ site_id: siteId, ...rest }) => ({ siteId, ...rest })

/**
 * @param {{
 *   emission_id: number;
 *   emission_value: number;
 *   scope: number;
 * }} RawEmission
 * @returns Emission
 */
export const fmtEmission = ({ emission_value: emissionValue, scope, ..._rest }) => ({ emissionValue, scope })

/**
 * @param {{
 *  batch_id: number;
 *  weight: number;
 *  site_id: number;
 *  created_at: string;
 *  type: string;
 *  eliabilities: {
 *    eliability_id: number;
 *    total_emissions: number;
 *    direct_emissions: number;
 *    sites: {
 *      site_id: number;
 *      name: string;
 *      location: string;
 *      type: SiteType;
 *    };
 *    emissions: {
 *      emission_id: number;
 *      emission_value: number;
 *      scope: number;
 *    }[];
 *  }[];
 * }} RawBatch
 * @returns Batch
 */
export const fmtBatch = ({
  batch_id: batchId,
  site_id: _deleted,
  created_at: date,
  eliabilities: [{ sites: s, emissions: em }],
  eliabilities: [e],
  ...rest
}) => ({
  batchId,
  createdAt: new Date(date),
  eliability: {
    eliabilityId: e.eliability_id,
    totalEmissions: e.total_emissions,
    directEmissions: e.direct_emissions,
    recipient: s ? fmtSite(s) : { siteId: -1, name: 'NA', location: '', type: 'refinery' },
    emissions: em.map(fmtEmission),
  },
  ...rest
})

/**
 * @param {{
 *   batch_id: string;
 *   created_at: string;
 *   eliability_id: number;
 *   recipient_site_id: number;
 *   direct_emissions: number;
 *   total_emissions: number;
 *   batches: {
 *     weight: number;
 *     sites: { name: string; }
 *   };
 *   emissions: {
 *    emission_id: number;
 *    emission_value: number;
 *    scope: number;
 *   }[];
 * }} RawEliability
 * @returns EliabilityTree
*/
export const fmtEliability = ({
  batch_id: batchId,
  eliability_id: eliabilityId,
  direct_emissions: directEmissions,
  total_emissions: totalEmissions,
  batches: b,
  emissions: em,
}) => ({
  batchId,
  weight: b.weight,
  siteName: b.sites.name,
  eliabilityId,
  directEmissions,
  totalEmissions,
  emissions: em.map(fmtEmission),
  parents: [],
})

export { };
