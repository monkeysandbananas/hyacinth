"use strict";

import * as exitcode from '../exitcode.js';

async function testOutput(io, env, cmd) {
  io.stdout.println("Executed testOutput");
  io.stdout.println("output output output output!");
  return exitcode.SUCCESS;
}

async function testInput(io, env, cmd) {
  let line = await io.stdin.readline();
  io.stdout.println("Read input: " + line);
  return exitcode.SUCCESS;
}

async function testExitcode(io, env, cmd) {
  return exitcode.FAILURE;
}

async function testReadAll(io, env, cmd) {
  io.stdin.readall((line) => {
    io.stdout.println(line);
  });
  return exitcode.SUCCESS;
}

export { testOutput, testInput, testExitcode };