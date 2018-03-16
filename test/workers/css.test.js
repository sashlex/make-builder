'use strict';

const Fs = require( 'fs' );
const test = require( 'ava' );
const tc = require( '../test.config' );
const css = require( '../../builder/workers/css' );

console.log( '* builder/workers/css *' );

/* setup */
test.before(() => tc.cleanup());

/* cleanup */
test.after.always(() => tc.cleanup());

test.cb( 'copy file, src and dist are files', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'css',
         src: `${ tc.SRC_DIR }/test-1.less`,
         dist: `${ tc.DIST_DIR }/test-1/test-1.css`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '@color:red;#header{color:@color;}' );

   /* execute test */
   css( data )
      .then( _=> {
         const str = Fs.readFileSync( data.paths[ 0 ].dist, 'utf8' );
         t.deepEqual( str, '#header{color:red}' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'css',
         src: `${ tc.SRC_DIR }/test-2.less`,
         dist: `${ tc.DIST_DIR }/test-2`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '@color:green;#header{color:@color;}' );

   /* execute test */
   css( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-2.css`, 'utf8' );
         t.deepEqual( str, '#header{color:green}' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is dotted directory with slash', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'css',
         src: `${ tc.SRC_DIR }/test-3.less`,
         dist: `${ tc.DIST_DIR }/test.test/`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '@color:blue;#header{color:@color;}' );

   /* compile file */
   css( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }test-3.css`, 'utf8' );
         t.deepEqual( str, '#header{color:blue}' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'css',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/test-5.css`,
      }],
      test: true
   };

   /* compile file */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/test-4/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* create test file */
   Fs.mkdirSync( data.paths[ 0 ].src.slice( 0, -1 )); // without asterisk

   /* compile file */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/**/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* execute test */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/test.css`,
         dist: `${ tc.DIST_DIR }/*`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/**`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* compile file */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/test.css`,
         dist: `${ tc.DIST_DIR }/*/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   css( data )
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
         type: 'css',
         src: `${ tc.SRC_DIR }/test.less`,
         dist: `${ tc.DIST_DIR }/**/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   css( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});
