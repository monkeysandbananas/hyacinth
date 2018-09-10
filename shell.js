"use strict";

import * as stream from './stream.js';
import * as module from './module.js';
import * as process from './process.js';
import * as argument from './argument.js';

class Shell {
  
  constructor() {
    this._history = [];
    this._executing = false;
    this._process = null;
    
    // initialize io
    this._instream = new stream.Stream();
    this._outstream = new stream.Stream();
  }
  
  async setup() {
    let sysio = {
      stdout: new stream.Writer(this._outstream),
      stderr: new stream.Writer(this._outstream),
    };
    
    return await module.setup(sysio);
  }
  
  // Write input to the shell
  async in(line) {
    if (this._executing) {
      this._instream.write(line);
    } else {
      await this._handle(line);
    }
  }
  
  // Handles a command execution
  async _handle(command) {
    // debug
    console.log(`Executing command: ${command}`);
    
    let sysio = {
      stdout: new stream.Writer(this._outstream),
      stderr: new stream.Writer(this._outstream),
    };
    let exec = module.dispatch(command, sysio);
    if (exec == null) {
      return;
    }

    let io = {
      stdin: new stream.Reader(this._instream),
      stdout: new stream.Writer(this._outstream),
      stderr: new stream.Writer(this._outstream),
    }, env = {}, cmd = {
      name: command,
    };
    this._executing = true;
    await exec(io, env, cmd);
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