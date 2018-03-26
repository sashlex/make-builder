'use strict';

const Path = require( 'path' );
const shell = require( 'shelljs' );
const jsBeautify = require( 'js-beautify' ).js;
const Util = require( 'util' );
const Fs = require( 'fs' );
const stat = Util.promisify( Fs.stat );
const readFile = Util.promisify( Fs.readFile );
const writeFile = Util.promisify( Fs.writeFile );

/**
 * Css builder
 * @param { object } data
 * @param { array } data.paths
 * @param { boolean } data.test
 * @return { object } data
 */
module.exports = async data => {
   const log = data.log || ( str => console.log( str ));
   let error;

   /* return if no data */
   if( ! Array.isArray( data.paths )) {
      return undefined;
   }

   /* go through data */
   await Promise.all( data.paths.map( async v => {
      let src = {}, // source info
          dist = {}, // dist info
          srcBasename,
          distBasename,
          path;

      /* check params */
      if( v.type !== 'js'  ) {
         return undefined; // skip other type
      }
      if( ! v.src || ! v.dist ) {
         throw new Error( 'Src or dist is empty!' );
      }

      /* get source info */
      src.stat = await stat( v.src ).catch( _=> src.stat = undefined ); // get file info
      srcBasename = Path.basename( v.src );

      /* check source */
      if( ! src.stat ) {
         throw new Error( 'Source not found!' );
      }
      if( ! src.stat.isFile()) {
         throw new Error( 'Source is not file!' );
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
      path = dist.type === 'directory' ? Path.normalize( `${ v.dist}/${ srcBasename.substr( 0, srcBasename.lastIndexOf( '.' )) + '.js' }` ) : v.dist; // add filename into path with replace file extension

      return readFile( v.src, 'utf8' )
         .then( str => jsBeautify( str ))
         .then( result => writeFile( path, result ));
   })).catch( e => ! data.test && log( e ) || ( error = e )); // return error
   return error || data;
};
