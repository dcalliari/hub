export function encodeJWT(payload: object): string {
  const header = {
    alg: "HS256",
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

  return `${base64Header}.${base64Payload}`;
}
