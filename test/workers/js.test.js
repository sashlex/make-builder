'use strict';

const Fs = require( 'fs' );
const test = require( 'ava' );
const tc = require( '../test.config' );
const js = require( '../../builder/workers/js' );

console.log( '* builder/workers/js *' );

/* setup */
test.before(() => tc.cleanup());

/* cleanup */
test.after.always(() => tc.cleanup());

test.cb( 'copy file, src and dist are files', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test-1.js`,
         dist: `${ tc.DIST_DIR }/test-1/test-1.js`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, 'let x=1;' );

   /* execute test */
   js( data )
      .then( _=> {
         const str = Fs.readFileSync( data.paths[ 0 ].dist, 'utf8' );
         t.deepEqual( str, 'let x = 1;' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test-2.js`,
         dist: `${ tc.DIST_DIR }/test-2`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, 'let x=2;' );

   /* execute test */
   js( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-2.js`, 'utf8' );
         t.deepEqual( str, 'let x = 2;' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is dotted directory with slash', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test-3.js`,
         dist: `${ tc.DIST_DIR }/test.test/`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, 'let x=3;' );

   /* compile file */
   js( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }test-3.js`, 'utf8' );
         t.deepEqual( str, 'let x = 3;' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/test-5.js`,
      }],
      test: true
   };

   /* compile file */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Source is not file!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src directory with asterisk and dist is directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test-4/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* create test file */
   Fs.mkdirSync( data.paths[ 0 ].src.slice( 0, -1 )); // without asterisk

   /* compile file */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src with asterisk path', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/**/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* execute test */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with asterisk', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test.js`,
         dist: `${ tc.DIST_DIR }/*`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src with double asterisk', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/**`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* compile file */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with asterisk and slash at end', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test.js`,
         dist: `${ tc.DIST_DIR }/*/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with double asterisk and slash at end', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'js',
         src: `${ tc.SRC_DIR }/test.js`,
         dist: `${ tc.DIST_DIR }/**/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   js( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});
