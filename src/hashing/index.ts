import { createHash } from 'crypto';

export function hashEmail(email: string, emailHashingSecret: string): string {
   const hash = createHash('sha256');
   hash.update(emailHashingSecret + email);
   return hash.digest('hex');
}
