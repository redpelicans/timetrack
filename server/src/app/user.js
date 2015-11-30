
export function init(app, resources, params){
  app.get('/user', function(req, res, next){
    res.json(req.user);
  });
}

