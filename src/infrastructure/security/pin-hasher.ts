import bcrypt from 'bcryptjs';

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}
