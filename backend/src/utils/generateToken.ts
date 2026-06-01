
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
import { TokenPayload, AuthTokens } from '../types/auth.types';

export const generateTokens = (payload: TokenPayload): AuthTokens => {
  const accessOptions: SignOptions = {
    expiresIn: JWT_CONFIG.accessTokenExpiry as SignOptions['expiresIn'],
  };

  const refreshOptions: SignOptions = {
    expiresIn: JWT_CONFIG.refreshTokenExpiry as SignOptions['expiresIn'],
  };

  const accessToken = jwt.sign(payload, JWT_CONFIG.secret, accessOptions);
  const refreshToken = jwt.sign(payload, JWT_CONFIG.secret, refreshOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_CONFIG.secret) as TokenPayload;
};