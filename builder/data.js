'use strict';

const Path = require( 'path' );

/* root directory where placed project, where README.md */
const ROOT_DIR = Path.normalize( __dirname + '/..' );

/* builder directory */
const BUILDER_DIR = Path.normalize( ROOT_DIR + '/builder' );

/* workers directory */
const WORKER_DIR = Path.normalize( BUILDER_DIR + '/workers' );

/* sources directory */
const SRC_DIR = Path.normalize( ROOT_DIR + '/src' );

/* distribution directory */
const DIST_DIR = Path.normalize( ROOT_DIR + '/dist' );

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

const data = {
   log: log,
   ROOT_DIR: ROOT_DIR,
   BUILDER_DIR: BUILDER_DIR,
   WORKER_DIR: WORKER_DIR,
   SRC_DIR: SRC_DIR,
   DIST_DIR: DIST_DIR,

   /* Important: place in execution order */
   paths: [

      /***
       * example:
       * {
       *    type: 'asset',
       *    src: SRC_DIR + 'assets/images',
       *    dist: DIST_DIR + 'assets/images',
       * }
       ***/

      /* root */
      {
         type: 'asset',
         src: SRC_DIR + 'package.json',
         dist: DIST_DIR + 'package.json'
      },
      {
         type: 'html',
         src: SRC_DIR + 'index.mustache',
         dist: DIST_DIR + 'index.html'
      },
      {
         type: 'js',
         src: SRC_DIR + 'index.js',
         dist: DIST_DIR + 'index.js'
      },

      /* styles */
      {
         type: 'css',
         src: SRC_DIR + 'styles/styles.less',
         dist: DIST_DIR + 'styles/styles.css'
      },

      /* scripts */
      {
         type: 'js',
         src: SRC_DIR + 'scripts/script.js',
         dist: DIST_DIR + 'scripts/script.js'
      }
   ]
};

/* fix data paths */
data.paths = data.paths.map( v => {
   v.src && ( v.src = Path.normalize( v.src ));
   v.dist && ( v.dist = Path.normalize( v.dist ));
});

module.exports = data;
