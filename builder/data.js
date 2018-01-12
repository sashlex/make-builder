'use strict';

const Path = require( 'path' );

/* root directory where placed project, where README.md */
const ROOT_DIR = Path.normalize( __dirname + '/..' );

/* builder directory */
const BUILDER_DIR = Path.normalize( ROOT_DIR + '/builder' );

/* workers directory */
const WORKERS_DIR = Path.normalize( BUILDER_DIR + '/workers' );

/* sources directory */
const SOURCES_DIR = Path.normalize( ROOT_DIR + '/sources' );

/* distribution directory */
const DIST_DIR = Path.normalize( ROOT_DIR + '/dist' );

module.exports = {
   ROOT_DIR: ROOT_DIR,
   BUILDER_DIR: BUILDER_DIR,
   WORKERS_DIR: WORKERS_DIR,
   SOURCES_DIR: SOURCES_DIR,
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
         source: SOURCES_DIR + 'package.json',
         dist: DIST_DIR + 'package.json'
      },
      {
         type: 'html',
         source: SOURCES_DIR + 'index.mustache',
         dist: DIST_DIR + 'index.html'
      },
      {
         type: 'js',
         source: SOURCES_DIR + 'index.js',
         dist: DIST_DIR + 'index.js'
      },

      /* styles */
      {
         type: 'css',
         source: SOURCES_DIR + 'styles/styles.less',
         dist: DIST_DIR + 'styles/styles.css'
      },

      /* scripts */
      {
         type: 'js',
         source: SOURCES_DIR + 'scripts/script.js',
         dist: DIST_DIR + 'scripts/script.js'
      }
   ]
};
