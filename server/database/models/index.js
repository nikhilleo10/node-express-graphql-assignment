import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getClient } from '../index';

export const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

const sequelize = getClient();

db.userModel = require('@database/models/user').model(sequelize, Sequelize.DataTypes);
db.driverModel = require('@database/models/driver').model(sequelize, Sequelize.DataTypes);
db.customerModel = require('@database/models/customer').model(sequelize, Sequelize.DataTypes);
db.vehicleModel = require('@database/models/vehicle').model(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

export default db;
