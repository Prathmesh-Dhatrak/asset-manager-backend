import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dataPath: {
    users: 'src/data/users.json',
    assets: 'src/data/assets.json',
  },
};

export default config;