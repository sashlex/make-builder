'use strict';

const test = require( 'ava' );
const data = require( '../builder/container' );

console.log( '* builder/container *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
