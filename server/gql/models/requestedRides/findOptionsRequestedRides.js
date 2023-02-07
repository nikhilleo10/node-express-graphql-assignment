import { sequelizedWhere } from '@server/database/dbUtils';
import { TRIP_STATUS_TYPES, formatForOrderByClause } from '@server/utils/constants';

export function getFindOptionsRequstedRides(db, findOptions, args) {
  if (!args.where.custId && args.where.tripStatus !== TRIP_STATUS_TYPES.PENDING) {
    return false;
  }
  findOptions.include = findOptions.include || [];
  const typeToInclude = args.where.tripStatus;
  if (typeToInclude === TRIP_STATUS_TYPES.COMPLETED) {
    findOptions.include.push({
      model: db.completedRideModel,
      as: 'completed_ride'
    });
  } else if (typeToInclude === TRIP_STATUS_TYPES.CANCELLED) {
    findOptions.include.push({
      model: db.incompleteRideModel,
      as: 'incomplete_ride'
    });
  }
  findOptions.where = sequelizedWhere(findOptions.where, args.where);
  findOptions.order = formatForOrderByClause(db, args.order);
  return findOptions;
}
