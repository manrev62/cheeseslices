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

    var multer = require('multer');
    //var multerCfg=getMulterConfig();
    var fileStl = request.query.file;

    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, "./public/stlfilestorage");
        },
        filename: function(req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    });

    var upload = multer({storage: Storage}).single(fileStl);
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
    
    //   var upload = multer({storage: Storage}).single(file), function (req, res, next) {
    //     console.log ();
    //     // req.file is the `avatar` file
    //     // req.body will hold the text fields, if there were any
    //   };
    

    response.send('Complete!');

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
            const image = file.mimetype.startsWith('image/');
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