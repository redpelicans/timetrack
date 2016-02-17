// version equals {package.json}.version
// githash is calculated at boot time
export function init(app, $){
  app.get('/version', function(req, res, next){
    res.json({
      githash: $.githash,
      version: $.version,
    });
  });
}
