'use strict';

const Fs = require( 'fs' );
const test = require( 'ava' );
const tc = require( '../test.config' );
const asset = require( '../../builder/workers/asset' );

console.log( '* builder/workers/asset *' );

/* setup */
test.before(() => tc.cleanup());

/* cleanup */
test.after.always(() => tc.cleanup());

test.cb( 'copy file, src and dist are files', t => {
   /*
     copy file from src to dist:
     src: 'src/file.json'
     dist: 'dist/file-prod.json'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-1.json`,
         dist: `${ tc.DIST_DIR }/test/test-test-1.json`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ a: 'b' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( data.paths[ 0 ].dist ));
         t.deepEqual( obj.a, 'b' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy file, src file and dist is directory', t => {
   /*
     copy file from src to dist:
     src: 'src/file.json'
     dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-2.json`,
         dist: `${ tc.DIST_DIR }/test`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ b: 'c' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-2.json` ));
         t.deepEqual( obj.b, 'c' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy file, src file and dist is dotted directory with slash', t => {
   /*
     copy file from src to dist:
     src: 'src/file.json'
     dist: 'dist.dir/'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-3.json`,
         dist: `${ tc.DIST_DIR }/test.test/`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ c: 'd' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( `${ data.paths[ 0 ].dist }test-3.json` ));
         t.deepEqual( obj.c, 'd' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy file, src file and dist is directory', t => {
   /*
     copy file from src to dist:
     src: 'src/file.json'
     dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-4.json`,
         dist: `${ tc.DIST_DIR }/test`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ d: 'e' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-4.json` ));
         t.deepEqual( obj.d, 'e' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy file, src directory and dist is file', t => {
   /*
     copy file from src to dist:
     src: 'src/'
     dist: 'dist/file.json'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/test-5.json`,
      }]
   };

   /* create test file */
   Fs.writeFileSync( `${ data.paths[ 0 ].src }/test-5.json`, JSON.stringify({ e: 'f' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( data.paths[ 0 ].dist ));
         t.deepEqual( obj.e, 'f' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy files, src directory with asterisk and dist is directory', t => {
   /*
     copy files from directory:
     src: 'src/*'
     dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-6/*`,
         dist: `${ tc.DIST_DIR }/test-test-6`,
      }]
   };

   /* create test file */
   Fs.mkdirSync( data.paths[ 0 ].src.slice( 0, -1 )); // without asterisk
   Fs.writeFileSync( `${ data.paths[ 0 ].src.slice( 0, -1 ) }test-6.json`, JSON.stringify({ f: 'h' })); // without asterisk

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-6.json` ));
         t.deepEqual( obj.f, 'h' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'copy directory, src directory and dist is directory', t => {
   /*
      copy file:
      src: 'src'
      dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test-7`,
         dist: `${ tc.DIST_DIR }/test-test-7`,
      }]
   };

   /* create test file */
   Fs.mkdirSync( data.paths[ 0 ].src );
   Fs.writeFileSync( `${ data.paths[ 0 ].src }/test-7.json`, JSON.stringify({ h: 'i' }));

   /* execute test */
   asset( data )
      .then( _=> {
         const obj = JSON.parse( Fs.readFileSync( `${ data.paths[ 0 ].dist }/test-7/test-7.json` ));
         t.deepEqual( obj.h, 'i' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src with asterisk path', t => {
   /*
     error:
     src: 'src/**\/*'
     dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/**/*`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, src with double asterisk', t => {
   /*
     error:
     src: 'src/**'
     dist: 'dist'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/**`,
         dist: `${ tc.DIST_DIR }`,
      }],
      test: true
   };

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Source not found!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with asterisk', t => {
   /*
     error:
     src: 'src/file.json'
     dist: 'dist/*'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/*`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with double asterisk', t => {
   /*
     error:
     src: 'src/file.json'
     dist: 'dist/**'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/**`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with asterisk and slash at end', t => {
   /*
     error:
     src: 'src/file.json'
     dist: 'dist/*\/'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/*/`,
      }],
      test: true
   };

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, '' );

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});


test.cb( 'bad parameter, dist with double asterisk and slash at end', t => {
   /*
     error:
     src: 'src'
     dist: 'dist/**\/'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/**/`,
      }],
      test: true
   };

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});

test.cb( 'bad parameter, dist with double asterisk at end', t => {
   /*
     error:
     src: 'src'
     dist: 'dist/**'
   */

   t.plan( 1 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }`,
         dist: `${ tc.DIST_DIR }/**`,
      }],
      test: true
   };

   /* execute test */
   asset( data )
      .then( error => {
         t.deepEqual( error.message, 'Bad dist parameter!' );
         return t.end();
      })
      .catch( e => console.log( e ));
});
