import './x.mjs';
if (!globalThis.serverlessCache) {
  globalThis.serverlessCache = Object.create(null);
}

globalThis.serverlessCache.put = function(key, val) {
  globalThis.serverlessCache[key] = val;
}
globalThis.serverlessCache.putClone = async function(key, val) {

  let r = await responseCopy(val);
  if (!val.fullBody) {
    val.fullBody = r?.fullBody;
  }
  if (!r) {
    return;
  }
  // console.log(r);
  globalThis.serverlessCache[key] = r;
  return val;
}

globalThis.serverlessCache.match = function(key) {
  return globalThis.serverlessCache[key];
}

globalThis.serverlessCache.matchClone = async function(key) {

  let val = globalThis.serverlessCache[key];
  if (!val) {
    return;
  }
  return await responseCopy(val);

}

globalThis.serverlessCache.generateCacheKey = function(req) {

  let cacheHead = JSON.parse(JSON.stringify(req.headers).toLowerCase());
  delete(cacheHead['cookie']);
  delete(cacheHead['user-agent']);
  delete(cacheHead['referer']);
  delete(cacheHead['accept']);
  delete(cacheHead['x-forwarded-for']);
  delete(cacheHead['sec-ch-ua']);
  delete(cacheHead['sec-ch-ua-mobile']);
  delete(cacheHead['sec-ch-ua-platform']);
  delete(cacheHead['if-modified-since']);
  return req.url.split('version=')[0] + JSON.stringify(cacheHead);
}
