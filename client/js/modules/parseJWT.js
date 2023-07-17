export function parseJWT(jwt) {
  const base64Url = jwt.split(".");

  const payload = JSON.parse(atob(base64Url[1]));

  return payload;
}
