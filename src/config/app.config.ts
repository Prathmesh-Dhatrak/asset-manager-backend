import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  dataPath: {
    users: 'src/data/users.json',
    assets: 'src/data/assets.json',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/asset-mgmt-db'
  },
  jwt: {
    SECRET: "LJKKJSDFKLJKK*&*234234234",
    JWT_EXPIRATION: "24h"
  }

};

export default config;