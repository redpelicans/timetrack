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
      // TODO: add secure, httpOnly, maxAge
      res.cookie('access_token', token(user, params.secretKey), {});
      res.json({ user: user });
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
  console.log("loadUser");
  console.log(googleUser)
  console.log(cb)
  Person.findOne({isDeleted: {$ne: true}, email: googleUser.email}, (err, user) => {
    if(err)return cb(err);
    if(!user) return cb(new Error("Unknwon email: " + googleUser.email));
    cb(null, user, googleUser);
  });
}

function updateAvatar(user, googleUser, cb){
  console.log(user)
  if(!googleUser.picture || user.avatar && user.avatar.url === googleUser.picture)return setImmediate(cb, null, user);
  Person.collection.updateOne({_id: user._id}, {$set: {'avatar.avatarType': 'url', 'avatar.url': googleUser.picture}}, err => {
    cb(err, user);
  });
}


function token(user, secretKey){
  const claims = {
    sub: user._id.toString(),
    iss: 'http://timetrack.repelicans.com',
  };
  const jwt = njwt.create(claims,secretKey);
  return jwt.compact();
}
