var ObjectId = require('mongobless').ObjectId;
export let data={
  collections:{
    persons: [
      {
        "email" : "test@redpelicans.com",
        "avatar" : {
          "url" : "https://lh4.googleusercontent.com/-g5KIWLrszUA/AAAAAAAAAAI/AAAAAAAAADk/tGLkC59TnFQ/s96-c/photo.jpg",
          "color" : "#67ae3f",
          "type" : "color"
        },
        "roles" : [
          "admin"
        ],
        "prefix" : "Mr",
        "firstName" : "test",
        "lastName" : "test",
        "type" : "worker",
        "jobType" : "manager",
        "preferred" : true,
        "skills" : [
          "Bootstrap",
          "Docker",
          "Mongodb",
          "Nodejs",
          "React"
        ],
        "phones" : [
          {
            "label" : "mobile",
            "number" : "06 06 06 06 06"
          }
        ],
        "tags" : [ ]
      }
    ]
  }
}
