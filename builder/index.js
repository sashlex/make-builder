'use strict';

const Builder = require( './Builder' );
const builder = new Builder();
const parameters = process.argv.slice( 2 );
let command = parameters[ 0 ];
let argument = command && parameters[ 1 ]; // if command not empty set argument

/* main job */
builder.build( command, argument );
