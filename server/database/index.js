import Sequelize from 'sequelize';
import { getLogger, isProdEnv, isTestEnv, logger } from '@server/utils';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

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
      let databaseUrl;
      let hostName;
      let databasePort;
      if (isProdEnv()) {
        const { username, host, dbname, password, port } = JSON.parse(process.env.GRAPHQLSERVERCLUSTER_SECRET);
        hostName = host;
        databasePort = port;
        databaseUrl = `mysql://${username}:${password}@${host}:${port}/${dbname}`;
      } else {
        dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });
        databaseUrl = process.env.DB_URI;
      }
      client = new Sequelize(databaseUrl, {
        hostName,
        databasePort,
        logging: isTestEnv() ? false : getLogger(),
        dialect: 'mysql',
        dialectModule: mysql2,
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
