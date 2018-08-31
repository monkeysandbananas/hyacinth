// Usage of Shell

import { Shell } from './shell.js';

// initialize the shell
let sh = new Shell();

// set output to the console
sh.attach(console.log);

// feed input
sh.in("echo hello");