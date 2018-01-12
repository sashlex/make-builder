'use strict';

const test = require( 'ava' );
const data = require( '../../builder/workers/html' );

console.log( '* builder/workers/html *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
