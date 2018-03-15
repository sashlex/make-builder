'use strict';

/* libs */
const data = require( './data' );
const Path = require( 'path' );
const log = data.log;

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
    * Handle commad line command
    * @param { string } command
    * @param { string } argument
    * @return { undefined }
    */
   build( command, argument ) {

      /* timer */
      this.start = new Date();
      log( `* Start ${ command }${ argument ? ' ' + argument : '' } *` );

      /* fix command if argument passed */
      command = argument ? ( command + 'Type' ) : command;

      /* call job by type */
      command === 'build' ? this.buildAll().then( _=> this.afterAll()) :
         command === 'buildType' ? this.buildType( argument ).then( _=> this.afterAll()) :
         command === 'watch' ? this.watch() :
         command === 'watchType' ? this.watch( argument ) :
         command === 'clean' || command === 'cleanType' ? this.clean( argument ) :
         log( 'Command not found' );
   }

   /**
    * Build all types
    * @return { object } Promise
    */
   async buildAll() {
      try {

         /* before build asset */
         log( 'Building assets' );
         await asset( data.paths );

         /* build html */
         log( 'Building html' );
         // await html( data.paths );

         /* build css */
         log( 'Build css' );
         // await css( data.paths );

         /* build js */
         log( 'Build js' );
         // await js( data.paths );
      } catch( error ) {
         console.log( error );
      }
      return undefined;
   }

   /**
    * Build by type
    * @param { string } type - source type
    * @return { undefined }
    */
   buildType( type ) {
      type === 'asset' ? log( 'Build asset' ) && asset( data.paths ) :
   //       type === 'html' ? log( 'Build html' ) && html( data.paths ) :
   //       type === 'css' ? log( 'Build css' ) && css( data.paths ) :
   //       type === 'js' ? log( 'Build js' ) && js( data.paths ) :
         log( 'Source type not found:', type );
   }
}

module.exports = new Builder();
