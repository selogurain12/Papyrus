export function localStorageBasePrefixVariable(variableName: string) {
  let prefix = "http://localhost:3000/";

  if (prefix.length === 1) {
    prefix = prefix.slice(0, -1);
  }

  return `${prefix}${variableName}`;
}
