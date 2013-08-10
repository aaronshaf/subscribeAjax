;(function(jQuery) {
  // https://github.com/fitzgen/glob-to-regexp/blob/master/index.js
  // BSD license
  var globToExp = function (glob) {
    var reStr = glob
      // Escape existing regular expression syntax
      .replace(/\\/g, "\\\\")
      .replace(/\//g, "\\/")
      .replace(/\^/g, "\\^")
      .replace(/\$/g, "\\$")
      .replace(/\+/g, "\\+")
      .replace(/\?/g, "\\?")
      .replace(/\./g, "\\.")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\=/g, "\\=")
      .replace(/\!/g, "\\!")
      .replace(/\|/g, "\\|")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\,/g, "\\,")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\-/g, "\\-")
      // Turn * into the match everything wildcard
      .replace(/\*/g, ".*");
    return new RegExp("^" + reStr + "$");
  }

  jQuery.subscribeAjax = function(options) {
    var routes = options.routes || [];
    var cache = !!options.cache;

    $.ajaxPrefilter(function(options) {
      if(!routes.some(function(glob) {
        if(glob instanceof RegExp) {
          return glob.test(options.url);
        } else {
          return globToExp(glob).test(options.url)  
        }
      }) || !options.success) {
        return true;
      }

      var type = options.type.toLowerCase();

      var subscribeAjaxCache = localStorage.getItem('subscribeAjaxCache');
      if(typeof subscribeAjaxCache === 'undefined' || !subscribeAjaxCache) {
        return true;
      }
      subscribeAjaxCache = JSON.parse(subscribeAjaxCache);

      // Repair cache if necessary
      if(typeof subscribeAjaxCache !== 'object') {
        localStorage.setItem('subscribeAjaxCache','{}');
        return true;
      }

      if(typeof subscribeAjaxCache[options.url] !== 'undefined') {
        if(type === 'get') {
          if(cache) {
            options.alreadySent = subscribeAjaxCache[options.url];
            options.success(subscribeAjaxCache[options.url]);  
          }
        } else {
          delete subscribeAjaxCache[options.url];
        }
      }

      var _success = options.success;
      options.success = function(data,textStatus,xhr) {
        if(JSON.stringify(options.alreadySent) === JSON.stringify(data)) {
          return false;
        }

        var cache = localStorage.getItem('subscribeAjaxCache');
        if(typeof cache === 'undefined' || !cache) {
          cache = {};
        } else {
          cache = JSON.parse(cache);
        }
        cache[options.url] = data;

        localStorage.setItem('subscribeAjaxCache',JSON.stringify(cache));

        // If we don't add the random text, localStorage may not fire change event
        localStorage.setItem('subscribeAjaxCacheMessenger',options.url + '```' + Math.random());

        _success.apply(this,arguments);
        return true;
      }

      window.addEventListener('storage', function(event) {
        if(event.key !== 'subscribeAjaxCacheMessenger'
            || !event.newValue) return false;

        var newValue = event.newValue.split('```');
        newValue = newValue[0];
        if(newValue !== options.url) return false;

        var subscribeAjaxCache = localStorage.getItem('subscribeAjaxCache');
        if(typeof subscribeAjaxCache === 'undefined' || !subscribeAjaxCache) return true;
        subscribeAjaxCache = JSON.parse(subscribeAjaxCache);
        if(typeof subscribeAjaxCache[options.url] === 'undefined' || typeof subscribeAjaxCache !== 'object') return;
        _success(subscribeAjaxCache[options.url]);
      },false);
    });
  };
}(jQuery));