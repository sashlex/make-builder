'use strict';

const Path = require( 'path' );
const shell = require( 'shelljs' );
const Util = require( 'util' );
const Fs = require( 'fs' );
const stat = Util.promisify( Fs.stat );

/**
 * Asset builder
 * @param { object } data
 * @param { array } data.paths
 * @param { boolean } data.test
 * @return { object } data
 */
module.exports = async data => {
   const log = data.log || ( str => console.log( str ));
   let error, asterisk = '/*';

   /* return if no data */
   if( ! Array.isArray( data.paths )) {
      return undefined;
   }

   /* go through data */
   await Promise.all( data.paths.map( async v => {
      let src = {}, // source info
          dist = {}, // dist info
          distBasename;

      /* check params */
      if( v.type !== 'asset'  ) {
         return undefined; // skip other type
      }
      if( ! v.src || ! v.dist ) {
         throw new Error( 'Src or dist is empty!' );
      }

      /* get source info */
      src.asterisk = /\/\*$/.test( v.src ); // is asterisk ( '/*' ) present in path
      src.stat = await stat( src.asterisk ? v.src.slice( 0, - asterisk.length ) : v.src ).catch( _=> src.stat = undefined ); // get file info
      src.type = src.stat && src.stat.isFile() ? 'file' : src.stat && src.stat.isDirectory() ? 'directory' : undefined;

      /* check source type */
      if( ! src.type ) {
         throw new Error( 'Source not found!' );
      }

      /* get dist info */
      dist.asterisk = /\*+\/?$/.test( v.dist ); // is path have asterisk at end
      dist.stat = await stat( v.dist ).catch( _=> dist.stat = undefined );
      distBasename = Path.basename( v.dist );

      /* check destination */
      if( dist.asterisk || ! distBasename ) {
         throw new Error( 'Bad dist parameter!' );
      }
      dist.type = dist.stat && dist.stat.isFile() ? 'file' :
         dist.stat && dist.stat.isDirectory() ? 'directory' :
         distBasename.includes( '.' ) && v.dist.slice( -1 ) === '/' ? 'directory' : // check last symbol for '/' mean directory
         distBasename.includes( '.' ) ? 'file' : 'directory';

      dist.type === 'file' && shell.mkdir( '-p', Path.dirname( v.dist )); // create path
      dist.type === 'directory' && shell.mkdir( '-p', v.dist ); // create path

      /* copy file, if src directory, and dist is file, and this file exists in src */
      if( src.type === 'directory' && dist.type === 'file' ) {
         let path = src.asterisk ? Path.normalize( `${ v.src.slice( 0, - asterisk.length ) }/${ distBasename }` ) : Path.normalize( `${ v.src }/${ distBasename }` ); // get path without asterisk
         src.stat = await stat( path ).catch( _=> src.stat = undefined );
         if( ! src.stat ) {
            throw new Error( 'Source not found!' );
         }
         src.stat && src.stat.isFile() && shell.cp( path, v.dist ); // copy file
      }

      /* copy files */
      else {
         shell.cp( '-R', v.src, v.dist );
      }
      return undefined;
   })).catch( e => ! data.test && log( e ) || ( error = e )); // return error
   return error || data;
};
