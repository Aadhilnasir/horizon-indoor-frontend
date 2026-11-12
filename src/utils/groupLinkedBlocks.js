// src/utils/groupLinkedBlocks.js
// Display only: folds the linked-court block rows that
// FacilityBlockController@store auto-creates into their main row.
//
// Row L is a linked row of main row M when:
//  - M's facility.linked_facility_ids contains L.facility_id (forward links only)
//  - start_date, end_date and reason are equal
//  - L.id > M.id (store creates the main row first)
//
// Returns the main rows in their original order, each with linkedNames.
export default function groupLinkedBlocks(blocks, facilities) {
  // null / undefined / non-array input is treated as []
  const list = (Array.isArray(blocks) ? blocks : []).filter(Boolean);
  const facs = (Array.isArray(facilities) ? facilities : []).filter(Boolean);
  const facilityById = new Map(facs.map(f => [Number(f.id), f]));
  const claimed = new Set();
  const linkedNamesById = new Map();

  // Lowest id first, so a main row is handled before its linked rows
  const byId = [...list].sort((a, b) => Number(a.id) - Number(b.id));

  byId.forEach(m => {
    const mId = Number(m.id);
    if (claimed.has(mId)) return;

    const rawLinked = facilityById.get(Number(m.facility_id))?.linked_facility_ids;
    const linkedIds = (Array.isArray(rawLinked) ? rawLinked : []).map(Number);
    const names = [];

    linkedIds.forEach(linkedFacilityId => {
      // One linked row per linked court: the first unclaimed match after M
      const match = byId.find(l =>
        Number(l.id) > mId &&
        !claimed.has(Number(l.id)) &&
        Number(l.facility_id) === linkedFacilityId &&
        l.start_date === m.start_date &&
        l.end_date === m.end_date &&
        l.reason === m.reason
      );
      if (match) {
        claimed.add(Number(match.id));
        if (match.facility) names.push(match.facility);
      }
    });

    linkedNamesById.set(mId, names);
  });

  return list
    .filter(b => !claimed.has(Number(b.id)))
    .map(b => ({ ...b, linkedNames: linkedNamesById.get(Number(b.id)) || [] }));
}
