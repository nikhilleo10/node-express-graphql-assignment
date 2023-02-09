require('dotenv').config();

let DB_URI;

if (process.env.ENVIRONMENT_NAME === 'production') {
  const { username, host, dbname, password, port } = JSON.parse(process.env.GRAPHQLSERVERCLUSTER_SECRET);
  DB_URI = `mysql://${username}:${password}@${host}:${port}/${dbname}`;
} else {
  DB_URI = process.env.DB_URI;
}

module.exports = {
  url: DB_URI,
  logging: true,
  dialect: 'mysql',
  options: {
    pool: {
      min: 0,
      max: 10,
      idle: 10000
    },
    define: {
      userscored: true,
      timestamps: false
    }
  }
};
