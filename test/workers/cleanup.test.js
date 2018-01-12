'use strict';

const test = require( 'ava' );
const data = require( '../../builder/workers/cleanup' );

console.log( '* builder/workers/cleanup *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
