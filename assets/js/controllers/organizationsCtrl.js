/**
 * Created by Khalid on 11/1/2017.
 */

app.controller('organizationsCtrl', function ($log, $scope, $rootScope, $location, user, $timeout) {

    console.log("Welcome to organizationsCtrl");
    $scope.firstLevelIndex = 0;
    $scope.secondLevelIndex = 0;
    $scope.thirdLevelIndex = 0;
    $scope.fourthLevelIndex = 0;
    $scope.firstLevelModel = '';
    $scope.secondLevelModel = '';
    $scope.thirdLevelModel = '';
    $scope.fourthLevelModel = '';
    $scope.showSecondLevel = false;
    $scope.showThirdLevel = false;
    $scope.showFourthLevel = false;
    $scope.addNewEntity = true;
    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {

            $timeout(function () {
                $scope.associations = entities;
                $scope.selectedFirstLevelObject = entities[$scope.firstLevelIndex];
                if ($scope.selectedFirstLevelObject) {
                    if ($scope.selectedFirstLevelObject.children && $scope.secondLevelKey) {
                        $scope.selectedSecondLevelObject = $scope.selectedFirstLevelObject.children[$scope.secondLevelKey];
                        if ($scope.selectedSecondLevelObject) {
                            if ($scope.selectedSecondLevelObject.children && $scope.thirdLevelKey) {
                                $scope.selectedThirdLevelObject = $scope.selectedSecondLevelObject.children[$scope.thirdLevelKey];
                            }
                        }
                    }
                }
                $scope.$apply();
            });


        });
    };
    $scope.renderEntities();
    $scope.onAssociationSelected = function (selected, index, type, key) {
        debugger;
        switch (type) {
            case 'level1':
                $scope.selectedFirstLevelObject = selected;
                $scope.firstLevelIndex = index;
                $scope.firstLevelModel = selected.name;
                $scope.secondLevelModel = '';
                delete $scope.selectedSecondLevelObject;
                delete $scope.selectedThirdLevelObject;
                $scope.addNewEntity = false;
                break;
            case 'level2':
                $scope.selectedSecondLevelObject = selected;
                $scope.secondLevelIndex = index;
                $scope.secondLevelModel = selected.name;
                $scope.secondLevelKey = key;
                $scope.thirdLevelModel = '';
                delete $scope.selectedThirdLevelObject;
                break;
            case 'level3':
                $scope.selectedThirdLevelObject = selected;
                $scope.thirdLevelIndex = index;
                $scope.thirdLevelModel = selected.name;
                $scope.thirdLevelKey = key;
                $scope.fourthLevelModel = '';
                $scope.showFourthLevel = true;
                break;
            case 'level4':
                $scope.fourthLevelIndex = index;
                $scope.fourthLevelModel = selected.name;
                $scope.fourthLevelKey = key;
                break;
        }
    };
    $scope.addEntry = function (type, valid) {
        switch (type) {
            case 'level1':
                // if (valid) {
                $scope.firstLevelModel = '';
                $scope.addNewEntity = true;
                // user.addEntity($scope.firstLevelModel).then(function (resolved) {
                //     $scope.firstLevelModel = '';
                //     $scope.renderEntities();

                // });
                // }
                break;
            case 'level2':
                $scope.secondLevelModel = '';
                delete $scope.secondLevelKey;
                // if (valid) {
                //     var timestampString = new Date().getTime() + '';
                //     var entityObject = angular.copy($scope.selectedFirstLevelObject);
                //     entityObject.children[timestampString] = { "name": $scope.secondLevelModel, "children": {} };
                //     user.updateEntity(entityObject).then(function (resolved) {
                //         $scope.secondLevelModel = '';
                //         $scope.renderEntities();
                //     });
                // }
                break;
            case 'level3':
                $scope.thirdLevelModel = '';
                delete $scope.thirdLevelKey;
                // if (valid) {
                //     var timestampString = new Date().getTime() + '';
                //     var entityObject = angular.copy($scope.selectedFirstLevelObject);
                //     entityObject.children[$scope.secondLevelKey].children[timestampString] = {
                //         "name": $scope.thirdLevelModel,
                //         "children": {}
                //     };
                //     user.updateEntity(entityObject).then(function (resolved) {
                //         $scope.thirdLevelModel = '';
                //         $scope.renderEntities();
                //     });
                // }
                break;
            case 'level4':
                $scope.fourthLevelModel = '';
                delete $scope.fourthLevelKey;
                // if (valid) {
                //     var timestampString = new Date().getTime() + '';
                //     var entityObject = angular.copy($scope.selectedFirstLevelObject);
                //     entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey].children[timestampString] = { "name": $scope.fourthLevelModel };
                //     user.updateEntity(entityObject).then(function (resolved) {
                //         $scope.fourthLevelModel = '';
                //         $scope.renderEntities();
                //     });
                // }
                break;
        }
    };
    $scope.deleteEntry = function (type) {
        $.confirm({
            title: '',
            content: 'تأكيد حذف الجهة؟',
            buttons: {
                confirm:{
                    text: 'تأكيد',
                    action: function(){
                        switch (type) {
                            case 'level1':
                                user.deleteEntity($scope.selectedFirstLevelObject._id).then(function (resolved) {
                                    delete $scope.selectedSecondLevelObject;
                                    delete $scope.selectedThirdLevelObject;
                                    $scope.renderEntities();
                                    $.alert("تم حذف الجهة!");                                        
                                    
                                });
                                break;
                            case 'level2':
                                var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                delete entityObject.children[$scope.secondLevelKey];
                                user.updateEntity(entityObject).then(function (resolved) {
                                    delete $scope.selectedThirdLevelObject;
                                    $scope.renderEntities();
                                    $.alert("تم حذف الجهة!");
                                });
                
                                break;
                            case 'level3':
                                var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                delete entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey];
                                user.updateEntity(entityObject).then(function (resolved) {
                                    $scope.showFourthLevel = false;
                                    $scope.renderEntities();
                                    $.alert("تم حذف الجهة!");
                                });
                
                                break;
                            case 'level4':
                                var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                delete entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey].children[$scope.fourthLevelKey];
                                user.updateEntity(entityObject).then(function (resolved) {
                                    $scope.renderEntities();
                                    $.alert("تم حذف الجهة!");
                                });
                                break;
                        }
                        $scope.firstLevelModel = '';
                        $scope.secondLevelModel = '';
                        $scope.thirdLevelModel = '';
                        $scope.fourthLevelModel = '';
                    }
                },
                cancel:{
                    text: 'إلغاء',
                    action: function () {
                        console.log("Cancelled");
                    }
                }
               
            }
        });
    };
    $scope.editEntry = function (type, valid) {

        switch (type) {
            case 'level1':
                if (valid) {
                    if ($scope.addNewEntity == true) {
                        $.confirm({
                            title: '',
                            content: 'تأكيد إضافة جهة جديدة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        user.addEntity($scope.firstLevelModel).then(function (resolved) {
                                            $.alert("تمت الإضافة بنجاح!");
                                            $scope.firstLevelModel = '';
                                            $scope.renderEntities();
    
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                    }
                    else {
                        $.confirm({
                            title: '',
                            content: 'تأكيد تعديل الجهة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.name = $scope.firstLevelModel;
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تم تعديل الجهة بنجاح!");                                        
                                            $scope.firstLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                    }
                }
                break;
            case 'level2':
                if (valid) {
                    if ($scope.secondLevelKey == undefined) {
                        $.confirm({
                            title: '',
                            content: 'تأكيد إضافة جهة جديدة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var timestampString = new Date().getTime() + '';
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[timestampString] = { "name": $scope.secondLevelModel, "children": {} };
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تمت الإضافة بنجاح!");
                                            $scope.secondLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });

                    }
                    else {
                        $.confirm({
                            title: '',
                            content: 'تأكيد تعديل الجهة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[$scope.secondLevelKey].name = $scope.secondLevelModel;
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تم تعديل الجهة بنجاح!");                                                                                
                                            $scope.secondLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                    }
                }
                break;
            case 'level3':
                if (valid) {
                    if ($scope.thirdLevelKey == undefined) {                    
                        $.confirm({
                            title: '',
                            content: 'تأكيد إضافة جهة جديدة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var timestampString = new Date().getTime() + '';
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[$scope.secondLevelKey].children[timestampString] = {
                                            "name": $scope.thirdLevelModel,
                                            "children": {}
                                        };
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تمت الإضافة بنجاح!");
                                            $scope.thirdLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });

                    }
                    else {
                        $.confirm({
                            title: '',
                            content: 'تأكيد تعديل الجهة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey].name = $scope.thirdLevelModel;
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تم تعديل الجهة بنجاح!");                                                                                
                                            $scope.thirdLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                    
                    }
                }
                break;

            case 'level4':
                if (valid) {
                    if ($scope.fourthLevelKey == undefined) {
                        $.confirm({
                            title: '',
                            content: 'تأكيد إضافة جهة جديدة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var timestampString = new Date().getTime() + '';
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey].children[timestampString] = { "name": $scope.fourthLevelModel };
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تمت الإضافة بنجاح!");
                                            $scope.fourthLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                      
                    }
                    else {
                        $.confirm({
                            title: '',
                            content: 'تأكيد تعديل الجهة؟',
                            buttons: {
                                confirm:{
                                    text: 'تأكيد',
                                    action: function(){
                                        var entityObject = angular.copy($scope.selectedFirstLevelObject);
                                        entityObject.children[$scope.secondLevelKey].children[$scope.thirdLevelKey].children[$scope.fourthLevelKey].name = $scope.fourthLevelModel;
                                        user.updateEntity(entityObject).then(function (resolved) {
                                            $.alert("تم تعديل الجهة بنجاح!");                                                                                
                                            $scope.fourthLevelModel = '';
                                            $scope.renderEntities();
                                        });
                                    }
                                },
                                cancel:{
                                    text: 'إلغاء',
                                    action: function () {
                                        console.log("Cancelled");
                                    }
                                }
                               
                            }
                        });
                   
                      
                    }
                }
                break;
        }
    };


});