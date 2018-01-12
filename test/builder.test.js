'use strict';

const test = require( 'ava' );
const data = require( '../builder/builder' );

console.log( '* builder/builder *' );

test.cb( 'test', t => {
   t.plan( 1 );

   t.deepEqual( true, true );
   return t.end();
});
