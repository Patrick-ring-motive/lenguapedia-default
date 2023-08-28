import './vercel-caches.mjs';

globalThis.tryURLs=async function(urlList,path,hash,reqDTO){
  const urlList_length=urlList.length;    
  for(let i=0;i<urlList_length;i++){try {
    
    let response = await fetch('https://' + urlList[i] + path + hash, reqDTO);
    if(response.status<300){
      let ct=response.headers.get('content-type');
      if(ct&&ct.includes('html')){
       /* let text = await response.clone().text();
        if(text.includes('t reach this website')
         ||text.includes('<titlelenguapedia|>'))
        {continue;}*/
      }
      return response;
    }
    
    } catch (e) {continue;}}

return;
  
};

globalThis.getHostConfigDefaults=function(){
  let defaultConfigs=Object.create(null);
  defaultConfigs.hostList = [];
  defaultConfigs.defaultHostProxy='lenguapedia.org';
  defaultConfigs.hostProxy = defaultConfigs.defaultHostProxy;
  defaultConfigs.hostTarget = '-m-wikipedia-org.translate.goog';
  defaultConfigs.hostIncubator = 'incubator-wikimedia-org.translate.goog/wiki/Wp/';
  defaultConfigs.hostWiki = '.m.wikipedia.org';
  defaultConfigs.hostEn = 'lenguapedia-en.vercel.app';
  defaultConfigs.hostList.push(defaultConfigs.hostEn);
  defaultConfigs.xlangs = 'en.en';
 return defaultConfigs; 
};

globalThis.configFromRequest=function(config,req){

   config.localhost=req.headers['host'];
  config.hostProxy = req.headers['host-proxy']||config.hostProxy;
  config.wikiPrefix = req.headers['wiki-prefix']||'en';
  config.langFrom = req.headers['lang-from']||'auto';
  config.langTo = req.headers['lang-to']||'en';
  

  if(config.hostProxy.toLowerCase()=='host'){hostProxy=config.defaultHostProxy;}
  if(config.wikiPrefix.toLowerCase()=='host'){config.wikiPrefix='en';}
  if(config.langTo.toLowerCase()=='host'){config.langTo='en';}
  if(config.langFrom.toLowerCase()=='host'){config.langFrom='auto';}
  
  if((config.langFrom.toLowerCase()=='auto') || (config.wikiPrefix==config.langFrom)){

      config.xlangs = config.wikiPrefix+'.'+config.langTo;
       
  }else{

      config.xlangs = config.wikiPrefix+'2'+config.langFrom+'.'+config.langTo;
    
  }
  


  config.hostTarget = config.wikiPrefix + config.hostTarget;
  config.hostWiki = config.wikiPrefix + config.hostWiki;
  config.hostIncubator = config.hostIncubator+config.wikiPrefix;
  config.hostList.push(config.hostWiki);
  config.hostList.push(config.hostTarget);
  config.hostList.push(config.hostIncubator);
  config.hashWord = unhache(req.url.toString());
  config.hash = '';
  if (config.wikiPrefix == 'en') {
    config.hostTarget = 'lenguapedia--en-vercel-app.translate.goog';
    config.hostIncubator = 'incubator-wikimedia-org.translate.goog';
    config.hostWiki = 'en.m.wikipedia.org';
    config.hostList.push(config.hostWiki);
    config.hostList.push(config.hostTarget);
    config.hash=hache(config.hashWord);
  }
  if(req.headers['wikia']){
    config.hostTarget=req.headers['wikia'];
    config.hostList.push(config.hostTarget);
  }
  return config;
}