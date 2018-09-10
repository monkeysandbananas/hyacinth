"use strict";

import * as stream from './stream.js';
import * as module from './module.js';
import * as argument from './argument.js';

class Shell {
  
  constructor() {
    this._history = [];
    
    // initialize io
    this._instream = new stream.Stream();
    this._outstream = new stream.Stream();
    
    this._instream.attach(this._handler(this));
  }
  
  async setup() {
    let io = {
      // stdin: new stream.Reader(this._stdin),
      stdout: new stream.Writer(this._outstream),
      stderr: new stream.Writer(this._outstream),
    };
    
    return await module.setup(io);
  }
  
  // Write input to the shell
  in(line) {
    this._instream.write(line);
  }
  
  // Returns a handler function
  // We lose the class instance when this is called by the stream object
  _handler(sh) {
    return (command) => sh._outstream.write(`Executed command: ${command}`);
  }
  
  // Attaches output of the shell (stdout and stderr) to a handle
  // Example: sh.attach(console.log);
  attach(handle) {
    this._history.forEach(m => handle(m));
    this._outstream.attach(handle);
  }

}

// Wrapper of Shell that can be ran inside an existing shell.
async function sh() {}

export { Shell };