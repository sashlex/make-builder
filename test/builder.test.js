'use strict';

const test = require( 'ava' );
const rewire = require( 'rewire' );
const builder = rewire( '../builder/builder' );
const sinon = require( 'sinon' );

/* add testing spy */
const spyBuilder = sinon.spy( builder, 'build' );
const spyBuildAll = sinon.spy( builder, 'buildAll' );
const spyBuildType = sinon.spy( builder, 'buildType' );
const spyAfterAll = sinon.spy( builder, 'afterAll' );
const spyAsset = sinon.spy();
const spyHtml = sinon.spy();
const spyCss = sinon.spy();
const spyJs = sinon.spy();

/* replace "builder" modules for testing */
builder.__set__( 'data.paths', 'paths' );
builder.__set__( 'asset', data => spyAsset( data ));
builder.__set__( 'html', data => spyHtml( data ));
builder.__set__( 'css', data => spyCss( data ));
builder.__set__( 'js', data => spyJs( data ));
builder.__set__( 'log', _=> '' );

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

test.cb( 'build', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'build' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         t.deepEqual( spyBuildAll.callCount, 1 );
         t.deepEqual( spyAsset.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyHtml.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyCss.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyJs.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyAfterAll.callCount, 1 );
         resetSpies();
         return t.end();
      });
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
         t.deepEqual( spyAsset.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyHtml.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyCss.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyJs.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
         resetSpies();
         return t.end();
      });
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
         t.deepEqual( spyAsset.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyHtml.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyCss.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyJs.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
         resetSpies();
         return t.end();
      });
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
         t.deepEqual( spyAsset.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyHtml.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyCss.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyJs.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyAfterAll.callCount, 1 );
         resetSpies();
         return t.end();
      });
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
         t.deepEqual( spyAsset.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyHtml.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyCss.withArgs( 'paths' ).callCount, 0 );
         t.deepEqual( spyJs.withArgs( 'paths' ).callCount, 1 );
         t.deepEqual( spyAfterAll.callCount, 1 );
         resetSpies();
         return t.end();
      });
});

test.cb( 'watch', t => {
   t.plan( 7 );

   /* execute */
   Promise.resolve()
      .then( _=> builder.build( 'watch' ))
      .then( _=> {

         /* check called chain */
         t.deepEqual( spyBuilder.callCount, 1 );
         resetSpies();
         return t.end();
      });
});

// test for no real data, for example bad param
