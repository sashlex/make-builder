'use strict';

const container = require( './container' );

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
      container.consoleMessage( 'Builder start', command, argument );

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
         container.consoleMessage( 'Command not found' );
         return container.promise.resolve( undefined );
      }
   }

   /**
    * Build all files
    * @return {object} promise
    */
   buildAll() {
      return container.promise.resolve()

      /* before build asset */
         .then( () => {
            container.consoleMessage( 'Build asset' );
            this.buildAsset = this.buildAsset || require( container.data.handlersDir + 'build-asset' ); // here require on request ( lazy load )
            return this.buildAsset( container, container.data.paths );
         })

      /* build html */
         .then( () => {
            container.consoleMessage( 'Build html' );
            this.buildHtml = this.buildHtml || require( container.data.handlersDir + 'build-html' ); // here require on request ( lazy load )
            return this.buildHtml( container, container.data.paths );
         })

      /* build css */
         .then( () => {
            container.consoleMessage( 'Build css' );
            this.buildCss = this.buildCss || require( container.data.handlersDir + 'build-css' ); // here require on request ( lazy load )
            return this.buildCss( container, container.data.paths );
         })

      /* build js */
         .then( () => {
            container.consoleMessage( 'Build js' );
            this.buildJs = this.buildJs || require( container.data.handlersDir + 'build-js' );
            return this.buildJs( container, container.data.paths );
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
      return container.promise.resolve()
         .then( () => {
            switch( type ) {
            case 'asset':
               container.consoleMessage( 'Build asset' );
               this.buildAsset = this.buildAsset || require( container.data.handlersDir + 'build-asset' );
               return this.buildAsset( container, container.data.paths );
               break;
            case 'html':
               container.consoleMessage( 'Build html' );
               this.buildHtml = this.buildHtml || require( container.data.handlersDir + 'build-html' );
               return this.buildHtml( container, container.data.paths );
               break;
            case 'css':
               container.consoleMessage( 'Build css' );
               this.buildCss = this.buildCss || require( container.data.handlersDir + 'build-css' );
               return this.buildCss( container, container.data.paths );
               break;
            case 'js':
               container.consoleMessage( 'Build js' );
               this.buildJs = this.buildJs || require( container.data.handlersDir + 'build-js' );
               return this.buildJs( container, container.data.paths );
               break;
            default:
               container.consoleMessage( 'Source type not found', type );
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
      return container.promise.resolve()
         .then( () => {
            switch( file.type ) {
            case 'asset':
               container.consoleMessage( 'Build asset' );
               this.buildAsset = this.buildAsset || require( container.data.handlersDir + 'build-asset' );
               return this.buildAsset( container, [ file ] );
               break;
            case 'html':
               container.consoleMessage( 'Build html file:', file.source );
               this.buildHtml = this.buildHtml || require( container.data.handlersDir + 'build-html' );
               return this.buildHtml( container, [ file ] );
               break;
            case 'css':
               container.consoleMessage( 'Build css file:', file.source );
               this.buildCss = this.buildCss || require( container.data.handlersDir + 'build-css' );
               return this.buildCss( container, [ file ] );
               break;
            case 'js':
               container.consoleMessage( 'Build js file:', file.source );
               this.buildJs = this.buildJs || require( container.data.handlersDir + 'build-js' );
               return this.buildJs( container, [ file ] );
               break;
            default:
               container.consoleMessage( 'Source type not found', file.type );
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
            let watchFiles = container.data.paths.slice();

            /* filter files by type */
            if( type ) {
               container.data.paths.forEach( ( value, index ) => {

                  /* if type defined, watch files by type */
                  if( type !== value.type ) {
                     delete watchFiles[ index ];
                  }
               });
            }

            /* filter files by source field */
            container.data.paths.forEach( ( value, index ) => {

               /* if no source remove */
               if( !value.source ) {
                  delete watchFiles[ index ];
               }
            });
            watchFiles = watchFiles.filter( Boolean );

            /* define listeners */
            watchFiles.forEach( value => {
               container.consoleMessage( 'Watch file:', value.source );

               /* Set watcher */
               this.watch_file( value, this.setListennerAttempts + 1, this.setListennerDelay )  // ++ -> fix counter ( bacause decreased on watcher starts )
                  .catch( ( error, watcher ) => {
                     watcher && watcher.close();

                     /* file does not exists ( deleted, renamed ) */
                     /* remove destination file and close watcher */
                     this.removePath( value )
                        .then( () => {
                           container.consoleMessage( 'File unwatched:', value.source );
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
      return new container.promise( ( resolve, reject ) => {
         try {
            attempt_counter --; // how times to try watch
            let handle_timeout,

                /* set listener */
                watcher = container.watch( file.source, { persistent: true }, ( event ) => {

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
                               container.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source ); // + 1 -> to prefent show from 0
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
                                  container.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
                                  return resolve( this.watch_file( file, attempt_counter, attempt_delay ) ); // reset watcher
                               } else {
                                  return reject( error, watcher ); // attempts ends return error
                               }
                            }, attempt_delay );
                            /* ******* END reset watcher block ******* */

                         });
                      clearTimeout( handle_timeout );
                      return undefined; // disable editor error notice
                   }, container.handle_delay );

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
                        container.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
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
                  container.consoleMessage( 'Trying watch file again, ' + ( this.setListennerAttempts - attempt_counter + 1 ) + ' attempt:', file.source );
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
      return container.lstat( file.source )
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
         for( let i = 0; i < container.data.paths.length; i ++ ) {
            if( type === container.data.paths[ i ].type ) {
               found = true;
               break;
            }
         };
         if( !found ) {
            container.consoleMessage( 'Source type not found', type );
            return this.afterWork();
         }
      } else {
         type = 'all';
      }

      /* type found continue clean */
      container.consoleMessage( 'Destroy ' + type );
      this.remove = this.remove || require( container.data.handlersDir + 'remove-whatever' );
      return this.remove( container, container.data.paths, type )
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
      container.consoleMessage( 'Destroy ' + dist );

      /* remove */
      this.remove = this.remove || require( container.data.handlersDir + 'remove-whatever' );
      return this.remove( container, [ path ], path.type );
   }

   /**
    * After build steps
    * @return {object} promise
    */
   afterWork() {

      /* timer */
      this.end = new Date();
      return container.consoleMessage( '--- ok ---', ( ( this.end - this.start ) / 1000 ) + ' sec' );
   }
}

module.exports = new Builder();
