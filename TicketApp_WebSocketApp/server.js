'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public'))); // Static files

const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});