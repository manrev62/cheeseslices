'use strict';

var app = angular.module('MainFormApp', ['ngRoute']);//'ngRoute''$scope'
//Debug -global
var href = window.location.href;
var g_debugMode = (href.indexOf("localhost") > -1) ? true : false;
var g_baseurl = (g_debugMode == false) ? "http://cheeseslicer.eu-4.evennode.com" : "http://localhost:3000";
//--
app.factory('mainForm', function ($http, $q) {

    console.log("mainForm  factory");
    
    function UploadSTLdata(stlFilename) {
        var deferred = $q.defer();
        console.log("in UploadSTLdata");

        var DataObj = UploadSTLdataServer($http, $q,stlFilename);



        // var deferred = $q.defer();
        // deferred.resolve(DataObj);

        return deferred.promise;

        //return uniqueCSstacks;
    }

    function getQuoteServer(material, nucopies) {

// We have Material number, of copies and required date.
// Here we have an extremely simplified algorithm - which indicates that a flow of considerations will impact quote
// This may well include optimisation - of cost and delivery - and can order be split between suppliers
//i) Capability: Material will determine machine type - and hence suppliers 
//ii) Capacity: Can a supplier supply n components by a certain date
//ii) Part cost

//ms/services/suppliers/:material
    var deferred = $q.defer();

    var suppliersURL = g_baseurl + '/ms/services/suppliers/material/'+material; 
    var suppliers;
    $http.get(suppliersURL).then(function (result) {
        suppliers = result.data.suppliers[0];//[];
        //return suppliers;
       
        var myModel=document.getElementById('custId').innerText;//internal
        var url=g_baseurl +'/ms/services/supplier/'+suppliers.name+'/partcost/number/'+ nucopies+'/model/'+myModel+'/material/'+material;
        var costObj = calcQuoteCheat(suppliers.name,nucopies,myModel,material);
        deferred.resolve(costObj);
    }), function (error) {
        console.log(error);
        deferred.reject(error);
    }
    //return suppliers;
return deferred.promise;
}

    return {     
        UploadSTLdata: UploadSTLdata,
        getQuoteServer: getQuoteServer
    
    };
});

app.controller('mainFormCtrl', function ($scope, mainForm) {
    console.log("mainFormCtrl");
    $scope.materials = ["Plastic", "Titanium", "Nylon"];
    $scope.NuCopies = {
        text: '1',
        word: /^\s*\w*\s*$/
      };
      $scope.reqDate = {
        text: '25/06/2018',
        word: /^\s*\w*\s*$/
      };
      
      $scope.suppliers="todo";
    
      $scope.model='unset'

    var uploadSTL = function (stlFilename) {

        mainForm.UploadSTLdata($http, $q,stlFilename)
    /*     mainForm.getElasticHashdata(crashHashID, userDateInfo).then(function (HashData) {
            //$scope.HashData = HashData;
            //$scope.NuDups = HashData.count;
            //$scope.uselatestbsf = uselatestbsf;

            mainForm.getElasticDetailsdata($scope).then(function (cases) {

                // does nothing - could return OK?
            }, function (error) {
                console.log(error);
            });

            console.log("in updateAllDataFromServer:init()");

        }, function (error) {
            console.log(error);
        });

 */
    }

    function init() {
        console.log("in init");
        $scope.modelData={"stlpath":"c:\\tmp\\Photoskulptur_Gutenberg.stl"};
    
    
    };

    $scope.onClick = function(operation) {
        console.log ("pressedOnClick");
        if (operation==='getEstimate'){ 

            var mat=$scope.selectedMaterial;
            var nucopies=$scope.NuCopies;
            //var suppliers = 
            mainForm.getQuoteServer(mat,nucopies.text).then(function (suppliers) {
                $scope.suppliers=suppliers;
                // does nothing - could return OK?
            }, function (error) {
                console.log(error);
            });

            //$scope.suppliers=suppliers;
        }

    };

    $scope.handleFiles = function(files) {
        for (var i = 0; i < files.length; i++) {
         // uploadFile(files[i]); // call the function to upload the file
        }
      };

    init();

});



function UploadSTLdataServer($http, $q, stlFileName) {
    
    if ('stlFileName' === typeof(userDateInfo)) { 
        return;
    } 

    var uploadSTL_URI = g_baseurl + '/myfileupload'; 
    console.log ('Post - '+uploadSTL_URI);
    $http.post(uploadSTL_URI).then(function (result) {
        var stuff = result.data;//[];
        
        //deferred.resolve(result.data);
        deferred.resolve(stuff);

    }), function (error) {
        console.log(error);
        deferred.reject(error);
    }
    
    return deferred.promise;
}

var calcQuoteCheat= function(suppliersName,nucopies,myModel,material){
// Need 
//i) Material cost 
// ii) material used
    var suppliers={};
    suppliers.ukcom={"name":"ukcom","materials":[{'type':'Titanium','cost':'3.65'},{'type':'Plastic','cost':'7.10'}]};
    suppliers.chinacom={"name":"chinacom","materials":[{'type':'Titanium','cost':'3.9'},{'type':'Plastic','cost':'6.05'},{'type':'Nylon','cost':'60.1'}]};
    suppliers.skoreacom={"name":"skoreacom","materials":[{'type':'Plastic','cost':'7.10'}]};

    //Get list of supplier who can manufacture - 
    var suppliersRtn=getsuppliers(suppliers,material);//cheat
    var comVol=document.getElementById('lblCompVolTxt').innerText;//internal
    var bbox = document.getElementById('lboundingBoxTxt').innerText;

    var res = bbox.split(","); 
    var bboxX=  Number(bbox[0]);
    var bboxY=  Number(bbox[1]);
    var bboxZ=  Number(bbox[2]);
    var bboxZ=  bbox[2];
    var bboxVol=res[0]*res[1]*res[2]
    //bbox[0]*bbox[1]*bbox[2];

    var comVol=document.getElementById('lblCompVolTxt').innerText;//internal
    var supplierName= suppliersRtn.suppliers[0].name;
    var rawpartcost= comVol * suppliersRtn.suppliers[0].cost*nucopies;
    var addtionalCosts= 0.2*rawpartcost;

    var total= (rawpartcost+addtionalCosts)*1.15

    var supplierUKcom={"name":'ukcom'}

    var rtnObj = {'supplierOuotes':[
        {'name':'ukcom',"partcost":total/nucopies, "totalcost":total},
        {'name':'skcom',"partcost":total/nucopies, "totalcost":total}
        ]};

    return rtnObj;
}

var getsuppliers=function(suppliers,material){

var rtnObj ={'suppliers':[{'name':'ukcom',"cost":'3.65'}, {'name':'skcom',"cost":'7:10'}]};
return rtnObj;
}

