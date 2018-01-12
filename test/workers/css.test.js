'use strict';

const test = require( 'ava' );
const data = require( '../../builder/workers/css' );

console.log( '* builder/workers/css *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
