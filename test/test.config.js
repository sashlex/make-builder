'use strict';

const Path = require( 'path' );
const Fs = require( 'fs' );
const shell = require( 'shelljs' );

const TMP_DIR = Path.normalize( `${ __dirname }/tmp` );
const SRC_DIR = Path.normalize( `${ __dirname }/tmp/src` );
const DIST_DIR = Path.normalize( `${ __dirname }/tmp/dist` );

/* check dirs */
try { Fs.accessSync( TMP_DIR ); } catch( error ) { Fs.mkdirSync( TMP_DIR ); }
try { Fs.accessSync( SRC_DIR ); } catch( error ) { Fs.mkdirSync( SRC_DIR ); }
try { Fs.accessSync( DIST_DIR ); } catch( error ) { Fs.mkdirSync( DIST_DIR ); }

const config = {
   TMP_DIR: TMP_DIR,
   SRC_DIR: SRC_DIR,
   DIST_DIR: DIST_DIR,
   cleanup: () => shell.rm( '-rf', TMP_DIR ) && shell.mkdir( '-p', [ SRC_DIR, DIST_DIR ]) // recreate dirs
};

module.exports = config;