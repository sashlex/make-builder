'use strict';

const test = require( 'ava' );
const Fs = require( 'fs' );
const tc = require( './test.config' );
const rewire = require( 'rewire' );
const builder = rewire( '../builder/builder' );
const sinon = require( 'sinon' );

/* add testing spy */
const spyBuilder = sinon.spy( builder, 'build' );
const spyBuildAll = sinon.spy( builder, 'buildAll' );
const spyBuildType = sinon.spy( builder, 'buildType' );
const spyWatch = sinon.spy( builder, 'watch' );
const spyAfterAll = sinon.spy( builder, 'afterAll' );
const spyAsset = sinon.spy( builder.__get__( 'asset'));
const spyHtml = sinon.spy( builder.__get__( 'html'));
const spyCss = sinon.spy( builder.__get__( 'css'));
const spyJs = sinon.spy( builder.__get__( 'js'));
const spyChokidarWatch = sinon.spy( builder.__get__( 'chokidar'), 'watch' ); // wrap method from builder.js -> chokidar.watch( files )

/* replace "builder" modules for testing */
builder.__set__( 'data', { test: true });
builder.__set__( 'asset', ( ...data ) => spyAsset( ...data ));
builder.__set__( 'html', ( ...data ) => spyHtml( ...data ));
builder.__set__( 'css', ( ...data ) => spyCss( ...data ));
builder.__set__( 'js', ( ...data ) => spyJs( ...data ));
builder.__set__( 'log', _=> '' );
builder.__set__( 'chokidar.watch', ( ...data ) => spyChokidarWatch( ...data )); // replace method from builder.js -> chokidar.watch( files ) with spy

/* reset spies */
function resetSpies() {
   spyBuilder.resetHistory();
   spyBuildAll.resetHistory();
   spyBuildType.resetHistory();
   spyAfterAll.resetHistory();
   spyAsset.resetHistory();
   spyHtml.resetHistory();
   spyCss.resetHistory();
   spyJs.resetHistory();
}

console.log( '* builder/builder *' );

/* setup */
test.before(() => tc.cleanup());

/* cleanup */
test.after.always(() => tc.cleanup());

test.cb( 'build', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildAll.callCount, 1 );
         t.deepEqual( spyAsset.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyHtml.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyCss.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyJs.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyAfterAll.callCount, 1 );
      })
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'build asset', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build', 'asset' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyHtml.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyCss.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyJs.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
      })
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'build html', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build', 'html' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyHtml.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyCss.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyJs.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
      })
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'build css', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build', 'css' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyHtml.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyCss.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyJs.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
      })
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'build js', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build', 'js' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyHtml.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyCss.withArgs({ test: true }).callCount, 0 );
         t.deepEqual( spyJs.withArgs({ test: true }).callCount, 1 );
         t.deepEqual( spyAfterAll.callCount, 1 );
      })
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'watch initialization', t => {
   t.plan( 7 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/test.json`,
      }]
   };

   /* update "builder" module data for test */
   builder.__set__( 'data', data );

   /* create test file */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ a: 'a' }));

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'watch' ))
      .then( _=> {

         /* check called chain ( watch initialization ) */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildAll.callCount, 1 );
         t.deepEqual( spyWatch.callCount, 1 );
         return spyWatch.returnValues[ 0 ]; // check what return builder.watch method
      })
      .then( paths => {
         t.deepEqual( paths, [ `${ tc.SRC_DIR }/test.json` ]);
         t.deepEqual( spyChokidarWatch.withArgs( paths ).callCount, 1 ); // check chockidar.watch() called
         t.deepEqual( spyChokidarWatch.returnValues[ 0 ].listeners( 'change' ).length, 1 ); // check watcher.on() called
         t.deepEqual( spyBuildType.callCount, 0 ); // check buildType() no called
      })
      .then( _=> builder.watchClose()) // close watcher
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'watch worker execution', t => {
   t.plan( 12 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test`,
         dist: `${ tc.DIST_DIR }/test/test`,
      },{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/test/test.json`,
      },{
         type: 'html',
         src: `${ tc.SRC_DIR }/test.njk`,
         dist: `${ tc.DIST_DIR }/test/test.html`,
      }]
   };
   const data_1 =  { // for test whatch json file below
      paths: [ data.paths[ 1 ]]
   };
   const data_2 =  { // for test whatch njk file below
      paths: [ data.paths[ 2 ]]
   };

   /* update "builder" module data for test */
   builder.__set__( 'data', data );

   /* create test files */
   Fs.mkdirSync( data.paths[ 0 ].src );
   Fs.writeFileSync( data.paths[ 1 ].src, JSON.stringify({ a: 'a' }));
   Fs.writeFileSync( data.paths[ 2 ].src, '{% set x = "test" %}test {{ x }}' );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'watch' ))

   /* wait until watcher has started */
      .then( _=> new Promise( res => setTimeout( _=> res(), 1000 )))
      .then( _=> {

         /* check first file content */
         t.deepEqual( JSON.parse( Fs.readFileSync( data.paths[ 1 ].src, 'utf8' )), { a: 'a' });
         t.deepEqual( JSON.parse( Fs.readFileSync( data.paths[ 1 ].dist, 'utf8' )), { a: 'a' });

         /* update first test file */
         Fs.writeFileSync( data.paths[ 1 ].src, JSON.stringify({ b: 'b' }));
         return new Promise( res => setTimeout( _=> res(), 1000 )); // wait until watch worker has executed
      })
      .then( _=> {

         /* check updated files content */
         t.deepEqual( JSON.parse( Fs.readFileSync( data.paths[ 1 ].src, 'utf8' )), { b: 'b' });
         t.deepEqual( JSON.parse( Fs.readFileSync( data.paths[ 1 ].dist, 'utf8' )), { b: 'b' });

         /* check called chain */
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs( data_1 ).callCount, 1 ); // check is worker executed with our changed file
      })
      .then( _=> {

         /* check second file content */
         t.deepEqual( Fs.readFileSync( data.paths[ 2 ].src, 'utf8' ), '{% set x = "test" %}test {{ x }}' );
         t.deepEqual( Fs.readFileSync( data.paths[ 2 ].dist, 'utf8' ), 'test test' );

         /* update second test file */
         Fs.writeFileSync( data.paths[ 2 ].src, '{% set x = "test test" %}test {{ x }}' );
         return new Promise( res => setTimeout( _=> res(), 1000 )); // wait until watch worker has executed
      })
      .then( _=> {

         /* check updated files content */
         t.deepEqual( Fs.readFileSync( data.paths[ 2 ].src, 'utf8' ), '{% set x = "test test" %}test {{ x }}' );
         t.deepEqual( Fs.readFileSync( data.paths[ 2 ].dist, 'utf8' ), 'test test test' );

         /* check called chain */
         t.deepEqual( spyBuildType.callCount, 2 );
         t.deepEqual( spyHtml.withArgs( data_2 ).callCount, 1 ); // check is worker executed with our changed file
      })
      .then( _=> builder.watchClose()) // close watcher
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});

test.cb( 'watch asset', t => {
   t.plan( 6 );

   const data = {
      paths: [{
         type: 'asset',
         src: `${ tc.SRC_DIR }/test.json`,
         dist: `${ tc.DIST_DIR }/test.json`,
      },{
         type: 'html',
         src: `${ tc.SRC_DIR }/test.njk`,
         dist: `${ tc.DIST_DIR }/test.html`,
      }]
   };
   const data_1 =  { // for test whatch json file below
      paths: [ data.paths[ 0 ]]
   };

   /* update "builder" module data for test */
   builder.__set__( 'data', data );

   /* create test files */
   Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ b: 'b' }));
   Fs.writeFileSync( data.paths[ 1 ].src, '{% set y = "test" %}test {{ y }}' );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'watch', 'asset' ))

   /* wait until watcher has started */
      .then( _=> new Promise( res => setTimeout( _=> res(), 1000 )))
      .then( _=> {

         /* update asset file */
         Fs.writeFileSync( data.paths[ 0 ].src, JSON.stringify({ c: 'c' }));
         return new Promise( res => setTimeout( _=> res(), 1000 )); // wait until watch worker has executed
      })
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuildType.callCount, 1 );
         t.deepEqual( spyAsset.withArgs( data_1 ).callCount, 1 ); // check is worker executed with our changed file
         t.deepEqual( spyHtml.callCount, 1 ); // check is html worker executed once in builder.buildAll()
      })
      .then( _=> {

         /* update second test file */
         Fs.writeFileSync( data.paths[ 1 ].src, '{% set y = "test test" %}test {{ y }}' );
         return new Promise( res => setTimeout( _=> res(), 1000 )); // wait until watch worker has executed
      })
      .then( _=> {

         /* check called chain ( html worker should not executed, only asset ) */
         t.deepEqual( spyBuildType.callCount, 1 ); // executed once on asset file not on html
         t.deepEqual( spyAsset.withArgs( data_1 ).callCount, 1 ); // executed on previous step
         t.deepEqual( spyHtml.callCount, 1 ); // executed once on builder.buildAll()
      })
      .then( _=> builder.watchClose()) // close watcher
      .then( _=> resetSpies() || t.end())
      .catch( e => console.log( e ));
});
