var fs = require('fs');


exports.Slicer = function (request, response) {
    console.log("DashboardBrowserInfo");

    var stl = require('stl')
    var fs = require('fs');
    var rtnObj={"err":"failed", "message":"NoSTL file path supplied"}
    if (request.params.stlfile){
        var stlFilePath= request.params.stlfile;
        var stlfile=fs.readFileSync(stlFilePath);
        var facets = stl.toObject(fs.readFileSync(stlfile));
    }
    
 
   

        //fs.writeFileSync(logPath, jsonData);
        response.setHeader('Access-Control-Allow-Origin', '*');
        //response.setHeader('content-type', 'text/csv');
        response.setHeader('content-type', 'text/plain');
        response.send(data);
        //response.status(200).sendFile(__dirname +'/temp.csv', function (err) {
        //    console.log("izo",err.message);
        //});

        // });
    console.log("before response");

}

exports.UploadSTL= function(request, response){

    if (!request.file) {
        console.log("No file received");
        return response.send({
          success: false
        });
    
       // https://www.npmjs.com/package/node-stl//
    
      } 

      var storedFile = request.file.filename;

      var nodestl=require ('node-stl');

      var localSTLFilePath=__dirname + '/../public/stlfilestorage/'+storedFile;
      var stl = nodestl(localSTLFilePath);
      console.log(stl.volume + 'cm^3');     // 21cm^3
      console.log(stl.weight + 'gm');       //  1gm
      console.log(stl.boundingBox,'(mm)');  // [60,45,50] (mm)
      console.log(stl.area,'(m)');    

      /* var stlSlicer= require('./mesh-slice-polygon.js');

      var slicer = stlSlicer();
        var stl = require('stl')
        var fs = require('fs');

        fs.createReadStream(localSTLFilePath)
        .pipe(stl.createParseStream())
        .on('data', function(obj) {
            // add an array of vertices
            // [[x, y, z], [x, y, z], [x,y,z]]
            //if (obj && obj.verts) console.log('verts'+obj.verts);
            obj && obj.verts && slicer.addTriangle(obj.verts)
        })
        .on('end', function() {
            // slize at z=0
            console.log(slicer.slice(0).map(function(polygon) {
            return polygon.points;
            }));
        });

        var createDropTarget = require('drop-stl-to-json'); */
   /*  var fc = require('fc');
    var createSlicer = require('../mesh-slice-polygon');
    var min = Math.min;
    var max = Math.max;
   
    var dropSlicer= require('./drop-slicer.js'); */

    var rtnObj= {"fileinfo":{"volume":stl.volume,"weight":stl.weight,"boundingBox":stl.boundingBox, "fileID":storedFile }}
    response.status(200).send(rtnObj);

}

function getMulterConfig (){
    var multer = require('multer');
    const multerConfig = {
    //https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610
    storage: multer.diskStorage({
     //Setup where the user's file will go
     destination: function(req, file, next){
       next(null, './public/stlfilestorage');
       },   
        
        //Then give the file a unique name
        filename: function(req, file, next){
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
          }
        }),   
        
        //A means of ensuring only images are uploaded. 
        fileFilter: function(req, file, next){
              if(!file){
                next();
              }
            const image = file.mimetype.startsWith('*/');
            if(image){
              console.log('photo uploaded');
              next(null, true);
            }else{
              console.log("file not supported");
              
              //TODO:  A better message response to user on failure.
              return next();
            }
        }
      };
  
    return multerConfig;
}