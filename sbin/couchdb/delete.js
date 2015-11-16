import {PouchDB, db}  from './util';
import async from 'async';
import _ from 'lodash';


async.waterfall([loadAll, deleteDocs], (err, data) => {
  if(err)return console.log(err);
  console.log(data)
  console.log("The end ...");
});

function loadAll(cb){
  db.allDocs({}, cb);
}


function deleteDocs(docs, cb){
  async.map(docs.rows, deleteDoc, cb);
}

function deleteDoc(doc, cb){
  console.log(`delete ${doc.id}, ${doc.value.rev}`)
  db.remove(doc.id, doc.value.rev, cb);
}
