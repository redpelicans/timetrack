import r from 'rethinkdb';
import moment from 'moment';
import _ from 'lodash';
import uuid from 'uuid';
import async from 'async';
import {Transac, Event, Message, bless} from '../models';
import {TransacError} from '../helpers';
import debug from 'debug';

let logerror = debug('transac:error')
  , loginfo = debug('transac:info');


export function loadOrCreate(conn, options, cb){
  findOne(conn, options, (err, transac) => {
    if(err) return cb(err);
    if(!transac) return insertOne(conn, options, null, cb);
    if(transac.isLocked()) return cb(new TransacError('Transaction already locked', 'locked'));
    if(transac.isCompound() && options.compound)return insertOne(conn, options, transac, cb);
    insertOne(conn, options, null, cb);
  });
}

// export to be tested
export function findOne(conn, options, cb){
  let query = r.table(Transac.collection).filter(r.row.hasFields('parentId').not()).filter({label: options.label, type: 'transac'});

  if(options.valueDate){
    let from = moment(options.valueDate).startOf('day').toDate()
      , to = moment(options.valueDate).endOf('day').toDate();

    query = query.filter( t => {
      return t('valueDate').during(from, to, {leftBound: "closed", rightBound: "closed"});
    });
  }

  if(options.compound) query = query.orderBy(r.asc('createdAt'));
  else query = query.orderBy(r.desc('createdAt'));

  query.run(conn, (err, cursor) => {
    if(err) return cb(err);
    cursor.toArray((err, transacs) => {
      if(err) return cb(err);
      let transac = transacs[0];
      if(!transac)return cb();
      cb(null, bless(transac));
    });
  });
}

export function loadAll(conn, {label, from=moment().startOf('day').toDate(), to=moment().endOf('day').toDate(), dateMode='valueDate'} = {}, cb){
  function findAll(cb){
    let query =  r.table(Transac.collection).filter( 
      r.row(dateMode === 'valueDate' ? 'valueDate' : 'createdAt').during(from, to, {leftBound: "closed", rightBound: "closed"}) 
    );
    if(label) query = query.filter({label: label});

    query.run(conn, (err, cursor) => {
      if(err) return cb(err);
      cursor.toArray((err, transacs) => {
        if(err) return cb(err);
        let transacIds = _.inject(transacs, (res, transac) => { res[transac.transacId] = transac.transacId; return res}, {});
        cb(null, _.keys(transacIds));
      });
    });
  }
  function loadTransacs(transacIds, cb){
    async.map(transacIds, load.bind(null, conn), cb);
  }

  async.waterfall([findAll, loadTransacs], cb);
}  

function loadRoot(conn, id, cb){
  r.table(Transac.collection).filter({transacId: id}).filter(r.row.hasFields('parentId').not()).run(conn, (err, cursor) => {
    if(err)return cb(err);
    cursor.toArray((err, nodes) => {
      if(err)return cb(err);
      cb(null, bless(nodes[0]));
    })
  })
}

export function load(conn, id, cb){
  r.table(Transac.collection).filter({transacId: id}).orderBy(r.asc('createdAt')).run(conn, (err, cursor) => {
    if(err)return cb(err);
    cursor.toArray((err, nodes) => {
      if(err)return cb(err);
      let root, hnodes = _.inject(nodes, (res, node) => { res[node.id] = bless(node); return res}, {});

      _.each(nodes, node => {
        let tnode = hnodes[node.id];
        if(!tnode.parentId){
          root = tnode;
        }else{
          let parent = hnodes[tnode.parentId];
          if(!parent){
            return cb(new Error("Wrong Transac Tree"));
          }
          parent.addChild(tnode);
        }
      });
      loginfo(`helper.transac.load`);
      cb(null, root);
    })
  })
}

function insertOne(conn, options, root, cb){
  if(!options.compound){
    let transac = new Transac(options);
    r.table(Transac.collection).insert( transac, {returnChanges: true} ).run(conn, (err, res) => {
      if(err)return cb(err);
      cb(null, transac);
    });
  }else{
    let transacs;
    if(options.compound && !root){
      root = new Transac(options);
      transacs = [root, new Transac(_.merge({transacId: root.id, parentId: root.id}, options))];
    }else{
      options.transacId = root.transacId;
      options.parentId = root.id;
      transacs = [new Transac(options)];
    }
    r.table(Transac.collection).insert( transacs, {returnChanges: true} ).run(conn, (err, res) => {
      if(err)return cb(err);
      cb(null, root);
    });
  }
}

export function addEvent(conn, id, options, cb){
  loginfo(`helper.transac.addEvent ...`);
  async.waterfall([
    loadRoot.bind(null, conn, id),
    (transac, cb) => {
      if(!transac) return setImmediate(cb, new Error("Unknown transaction"));
      if(!transac.isCompound()) return setImmediate(cb, null, transac);
      load(conn, id, cb);
    },
    (transac, cb) => {
      let targetTransac = transac.isCompound() ? transac.lastChild : transac
        , recipe = options.label ? [addEventTransac(conn, targetTransac, options), addMessages.bind(null, conn, targetTransac, options)] : [addMessages.bind(null, conn, targetTransac, options, targetTransac)];
      async.waterfall(recipe, (err) => {
        loginfo(`helper.transac.addEvent done`);
        cb(err, transac);
      });
    }
  ], cb); 
}

function addEventTransac(conn, transac, options){
  return function(cb){
    try{
      options.transacId = transac.transacId;
      let event = new Event(options);
      transac.addEvent(event);
      r.table(Transac.collection).insert( event, {returnChanges: true} ).run(conn, {durability: 'soft'}, (err, res) => {
        if(err)return cb(err);
        loginfo(`helper.transac.addEventTransac done`);
        cb(null, event);
      });
    }catch(e){
      setImmediate(cb, e);
    }
  }
}

function addMessages(conn, transac, options, parent, cb){
  try{
    let messages = _.map(options.messages, message => new Message({label: message, level: options.level, transacId: transac.transacId}));
    _.each(messages, message => parent.addChild(message));
    r.table(Transac.collection).insert( messages, {returnChanges: true} ).run(conn, {durability: 'soft'}, (err, res) => {
      if(err)return cb(err);
      loginfo(`helper.transac.addMessages done`);
      cb(null, transac);
    });
  }catch(e){
    setImmediate(cb, e);
  }
}
