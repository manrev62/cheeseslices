'use strict';

var app = angular.module('MainFormApp', ['ngRoute']);//'ngRoute''$scope'
//Debug -global
var href = window.location.href;
var g_debugMode = (href.indexOf("localhost") > -1) ? true : false;
var g_baseurl = (g_debugMode == false) ? "http://cheeseslicer.eu-4.evennode.com/" : "http://localhost:3000";
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

    return {     
        UploadSTLdata: UploadSTLdata
    
    };
});

app.controller('mainFormCtrl', function ($scope, mainForm) {
    console.log("mainFormCtrl");
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
        //updateAllDataFromServer();
    
    };

    $scope.onClick = function(stlfilename) {
        console.log ("pressedOnClcik");
        mainForm.UploadSTLdata(stlfilename);
    };

    init();

});


function UploadSTLdataServer($http, $q, stlFileName) {
    
    if ('stlFileName' === typeof(userDateInfo)) { 
        return;
    } 

    var uploadSTL_URI = g_baseurl + '/api/services/upload?file='+stlFileName; 
    
    //var uploadSTL_URI = g_baseurl + '/api/services/slicer/'+stlFileName;
    $http.post(uploadSTL_URI).then(function (result) {
        var stacks = result.data;//[];
        
        //deferred.resolve(result.data);
        deferred.resolve(stacks);

    }), function (error) {
        console.log(error);
        deferred.reject(error);
    }
    
    return deferred.promise;
}

