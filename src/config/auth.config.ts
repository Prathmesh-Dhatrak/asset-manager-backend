import dotenv from 'dotenv';

dotenv.config();

const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_do_not_use_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  saltRounds: 10,
};

export default authConfig;