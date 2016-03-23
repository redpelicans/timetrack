import njwt from 'njwt';

export function init(app, resources, params){
  app.get('/logout', function(req, res, next){
    // TODO:
    res.clearCookie('access_token');
    res.clearCookie('timetrackToken');
    res.json({logout: true});
  });
}
