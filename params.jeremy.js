module.exports = {
  proxy: {
     host: '0.0.0.0'
   , port: 7011
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  },
  webpack: { 
     host: 'localhost'
   , port: 6808
   , get url(){ return 'ws://' + this.host + ':' + this.port } 
  },
  server: {
     host: 'localhost'
   , port: 7012
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  },
  db: {
    host: 'mongodev',
    port: 27017,
    options:{
      auto_reconnect: true,
      poolSize: 10, 
      w: 1, 
      strict: true, 
      native_parser: true
    },
    database: 'timetrack',
  },
  sessionDuration: 120,
  secretKey: 'coucou',
  google:{
    clientId: "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"
  }
}

