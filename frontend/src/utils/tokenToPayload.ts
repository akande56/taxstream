export const tokenToPayload = (token: string) => {
  const arrayToken = token.split(".");

  // decoding the token
  // !this is more efficient as no external library needed
  const tokenPayload = JSON.parse(atob(arrayToken[1]));

  return tokenPayload;
};
