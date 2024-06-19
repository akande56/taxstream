import { tokenToPayload } from "./tokenToPayload";

export const isTokenExpired = (token: string) => {
  const tokenPayload = tokenToPayload(token);

  return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
};
