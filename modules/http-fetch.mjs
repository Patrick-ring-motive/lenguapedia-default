export async function normalizeRequest(req) {
  let options = {
    method: req.method,
    headers: req.headers
  };

  if ((req.method != 'GET') && (req.method != 'HEAD')) {

    /* start reading the body of the request*/
    let bdy = "";
    req.on('readable', function() {
      bdy += req.read();
    });

    req.promise = new Promise((resolve, reject) => {
      req.resolve = resolve;
    });

    req.on('end', req.resolve);
    await req.promise;
    /* finish reading the body of the request*/

    /* start copying over the other parts of the request */

    /* fetch throws an error if you send a body with a GET request even if it is empty */
    if (bdy.length > 0) {
      options = {
        method: req.method,
        headers: req.headers,
        body: bdy
      };
    }
  }
  /* finish copying over the other parts of the request */
  options.url = 'https://' + req.headers['host'] + req.url.replaceAll('*', '');

  return options;

}

export function mapResHeaders(res, response) {

  /* copy over response headers  */

  for (let [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  for (let [key, value] of response.headers.keys()) {
    if (key.length > 1) {
      res.removeHeader(key);
      res.setHeader(key, value);
    }
  }

  res.removeHeader('content-encoding');
  res.removeHeader('content-length');

  return res;

}
