'use strict';

const test = require( 'ava' );
const data = require( '../builder/data' );
const Fs = require( 'fs' );

console.log( '* builder/data *' );

test.cb( 'directories exists', t => {
   t.plan( 5 );

   t.deepEqual( Fs.existsSync( data.ROOT_DIR ), true );
   t.deepEqual( Fs.existsSync( data.BUILDER_DIR ), true );
   t.deepEqual( Fs.existsSync( data.WORKER_DIR ), true );
   t.deepEqual( Fs.existsSync( data.SOURCE_DIR ), true );
   t.deepEqual( Fs.existsSync( data.DIST_DIR ), true );
   return t.end();
});

test.cb( 'paths is array', t => {
   t.plan( 1 );

   t.deepEqual( Array.isArray( data.paths ), true );
   return t.end();
});
