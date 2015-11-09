import async from 'async';
import _ from 'lodash';
import request from 'request';

export function init(app){
  app.post('/check_url', function(req, res, next){
    let url = req.body.url;
    request({
      method: 'HEAD',
      uri: url,
      timeout: 1000
    }, (error, response, body) => {
      if (error || response.statusCode !== 200 || response.headers['content-type'].indexOf('image') !== 0) {
        // setTimeout(() => {
        // res.json({url: url, ok: false});
        // }, 3000);
        res.json({url: url, ok: false});
      }else{
        // setTimeout(() => {
        // res.json({url: url, ok: true});
        // }, 3000);
        res.json({url: url, ok: true});
      }
    });

  });
}
