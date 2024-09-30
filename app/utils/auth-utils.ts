import { encodeGlobalID } from '@pothos/plugin-relay';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '~/config/env.server';

export const hashPassword = (rawPassword: string) => {
  const saltRounds = 10;
  return bcrypt.hash(rawPassword, saltRounds);
};

export const verifyPassword = (args: { rawPassword: string; hashedPassword: string }) => {
  const { rawPassword, hashedPassword } = args;
  return bcrypt.compare(rawPassword, hashedPassword);
};

export const jwtSign = (userId: string, payload: object = {}) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    subject: encodeGlobalID('User', userId),
    expiresIn: env.JWT_EXPIRATION,
  });
};

export const jwtVerify = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
