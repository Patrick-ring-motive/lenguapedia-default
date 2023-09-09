import fetch from 'node-fetch';
import http from 'http';
import transformBody from './modules/body-transform.mjs';
import addCorsHeaders from './modules/cors-headers.mjs';
import {normalizeRequest,mapResHeaders} from './modules/http-fetch.mjs';
import {csscalc} from './modules/csscalc.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import maintain from './modules/auto-maintain.mjs';
import {availReq,availRes} from './modules/availability.mjs';
import './modules/x.mjs';
import './modules/vercel-caches.mjs';
import './modules/lenguapedia.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let path_join = path.join;

let server = http.createServer(availReq(onRequest));

server.listen(3000);
maintain(server);


async function onRequest(req, res) {
    
  req.socket.setNoDelay();
  res.socket.setNoDelay();
  
 res=availRes(res);

let hostConfig=getHostConfigDefaults();
    hostConfig=configFromRequest(hostConfig,req);

  let referer = req.headers['referer'];

  let bkcolor = 
    csscalc(hostConfig.wikiPrefix) +
    csscalc(hostConfig.langFrom) +
    csscalc(hostConfig.langTo);
  
  let translator = 
    '_x_tr_sl=' + hostConfig.langFrom +
    '&_x_tr_tl=' + hostConfig.langTo +
    '&_x_tr_hl=en&_x_tr_pto=wapp';


  let path = safeURLChars(removeHache(req.url.replaceAll('*', '')));
  let pat = path.split('?')[0].split('#')[0];

  let staticFiles = await checkStaticsFiles(pat,res);
  if(staticFiles){return staticFiles;}


  req.headers.host = hostConfig.hostTarget;
  req.headers.referer = hostConfig.hostTarget;

  let reqDTO = await normalizeRequest(req);

    /* fetch from your desired target */


let char='?';
  if(path.includes('?')){char='&';}
  if(!path.includes('wapp')){
   path=path+char;
   path=path+translator;
  }
  let response = await tryURLs([
    hostConfig.hostTarget,
    hostConfig.hostIncubator,
    hostConfig.hostWiki,
    hostConfig.hostEn],path,hostConfig.hash,reqDTO);
  response = response||new Response();
  response.headers.get('content-language');
    /* copy over response headers */
   Q(U=>{res = mapResHeaders(res,response);})

    res = addCorsHeaders(res);

    /* check to see if the response is not a text format */
    let cl = response.headers.get('content-language');
    let ct = response.headers.get('content-type');
    res.setHeader('content-type', ct);
    res.setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('CDN-Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Cache-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');
    res.setHeader('Surrogate-Control', 'public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000');

    if (/*(cl)&&(cl=='en')&&*/(ct) && (!ct.includes('image')) && (!ct.includes('video')) && (!ct.includes('audio'))) {
     /* if (!path.includes('wapp')||!path.includes('langs=')) {
     
       let langs='&langs='+xlangs;
        res.setHeader('location', 'https://' + hostProxy + pat + '?'+translator+langs);
        res.statusCode = 301;
        return res.endAvail();

      }*/

      /* Copy over target response and return */
      let resBody = await response.text();

      resBody=resBody.replace('</head>',
        `<http>
          <http-response>
            <http-headers>
              <http-header key="referer" value="`+referer+`"></http-header>
            </http-headers>
          </http-response>
        </http><script src="https://files-servleteer.vercel.app/lenguapedia/check-referer.js"></script></head>`);

      return res.endAvail(
              transformBody(resBody,
                            ct,
                            hostConfig.hostList,
                            hostConfig.hostProxy,
                            hostConfig.xlangs,
                            bkcolor));


    } else {
    let resBody = Buffer.from(await(response).arrayBuffer());
    res.setHeader('Content-Type',ct);

    return res.endAvail(resBody);

    }



}


