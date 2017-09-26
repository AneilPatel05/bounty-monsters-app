Package.describe({
  name: "bm-icos",
  summary: "Vulcan posts package",
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:core@1.7.0',
    'vulcan:events@1.7.0',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
