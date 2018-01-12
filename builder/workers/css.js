/**
 * CSS builder
 * @param {Object} lc - libraries container
 * @param {Object} files
 */
function buildCss( lc, paths ) {

   return lc.promise.each( paths, path => {
      return new Promise( ( next, reject ) => {

         /* if not css return */
         if( path.type != 'css' ) {
            return next();
         }

         /* read file */
         return lc.readFile( path.source, 'utf8' )
            .then( contents => {

               /* compile less */
               return lc.less.render( contents, { paths: [], filename: path.source, compress: false } ) // specify a filename, for better error messages
                  .catch( error => {
                     return reject( error );
                  });
            })
            .then( compiled => {
               let css = compiled.css;

               /* beautify css */
               let beautified;
               try {
                  beautified =  lc.beautify.css( css, { indent_size: 3, no_preserve_newlines: true } );
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
};

module.exports = buildCss;
