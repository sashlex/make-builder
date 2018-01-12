/**
 * Remover
 * @param {Object} lc - libraries container
 * @param {Object} paths
 */
function removeWhatever( lc, paths, type ) {
   let result;
   return lc.promise.each( paths, path => {
      return new Promise( ( next, reject ) => {

         /* if no type next */
         if( !type ) {
            return next();
         }

         switch( type ) {

         /* remove with type "asset" */
         case 'asset':
            removeAsset( lc, path );
            break;

         /* remove with type "*" */
         case 'all':
            removeAny( lc, path );
            break;

         /* remove "common type" element, not type asset */
         case path.type:
            removeCommonType( lc, path );
            break;
         }

         /* go next file */
         return next();
      }).catch( error => {
         console.log( error );
         return process.exit( 1 );
      });
   });
}

module.exports = removeWhatever;

/**
 * Remove common type element
 * @param {Object} lc - libraries container
 * @param {Object} path - file path
 */
function removeCommonType( lc, path ) {

   let result;
   result = lc.shell.rm( path.buildDist );

   /* show if error */
   if( result.stderr ) {
      lc.consoleMessage( result.stderr );
   } else {
      if( path.destroyDist ) {
         lc.consoleMessage( 'Removed', path.destroyDist );
      } else {
         lc.consoleMessage( 'Removed', path.buildDist );
      }
   }
}

/**
 * Remove asset type element
 * @param {Object} lc - libraries container
 * @param {Object} path - file path
 */
function removeAsset( lc, path ) {
   let result;

   /* if no command continue */
   if( !path.destroyCommand ) {
      return; 
   }

   /* switch shell command *//* ( here we can use without switch, but with we avoid execute wrong commands ) */
   switch( path.destroyCommand ) {
   case 'rm':

      /* if options remove with options, otherwise without */
      result = path.destroyOptions && lc.shell.rm( path.destroyOptions, path.destroyDist ) || lc.shell.rm( path.destroyDist );

      /* show if error */
      if( result.stderr ) {
         lc.consoleMessage( result.stderr );
      } else {
         lc.consoleMessage( 'Removed', path.destroyDist );
      }
      break;
   }
   return;
}

/**
 * Remove any type element
 * @param {Object} lc - libraries container
 * @param {Object} path - file path
 */
function removeAny( lc, path ) {

   /* each file type have different remove method */
   switch( path.type ) {

   /* assets have destroyDist option */
   case 'asset':
      removeAsset( lc, path );
      break;

   /* other file have buildDist option */
   default:
      removeCommonType( lc, path );
      break;
   }
}
