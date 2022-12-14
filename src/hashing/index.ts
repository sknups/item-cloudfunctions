import * as crypto from 'crypto';

export function hashEmail(email: string, emailHashingSecret: string ) : string {
   const hash = crypto.createHash('sha256');
   hash.update(emailHashingSecret);
   hash.update(email);
   return hash.digest('hex');
}