import Bacon from 'baconjs';

export default class Dispatcher {
  constructor(){
    this.busCache = {};
  }

  stream(name) {
    return this._bus(name);
  }

  push(name, value) {
    this._bus(name).push(value);
  }

  plug(name, value) {
   this._bus(name).plug(value);
  }

  _bus(name) {
    return this.busCache[name] = this.busCache[name] || new Bacon.Bus();
  }

}


