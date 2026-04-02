/** 
Root Fallback
<style>
*{display:none;}
</style>
<script>
void async function(){

let root=await fetch('/_root');
let homePage=await root.text();

document.write(homePage);

}();
</script>
*/

import fetch from 'node-fetch';
import http from 'http';
import transformBody from './modules/body-transform.mjs';
import addCorsHeaders from './modules/cors-headers.mjs';
import {
  normalizeRequest,
  mapResHeaders
} from './modules/http-fetch.mjs';
import {
  csscalc
} from './modules/csscalc.mjs';
import path from 'path';
import {
  fileURLToPath
} from 'url';
import {
  dirname
} from 'path';
import maintain from './modules/auto-maintain.mjs';
import {
  availReq,
  availRes
} from './modules/availability.mjs';
import './modules/x.mjs';
import './modules/vercel-caches.mjs';
import './modules/lenguapedia.mjs';
import './modules/serverlessCache.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let path_join = path.join;

let server = http.createServer(availReq(onRequest));
//process.setMaxListeners(100);
//require('events').defaultMaxListeners = 1;
server.listen(3000);
maintain(server);

async function onRequest(req, res) {

  req.socket.setNoDelay();
  res.socket.setNoDelay();

  res = availRes(res);

  let cacheKey = serverlessCache.generateCacheKey(req);
  let cacheVal = await serverlessCache.matchClone(cacheKey);
  let response;
  let referer;
  // console.log(cacheKey,cacheVal);
  if (cacheVal) {
    //console.log(cacheKey,cacheVal);
    response = cacheVal;

  }

  let hostConfig = getHostConfigDefaults();
  hostConfig = configFromRequest(hostConfig, req);

  referer = req.headers['referer'];

  let bkcolor =
    csscalc(hostConfig.wikiPrefix) +
    csscalc(hostConfig.langFrom) +
    csscalc(hostConfig.langTo);

  let translator =
    '_x_tr_sl=' + hostConfig.langFrom +
    '&_x_tr_tl=' + hostConfig.langTo +
    '&_x_tr_hl=en&_x_tr_pto=wapp';

  let path = safeURLChars(removeHache(req.url.replaceAll('*', '')));
  if (path.startsWith('/_root/')) {
    path = path.replace('/_root/', '/');
  } else if (path.startsWith('/_root')) {
    path = path.replace('/_root', '/');
  }
  let pat = path.split('?')[0].split('#')[0];

  let staticFiles = await checkStaticsFiles(pat, res, bkcolor);
  if (staticFiles) {
    return staticFiles;
  }

  if (!cacheVal) {
    req.headers.host = hostConfig.hostTarget;
    req.headers.referer = hostConfig.hostTarget;

    let reqDTO = await normalizeRequest(req);

    /* fetch from your desired target */

    let char = '?';
    if (path.includes('?')) {
      char = '&';
    }
    if (!path.includes('wapp')) {
      path = path + char;
      path = path + translator;
    }
    response = await tryURLs([
      hostConfig.hostTarget,
      hostConfig.hostIncubator,
      hostConfig.hostWiki,
      hostConfig.hostEn
    ], path, hostConfig.hash, reqDTO);

    if (response?.status && (response?.status > 199) && (response?.status < 300)) {
      response = await serverlessCache.putClone(cacheKey, response);
    }

    response = response || new Response();
    response.headers.get('content-language');
    /* copy over response headers */

  }
  //res = mapResHeaders(res,response);
  Q(U => {
    res = mapResHeaders(res, response);
  });

  Q(U => {
    res = addCorsHeaders(res);
  });

  /* check to see if the response is not a text format */
  let cl = response.headers.get('content-language');
  let ct = response.headers.get('content-type');
  Q(U => {
    res.setHeader('content-type', ct);
    res.setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Surrogate-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
  });
  if ( /*(cl)&&(cl=='en')&&*/ (ct) && (!ct.includes('image')) && (!ct.includes('video')) && (!ct.includes('audio'))) {
    /* if (!path.includes('wapp')||!path.includes('langs=')) {
    
      let langs='&langs='+xlangs;
       res.setHeader('location', 'https://' + hostProxy + pat + '?'+translator+langs);
       res.statusCode = 301;
       return res.endAvail();

     }*/

    /* Copy over target response and return */
    let resBody = response.fullBody;
    if (!resBody) {
      resBody = await response.text();
    } else {
      const decoder = new TextDecoder();
      resBody = decoder.decode(resBody);
    }

    resBody = resBody.replace('</head>',
      `<http>
          <http-response>
            <http-headers>
              <http-header key="referer" value="` + referer + `"></http-header>
            </http-headers>
          </http-response>
        </http>
        <script src="https://files-servleteer.vercel.app/lenguapedia/check-referer.js"></script>
                <script src="https://files-servleteer.vercel.app/lenguapedia/default/image-loader.js"></script>
        </head>`);

    return res.endAvail(
      transformBody(resBody,
        ct,
        hostConfig.hostList,
        hostConfig.hostProxy,
        hostConfig.xlangs,
        bkcolor));

  } else {

    let resBody;
    if (response.fullBody) {
      resBody = Buffer.from(response.fullBody);
    } else {
      resBody = Buffer.from(await (response).arrayBuffer());
    }
    Q(U => {
      res.setHeader('Content-Type', ct);
    });

    return res.endAvail(resBody);

  }

}
