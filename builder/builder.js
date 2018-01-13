'use strict';

/* libs */
const data = require( './data' );
const Promise = require( 'bluebird' );
const Path = require( 'path' );

/* workers */
const asset = require( data.WORKER_DIR + '/asset' );
const html = require( data.WORKER_DIR + '/html' );
const css = require( data.WORKER_DIR + '/css' );
const js = require( data.WORKER_DIR + '/js' );

/**
 * Class Builder represents application builder
 * @class
 */
class Builder {

   /**
    * Build by command
    * @param { string } command
    * @param { string } argument
    * @return { object } Promise
    */
   build( command, argument ) {

      /* timer */
      this.start = new Date();
      log( `* Builder start ${ command } ${ argument } *` );

      /* change command if argument passed */
      command = argument ? ( command + 'Type' ) : command;

      /* call job by type */
      command === 'build' ? this.buildAll().then(() => this.afterAll()) :
         command === 'buildType' ? this.buildType( argument ).then(() => this.afterAll()) :
         command === 'watch' ? this.watch() :
         command === 'watchType' ? this.watch( argument ) :
         command === 'clean' || command === 'cleanType' ? this.clean( argument ) :
         log( 'Command not found' );
   }

   /**
    * Build files by type
    * @param {string} type - file type
    * @return {object} promise
    */
   buildType( type ) {
      type === 'asset' ? log( 'Build asset' ) && asset( data.paths ) :
         type === 'html' ? log( 'Build html' ) && html( data.paths ) :
         type === 'css' ? log( 'Build css' ) && css( data.paths ) :
         type === 'js' ? log( 'Build js' ) && js( data.paths ) :
         log( 'Source type not found:', type ) && process.exit( 1 );
   }
}

/**
 * Show message in console
 * @param { * } arguments
 * @return { void }
 */
function log() {
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



module.exports = new Builder();
