var express = require('express');

var router = express.Router();
var path = require('path');
//var IISvirtualDirPath = process.env.virtualDirPath || '';


exports.setupMainForm= function (req, res) {

    console.log(__dirname);
    console.log("setupMainForm");

    res.set({
        'Content-Type': 'text/html; charset=utf-8'
    });
   
    var options={};
    res.sendFile(path.join(__dirname + './../views/index.html'), function (err) {

        if (err) {
           // next(err);
        } else {
         //   console.log('Sent:', days);
        }
    });

}


