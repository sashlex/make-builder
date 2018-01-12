'use strict';

const express = require( 'express' );
const path = require( 'path' );
const app = express();

app.use( '/styles', express.static( 'styles'));
app.use( '/scripts', express.static( 'scripts'));
app.get( '/', ( req, res ) => res.sendFile( path.join( __dirname + '/index.html' )));
app.listen( 3000, () => console.log( 'App listening on port 3000!' ));
