/* not done do not use */
export function addLangs(body, xlangs) {
  const re = /(<[^>]*href=\"[^\"]*)/gi;
  const bodyMatches = body.matches(re);
  const bodyMatches_length = bodyMatches.length;

  return body.replace(req, '$1&langs=' + xlangs).replace(re, '$1?langs=' + xlangs);
}
