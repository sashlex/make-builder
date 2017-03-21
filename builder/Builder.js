'use strict';

/**
 * Class Builder represents application builder
 * @class
 */
class Builder {

   /**
    * initialize
    * @constructor
    */
   constructor() {

      console.log( '-> * * * * * * * * * * * * * * * * * * * * * * * * * * * * |' );
      const LazyContainer = require( './LazyContainer' );
      this.lc = new LazyContainer( this );

      /* watcher configs */
      this.watchStarted = false;

      /* this parameter prevent call listener two or more times by one event */
      this.handle_delay = 1000;

      /* watcher set listenner attempts */
      this.setListennerAttempts = 33;
      this.setListennerDelay = 500;
      return undefined;
   }

   /**
    * Build by command
    * @param {string} command
    * @param {string} argument
    * @return {object} promise
    */
   build( command, argument ) {
      /* timer */
      this.start = new Date();
      this.lc.consoleMessage( 'Builder start', command, argument );

      /* fix command if argument not empty */
      command = argument ? ( command + 'Type' ) : command;
      switch( command ) {
      case 'build':
         return this.buildAll()
            .then( () => {
               return this.afterWork();
            });
         break;
      case 'buildType':
         return this.buildType( argument )
            .then( () => {
               return this.afterWork();
            });
         break;
      case 'watch':
         return this.watch();
         break;
      case 'watchType':
         return this.watch( argument );
         break;
      case 'clean':
      case 'cleanType':
         return this.clean( argument );
         break;
      default:
         this.lc.consoleMessage( 'Command not found' );
         return this.lc.promise.resolve( undefined );
      }
   }

   /**
    * Build all files
    * @return {object} promise
    */
   buildAll() {
      return this.lc.promise.resolve()

      /* before build asset */
         .then( () => {
            this.lc.consoleMessage( 'Build asset' );
            this.buildAsset = this.buildAsset || require( this.lc.data.handlersDir + 'build-asset' ); // here require on request ( lazy load )
            return this.buildAsset( this.lc, this.lc.data.paths );
         })

      /* build html */
         .then( () => {
            this.lc.consoleMessage( 'Build html' );
            this.buildHtml = this.buildHtml || require( this.lc.data.handlersDir + 'build-html' ); // here require on request ( lazy load )
            return this.buildHtml( this.lc, this.lc.data.paths );
         })

      /* build css */
         .then( () => {
            this.lc.consoleMessage( 'Build css' );
            this.buildCss = this.buildCss || require( this.lc.data.handlersDir + 'build-css' ); // here require on request ( lazy load )
            return this.buildCss( this.lc, this.lc.data.paths );
         })

      /* build js */
         .then( () => {
            this.lc.consoleMessage( 'Build js' );
            this.buildJs = this.buildJs || require( this.lc.data.handlersDir + 'build-js' );
            return this.buildJs( this.lc, this.lc.data.paths );
         })
         .catch( error => {
            console.log( error );
            return process.exit( 1 );
         });
   }

   /**
    * Build files by type
    * @param {string} type - file type
    * @return {object} promise
    */
   buildType( type ) {
      return this.lc.promise.resolve()
         .then( () => {
            switch( type ) {
            case 'asset':
               this.lc.consoleMessage( 'Build asset' );
               this.buildAsset = this.buildAsset || require( this.lc.data.handlersDir + 'build-asset' );
               return this.buildAsset( this.lc, this.lc.data.paths );
               break;
            case 'html':
               this.lc.consoleMessage( 'Build html' );
               this.buildHtml = this.buildHtml || require( this.lc.data.handlersDir + 'build-html' );
               return this.buildHtml( this.lc, this.lc.data.paths );
               break;
            case 'css':
               this.lc.consoleMessage( 'Build css' );
               this.buildCss = this.buildCss || require( this.lc.data.handlersDir + 'build-css' );
               return this.buildCss( this.lc, this.lc.data.paths );
               break;
            case 'js':
               this.lc.consoleMessage( 'Build js' );
               this.buildJs = this.buildJs || require( this.lc.data.handlersDir + 'build-js' );
               return this.buildJs( this.lc, this.lc.data.paths );
               break;
            default:
               this.lc.consoleMessage( 'Source type not found', type );
               return this.promise.resolve( undefined );
            }
         })
         .catch( error => {
            console.log( error );
            return process.exit( 1 );
         });
   }

   /**
    * Build file used in watcher
    * @param {object} file
    * @return {object} promise
    */
   buildFile( file ) {
      return this.lc.promise.resolve()
         .then( () => {
            switch( file.type ) {
            case 'asset':
               this.lc.consoleMessage( 'Build asset' );
               this.buildAsset = this.buildAsset || require( this.lc.data.handlersDir + 'build-asset' );
               return this.buildAsset( this.lc, [ file ] );
               break;
            case 'html':
               this.lc.consoleMessage( 'Build html file:', file.source );
               this.buildHtml = this.buildHtml || require( this.lc.data.handlersDir + 'build-html' );
               return this.buildHtml( this.lc, [ file ] );
               break;
            case 'css':
               this.lc.consoleMessage( 'Build css file:', file.source );
               this.buildCss = this.buildCss || require( this.lc.data.handlersDir + 'build-css' );
               return this.buildCss( this.lc, [ file ] );
               break;
            case 'js':
               this.lc.consoleMessage( 'Build js file:', file.source );
               this.buildJs = this.buildJs || require( this.lc.data.handlersDir + 'build-js' );
               return this.buildJs( this.lc, [ file ] );
               break;
            default:
               this.lc.consoleMessage( 'Source type not found', file.type );
               return this.promise.resolve( undefined );
            }
         })
         .catch( error => {
            console.log( error );
            return process.exit( 1 );
         });
   }

   /**
    * watch files by type
    * @param {string} type - file type
    * @return {object} promise
    */
   watch( type ) {
      return this.buildAll()
         .then( () => {

            /* prepare watching files */
            let watchFiles = this.lc.data.paths.slice();

            /* filter files by type */
            if( type ) {
               this.lc.data.paths.forEach( ( value, index ) => {

                  /* if type defined, watch files by type */
                  if( type !== value.type ) {
                     delete watchFiles[ index ];
                  }
               });
            }

            /* filter files by source field */
            this.lc.data.paths.forEach( ( value, index ) => {

               /* if no source remove */
               if( !value.source ) {
                  delete watchFiles[ index ];
               }
            });
            watchFiles = watchFiles.filter( Boolean );

            /* define listeners */
            watchFiles.forEach( value => {
               this.lc.consoleMessage( 'Watch file:', value.source );

               /* Set watcher */
               this.watch_file( value, this.setListennerAttempts + 1, this.setListennerDelay )  // ++ -> fix counter ( bacause decreased on watcher starts )
                  .catch( ( error, watcher ) => {
                     watcher && watcher.close();

                     /* file does not exists ( deleted, renamed ) */
                     /* remove destination file and close watcher */
                     this.removePath( value )
                        .then( () => {
                           this.lc.consoleMessage( 'File unwatched:', value.source );
                        })
                        .then( () => {
                           return this.afterWork();
                        })
                        .catch( error => {
                           console.log( error );
                           return process.exit( 1 );
                        });
                  });
            });
            this.watchStarted = true;
         });
   }

   /**
    * Set watcher
    * @param {object} file - file data
    * @param {number} attempt_counter
    * @param {number} attempt_delay
    * @return {object} promise
    */
   watch_file( file, attempt_counter, attempt_delay ) {
      return new this.lc.promise( ( resolve, reject ) => {
         try {
            attempt_counter --; // how times to try watch
            let handle_timeout,

                /* set listener */
                watcher = this.lc.watch( file.source, { persistent: true }, ( event ) => {

                   /* execution timer */
                   this.start = new Date();
                   clearTimeout( handle_timeout ); // remove old, execute new
                   handle_timeout = setTimeout( () => {

                      /* on rename reset watcher */
                      if( event === 'rename' ) {
                         watcher.close();

                         /* ******* START reset watcher block ******* */
                         /* make trying watch again */
                         setTimeout( () => {
                            if( attempt_counter ) {
                               this.lc.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source ); // + 1 -> to prefent show from 0
                               return resolve( this.watch_file( file, attempt_counter, attempt_delay ) ); // reset watcher
                            } else {
                               return reject( new Error( 'File was renamed!' ), watcher ); // attempts ends return error
                            }
                         }, attempt_delay );
                         /* ******* END reset watcher block ******* */

                         return undefined; // do not execute handler
                      }

                      /* build file */
                      this.watch_handler( file )
                         .then( () => attempt_counter = this.setListennerAttempts ) // reset attempt counter
                         .catch( error => {
                            console.log( error );
                            watcher.close();

                            /* ******* START reset watcher block ******* */
                            /* make trying watch again */
                            setTimeout( () => {
                               if( attempt_counter ) {
                                  this.lc.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
                                  return resolve( this.watch_file( file, attempt_counter, attempt_delay ) ); // reset watcher
                               } else {
                                  return reject( error, watcher ); // attempts ends return error
                               }
                            }, attempt_delay );
                            /* ******* END reset watcher block ******* */

                         });
                      clearTimeout( handle_timeout );
                      return undefined; // disable editor error notice
                   }, this.lc.handle_delay );

                   return undefined; // disable editor error notice
                });

            /* build on watch started ( should not execute if previous watcher initialization fails ) */
            this.watchStarted && this.watch_handler( file )
               .then( () => attempt_counter = this.setListennerAttempts ) // reset attmept counter
               .catch( error => {
                  console.log( error );
                  watcher.close();

                  /* ******* START reset watcher block ******* */
                  /* make trying watch again */
                  setTimeout( () => {
                     if( attempt_counter ) {
                        this.lc.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
                        return resolve( this.watch_file( file, attempt_counter, attempt_delay ) ); // reset watcher
                     } else {
                        return reject( error, watcher ); // attempts ends return error
                     }
                  }, attempt_delay );
                  /* ******* END reset watcher block ******* */

               });
         } catch( error ) {
            console.log( error );

            /* ******* START reset watcher block ******* */
            /* make trying watch again */
            setTimeout( () => {
               if( attempt_counter ) {
                  this.lc.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
                  return resolve( this.watch_file( file, attempt_counter, attempt_delay ) ); // reset watcher
               } else {
                  return reject( error ); // attempts ends return error
               }
            }, attempt_delay );
            /* ******* END reset watcher block ******* */
         }
      });
   }

   /**
    * Handle watch events
    * @param {object} file - file data
    * @return {object} promise
    */
   watch_handler( file ) {

      /* get file stat, that mean the file is exists */
      return this.lc.lstat( file.source )
         .then( stat => {

            /* build by file type */
            return this.buildFile( file )
               .then( () => {
                  this.afterWork();
               });
         });
   }

   /**
    * Clean dist
    * @param {string} type - delete dist by type
    * @return {object} promise
    */
   clean( type ) {

      /* check is such type exists */
      if( type  ) {
         let found = false;
         for( let i = 0; i < this.lc.data.paths.length; i ++ ) {
            if( type === this.lc.data.paths[ i ].type ) {
               found = true;
               break;
            }
         };
         if( !found ) {
            this.lc.consoleMessage( 'Source type not found', type );
            return this.afterWork();
         }
      } else {
         type = 'all';
      }

      /* type found continue clean */
      this.lc.consoleMessage( 'Destroy ' + type );
      this.remove = this.remove || require( this.lc.data.handlersDir + 'remove-whatever' );
      return this.remove( this.lc, this.lc.data.paths, type )
         .then( () => {
            return this.afterWork();
         })
         .catch( error => {
            console.log( error );
            return process.exit( 1 );
         });
   }

   /**
    * Remove one path
    * @param {string} path - path object
    * @return {object} promise
    */
   removePath( path ) {
      if( !path ) {
         return undefined;
      }

      /* set destroy destination */
      let dist = path.destroyDist || path.buildDist;
      this.lc.consoleMessage( 'Destroy ' + dist );

      /* remove */
      this.remove = this.remove || require( this.lc.data.handlersDir + 'remove-whatever' );
      return this.remove( this.lc, [ path ], path.type );
   }

   /**
    * After build steps
    * @return {object} promise
    */
   afterWork() {

      /* timer */
      this.end = new Date();
      return this.lc.consoleMessage( '--- ok ---', ( ( this.end - this.start ) / 1000 ) + ' sec' );
   }
}

module.exports = Builder;
