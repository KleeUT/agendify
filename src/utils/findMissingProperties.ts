export function findMissingProperties(
  reqBody: any,
  properties: string[]
): string[] {
  return properties.reduce(
    (missing, prop) => (reqBody[prop] ? missing : [...missing, prop]),
    [] as Array<string>
  );
}
