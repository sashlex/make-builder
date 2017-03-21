/**
 * Paths builder
 * @param {Object} lc - libraries container
 * @param {Object} paths
 */
function buildPaths( lc, paths ) {
   return lc.promise.each( paths, path => {
      return new Promise( ( next, reject ) => {
         let result;

         /* if not path return */
         if( path.type != 'asset' ) {
            return next();
         }

         /* if no command return */
         if( !path.buildCommand ) {
            return next();
         }

         /* resolve paths */
         try {
            switch( path.buildCommand ) {
            case 'mkdir':

               /* if options cp with options, otherwise without */
               result = path.buildOptions && lc.shell.mkdir( path.buildOptions, path.buildDist ) || lc.shell.mkdir( path.buildDist );

               /* show if error */
               if( result.stderr ) {
                  lc.consoleMessage( result.stderr );
               }
               break;
            case 'cp':

               /* if options cp with options, otherwise without */
               result = path.buildOptions && lc.shell.cp( path.buildOptions, path.source, path.buildDist ) || lc.shell.cp( path.source, path.buildDist );

               /* show if error */
               if( result.stderr ) {
                  lc.consoleMessage( result.stderr );
               }
               break;
            }
         } catch( error ) {
            return reject( error );
         }

         return next();
      }).catch( error => {
         console.log( error );
         // return process.exit( 1 );
      });
   });
}

module.exports = buildPaths;
