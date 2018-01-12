'use strict';

const test = require( 'ava' );
const data = require( '../../builder/workers/js' );

console.log( '* builder/workers/js *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
