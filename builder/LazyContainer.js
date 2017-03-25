'use strict';

/**
 * Represents libraries container
 * with lazy loading soul
 **/
class LazyContainer {

   /**
    * @param {object} parent - parent reference
    * @constructor
    */
   constructor() {

      /* set always used parameters */

      /* configure data */
      this.data = require( './data' );

      /* normalize data for crossplatform compatible */
      this.data.rootDir && ( this.data.rootDir = this.path.normalize( this.data.rootDir ) );
      this.data.builderDir && ( this.data.builderDir = this.path.normalize( this.data.builderDir ) );
      this.data.sourcesDir && ( this.data.sourcesDir = this.path.normalize( this.data.sourcesDir ) );
      this.data.distDir && ( this.data.distDir = this.path.normalize( this.data.distDir ) );
      for( let i = 0; i < this.data.paths.length; i ++ ) {
         this.data.paths[ i ].source && ( this.data.paths[ i ].source = this.path.normalize( this.data.paths[ i ].source ) );
         this.data.paths[ i ].buildDist && ( this.data.paths[ i ].buildDist = this.path.normalize( this.data.paths[ i ].buildDist ) );
         this.data.paths[ i ].destroyDist && ( this.data.paths[ i ].destroyDist = this.path.normalize( this.data.paths[ i ].destroyDist ) );
      }
   }

   /**
    * Set parent reference ( this <- parent )
    * @param {object} parent - parent reference
    **/
   setParent( parent ) {
      this.parent = parent;
   }

   /**
    * Show message in console
    * @param {*} arguments
    * @return {void}
    */
   consoleMessage() {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = ( '0' + date.getSeconds() ).slice( -2 );
      let miliseconds = date.getMilliseconds();

      this.stack = new Error().stack;
      this.caller = this.stack.split( '\n' )[ 2 ].trim();
      this.callerFile = this.path.basename( this.caller ).replace( /\)$/, '' );

      /* without undefined values */
      return console.log( `-> ${ [ ...arguments ].filter( arg => { return arg !== undefined; } ).join( ' | ' ) } | ${ hours }:${ minutes }:${ seconds }:${ miliseconds } | ${ this.callerFile } ` );
   }

   get pug() {
      return require( 'pug' );
   }

   get less() {
      return require( 'less' );
   }

   get beautify() {
      return require( 'js-beautify' );
   };

   get promise() {
      return require( 'bluebird' );
   }

   get readFile() {
      return this.promise.promisify( require( 'fs' ).readFile ); // here this.promise will setted from getter ( get promise )
   };

   get writeFile() {
      return this.promise.promisify( require( 'fs' ).writeFile );
   }

   get mkdir() {
      return this.promise.promisify( require( 'fs' ).mkdir );
   }

   get lstat() {
      return this.promise.promisify( require( 'fs' ).lstat );
   }

   get watch() {
      return require( 'fs' ).watch;
   }

   get path() {
      return require( 'path' );
   }

   get shell() {
      if( !this.shelljs ) {
         this.shelljs = require( 'shelljs' );

         /* save old silent state */
         this.silentState = this.shelljs.config.silent;

         /* enable silent state  */
         this.shelljs.config.silent = true;

         /* restore old silent state */
         // this.shelljs.config.silent = this.silentState; 

      }
      return this.shelljs;
   }
}

module.exports = new LazyContainer();
