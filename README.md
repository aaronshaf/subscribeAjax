jQuery.subscribeAjax is magic fairy dust sprinkles for your XHR.

```javascript
$.subscribeAjax([
  '/api/users/*'
]);
```

Now, when you do a matching GET request, the result will be cached and published to other windows/tabs on the same domain.

If enabled, subsequent calls can use cache to initially run the success callback, then run it again if the XHR response is different.

Be sure to write your success callbacks so that they can be run multiple times.