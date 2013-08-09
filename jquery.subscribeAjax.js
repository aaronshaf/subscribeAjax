;(function(jQuery) {
  // https://github.com/fitzgen/glob-to-regexp/blob/master/index.js
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

  jQuery.subscribeAjax = function(globs) {
    $.ajaxPrefilter(function(options) {
      if(!globs.some(function(glob) {
        return globToExp(glob).test(options.url)
      })) {
        return true;
      }

      var cache = localStorage.getItem('subscribeAjaxCache');
      if(typeof cache === 'undefined' || !cache) {
        return true;
      } else {
        cache = JSON.parse(cache);
        if(typeof cache[options.url] !== 'undefined') {
          options.success(cache[options.url]);
        }
      }
    });

    $(document).ajaxSuccess(function(event, request, settings) {
      if(settings.type.toLowerCase() !== 'get' || settings.dataType.toLowerCase() !== 'json') {
        return true;
      }

      var cache = localStorage.getItem('subscribeAjaxCache');
      if(typeof cache === 'undefined' || !cache) {
        cache = {};
      } else {
        cache = JSON.parse(cache);
      }
      cache[settings.url] = request.responseJSON;

      localStorage.setItem('subscribeAjaxCache',JSON.stringify(cache));

      return true;
    });
  };
}(jQuery));