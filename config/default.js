import path from 'path';

module.exports = {
  server: {
    host: "localhost",
    port: 3030,
  },
  mongodb: "mongodb://localhost:27017/timetrack",
  public: path.join(__dirname, "../public/"),
  auth: {
    token: {
      secret: "5Bp4frxP5HzhaPiA3NPM5Oj6nR3XTRnnQQ5ISriVkbVP0B1/qtB/CxloipzCSHmA3nM39lnsDoyZnNpmLBeP1g=="
    },
    local: {}
  }
};
