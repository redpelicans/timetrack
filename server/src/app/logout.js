import njwt from 'njwt';

export function init(app, resources, params){
  app.get('/logout', function(req, res, next){
    res.clearCookie('access_token');
    res.json({logout: true});
  });
}
