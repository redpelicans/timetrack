module.exports = {
  proxy: {
     host: 'localhost'
   , port: 3004
  },
  webpack: { 
     host: 'localhost'
   , port: 6808
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  },
  server: {
     host: 'localhost'
   , port: 3005
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  }
}
