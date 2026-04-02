import {
  addLangs
} from './langs.mjs';
await import('./preload-css.js');
let cssmods = await (await fetch('https://files-servleteer.vercel.app/lenguapedia/default/mods.css')).text();

export default function transformBody(resBody, ct, hostList, hostProxy, xlangs, bkcolor) {
  cssmods.replaceAll('cce9ff', bkcolor)
    .replaceAll('rgba(255,255,255,0.69)', bkcolor);
  const hostList_length = hostList.length;
  if (ct.includes('javascript')) {
    for (let i = 0; i < hostList_length; i++) {
      resBody = resBody.replaceAll(hostList[i], hostProxy);
    }
  }

  let bodyTagHead = resBody.match(/<body[^>]*>/)?.[0] || '<body>';

  resBody = resBody.replace(/<body[^>]*>/,
    bodyTagHead +
    `<lenguapedia` +
    `   host-list="` + btoa(JSON.stringify(hostList)) +
    `"  host-Proxy="` + btoa(hostProxy) +
    `" xlangs="` + xlangs + `"></lenguapedia>` +
    preloadCSS +
    `<script src="/static/link-resolver.v.js?4"></script>
      <script src="/static/inject-langs.js?2" onerror="(function(){let s=document.createElement('script');s.src='https://lenguapedia.org/static/inject-langs.js';document.body.appendChild(s);})();"></script>
      <link rel="stylesheet" href="/static/mods.css"></link>
`).replace('</body>',
    `<lenguapedia` +
    `   host-list="` + btoa(JSON.stringify(hostList)) +
    `"  host-Proxy="` + btoa(hostProxy) +
    `" xlangs="` + xlangs + `"></lenguapedia>` +
    preloadCSS +
    `<script src="/static/link-resolver.v.js?4"></script>
      <script src="/static/inject-langs.js?2"></script>
      <link rel="stylesheet" href="https://files-servleteer.vercel.app/lenguapedia/default/mods.css"></link>
      <link rel="stylesheet" href="/static/mods.css?69"></link>
      </body>
`);

  resBody = resBody
    .replaceAll('rel="nofollow"', '')
    .replaceAll('content="noindex"', '')
    .replaceAll('content="none"', '')
    .replaceAll('noindex', '')
    .replaceAll('content="nosnippet"', '');

  //resBody = addLangs(resBody,xlangs);

  return resBody;
}
