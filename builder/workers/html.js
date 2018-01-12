/**
 * HTML builder
 * @param {Object} lc - libraries container
 * @param {Object} files
 */
function buildHtml( lc, paths ) {

   return lc.promise.each( paths, path => {
      return new Promise( ( next, reject ) => {

         /* if not html return */
         if( path.type != 'html' ) {
            return next();
         }

         /* compile html */
         let html;
         try {
            html = lc.pug.renderFile( path.source, { pretty: '   ' });
         } catch( error ) {
            return reject( error );
         }

         /* save file */
         return lc.writeFile( path.buildDist, html )
            .then( () => {
               return next();
            });

      }).catch( error => {
         console.log( error );
      });
   });
}

module.exports = buildHtml;

