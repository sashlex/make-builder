'use strict';

/* builder entry point */
const builder = require( './builder' );
const parameters = process.argv.slice( 2 );
const command = parameters[ 0 ];
const argument = command && parameters[ 1 ]; // if command not empty set argument

/* call main job */
builder.build( command, argument );
