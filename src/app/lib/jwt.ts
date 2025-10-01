import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Convert string secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: any, expiresIn: string = '7d'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
}
