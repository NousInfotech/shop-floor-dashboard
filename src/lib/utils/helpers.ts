export const generateEmployeeCode = () => {
  const prefix = 'EMP';
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${randomDigits}`;
};
