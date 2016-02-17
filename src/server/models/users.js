import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';
import {oAuth2Client, oAuth2AccessToken, oAuth2RefreshToken} from './oauth2';

@mongobless({collection: 'users'})
export class User{ 
    
    static getAccessToken (bearerToken, callback) {
        console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');
        
        oAuth2AccessToken.findOne({accessToken: bearerToken}, callback);
    }
    
    static getClient(clientId, clientSecret, callback) {
        console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
        
        if (clientSecret === null) {
            return oAuth2Client.findOne({clientId: clientId}, callback);
        }
        
        oAuth2Client.findOne({id: clientId, secret: clientSecret}, (err, client) => {
            if(err) return callback(err);
            client.clientId = client.id;
            callback(null, client);
        });
        
    }
    
    static grantTypeAllowed(clientId, grantType, callback) {
        console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

        if (grantType === 'password' ||grantType === 'refresh_token') {
            oAuth2Client.findOne({id: clientId, grant_types: grantType}, (err, client) => {
                if(err) return callback(err);
                
                if(client.id == clientId) {
                    callback(false, true);
                } else {
                    callback(false, false);
                }
            });
            
        } else {
            callback(false, false);
        }

    }
    
    static saveAccessToken(accessToken, clientId, expires, user, callback) {
        console.log('in saveAccessToken (token: ' + accessToken + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

        let token = {accessToken: accessToken, clientId: clientId, expires:expires, userId: user.id};
        
        oAuth2AccessToken.collection.insert(token, callback);
        
    }
    
    static saveRefreshToken (token, clientId, expires, user, callback) {
        console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');
    
        let refreshToken = {
            refreshToken: token,
            clientId: clientId,
            userId: user.id,
            expires: expires
        }
        
        oAuth2RefreshToken.collection.insert(refreshToken, callback); 
    
    };
    
    static getRefreshToken (refreshToken, callback) {
        console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');
    
        oAuth2RefreshToken.findOne({refreshToken: refreshToken}, callback);
    
    };
    
    static getUser(username, password, callback) {
        console.log('in getUser (username: ' + username + ', password: ' + password + ')');
        User.findOne({username: username, password: password }, (err, user) => {
            if(err) return callback(err);
            user.id = user._id + "";
            callback(null, user);
        }); 
        
    }

    
}
