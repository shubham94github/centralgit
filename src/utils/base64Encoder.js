export const base64Encoder = (clientId, clientSecret) => btoa(`${clientId}:${clientSecret}`);
