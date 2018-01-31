/**
 * Created by Khalid on 11/19/2017.
 */
/**
 * Created by Khalid on 10/21/2017.
 */
app.controller('loginCtrl', function ($log, $scope, $rootScope, $location, connector) {

    console.log("Welcome to login screen");
    $rootScope.loginPage = true;
    $scope.login = function () {
        //window.localStorage.setItem('userLoggedIn','1');
        $rootScope.loginPage = false;
        $rootScope.navigateToPage('home');
    };

});