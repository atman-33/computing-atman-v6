import bcrypt from 'bcrypt';

export const hashPassword = (rawPassword: string) => {
  const saltRounds = 10;
  return bcrypt.hash(rawPassword, saltRounds);
};

export const verifyPassword = (args: { rawPassword: string; hashedPassword: string }) => {
  const { rawPassword, hashedPassword } = args;
  return bcrypt.compare(rawPassword, hashedPassword);
};
