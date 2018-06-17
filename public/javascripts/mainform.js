'use strict';

var app = angular.module('MainFormApp', ['ngRoute']);//'ngRoute'
//Debug -global
var href = window.location.href;
var g_debugMode = (href.indexOf("localhost") > -1) ? true : false;
var g_baseurl = (g_debugMode == false) ? "http://cheeseslicer.eu-4.evennode.com/" : "http://localhost:3000";
//--
app.factory('mainForm', function ($http, $q) {

    console.log("mainForm  factory");
    
    function getElasticDetailsdata() {
        var deferred = $q.defer();
        console.log("in getElasticDetailsdata");

        // var DataObj = getElasticHashdataServer($http, $q, numdays);

        // console.log("in getElasticDetailsdata");


        // var deferred = $q.defer();
        // deferred.resolve(DataObj);

        return deferred.promise;

        //return uniqueCSstacks;
    }

    return {     
        getElasticDetailsdata: getElasticDetailsdata
    
    };
});

app.controller('mainFormCtrl', function ($scope, $location, mainForm) {

    var updateAllDataFromServer = function () {
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
        $scope.modelData={};
        //updateAllDataFromServer();
    
    }

    init();

});



