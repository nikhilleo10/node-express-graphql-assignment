import { sequelizedWhere } from '@server/database/dbUtils';

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

export function formatForOrderByClause(db, args) {
  // Replacing leading and trailing commas if any.
  args = args.replace(/,\s*$/, '').replace(/^,/, '');
  // eslint-disable-next-line array-callback-return
  return args.split(',').map(orderClause => {
    orderClause = orderClause.trim();
    if (orderClause) {
      const queryArgs = orderClause.trim().split(' ');
      if (queryArgs.length) {
        const [orderByCol, orderByType] = queryArgs;
        const query = 'queryColumn'.replace('queryColumn', orderByCol);
        return [db.sequelize.literal(query), `${orderByType}`];
      }
    }
  });
}
