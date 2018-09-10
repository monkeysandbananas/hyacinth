"use strict";

import * as exitcode from './exitcode.js';

var builtins = [
  './scripts/test.js',
];

class Command {
  
  constructor(module, name, executable) {
    this._module = module;
    this._name = name;
    this._executable = executable;
  }
  
  get module() {
    return this._module;
  }
  
  get name() {
    return this._name;
  }
  
  get executable() {
    return this._executable;
  }
  
}

var commands = {};
var modules = {};

var locked = false;

async function setup(io) {
  let results = [];
  for (let path of builtins) {
    let result = await install(path, io);
    if (result !== exitcode.SUCCESS) {
      console.log(`Non-zero return value ${result}`)
      // return result;
    }
  }
  
  console.log("commands:", commands);
  console.log("modules:", modules);
  return exitcode.SUCCESS;
}

// Full pathname of the module is the name of the module.
async function install(path, io) {
  if (locked) {
    io.stderr.println(`Another installer is running. Please run install synchronously.`);
    return exitcode.NOLOCK;
  }
  locked = true;
  
  // check if module is already imported
  if (modules.hasOwnProperty(path)) {
    io.stderr.println(`Module ${path} is already installed.`);
    return exitcode.DUPLICATE;
  }
  
  // try to import module
  let module;
  try {
    module = await import(path);
  } catch (err) {
    io.stderr.println(`Failed to import builtin module ${path}: ${err}.`);
    locked = false;
    return exitcode.NOTFOUND;
  }

  // check for collision commands
  let duplicates = [];
  for (let command in module) {
    if (commands.hasOwnProperty(command)) {
      duplicates.push(command);
    }
  }
  if (duplicates.length !== 0) {
    io.stderr.println(`Failed to install module ${path}, commands ${duplicates} are already installed.`);
    locked = false;
    return exitcode.DUPLICATE;
  }

  // import them into commands
  modules[path] = [];
  for (let command in module) {
    commands[command] = new Command(path, command, module[command]);
    modules[path].push(commands[command]);
  }
  
  locked = false;
  return exitcode.SUCCESS;
}

function execute(command) {
  
}

export { setup, execute };