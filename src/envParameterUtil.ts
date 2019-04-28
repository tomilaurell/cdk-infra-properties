export default function(key: string) {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Could not find enviroment variable: ${key}`);
  }
  return value;
}
