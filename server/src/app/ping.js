// useful for monitoring
export function init(app){
  app.get('/ping', function(req, res){
    res.json({data: 'pong'});
  });
}
