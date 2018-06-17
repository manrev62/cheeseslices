var fs = require('fs');


exports.Slicer = function (request, response) {
    console.log("DashboardBrowserInfo");

    

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