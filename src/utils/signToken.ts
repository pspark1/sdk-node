import jwt from 'jsonwebtoken';
import { unixTime } from './unixTme';

const TOKEN_EXPIRATION_TIME = 30;

interface TokenBody {
  nonce: number;
  iat: number;
  exp: number;
}

export function signToken<TBodyType extends object>(
  secret: string,
  body: TBodyType,
): {
  token: string;
  body: TBodyType & TokenBody;
} {
  const now = unixTime();

  const tokenBody: TokenBody = {
    nonce: now + Math.floor(Math.random() * 1000),
    iat: now,
    exp: now + TOKEN_EXPIRATION_TIME,
  };

  const payload = {
    ...tokenBody,
    ...body,
  };

  const token = jwt.sign(JSON.stringify(payload), secret, {
    algorithm: 'RS256',
  });

  return {
    token,
    body: payload,
  };
}
