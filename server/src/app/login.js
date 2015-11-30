import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person} from '../models';
import {ObjectId} from '../helpers';
import request from 'request';
import njwt from 'njwt';

const TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo";

export function init(app, resources, params){
  app.post('/login', function(req, res, next){
    let id_token = req.body.id_token;
    if(!id_token) setImmediate(next, new Error("Cannot login without a token!"));
    async.waterfall([checkGoogleUser.bind(null, id_token), loadUser, updateAvatar], (err, user) => {
      if(err)return next(err);
      const expirationDate = moment().add(1, 'hour').toDate();
      const jwt = token(user, params.secretKey, expirationDate);
      res.json({ user: user, token: jwt });
    });
  });

  function checkGoogleUser(token, cb){
    const clientId = params.google && params.google.clientId;
    request({
      method: 'GET',
      uri: TOKENINFO + `?id_token=${token}`,
      json: true,
      timeout: 1000
    }, (error, response, body) => {
      if(error || response.statusCode !== 200) return cb(error);
      if(body.aud !== clientId) return cb(new Error("Wrong Google token_id!"));
      cb(null, body);
    });
  }
}

function loadUser(googleUser, cb){
  Person.findOne({isDeleted: {$ne: true}, email: googleUser.email}, (err, user) => {
    if(err)return cb(err);
    if(!user) return cb(new Error("Unknwon email: " + googleUser.email));
    cb(null, user, googleUser);
  });
}

function updateAvatar(user, googleUser, cb){
  if(!googleUser.picture || user.avatar && user.avatar.url === googleUser.picture)return setImmediate(cb, null, user);
  Person.collection.updateOne({_id: user._id}, {$set: {'avatar.avatarType': 'url', 'avatar.url': googleUser.picture}}, err => {
    cb(err, user);
  });
}


function token(user, secretKey, expirationDate){
  const claims = {
    sub: user._id.toString(),
    iss: 'http://timetrack.repelicans.com',
  };
  const jwt = njwt.create(claims,secretKey);
  jwt.setExpiration(expirationDate);
  return jwt.compact();
}
