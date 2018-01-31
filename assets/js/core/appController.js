/**
 * Created by Khalid on 11/14/2017.
 */

var app = angular.module('myApp', [
    'ui.router','cp.ngConfirm'
]);

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

    //var isUserLoggedIn = window.localStorage.getItem('userLoggedIn');
    //if (isUserLoggedIn && isUserLoggedIn !== "undefined") {
    //    location.hash = '#/home';
    //}
    //else{
    //    location.hash = '#/login';
    //}
    location.hash = '#/login';
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'home.html',
        controller: 'homeScreenController'
    }).state('personalInfo', {
        url: '/personal',
        templateUrl: 'profile-ar.html',
        controller: 'personalInfoScreenCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'loginCtrl'
    }).state('tasks', {
        url: '/tasks',
        templateUrl: 'roles-ar.html',
        controller: 'createTaskCtrl'
    }).state('projects', {
        url: '/projects',
        templateUrl: 'projects-ar.html',
        controller: 'createProjectCtrl'
    }).state('programs', {
        url: '/programs',
        templateUrl: 'programs-ar.html',
        controller: 'createProgramCtrl'
    }).state('targets', {
        url: '/targets',
        templateUrl: 'targets-ar.html',
        controller: 'targetsCtrl'
    }).state('organizations', {
        url: '/organizations',
        templateUrl: 'organizations-ar.html',
        controller: 'organizationsCtrl'
    }).state('persons', {
        url: '/persons',
        templateUrl: 'persons-ar.html',
        controller: 'personsCtrl'
    }).state('charts', {
        url: '/charts',
        templateUrl: 'targets-map-ar.html',
        controller: 'homeScreenController'
    }).state('reports', {
        url: '/reports',
        templateUrl: 'reports.html',
        controller: 'reportsCtrl'
    });
}]);

app.run(function ($rootScope, $log, $location) {
    console.log("Hello from Harameen University website");
    //$rootScope.setAppLanguage = function (lang) {
    //
    //    if (lang) {
    //        $translate.use(lang)
    //            .then(function () {
    //                $log.debug('$translate.use. Lang is: ' + $translate.use());
    //                if (lang === 'ar') {
    //                    $rootScope.appDirection = 'rtl';
    //                }
    //                else {
    //                    $rootScope.appDirection = 'ltr';
    //                }
    //            });
    //    }
    //};
    //$rootScope.setAppLanguage('ar');

    $rootScope.manageSideBarDisplay = function (clickedElementID) {
        if (clickedElementID) {
            var allComponents = document.getElementsByClassName("nav-list-item");
            var jqueryAllComponents = $(allComponents);
            jqueryAllComponents.removeClass('active');
            var domElement = document.getElementById(clickedElementID);
            var element1 = $(domElement);
            element1.addClass('active');
        }
        else {
            var domElement = document.getElementById('home');
            var element1 = $(domElement);
            element1.addClass('active');
        }
    };
    $rootScope.navigateToPage = function (url) {
        $location.url('/' + url);
        $rootScope.manageSideBarDisplay(url);
    };

    $rootScope.manageSideBarDisplay();
    $rootScope.formatDate = function (date) {
        if(date && date != ""){
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    else{
        return "";
    }
};

});
