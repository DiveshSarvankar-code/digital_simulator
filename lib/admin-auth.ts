import crypto from 'crypto';

export const SESSION_COOKIE = 'dls_admin_session';
const SESSION_DURATION = 1000 * 60 * 60 * 8; // 8 hours

export function getSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!password || !sessionSecret) {
    throw new Error('ADMIN_PASSWORD and SESSION_SECRET must be set');
  }
  return { password, sessionSecret };
}

export function createSessionToken(): string {
  const { sessionSecret } = getSecrets();
  const expires = Date.now() + SESSION_DURATION;
  const payload = `${expires}`;
  const hmac = crypto.createHmac('sha256', sessionSecret).update(payload).digest('hex');
  return `${expires}.${hmac}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const { sessionSecret } = getSecrets();
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [expiresStr, signature] = parts;
  const expires = parseInt(expiresStr, 10);
  if (!expires || isNaN(expires)) return false;
  if (Date.now() > expires) return false;
  const expected = crypto.createHmac('sha256', sessionSecret).update(expiresStr).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const { password } = getSecrets();
  if (input.length !== password.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(password));
  } catch {
    return false;
  }
}
