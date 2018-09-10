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

async function setup(sysio) {
  let results = [];
  for (let path of builtins) {
    let result = await install(path, sysio);
    if (result !== exitcode.SUCCESS) {
      return result;
    }
  }
  
  // debug
  console.log("commands:", commands);
  console.log("modules:", modules);
  
  return exitcode.SUCCESS;
}

// Full pathname of the module is the name of the module.
async function install(path, sysio) {
  if (locked) {
    sysio.stderr.println(`Another installer is running. Please run install synchronously.`);
    return exitcode.NOLOCK;
  }
  locked = true;
  
  // check if module is already imported
  if (modules.hasOwnProperty(path)) {
    sysio.stderr.println(`Module ${path} is already installed.`);
    return exitcode.DUPLICATE;
  }
  
  // try to import module
  let module;
  try {
    module = await import(path);
  } catch (err) {
    sysio.stderr.println(`Failed to import builtin module ${path}: ${err}.`);
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
    sysio.stderr.println(`Failed to install module ${path}, commands ${duplicates} are already installed.`);
    locked = false;
    return exitcode.DUPLICATE;
  }

  // import them into commands
  modules[path] = [];
  let added = [];
  for (let command in module) {
    if (typeof module[command] === "function") {
      commands[command] = new Command(path, command, module[command]);
      modules[path].push(commands[command]);
      added.push(command);
    }
  }
  
  sysio.stdout.println();
  locked = false;
  return exitcode.SUCCESS;
}

function dispatch(command, sysio) {
  if (!commands.hasOwnProperty(command)) {
    sysio.stderr.println(`Could not find command ${command}.`)
    return null;
  }
  
  return commands[command].executable;
}

export { setup, dispatch };