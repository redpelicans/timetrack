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
  },
  db: {
    host: 'mongo',
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
  google:{
    clientId: "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"
  }
}
