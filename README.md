jQuery.subscribeAjax is magic fairy dust sprinkles for your XHR.

```javascript
$.subscribeAjax([
  '/api/users/*'
]);
```

Now, when you do a matching GET request, the result will be cached and published to other windows/tabs.

Subsequent calls can optionally use cache to initially run the success callback, and then run it again if the XHR response is different.

Be sure to write your success callbacks for jQuery.ajax so that they can be run multiple times.