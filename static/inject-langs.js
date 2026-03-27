void async function InjectLangs() {

  setInterval(async function() {

    let xlangs = document.querySelector('lenguapedia').getAttribute('xlangs');

    let hrefs = document.querySelectorAll('[href]:not([href*="langs="])');
    const hrefs_length = hrefs.length;
    for (let i = 0; i < hrefs_length; i++) {
      try {
        let prefix = '?';
        if (hrefs[i].getAttribute('href').includes('?')) {
          prefix = '&';
        }
        hrefs[i].setAttribute('href', hrefs[i].href + prefix + 'langs=' + xlangs);

      } catch (e) {
        continue;
      }
    }

    /*let srcs = document.querySelectorAll('[src]:not([src*="xxlangsxx"])');
    const srcs_length = srcs.length;
    for (let i = 0; i < srcs_length; i++) {
      try {

        srcs[i].setAttribute('src', srcs[i].src+'?xxlangsxx'+xlangs+'xxlangsxx');

      } catch (e) { continue; }
    }*/

    let dataSrcs = document.querySelectorAll('[data-src]:not([data-src*="langs="])');
    const dataSrcs_length = dataSrcs.length;
    for (let i = 0; i < dataSrcs_length; i++) {
      try {
        let prefix = '?';
        if (dataSrcs[i].getAttribute('data-src').includes('?')) {
          prefix = '&';
        }
        dataSrcs[i].setAttribute('data-src', dataSrcs[i].getAttribute('data-src') + prefix + 'langs=' + xlangs);

      } catch (e) {
        continue;
      }
    }

  }, 100);

}?.();
