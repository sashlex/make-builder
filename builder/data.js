'use strict';

const Path = require( 'path' );

/* root directory where placed project, where README.md */
const ROOT_DIR = Path.normalize( __dirname + '/..' );

/* builder directory */
const BUILDER_DIR = Path.normalize( ROOT_DIR + '/builder' );

/* workers directory */
const WORKER_DIR = Path.normalize( BUILDER_DIR + '/workers' );

/* sources directory */
const SOURCE_DIR = Path.normalize( ROOT_DIR + '/sources' );

/* distribution directory */
const DIST_DIR = Path.normalize( ROOT_DIR + '/dist' );

module.exports = {
   ROOT_DIR: ROOT_DIR,
   BUILDER_DIR: BUILDER_DIR,
   WORKER_DIR: WORKER_DIR,
   SOURCE_DIR: SOURCE_DIR,
   DIST_DIR: DIST_DIR,

   /* Important: place in execution order */
   paths: [

      /***
       * example:
       * {
       *    type: 'asset',
       *    source: SOURCES_DIR + 'assets/images',
       *    dist: DIST_DIR + 'assets/images',
       * }
       ***/

      /* root */
      {
         type: 'asset',
         source: SOURCE_DIR + 'package.json',
         dist: DIST_DIR + 'package.json'
      },
      {
         type: 'html',
         source: SOURCE_DIR + 'index.mustache',
         dist: DIST_DIR + 'index.html'
      },
      {
         type: 'js',
         source: SOURCE_DIR + 'index.js',
         dist: DIST_DIR + 'index.js'
      },

      /* styles */
      {
         type: 'css',
         source: SOURCE_DIR + 'styles/styles.less',
         dist: DIST_DIR + 'styles/styles.css'
      },

      /* scripts */
      {
         type: 'js',
         source: SOURCE_DIR + 'scripts/script.js',
         dist: DIST_DIR + 'scripts/script.js'
      }
   ]
};
