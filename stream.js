"use strict";

// A generic stream class for passing objects around.
class Stream {
  
  constructor() {
    this._buffer = [];
    this._waiting = [];
    this._listeners = [];
    this._handler = null;
    this._throughput = 0;
  }
  
  // There might be a race condition with this!
  write(message) {
    if (this._handler !== null) {
      this._handler(message);
    } else if (this._waiting.length === 0) {
      this._buffer.push(message);
    } else {
      let callback = this._waiting.shift();
      callback(message);
    }
    // Depending on how JS context switching is done, the order in 
    // which the listeners receive messages is not guaranteed.
    // More research needs to be done.
    this._listeners.forEach(l => l(message));
    this._throughput++;
  }
  
  read() {
    if (this._handler !== null) {
      throw new Error("Cannot read when a handler is attached.");
    }
    
    // if there are messages in the buffer, we simply return the first
    if (this._buffer.length !== 0) {
      return this._buffer.shift();
    }
    
    // otherwise we will return a promise of a message, which resolves
    // when a message becomes available.
    let parent = this;
    return new Promise(function (resolve, reject) {
      parent._waiting.push(resolve);
    });
  }
  
  // Attaches a handler to the stream, which executes instead of 
  // passing it downstream. All reads will fail if there is a handler
  // attached. Attach a listener to inspect the stream.
  attach(handle) {
    this._handler = handle;
  }
  
  detach() {
    this._handler = null;
  }
  
}

// Wrapper for a stream
class Stdin {
  
  constructor(stream) {
    this._stream = stream;
  }
  
  readline() {
    return this._stream.read();
  }
  
}

// Wrapper for a stream
class Stdout {
  
  constructor(stream) {
    this._stream = stream;
  }
  
  println(line) {
    this._stream.write(line);
  }
  
}

export { Stream, Stdin, Stdout };