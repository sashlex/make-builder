'use strict';

/* build data */
const data = require( './data' );

/* libs */
const Path = require( 'path' );
const Promise = require( 'bluebird' );

/**
 * Common Container
 **/
class Container {

   /**
    * Show message in console
    * @param { * } arguments
    * @return { void }
    */
   log() {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = ( '0' + date.getSeconds()).slice( -2 );
      const miliseconds = date.getMilliseconds();

      const stack = new Error().stack;
      const caller = stack.split( '\n' )[ 2 ].trim();
      const callerFile = Path.basename( caller ).replace( /\)$/, '' );

      /* without undefined values */
      return console.log( `-> ${ [ ...arguments ].filter( arg => arg !== undefined ).join( ' | ' ) } | ${ hours }:${ minutes }:${ seconds }:${ miliseconds } | ${ callerFile } ` );
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
      return Promise.promisify( require( 'fs' ).readFile );
   };

   get writeFile() {
      return Promise.promisify( require( 'fs' ).writeFile );
   }

   get mkdir() {
      return Promise.promisify( require( 'fs' ).mkdir );
   }

   get lstat() {
      return Promise.promisify( require( 'fs' ).lstat );
   }

   get watch() {
      return require( 'fs' ).watch;
   }

   get path() {
      return Path;
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

module.exports = new Container();
