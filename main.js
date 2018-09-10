// Usage of Shell

import { Shell } from './shell.js';

// initialize the shell
let sh = new Shell();
sh.attach(console.log);

// sets up the shell
sh.setup()
  .then(() => sh.in("echo hello"));
