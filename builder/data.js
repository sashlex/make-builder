'use strict';

/***
 *
 * full example:
 * {
 *    type: 'asset',
 *    source: SOURCES_DIR + 'assets/images',
 *    buildCommand: 'cp',
 *    buildOptions: '-ru',
 *    buildDist: DIST_DIR,
 *    destroyCommand: 'rm',
 *    destroyOptions: '-r',
 *    destroyDist: DIST_DIR + 'assets/images'
 * }
 *
 ***/

/* root directory where placed project, where README.md */
const ROOT_DIR = __dirname + '/../';

/* builder directory */
const BUILDER_DIR = ROOT_DIR + 'builder/';

/* handlers directory */
const HANDLERS_DIR = BUILDER_DIR + 'handlers/';

/* sources directory */
const SOURCES_DIR = ROOT_DIR + 'sources/';

/* distribution directory */
const DIST_DIR = ROOT_DIR + 'dist/';

module.exports = {
   rootDir: ROOT_DIR,
   builderDir: BUILDER_DIR,
   handlersDir: HANDLERS_DIR,
   sourcesDir: SOURCES_DIR,
   distDir: DIST_DIR,

   /* Important: place in creation order */
   paths: [

      /* START - root */
      {
         type: 'asset',
         source: SOURCES_DIR + 'package.json',
         buildCommand: 'cp',
         buildOptions: '-u',
         buildDist: DIST_DIR,
         destroyCommand: 'rm',
         destroyDist: DIST_DIR + 'package.json'
      },
      {
         type: 'html',
         source: SOURCES_DIR + 'index.pug',
         buildDist: DIST_DIR + 'index.html'
      },
      {
         type: 'js',
         source: SOURCES_DIR + 'index.js',
         buildDist: DIST_DIR + 'index.js'
      },
      /* END */

      /* START - styles */
      {
         type: 'asset',
         buildCommand: 'mkdir',
         buildOptions: '-p',
         buildDist: DIST_DIR + 'styles',
         destroyCommand: 'rm',
         destroyOptions: '-r',
         destroyDist: DIST_DIR + 'styles'
      },
      {
         type: 'css',
         source: SOURCES_DIR + 'styles/styles.less',
         buildDist: DIST_DIR + 'styles/styles.css'
      },
      /* END */

      /* START - scripts */
      {
         type: 'asset',
         buildCommand: 'mkdir',
         buildOptions: '-p',
         buildDist: DIST_DIR + 'scripts',
         destroyCommand: 'rm',
         destroyOptions: '-r',
         destroyDist: DIST_DIR + 'scripts'
      },
      {
         type: 'js',
         source: SOURCES_DIR + 'scripts/script.js',
         buildDist: DIST_DIR + 'scripts/script.js'
      }
      /* END */
   ]
};
