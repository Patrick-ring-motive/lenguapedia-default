import fetch from 'node-fetch';
import http from 'http';
import transformBody from './modules/body-transform.mjs';
import addCorsHeaders from './modules/cors-headers.mjs';
import {normalizeRequest,mapResHeaders} from './modules/http-fetch.mjs';
import {csscalc} from './modules/csscalc.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import maintain from './modules/auto-maintain.mjs';
import {availReq,availRes} from './modules/availability.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let path_join = path.join;

let server = http.createServer(availReq(onRequest));

server.listen(3000);
maintain(server);

async function onRequest(req, res) {
 res=availRes(res);
  let hostList = [];
  const defaultHostProxy='lenguapedia-default.weblet.repl.co';//'lenguapedia-default.vercel.app';
  let hostProxy = 'defaultHostProxy';

  let hostTarget = '-m-wikipedia-org.translate.goog';
  let hostWiki = '.m.wikipedia.org';
  let hostEn = 'lenguapedia-en.vercel.app';
  hostList.push(hostEn);

  hostProxy = req.rawHeaders[req.rawHeaders.indexOf('Host-Proxy') + 1];
  let wikiPrefix = req.rawHeaders[req.rawHeaders.indexOf('Wiki-Prefix') + 1]||'en';
  let langFrom = req.rawHeaders[req.rawHeaders.indexOf('Lang-From') + 1]||'auto';
  let langTo = req.rawHeaders[req.rawHeaders.indexOf('Lang-To') + 1]||'en';
  let xlangs = 'en.en';

  if(hostProxy=='Host'){hostProxy=defaultHostProxy;}
  if(wikiPrefix=='Host'){wikiPrefix='en';}
  if(langTo=='Host'){langTo='en';}
  if(langFrom=='Host'){langFrom='auto';}
  
  if((langFrom.toLowerCase()=='auto') || (wikiPrefix==langFrom)){

      xlangs = wikiPrefix+'.'+langTo;
       
  }else{

      xlangs = wikiPrefix+'2'+langFrom+'.'+langTo;
    
  }
  

  let bkcolor = csscalc(wikiPrefix) + csscalc(langFrom) + csscalc(langTo);
  hostTarget = wikiPrefix + hostTarget;
  hostWiki = wikiPrefix + hostWiki;
  hostList.push(hostWiki);
  hostList.push(hostTarget);
  if (wikiPrefix == 'en') {
    hostTarget = 'lenguapedia--en-vercel-app.translate.goog';
    hostWiki = 'en.m.wikipedia.org';
    hostList.push(hostWiki);
    hostList.push(hostTarget);
  }



  let translator = '_x_tr_sl=' + langFrom + '&_x_tr_tl=' + langTo + '&_x_tr_hl=en&_x_tr_pto=wapp';
  let path = req.url.replaceAll('*', '');
  let pat = path.split('?')[0].split('#')[0];



  /*respond to ping from uptime robot*/
  if (path == '/ping') {
    res.statusCode = 200;
    return res.end();
  }
  if ((pat == '/static/link-resolver.v.js')||(pat == '/static/inject-langs.js')){
    let resp=await fetch('https://files-servleteer.vercel.app/lenguapedia/default'+pat.replace('/static',''));
    res.setHeader('Content-Type', 'text/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    return res.end(await resp.text());
  }


  if (pat == '/static/mods.css') {


    let resp=await fetch('https://files-servleteer.vercel.app/lenguapedia/default/mods.css');
    let file = (await resp.text()).replaceAll('cce9ff',bkcolor);
    res.setHeader('Content-Type',resp.headers.get('Content-Type'));
   
    return res.end(file);
  }

  if (pat == '/robots.txt') {
    res.statusCode = 200;
    return res.end(
      `User-agent: *
Allow: /`);

  }

  req.headers.host = hostTarget;
  req.headers.referer = hostTarget;

  let reqDTO = await normalizeRequest(req);

    /* fetch from your desired target */
    let response = new Response();


  if(!path.includes('wapp')){path=path+'?'+translator;}
    try {
      response = await fetch('https://' + hostTarget + path, reqDTO);

    } catch (e) {
      try {
        response = await fetch('https://' + hostWiki + path, reqDTO);
      } catch (e) {
        try {
          response = await fetch('https://' + hostEn + path, reqDTO);
        } catch (e) {
          res.setHeader('location', 'https://' + hostTarget + path);
          res.statusCode = 302;
          return res.end();
        }
      }
    }
    /* copy over response headers */
    res = mapResHeaders(res,response);

    res = addCorsHeaders(res);

    /* check to see if the response is not a text format */
    let ct = response.headers.get('content-type');

    if ((ct) && (!ct.includes('image')) && (!ct.includes('video')) && (!ct.includes('audio'))) {
      if (!path.includes(translator)||!path.includes('langs=')) {
        /* if not a text response then redirect straight to target */
       let langs='&langs='+xlangs;
        res.setHeader('location', 'https://' + hostProxy + pat + '?'+translator+langs);
        res.statusCode = 301;
        return res.end();

      }

      /* Copy over target response and return */
      let resBody = await response.text();



      return res.end(transformBody(resBody, ct, hostList, hostProxy,xlangs));


    } else {
    let resBody = Buffer.from(await(response).arrayBuffer());
    res.setHeader('Content-Type',ct);
    return res.endAvail(resBody);

    }



}