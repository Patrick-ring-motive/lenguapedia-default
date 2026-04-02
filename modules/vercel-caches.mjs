globalThis.hache = function(word) {

  return 'xxhachexx' + btoa(word) + 'xxhachexx';
}

globalThis.unhache = function(hash) {

  try {
    return atob(hash.split('xxhachexx')[1]);
  } catch (e) {
    return undefined;
  }

}

globalThis.removeHache = function(url) {

  try {
    let urlTokens = url.split('xxhachexx');
    urlTokens[1] = '';
    return urlTokens.join('');
  } catch (e) {
    return url;
  }

}
