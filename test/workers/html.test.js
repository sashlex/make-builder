'use strict';

const Fs = require( 'fs' );
const test = require( 'ava' );
const tc = require( '../test.config' );
const html = require( '../../builder/workers/html' );

console.log( '* builder/workers/html *' );

/* setup */
test.before(() => tc.cleanup());

/* cleanup */
test.after.always(() => tc.cleanup());

test.cb( 'compile template, src and dist are files', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }/test-1.njk`,
         dist: `${ tc.DIST_DIR }/test/test-1.html`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '{% set x = "test1" %}test1 {{ x }}' );

   /* compile file */
   html( data )
      .then( _=> {
         const str = Fs.readFileSync( data.paths[ 0 ].dist, 'utf8' );
         t.deepEqual( str, 'test1 test1' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }/test-2.njk`,
         dist: `${ tc.DIST_DIR }/test`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '{% set x = "test2" %}test2 {{ x }}' );

   /* compile file */
   html( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-2.html`, 'utf8' );
         t.deepEqual( str, 'test2 test2' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'compile template, src file and dist is dotted directory with slash', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }/test-3.njk`,
         dist: `${ tc.DIST_DIR }/test.test/`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '{% set x = "test3" %}test3 {{ x }}' );

   /* compile file */
   html( data )
      .then( _=> {
         const str = Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-3.html`, 'utf8' );
         t.deepEqual( str, 'test3 test3' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src directory', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/test-5.html`,
      }],
      test: true
   };

   /* compile file */
   html( data )
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
         type: 'html',
         src: `${ tc.SRC_DIR }/test-4/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* create test file */
   Fs.mkdirSync( data.paths[ 0 ].src.slice( 0, -1 )); // without asterisk

   /* compile file */
   html( data )
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
         type: 'html',
         src: `${ tc.SRC_DIR }/**/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* compile file */
   html( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src with double asterisk', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }/**`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* compile file */
   html( data )
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
         type: 'html',
         src: `${ tc.SRC_DIR }/test.njk`,
         dist: `${ tc.DIST_DIR }/*`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* compile file */
   html( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })

      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with asterisk and slash at end', t => {
   t.plan( 1 );

   const data = {
      paths: [{
         type: 'html',
         src: `${ tc.SRC_DIR }/test.njk`,
         dist: `${ tc.DIST_DIR }/*/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   html( data )
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
         type: 'html',
         src: `${ tc.SRC_DIR }/test.njk`,
         dist: `${ tc.DIST_DIR }/**/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   html( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});
