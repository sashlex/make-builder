'use strict';

/* libs */
const data = require( './data' );
const Path = require( 'path' );
const Fs = require( 'fs' );
const Util = require( 'util' );
const stat = Util.promisify( Fs.stat );
const chokidar = require( 'chokidar' );
const shell = require( 'shelljs' );
const clone = require( 'clone' );
const log = data.log;

/* workers */
const asset = require( data.WORKER_DIR + '/asset' );
const html = require( data.WORKER_DIR + '/html' );
const css = require( data.WORKER_DIR + '/css' );
const js = require( data.WORKER_DIR + '/js' );

/**
 * Class Builder represents application builder
 * @class
 **/
class Builder {

   /**
    * Handle commad line command
    * @param { string } command
    * @param { string } argument
    * @return { undefined }
    */
   async build( command, argument ) {

      /* timer */
      this.start = new Date();
      log( `* Start ${ command }${ argument ? ' ' + argument : '' } *` );

      /* fix command if argument passed */
      command = argument ? ( command + 'Type' ) : command;

      /* call job by type */
      return command === 'build' ? ( await this.buildAll(), await this.afterAll()) :
         command === 'buildType' ? ( await this.buildType( argument ), await this.afterAll()) :
         command === 'watch' ? await this.watch() :
         command === 'watchType' ? await this.watch( argument ) :
         command === 'clean' || command === 'cleanType' ? this.clean( argument ) :
         log( 'Command not found!' );
   }

   /**
    * Build all types
    * @return { object } Promise
    **/
   async buildAll() {
      try {

         /* before build asset */
         log( 'Build assets' );
         await asset( data );

         /* build html */
         log( 'Build html' );
         await html( data );

         /* build css */
         log( 'Build css' );
         await css( data );

         /* build js */
         log( 'Build js' );
         await js( data );

      } catch( error ) {
         console.log( error );
      }
      return undefined;
   }

   /**
    * Build by type
    * @param { string } type - source type
    * @param { object } jobData - data for build
    * @return { undefined }
    **/
   async buildType( type, jobData ) {
      jobData = jobData || data;
      return type === 'asset' ? log( 'Build asset' ) || await asset( jobData ) :
         type === 'html' ? log( 'Build html' ) || await html( jobData ) :
         type === 'css' ? log( 'Build css' ) || await css( jobData ) :
         type === 'js' ? log( 'Build js' ) || await js( jobData ) :
         log( `Source type not found: ${ type }` );
   }

   /**
    * watch files by type
    * @param { string } type - data type
    * @return { object } Return watching paths
    **/
   async watch( type ) {
      await this.buildAll(); // prepare

      /* check params */
      if( ! data.paths || ! data.paths.length ) {
         throw new Error( 'There are no files to watch!' );
      }

      /* get data with files */
      const paths = ( await Promise.all( data.paths.map( async path => {

         if( type && path.type !== type ) { // check type if need
            return undefined;
         }

         /* get path info */
         const statData = await stat( path.src ).catch( _=> undefined );
         const isFile = statData && statData.isFile();

         /* only files keep */
         if( isFile ) {
            return path;
         }
         return undefined;
      }))).filter( v => v );

      /* get file paths */
      const files = paths.map( v => v.src );

      /* set watcher */
      this.watcher = chokidar.watch( files );
      this.watcher.on( 'change', async path => {
         let jobData = clone( data ); // to avoid change original
         jobData.paths = jobData.paths.map( v => { if( v.src === path ) return v; return undefined; }).filter( v => v ); // keep only updated file
         for( let i = 0; i < paths.length; i ++ ) {
            path === paths[ i ].src && ( await this.buildType( paths[ i ].type, jobData ));
         }
      });
      return files;
   }

   /**
    * Close watcher
    * @return { object }
    **/
   watchClose() {
      return this.watcher && this.watcher.close();
   }

   /**
    * After build
    * @return { object }
    **/
   afterAll() {

      /* timer */
      this.end = new Date();
      return log( '--- ok ---', (( this.end - this.start ) / 1000 ) + ' sec' );
   }

   /**
    * After build
    * @param { string } type - data type
    * @return { object }
    **/
   clean( type ) {

      /* check params */
      if( ! data.paths || ! data.paths.length ) {
         throw new Error( 'There are no files to delete!' );
      }

      /* get paths */
      const paths =  data.paths.map( v => {
         if( ! type ) { // return all if no type provided
            return v.src;
         }
         if( v.type === type ) { // filter if type provided
            return v.src;
         }
         return undefined;
      }).filter( v => v );
      return shell.rm( '-rf', paths );
   }

}

module.exports = new Builder();
