jQuery.subscribeAjax is magic fairy dust sprinkles for your XHR. It speeds up your app.

Less spinning. More _voom voom_.

```javascript
$.subscribeAjax([
  '/api/users/*'
]);
```

Now, when you do a matching GET request, the result will be cached and published to other windows/tabs on the same domain.

If a non-GET request is made to a URL, any cache for it is cleared.

If enabled, subsequent calls can use cache to initially run the success callback, then run it again if the XHR response is different.

Be sure to write your success callbacks so that they can be run multiple times.