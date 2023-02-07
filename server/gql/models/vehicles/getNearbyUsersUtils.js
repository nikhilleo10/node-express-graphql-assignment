import { sequelizedWhere } from '@server/database/dbUtils';
import { formatForOrderByClause } from '@server/utils/constants';

export function getFindOptions(db, findOptions, args, context) {
  const cooridnates = args.points.split(' ');
  const locationSql = db.sequelize.literal(`ST_GeomFromText('POINT(${cooridnates[0]} ${cooridnates[1]})')`);
  findOptions.include.push({
    model: db.driverModel,
    as: 'driver',
    include: [
      {
        model: db.userModel,
        as: 'user',
        attributes: [
          'firstName',
          'lastName',
          'typeOfUser',
          'email',
          'dateOfBirth',
          'id',
          [db.sequelize.fn('ST_Distance_Sphere', db.sequelize.literal('location'), locationSql), 'distance_in_km']
        ]
      }
    ]
  });
  findOptions.raw = true;
  findOptions.nest = true;
  findOptions.order = formatForOrderByClause(db, args.order);
  findOptions.where = sequelizedWhere(findOptions.where, args.where);
  return findOptions;
}
