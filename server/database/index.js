import Sequelize from 'sequelize';
import { getLogger, isTestEnv, logger } from '@server/utils';

let client;
let namespace;
const cls = require('cls-hooked');
export const getClient = force => {
  if (!namespace) {
    namespace = cls.createNamespace(`${process.env.ENVIRONMENT_NAME}-namespace`);
  }
  if (force || !client) {
    try {
      if (!isTestEnv()) {
        Sequelize.useCLS(namespace);
      }
      client = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        logging: isTestEnv() ? false : getLogger(),
        dialect: 'mysql',
        pool: {
          min: 0,
          max: 10,
          idle: 10000
        },
        retry: {
          match: [
            'unknown timed out',
            Sequelize.TimeoutError,
            'timed',
            'timeout',
            'TimeoutError',
            'Operation timeout',
            'refuse',
            'SQLITE_BUSY'
          ],
          max: 10 // maximum amount of tries
        }
      });
    } catch (err) {
      logger().info({ err });
      throw err;
    }
  }
  return client;
};
export const connect = async () => {
  client = getClient();
  try {
    await client.authenticate();
    console.log('Connection has been established successfully.\n', {
      db: process.env.MYSQL_DB,
      user: process.env.MYSQL_USER,
      host: process.env.MYSQL_HOST
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
export { client };
