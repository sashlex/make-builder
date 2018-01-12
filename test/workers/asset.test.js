'use strict';

const test = require( 'ava' );
const data = require( '../../builder/workers/asset' );

console.log( '* builder/workers/asset *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
