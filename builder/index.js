'use strict';

/* builder entry point */

/**
 * Available commands:
 * npm run build
 * npm run build html [ asset, html, css, js ]
 * npm run watch
 * npm run watch html [ asset, html, css, js ]
 * npm run clean
 * npm run clean html [ asset, html, css, js ]
 * npm run app
 * npm test
 **/

const builder = require( './builder' );
const parameters = process.argv.slice( 2 );
const command = parameters[ 0 ];
const argument = command && parameters[ 1 ]; // if command not empty set argument

/* call main job */
builder.build( command, argument );
