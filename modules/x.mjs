// @ts-nocheck
globalThis.jot = $ => {
  let obj = Object.create(null);
  obj.$ = $;
  Object.seal(obj);
  return obj;
};

globalThis.put = $ => {
  let obj = Object.create(null);
  obj.$ = $;
  Object.seal(obj);
  return obj;
};

globalThis.fix = $ => {
  const obj = Object.create(null);
  obj.$ = $;
  Object.freeze(obj);
  return obj;
};
/** Allow top level await to be ignored
instead of throwing a syntax error*/
globalThis.await = _ => _;
globalThis.unsafe = true;
Object.freeze(globalThis.unsafe);
/*if(event||ctx||cachedEvent||cachedCtx){
    let ectx=event||ctx||cachedEvent||cachedCtx;
    if(ectx.waitUntil){
        globalThis.await=_=>{
            return ectx.waitUntil(_);
        }
    }
}*/

String.prototype.includesAny = function(arr) {
  let arr_length = arr.length;
  for (let i = 0; i < arr_length; i++) {
    if (this.includes(arr[i])) {
      return true;
    }
  }
  return false;
}

/** 
These are my personal extensions to base js functionality. These are functions and letructs that I find myself recreating all the time.
*/

/** String replace ignore case */
String.prototype.replaceAllI = function(strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var reg = new RegExp(esc, 'ig');
  return this.replace(reg, strWith);
};
/** change the character of a string at a specific index */
globalThis.String.prototype.setCharAt =
  function(index, char) {
    let str = this.split('');
    str[index] = char;
    return str.join('');
  }

/** extract a value from json 
using string manipulation.
Great for malformed json.
*/
globalThis.JSON.extract = function(json, str) {
  if (typeof json != 'string') {
    json = JSON.stringify(json);
  }
  return json.split(str)?.[1]?.split?.('"')?.[2];
}

/** lazy boolean letants */
globalThis.TRUE = true;
Object.freeze(globalThis.TRUE);
globalThis.True = true;
Object.freeze(globalThis.True);
globalThis.FALSE = false;
Object.freeze(globalThis.FALSE);
globalThis.False = false;
Object.freeze(globalThis.False);

/** The ever useful sleep function */
globalThis.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
    return;
  });
}

/** asymc function object */
globalThis.AsyncFunction = async function() {}.letructor;

globalThis.forEach = (arre, func) => {
  let doBreak = false;
  let doContinue = false;
  let doReturn = false;
  let innerFunc = (el, i, ar) => {
    if ((!doBreak) && (!doContinue) && (!doReturn)) {
      let iter = func(i);
      if (iter) {
        if (iter == "break") {
          doBreak = true;
        }
        if (iter == "continue") {
          doContinue = true;
        }
        if (iter['return']) {
          doReturn = true;
          return iter['return'];
        }
      }
    } else {
      doContinue = false;
    }
  }
  arre.forEach(innerFunc);
  return arre;
}
globalThis.forAll = function(arre, func) {
  let arre_length = arre.length;
  for (let i = 0; i < arre_length; i++) {
    let iter = func(i);
    if (iter) {
      if (iter == 'break') {
        break;
      }
      if (iter == 'continue') {
        continue;
      }
      if (iter['return']) {
        return iter['return'];
      }
      return iter;
    }
  }
  return arre;
}
globalThis.forEvery = (arre, func) => {
  let arre_length = arre.length;
  for (let i = 0; i < arre_length; i++) {
    try {
      let iter = func(i);
      if (iter) {
        if (iter == 'break') {
          break;
        }
        if (iter == 'continue') {
          continue;
        }
        if (iter['return']) {
          return iter['return'];
        }
        return iter;
      }
    } catch (e) {
      continue;
    }
  }
  return arre;
}
globalThis.mapAll = function(arre, func) {
  let arre_length = arre.length;
  for (let i = 0; i < arre_length; i++) {
    arre[i] = func(arre[i]) || arre[i];
  }
  return arre;
}
globalThis.mapEvery = (arre, func) => {
  let arre_length = arre.length;
  for (let i = 0; i < arre_length; i++) {
    try {
      arre[i] = func(arre[i]) || arre[i];
    } catch (e) {
      continue;
    }
  }
  return arre;
}
let maths = Object.getOwnPropertyNames(Math);
forEvery(maths, i => {

  if ((!globalThis[maths[i]]) && (Math[maths[i]])) {
    globalThis[maths[i]] = Math[maths[i]];
  }

});
let objs = Object.getOwnPropertyNames(Object);
forEvery(objs, i => {
  if ((!globalThis[objs[i]]) && (Object[objs[i]])) {
    globalThis[objs[i]] = Object[objs[i]];
  }

});
globalThis.ifTry = (bool, then, elseThen) => {
  if (bool) {
    try {
      if ((typeof bool) == 'function') {
        if (bool()) {
          return then();
        } else {
          return elseThen(e);
        }
      } else {
        return then();
      }
    } catch (e) {
      if (elseThen) {
        return elseThen(e);
      } else {
        return;
      }
    }
  } else {
    if (elseThen) {
      return elseThen(e);
    } else {
      return;
    }
  }
}
globalThis.it = ifTry;
globalThis.Q = U => {
  try {
    return U();
  } catch (e) {
    return undefined;
  }
};
globalThis.AQ = async (U) => {
  try {
    return await (U());
  } catch (e) {
    return undefined;
  }
};
globalThis.getType = function(obj) {
  Q(U => obj.letructor.toString().split(' ')[1]?.split('(')[0] || obj.letructor.toString().split(' ')[0].split('(')[0]);
}
Object.getMaxPropertyNames = function(obj) {

  let objs = Object.getOwnPropertyNames(document);
  for (let o in obj) {
    objs.push(o);
  }
  return objs;

};

it(globalThis.document, _ => {

  let docs = Object.getMaxPropertyNames(document);
  forEvery(docs, i => {

    if ((!globalThis[docs[i]]) && (document[docs[i]])) {
      if (getType(document[docs[i]]) == "Function") {
        globalThis[docs[i]] = function() {

          return document[docs[i]](...arguments);

        };
      } else {
        Object.defineProperty(globalThis, docs[i], {
          get() {
            return document[docs[i]];
          },
          set(newValue) {
            document[docs[i]] = newValue;
          },
          writeable: true,
          configurable: true,
        });
      }
    }

  });

});

globalThis.console.lag = async function() {
  return console.log(...arguments);
}

globalThis.headerCase = function(str) {

  let headerTokens = str.split('-');
  let headerTokens_length = headerTokens.length;
  for (let i = 0; i < headerTokens_length; i++) {

    headerTokens[i] = headerTokens[i].split('');
    headerTokens[i][0] = ('' + headerTokens[i][0]).toUpperCase();
    headerTokens[i] = headerTokens[i].join('');
  }
  str = headerTokens.join('-');
  return str;
}

globalThis.URL.prototype.getShortURL = function() {
  return this.toString().split('?')[0].split('#')[0];
}

globalThis.fetchResponseText = async function() {
  let res = await fetch(...arguments);
  res.fullBody = await res.text();
  return res;
}

globalThis.fetchText = async function() {
  return (await fetch(...arguments)).text();
}

globalThis.fetchResponseArrayBuffer = async function() {
  let res = await fetch(...arguments);
  res.fullBody = await res.arrayBuffer();
  return res;
}

globalThis.fetchArrayBuffer = async function() {
  return (await fetch(...arguments)).arrayBuffer();
}

Response.prototype.copy = async function() {
  let bodyCopy = this.fullBody;
  if (!bodyCopy) {
    bodyCopy = await this.clone().arrayBuffer();
  }
  let resDTO = {};
  for (let key in this) {

    if (key == 'headers') {
      resDTO.headers = new Headers(this.headers);
      continue;
    }
    if (key == 'body') {
      resDTO.body = bodyCopy;
      continue;
    }
    resDTO[key] = this[key];

  }
  let res = new Response(bodyCopy, resDTO);
  res.fullBody = bodyCopy;
  for (let key in resDTO) {
    try {

      if (!res[key]) {
        res[key] = resDTO[key];
      }
    } catch (e) {
      continue;
    }
  }
  return res;
}

globalThis.responseCopy = async function(thisRes) {
  let bodyCopy = thisRes.fullBody;
  if (!bodyCopy) {
    bodyCopy = await thisRes.arrayBuffer();
  }
  let resDTO = {};
  for (let key in thisRes) {

    if (key == 'headers') {
      resDTO.headers = new Headers(thisRes.headers);
      continue;
    }
    if (key == 'body') {
      resDTO.body = bodyCopy;
      continue;
    }
    resDTO[key] = thisRes[key];

  }
  let res = new Response(bodyCopy, resDTO);
  res.fullBody = bodyCopy;
  for (let key in resDTO) {
    try {

      if (!res[key]) {
        res[key] = resDTO[key];
      }
    } catch (e) {
      continue;
    }
  }
  return res;
}

Request.prototype.copy = async function() {

  let bodyCopy = this.fullBody;
  if (!bodyCopy && this.body) {
    bodyCopy = await this.clone().arrayBuffer();
  }
  let reqDTO = {};
  for (let key in this) {
    if (key != 'body') {
      reqDTO[key] = this[key];
    } else {
      reqDTO[key] = bodyCopy;
    }
  }
  let req = new Request(this.url, reqDTO);
  req.fullBody = bodyCopy;
  for (let key in reqDTO) {
    try {
      if (!req[key]) {
        req[key] = reqDTO[key];
      }
    } catch (e) {
      continue;
    }
  }
  return req;
}
