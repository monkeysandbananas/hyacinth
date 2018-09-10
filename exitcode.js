"use strict";

// List of exit causes to standardize failure codes
// ALl non-zero codes are failures.
export var SUCCESS = 0;
export var FAILURE = 1;                   // generic failure
export var ARGUMENT = 2;                  // invalid arguments
export var NOLOCK = 3;                    // no locks available
export var NOTFOUND = 4;                  // resource not found
export var DUPLICATE = 5;                 // resource already exists