"use strict";

import * as stream from './stream.js';
import * as argument from './argument.js';

class Shell {

  constructor() {
    this._history = [];
    this._stdin = new stream.Stream();
    this._stdout = new stream.Stream();
    // this._stderr = new stream.Stream();
    
    this._stdin.attach(this._handler(this));
  }
  
  in(line) {
    this._stdin.write(line);
  }
  
  _handler(sh) {
    return (command) => sh._stdout.write("Executed command: " + command);
  }
  
  // Attaches output of the shell to a handle
  // Example: sh.attach(console.log);
  attach(handle) {
    this._history.forEach(m => handle(m));
    this._stdout.attach(handle);
  }

}

// wrapper of Shell to be ran inside an existing shell.
async function sh() {}

export { Shell, sh };