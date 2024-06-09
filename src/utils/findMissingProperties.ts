export function findMissingProperties(
  reqBody: { [key: string]: string | undefined },
  properties: string[]
): string[] {
  return properties.reduce(
    (missing, prop) => (reqBody[prop] ? missing : [...missing, prop]),
    [] as Array<string>
  );
}
