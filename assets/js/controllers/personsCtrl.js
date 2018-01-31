/**
 * Created by Khalid on 11/12/2017.
 */
app.controller('personsCtrl', function ($log, $scope, $rootScope, $location, connector, $timeout, user) {

    console.log("Welcome to personsCtrl");
    $scope.entitiesModel = {};
    $scope.userForm = {};
    $scope.userForm.role = "user";
    $scope.userAuthorotiesModel = {};
    $scope.filterationModel = {
        "entityl1": undefined,
        "entityl2": undefined,
        "entityl3": undefined,
        "entityl4": undefined
    };
    $scope.updateFilterationModel = function () {
        $scope.filterationModel.entityl1 = angular.isDefined($scope.selectedFirstLevelObject) ? $scope.selectedFirstLevelObject._id : undefined;
        $scope.filterationModel.entityl2 = $scope.entitiesModel.secondLevel == '' ? undefined : $scope.entitiesModel.secondLevel;
        $scope.filterationModel.entityl3 = $scope.entitiesModel.thirdLevel == '' ? undefined : $scope.entitiesModel.thirdLevel;
        $scope.filterationModel.entityl4 = $scope.entitiesModel.fourthLevel == '' ? undefined : $scope.entitiesModel.fourthLevel;
        $log.debug("new filter object");
        $log.debug($scope.filterationModel);
    };
    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {
            $scope.associations = entities;

        });
    };
    $scope.renderEntities();
    $scope.onAssociationSelected = function (type) {
        debugger;
        switch (type) {
            case 'level1':
                $scope.selectedFirstLevelObject = $scope.associations[parseInt($scope.entitiesModel.firstLevel)];
                $scope.entitiesModel.secondLevel = '';
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.firstLevel === "") {
                    $scope.disableSecondLevel = true;
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else {
                    $scope.disableSecondLevel = false;
                }


                break;
            case 'level2':
                $scope.selectedSecondLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel];
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.secondLevel === "") {
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else {
                    $scope.disablethirdLevel = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel];
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.thirdLevel === "") {
                    $scope.disableFourthLevel = true;
                }
                else {
                    $scope.disableFourthLevel = false;
                }
                break;
            case 'level4':
                $scope.fourthLevelKey = $scope.entitiesModel.fourthLevel;
                break;
        }
        $scope.updateFilterationModel();
        $scope.renderUsers($scope.filterationModel);
    };

    $scope.renderUsers = function (filter) {
        user.getUsers(filter).then(function (resolved) {
            $timeout(function () {
                //debugger;
                $scope.users = resolved;
                $scope.$apply();
            });


        });
    };
    $scope.renderUsers();
    $scope.onUserClicked = function (user) {
        $scope.selectedUser = user;
        $log.debug('Selected user');
        $log.debug(user);
        $scope.fillUserForm($scope.selectedUser);
    };
    $scope.deleteUser = function () {
        if ($scope.selectedUser) {
            $.confirm({
                title: '',
                content: 'تأكيد حذف المستخدم؟',
                buttons: {
                    confirm:{
                        text: 'تأكيد',
                        action: function(){
                            user.deleteUser($scope.selectedUser._id == undefined ? "" : $scope.selectedUser._id).then(function (resolved) {
                                $scope.userForm = {};
                                delete $scope.selectedUser;
                                $scope.renderUsers($scope.filterationModel);
                                $.alert("تم حذف المستخدم");
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
        else{
            $.alert("لم يتم اختيار أي مستخدم");
        }
    };
    $scope.fillUserForm = function (selectedUser) {
        //$scope.userForm
        if (selectedUser) {
            $scope.userForm.name = selectedUser.name;
            $scope.userForm.role = selectedUser.role;
            $scope.userForm.title = selectedUser.title;
            $scope.userForm.position = selectedUser.position;
            $scope.userForm.mobile = selectedUser.mobile;
            $scope.userForm.whatsapp = selectedUser.whatsapp;
            $scope.userForm.telephone = selectedUser.telephone;
            $scope.userForm.email1 = selectedUser.email1;
            $scope.userForm.email2 = selectedUser.email2;
            $scope.userForm._id = selectedUser._id;
            $scope.userForm.entityl1 = selectedUser.entityl1;
            $scope.userForm.entityl2 = selectedUser.entityl2;
            $scope.userForm.entityl3 = selectedUser.entityl3;
            $scope.userForm.entityl4 = selectedUser.entityl4;
            $scope.setUserEntities();
            $scope.userForm.authTask = selectedUser.authTask;
            $scope.userForm.authProject = selectedUser.authProject;
            $scope.userForm.authProgram = selectedUser.authProgram;
            $scope.userForm.authGoals = selectedUser.authGoals;
            $scope.userForm.authUsers = selectedUser.authUsers;
            $scope.userForm.authEntities = selectedUser.authEntities;
            $scope.setAuthoroties();

        }
    };

    $scope.onEntitySelected = function (type) {
        debugger;
        switch (type) {
            case 'level1':
                debugger;
                for (var index = 0; index < $scope.associations.length; index++) {
                    if ($scope.associations[index]._id == $scope.userForm.entityl1) {
                        $scope.selectedUniversity = $scope.associations[index];
                    }
                }
                $scope.userForm.entityl2 = '';
                $scope.userForm.entityl3 = '';
                $scope.userForm.entityl4 = '';


                break;
            case 'level2':
                $scope.selectedFaculty = $scope.selectedUniversity.children[$scope.userForm.entityl2];
                $scope.userForm.entityl3 = '';
                $scope.userForm.entityl4 = '';
                break;
            case 'level3':
                $scope.selectedSector = $scope.selectedUniversity.children[$scope.userForm.entityl2].children[$scope.userForm.entityl3];
                $scope.userForm.entityl4 = '';
                break;
            case 'level4':
                $scope.selectedDepartmentKey = $scope.userForm.entityl4;
                break;
        }
    };
    $scope.setUserEntities = function () {
        for (var index = 0; index < $scope.associations.length; index++) {
            if ($scope.associations[index]._id == $scope.userForm.entityl1) {
                $scope.selectedUniversity = $scope.associations[index];
            }
        }
        $scope.selectedFaculty = $scope.selectedUniversity.children[$scope.userForm.entityl2];

        if ($scope.selectedUniversity.children[$scope.userForm.entityl2]) {
            $scope.selectedSector = $scope.selectedUniversity.children[$scope.userForm.entityl2].children[$scope.userForm.entityl3];
        }
    };
    $scope.submitUserForm = function (userForm, userAuthorotiesModel, valid) {
        $scope.userForm = {};
        $scope.userForm.role = "user";
        $scope.setAuthoroties();
        delete $scope.selectedUser;

        //     if(valid){
        //     var newForm = $scope.initializeUserForm(userForm);
        //     newForm = $scope.bindUserAuthorotiesWithForm(newForm, userAuthorotiesModel);
        //     $log.debug('submitted form');
        //     $log.debug(newForm);
        //     user.addUser(newForm).then(function (resolved) {
        //         $scope.renderUsers();
        //     });
        // }else{
        //     window.alert("من فضلك قم بإدخال الاسم والجهة واسم المستخدم");
        // }

    };
    $scope.initializeUserForm = function (userForm) {
        var form = {};
        form.name = userForm.name ? userForm.name : "";
        form.title = userForm.title ? userForm.title : "";
        form.position = userForm.position ? userForm.position : "";
        form.mobile = userForm.mobile ? userForm.mobile : "";
        form.whatsapp = userForm.whatsapp ? userForm.whatsapp : "";
        form.telephone = userForm.telephone ? userForm.telephone : "";
        form.email1 = userForm.email1 ? userForm.email1 : "";
        form.email2 = userForm.email2 ? userForm.email2 : "";
        form._id = userForm._id ? userForm._id : "";
        form.role = userForm.role;
        form.entityl1 = userForm.entityl1 ? userForm.entityl1 : "";
        form.entityl2 = userForm.entityl2 ? userForm.entityl2 : "";
        form.entityl3 = userForm.entityl3 ? userForm.entityl3 : "";
        form.entityl4 = userForm.entityl4 ? userForm.entityl4 : "";
        return form;

    }
    $scope.bindUserAuthorotiesWithForm = function (userForm, userAuthorotiesModel) {
        userAuthorotiesModel.authTask_show = userAuthorotiesModel.authTask_show ? userAuthorotiesModel.authTask_show : 0;
        userAuthorotiesModel.authTask_add = userAuthorotiesModel.authTask_add ? userAuthorotiesModel.authTask_add : 0;
        userAuthorotiesModel.authTask_edit = userAuthorotiesModel.authTask_edit ? userAuthorotiesModel.authTask_edit : 0;
        userAuthorotiesModel.authTask_delete = userAuthorotiesModel.authTask_delete ? userAuthorotiesModel.authTask_delete : 0;
        userForm.authTask = userAuthorotiesModel.authTask_show + userAuthorotiesModel.authTask_add + userAuthorotiesModel.authTask_edit + userAuthorotiesModel.authTask_delete;

        userAuthorotiesModel.authProject_show = userAuthorotiesModel.authProject_show ? userAuthorotiesModel.authProject_show : 0;
        userAuthorotiesModel.authProject_add = userAuthorotiesModel.authProject_add ? userAuthorotiesModel.authProject_add : 0;
        userAuthorotiesModel.authProject_edit = userAuthorotiesModel.authProject_edit ? userAuthorotiesModel.authProject_edit : 0;
        userAuthorotiesModel.authProject_delete = userAuthorotiesModel.authProject_delete ? userAuthorotiesModel.authProject_delete : 0;
        userForm.authProject = userAuthorotiesModel.authProject_show + userAuthorotiesModel.authProject_add + userAuthorotiesModel.authProject_edit + userAuthorotiesModel.authProject_delete;

        userAuthorotiesModel.authProgram_show = userAuthorotiesModel.authProgram_show ? userAuthorotiesModel.authProgram_show : 0;
        userAuthorotiesModel.authProgram_add = userAuthorotiesModel.authProgram_add ? userAuthorotiesModel.authProgram_add : 0;
        userAuthorotiesModel.authProgram_edit = userAuthorotiesModel.authProgram_edit ? userAuthorotiesModel.authProgram_edit : 0;
        userAuthorotiesModel.authProgram_delete = userAuthorotiesModel.authProgram_delete ? userAuthorotiesModel.authProgram_delete : 0;
        userForm.authProgram = userAuthorotiesModel.authProgram_show + userAuthorotiesModel.authProgram_add + userAuthorotiesModel.authProgram_edit + userAuthorotiesModel.authProgram_delete;

        userAuthorotiesModel.authGoals_show = userAuthorotiesModel.authGoals_show ? userAuthorotiesModel.authGoals_show : 0;
        userAuthorotiesModel.authGoals_add = userAuthorotiesModel.authGoals_add ? userAuthorotiesModel.authGoals_add : 0;
        userAuthorotiesModel.authGoals_edit = userAuthorotiesModel.authGoals_edit ? userAuthorotiesModel.authGoals_edit : 0;
        userAuthorotiesModel.authGoals_delete = userAuthorotiesModel.authGoals_delete ? userAuthorotiesModel.authGoals_delete : 0;
        userForm.authGoals = userAuthorotiesModel.authGoals_show + userAuthorotiesModel.authGoals_add + userAuthorotiesModel.authGoals_edit + userAuthorotiesModel.authGoals_delete;

        userAuthorotiesModel.authUsers_show = userAuthorotiesModel.authUsers_show ? userAuthorotiesModel.authUsers_show : 0;
        userAuthorotiesModel.authUsers_add = userAuthorotiesModel.authUsers_add ? userAuthorotiesModel.authUsers_add : 0;
        userAuthorotiesModel.authUsers_edit = userAuthorotiesModel.authUsers_edit ? userAuthorotiesModel.authUsers_edit : 0;
        userAuthorotiesModel.authUsers_delete = userAuthorotiesModel.authUsers_delete ? userAuthorotiesModel.authUsers_delete : 0;
        userForm.authUsers = userAuthorotiesModel.authUsers_show + userAuthorotiesModel.authUsers_add + userAuthorotiesModel.authUsers_edit + userAuthorotiesModel.authUsers_delete;

        userAuthorotiesModel.authEntities_show = userAuthorotiesModel.authEntities_show ? userAuthorotiesModel.authEntities_show : 0;
        userAuthorotiesModel.authEntities_add = userAuthorotiesModel.authEntities_add ? userAuthorotiesModel.authEntities_add : 0;
        userAuthorotiesModel.authEntities_edit = userAuthorotiesModel.authEntities_edit ? userAuthorotiesModel.authEntities_edit : 0;
        userAuthorotiesModel.authEntities_delete = userAuthorotiesModel.authEntities_delete ? userAuthorotiesModel.authEntities_delete : 0;
        userForm.authEntities = userAuthorotiesModel.authEntities_show + userAuthorotiesModel.authEntities_add + userAuthorotiesModel.authEntities_edit + userAuthorotiesModel.authEntities_delete;

        return userForm;

    };
    $scope.setAuthoroties = function () {

        if ($scope.userForm.authTask & 1) {
            $log.debug('task delete enabled');
            $scope.userAuthorotiesModel.authTask_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authTask_delete = 0;
        }

        if ($scope.userForm.authTask & 2) {
            $log.debug('task edit enabled');
            $scope.userAuthorotiesModel.authTask_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authTask_edit = 0;
        }

        if ($scope.userForm.authTask & 4) {
            $log.debug('task add enabled');
            $scope.userAuthorotiesModel.authTask_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authTask_add = 0;
        }

        if ($scope.userForm.authTask & 8) {
            $scope.userAuthorotiesModel.authTask_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authTask_show = 0;
        }

        if ($scope.userForm.authProject & 1) {
            $log.debug('project delete enabled');
            $scope.userAuthorotiesModel.authProject_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authProject_delete = 0;
        }

        if ($scope.userForm.authProject & 2) {
            $log.debug('project edit enabled');
            $scope.userAuthorotiesModel.authProject_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authProject_edit = 0;
        }

        if ($scope.userForm.authProject & 4) {
            $log.debug('project add enabled');
            $scope.userAuthorotiesModel.authProject_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authProject_add = 0;
        }

        if ($scope.userForm.authProject & 8) {
            $scope.userAuthorotiesModel.authProject_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authProject_show = 0;
        }


        if ($scope.userForm.authProgram & 1) {
            $log.debug('program delete enabled');
            $scope.userAuthorotiesModel.authProgram_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authProgram_delete = 0;
        }

        if ($scope.userForm.authProgram & 2) {
            $log.debug('program edit enabled');
            $scope.userAuthorotiesModel.authProgram_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authProgram_edit = 0;
        }

        if ($scope.userForm.authProgram & 4) {
            $log.debug('program add enabled');
            $scope.userAuthorotiesModel.authProgram_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authProgram_add = 0;
        }
        
        if ($scope.userForm.authProgram & 8) {
            $scope.userAuthorotiesModel.authProgram_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authProgram_show = 0;
        }


        if ($scope.userForm.authGoals & 1) {
            $log.debug('goals delete enabled');
            $scope.userAuthorotiesModel.authGoals_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authGoals_delete = 0;
        }

        if ($scope.userForm.authGoals & 2) {
            $log.debug('goals edit enabled');
            $scope.userAuthorotiesModel.authGoals_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authGoals_edit = 0;
        }

        if ($scope.userForm.authGoals & 4) {
            $log.debug('goals add enabled');
            $scope.userAuthorotiesModel.authGoals_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authGoals_add = 0;
        }
        
        if ($scope.userForm.authGoals & 8) {
            $scope.userAuthorotiesModel.authGoals_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authGoals_show = 0;
        }


        if ($scope.userForm.authUsers & 1) {
            $log.debug('users delete enabled');
            $scope.userAuthorotiesModel.authUsers_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authUsers_delete = 0;
        }

        if ($scope.userForm.authUsers & 2) {
            $log.debug('users edit enabled');
            $scope.userAuthorotiesModel.authUsers_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authUsers_edit = 0;
        }

        if ($scope.userForm.authUsers & 4) {
            $log.debug('users add enabled');
            $scope.userAuthorotiesModel.authUsers_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authUsers_add = 0;
        }

        if ($scope.userForm.authUsers & 8) {
            $scope.userAuthorotiesModel.authUsers_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authUsers_show = 0;
        }


        if ($scope.userForm.authEntities & 1) {
            $log.debug('etities delete enabled');
            $scope.userAuthorotiesModel.authEntities_delete = 1;
        }
        else {
            $scope.userAuthorotiesModel.authEntities_delete = 0;
        }

        if ($scope.userForm.authEntities & 2) {
            $log.debug('entities edit enabled');
            $scope.userAuthorotiesModel.authEntities_edit = 2;
        }
        else {
            $scope.userAuthorotiesModel.authEntities_edit = 0;
        }
        if ($scope.userForm.authEntities & 4) {
            $log.debug('entities add enabled');
            $scope.userAuthorotiesModel.authEntities_add = 4;
        }
        else {
            $scope.userAuthorotiesModel.authEntities_add = 0;
        }
        if ($scope.userForm.authEntities & 8) {
            $scope.userAuthorotiesModel.authEntities_show = 8;
        }
        else{
            $scope.userAuthorotiesModel.authEntities_show = 0;
        }

    };

    $scope.updateUser = function (userForm, userAuthorotiesModel, valid) {
        if (valid) {
            if ($scope.selectedUser === undefined) {
                $.confirm({
                    title: '',
                    content: 'إضافة مستخدم جديد؟',
                    buttons: {
                        confirm:{
                            text: 'تأكيد',
                            action: function(){
                                var newForm = $scope.initializeUserForm(userForm);
                                newForm = $scope.bindUserAuthorotiesWithForm(newForm, userAuthorotiesModel);
                                $log.debug('submitted form');
                                $log.debug(newForm);
                                user.addUser(newForm).then(function (resolved) {
                                    $.alert("تمت إضافة مستخدم جديد بنجاح!");
                                    $scope.renderUsers($scope.filterationModel);
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
                    content: 'تعديل بيانات المستخدم؟',
                    buttons: {
                        confirm:{
                            text: 'تأكيد',
                            action: function(){
                                var newForm = $scope.initializeUserForm(userForm);
                                newForm = $scope.bindUserAuthorotiesWithForm(newForm, userAuthorotiesModel);
                                $log.debug('submitted form');
                                $log.debug(newForm);
                                user.updateUser(newForm).then(function (resolved) {
                                    $.alert("تم تعديل بيانات المستخدم بنجاح!");                                    
                                    $scope.renderUsers($scope.filterationModel);
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
        } else {
            $.alert("من فضلك قم بإدخال الاسم والجهة واسم المستخدم");
        }
    };
});