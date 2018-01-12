/**
 * JS builder
 * @param {Object} lc - libraries container
 * @param {Object} files
 */
function buildJs( lc, paths ) {
   return lc.promise.each( paths, path => {
      return new Promise( ( next, reject ) => {

         /* if not js return */
         if( path.type != 'js' ) {
            return next();
         }

         /* read file */
         return lc.readFile( path.source, 'utf8' )
            .then( compiled => {

               /* beautify javascript */
               let beautified;
               try {
                  beautified =  lc.beautify( compiled, { indent_size: 3, no_preserve_newlines: true } );
               } catch( error ) {
                  return reject( error );
               }
               return beautified;
            })
            .then( beautified => {

               /* save file */
               return lc.writeFile( path.buildDist, beautified )
                  .then( result => {
                     return next();
                  })
                  .catch( error => {
                     return reject( error );
                  });
            })
            .catch( error => {
               return reject( error );
            });
      }).catch( error => {
         console.log( error );
         // return process.exit( 1 );
      });
   });
}

module.exports = buildJs;

/* typescript */
// const ts = require( 'typescript' );
// .then( contents => {
//    let js;
//    /* compile javascript */
//    try {
//       js = ts.transpileModule( contents, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
//    } catch( error ) {
//       return reject( error );
//    }
//    return js;
// })
