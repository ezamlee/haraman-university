/**
 * Created by Khalid on 11/2/2017.
 */

app.controller('createProgramCtrl', function ($log, $scope, $rootScope, $location, user, $timeout, $ngConfirm) {

    console.log("Welcome to ProgramCtrl");
    $scope.goalsModel = {};
    $scope.entitiesModel = {};
    $scope.programForm = {};
    $scope.userFilterEntitiesModel = {};
    $scope.filterationModel = {
        "entities": { "$elemMatch": { "l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined } },
        "goals": { "$elemMatch": { "l1": undefined, "l2": undefined } }
    };
    $scope.userFilterationModel = {
        "entityl1": undefined,
        "entityl2": undefined,
        "entityl3": undefined,
        "entityl4": undefined
    };
    $scope.updateFilterationModel = function () {
        $scope.filterationModel.entities.$elemMatch.l1 = angular.isDefined($scope.selectedFirstLevelObject) ? $scope.selectedFirstLevelObject._id : undefined;
        $scope.filterationModel.entities.$elemMatch.l2 = $scope.entitiesModel.secondLevel == '' ? undefined : $scope.entitiesModel.secondLevel;
        $scope.filterationModel.entities.$elemMatch.l3 = $scope.entitiesModel.thirdLevel == '' ? undefined : $scope.entitiesModel.thirdLevel;
        $scope.filterationModel.entities.$elemMatch.l4 = $scope.entitiesModel.fourthLevel == '' ? undefined : $scope.entitiesModel.fourthLevel;
        $scope.filterationModel.goals.$elemMatch.l1 = angular.isDefined($scope.selectedStrategicGoal) ? $scope.selectedStrategicGoal._id : undefined;
        $scope.filterationModel.goals.$elemMatch.l2 = $scope.goalsModel.secondaryGoal == '' ? undefined : $scope.goalsModel.secondaryGoal;

        $log.debug("new filter object");
        $log.debug($scope.filterationModel);
    };
    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {
            $scope.associations = entities;

            if (entities) {
                $scope.flatEntities = {};
                for (var et in entities) {
                    $scope.flatEntities[entities[et]._id] = entities[et].name;
                    if (Object.keys(entities[et].children).length != 0) {
                        for (var secondLevelChild in entities[et].children) {
                            $scope.flatEntities[secondLevelChild] = entities[et].children[secondLevelChild].name;
                            if (Object.keys(entities[et].children[secondLevelChild].children).length != 0) {
                                for (var thirdLevelChild in entities[et].children[secondLevelChild].children) {
                                    $scope.flatEntities[thirdLevelChild] = entities[et].children[secondLevelChild].children[thirdLevelChild].name;
                                    if (Object.keys(entities[et].children[secondLevelChild].children[thirdLevelChild].children).length != 0) {
                                        for (var fourthLevelChild in entities[et].children[secondLevelChild].children[thirdLevelChild].children) {
                                            $scope.flatEntities[fourthLevelChild] = entities[et].children[secondLevelChild].children[thirdLevelChild].children[fourthLevelChild].name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $log.debug("Flat entities");
                $log.debug($scope.flatEntities);

            }

        });
    };
    $scope.renderEntities();
    $scope.onAssociationSelected = function (entityLevel) {

        switch (entityLevel) {
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
        $scope.renderPrograms($scope.filterationModel);

    };
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            $scope.strategicGoals = goals;
            $scope.flatGoals = {};
            if (goals) {
                for (var goal in goals) {
                    $scope.flatGoals[goals[goal]._id] = goals[goal].name;
                    if (Object.keys(goals[goal].subgoals)) {
                        for (var subgoal in goals[goal].subgoals) {
                            $scope.flatGoals[subgoal] = goals[goal].subgoals[subgoal].name;
                        }
                    }
                }
                $log.debug("flat goals");
                $log.debug($scope.flatGoals);
            }


        });
    };
    $scope.renderGoals();
    $scope.onStrategicGoalSelected = function () {
        $scope.selectedStrategicGoal = $scope.strategicGoals[$scope.goalsModel.strategicGoal];
        $scope.goalsModel.secondaryGoal = '';
        if ($scope.goalsModel.strategicGoal === "") {
            $scope.disableSecondaryGoal = true;
        }
        else {
            $scope.disableSecondaryGoal = false;
        }
        $scope.updateFilterationModel();
        $scope.renderPrograms($scope.filterationModel);
    };
    $scope.onSecondaryGoalSelected = function () {
        $scope.selectedSecondaryObjectKey = $scope.selectedStrategicGoal[$scope.goalsModel.secondaryGoal];
        $scope.updateFilterationModel();
        $scope.renderPrograms($scope.filterationModel);
    };
    $scope.renderPrograms = function (filter) {
        user.getPrograms(filter).then(function (resolved) {
            $timeout(function () {
                $scope.programs = resolved;
                $scope.$apply();
            });


        });
    };
    $scope.renderPrograms();
    $scope.onProgramClicked = function (program) {
        $log.debug("Clicked program");
        $log.debug(program);
        $scope.selectedProgram = program;
        $scope.setProgramForm($scope.selectedProgram);

    };
    $scope.setProgramForm = function (selectedProgram) {
        $scope.programForm._id = selectedProgram._id;
        $scope.programForm.name = selectedProgram.name;
        $scope.programForm.manager = selectedProgram.manager;
        $scope.programForm.active = selectedProgram.active ? "true" : "false";
        $scope.programForm.approxCost = selectedProgram.approxCost;
        $scope.programForm.datePlannedStart = new Date(selectedProgram.datePlannedStart);
        $scope.programForm.datePlannedEnd = new Date(selectedProgram.datePlannedEnd);
        $scope.programForm.dateActualStart = new Date(selectedProgram.dateActualStart);
        $scope.programForm.dateActualEnd = new Date(selectedProgram.dateActualEnd);
        $scope.internalTeamArr = [];
        $scope.externalTeamArr = [];
        if ($scope.allUsers != undefined) {
            for (var userIndex in $scope.allUsers) {
                if (selectedProgram.teamInt.indexOf($scope.allUsers[userIndex]._id) > -1) {
                    $scope.internalTeamArr.push($scope.allUsers[userIndex]);
                }
                if (selectedProgram.teamExt.indexOf($scope.allUsers[userIndex]._id) > -1) {
                    $scope.externalTeamArr.push($scope.allUsers[userIndex]);
                }
            }
        }
        $scope.programForm.description = selectedProgram.description;
        $scope.programForm.strategies = selectedProgram.strategies;
        $scope.programForm.stages = selectedProgram.stages;
        $scope.selectedEntitiesArray = {};
        var lvls = selectedProgram.entities;

        var o = {};

        for (var i = 0; i < lvls.length; i++) {
            var lvl = lvls[i];
            var l1 = lvl.l1;
            var l2 = lvl.l2;
            var l3 = lvl.l3;
            var l4 = lvl.l4;

            if (l1 != undefined && l1 != "undefined") {
                if (!(l1 in o)) { o[l1] = {}; }
                var ol1 = o[l1];
                if (l2 != undefined && l2 != "undefined") {
                    if (!(l2 in ol1)) { ol1[l2] = {}; }
                    var ol2 = ol1[l2];
                    if (l3 != undefined && l3 != "undefined") {
                        if (!(l3 in ol2)) { ol2[l3] = {}; }
                        var ol3 = ol2[l3];

                        if (l4 != undefined && l4 != "undefined") {
                            if (!(l4 in ol3)) {
                                ol3[l4] = null;
                            }
                        }

                    }

                }
            }
        }
        $log.debug("output entities array");
        $log.debug(o);
        $scope.selectedEntitiesArray = o;

        $scope.selectedGoalsArray = {};
        var lvls = selectedProgram.goals;

        var o = {};

        for (var i = 0; i < lvls.length; i++) {
            var lvl = lvls[i];
            var l1 = lvl.l1;
            var l2 = lvl.l2;

            if (l1 != undefined && l1 != "undefined") {
                if (!(l1 in o)) { o[l1] = {}; }
                var ol1 = o[l1];

                if (l2 != undefined && l2 != "undefined") {
                    if (!(l2 in ol1)) { ol1[l2] = null; }
                }
            }

        }
        $log.debug("output goals array");
        $log.debug(o);
        $scope.selectedGoalsArray = o;


    };
    $scope.renderUsers = function (filter) {
        user.getUsers(filter).then(function (resolved) {
            $timeout(function () {
                if (filter == undefined) {
                    $scope.allUsers = resolved;
                }
                $scope.users = resolved;
                $scope.$apply();
            });


        });
    };
    $scope.renderUsers();
    $scope.updateUserFiltrationModel = function () {
        $scope.userFilterationModel.entityl1 = angular.isDefined($scope.selectedFirstLevelEntity) ? $scope.selectedFirstLevelEntity._id : undefined;
        $scope.userFilterationModel.entityl2 = $scope.userFilterEntitiesModel.secondLevel == '' ? undefined : $scope.userFilterEntitiesModel.secondLevel;
        $scope.userFilterationModel.entityl3 = $scope.userFilterEntitiesModel.thirdLevel == '' ? undefined : $scope.userFilterEntitiesModel.thirdLevel;
        $scope.userFilterationModel.entityl4 = $scope.userFilterEntitiesModel.fourthLevel == '' ? undefined : $scope.userFilterEntitiesModel.fourthLevel;
    };
    $scope.filterUsers = function (level) {
        switch (level) {
            case 'level1':
                $scope.selectedFirstLevelEntity = $scope.associations[parseInt($scope.userFilterEntitiesModel.firstLevel)];
                $scope.userFilterEntitiesModel.secondLevel = '';
                $scope.userFilterEntitiesModel.thirdLevel = '';
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if ($scope.userFilterEntitiesModel.firstLevel === "") {
                    $scope.disableSecondLevelEntity = true;
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else {
                    $scope.disableSecondLevelEntity = false;
                }
                break;
            case 'level2':
                $scope.selectedSecondLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel];
                $scope.userFilterEntitiesModel.thirdLevel = '';
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if ($scope.userFilterEntitiesModel.secondLevel === "") {
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else {
                    $scope.disableThirdLevelEntity = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel].children[$scope.userFilterEntitiesModel.thirdLevel];
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if ($scope.userFilterEntitiesModel.thirdLevel === "") {
                    $scope.disableFourthLevelEntity = true;
                }
                else {
                    $scope.disableFourthLevelEntity = false;
                }
                break;
            case 'level4':
                //$scope.fourthLevelKey = $scope.userFilterEntitiesModel.fourthLevel;
                break;
        }
        $scope.updateUserFiltrationModel();
        $scope.renderUsers($scope.userFilterationModel);

    };


    $scope.deleteProgram = function () {
        if ($scope.selectedProgram) {
            $.confirm({
                title: '',
                content: 'تأكيد حذف برنامج؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            user.deleteProgram($scope.selectedProgram._id).then(function (resolved) {
                                $scope.programForm = {};
                                delete $scope.selectedProgram;
                                $scope.internalTeamArr = [];
                                $scope.externalTeamArr = [];
                                $scope.selectedEntitiesArray = {};
                                $scope.selectedGoalsArray = {};
                                $scope.renderPrograms($scope.filterationModel);
                                $.alert("تم حذف البرنامج");
                            });
                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        action: function () {
                            console.log("Cancelled");
                        }
                    }

                }
            });

        } else {
            $.alert("لم يتم اختيار أي برنامج");
        }
    };
    $scope.createNewProgram = function (newProgramForm, valid, form) {
        $scope.programForm = {};
        delete $scope.selectedProgram;
        $scope.internalTeamArr = [];
        $scope.externalTeamArr = [];
        $scope.selectedEntitiesArray = {};
        $scope.selectedGoalsArray = {};
    };

    $scope.editProgram = function (programForm, valid) {
        if (valid) {
            if ($scope.selectedProgram == undefined) {
                $.confirm({
                    title: '',
                    content: 'تأكيد إضافة برنامج؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                var submittedForm = $scope.initializeProgramForm(programForm);
                                submittedForm._id = new Date().getTime() + '';
                                $log.debug("Submit program form");
                                $log.debug(submittedForm);
                                user.addProgram(submittedForm).then(function (resolved) {
                                    $.alert("تمت إضافة برنامج جديد!");
                                    $scope.renderPrograms($scope.filterationModel);
                                });
                            }
                        },
                        cancel: {
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
                    content: 'تأكيد تعديل برنامج؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                var submittedForm = $scope.initializeProgramForm(programForm);
                                submittedForm._id = $scope.selectedProgram._id;
                                $log.debug("Submit program form");
                                $log.debug(submittedForm);
                                user.editProgram(submittedForm).then(function (resolved) {
                                    $.alert("تم تعديل البرنامج!");
                                    $scope.renderPrograms($scope.filterationModel);
                                });
                            }
                        },
                        cancel: {
                            text: 'إلغاء',
                            action: function () {
                                console.log("Cancelled");
                            }
                        }

                    }
                });

            }
        }
        else {
            $.alert("من فضلك تأكد من إكمال البيانات المطلوبة");

        }
    };
    $scope.initializeProgramForm = function (programForm) {
        var newForm = angular.copy(programForm);
        newForm.manager = programForm.manager ? programForm.manager : "";
        newForm.approxCost = programForm.approxCost ? programForm.approxCost : 0;
        newForm.datePlannedStart = $rootScope.formatDate(programForm.datePlannedStart);
        newForm.datePlannedEnd = $rootScope.formatDate(programForm.datePlannedEnd);
        newForm.dateActualStart = $rootScope.formatDate(programForm.dateActualStart);
        newForm.dateActualEnd = $rootScope.formatDate(programForm.dateActualEnd);
        newForm.active = programForm.active === "true";
        newForm.entities = convert(serialize($scope.selectedEntitiesArray));
        newForm.goals = convert(serialize($scope.selectedGoalsArray));
        newForm.description = programForm.description ? programForm.description : "";
        newForm.strategies = programForm.strategies ? programForm.strategies : "";
        newForm.stages = programForm.stages ? programForm.stages : "";
        newForm.teamInt = [];
        for (var index3 in $scope.internalTeamArr) {
            newForm.teamInt[index3] = $scope.internalTeamArr[index3]._id;
        }
        newForm.teamExt = [];
        for (var index4 in $scope.externalTeamArr) {
            newForm.teamExt[index4] = $scope.externalTeamArr[index4]._id;
        }
        return newForm;
    };

    $scope.internalTeamArr = [];
    $scope.externalTeamArr = [];
    $scope.putUserInTeam = function (user) {
        $.confirm({
            title: '',
            content: 'اختر الفريق',
            buttons: {
                internal: {
                    text: 'فريق العمل داخليا',
                    action: function () {
                        $timeout(function () {
                            $scope.internalTeamArr.push(user);
                            $log.debug("Internal team");
                            $log.debug($scope.internalTeamArr);
                            $scope.$apply();
                        });

                    }
                },
                external: {
                    text: 'فريق العمل خارجيا',
                    action: function () {
                        $timeout(function () {
                            $scope.externalTeamArr.push(user);
                            $log.debug("External team");
                            $log.debug($scope.externalTeamArr);
                            $scope.$apply();
                        });

                    }
                },
                cancel: {
                    text: 'إلغاء',
                    action: function () {
                        console.log("Cancelled");
                    }
                }

            }
        });

    };
    $scope.deleteMember = function (index, teamType) {
        $.confirm({
            title: '',
            content: 'هل ترغب بحذف العضو من هذه القائمة؟',
            buttons: {
                confirm: {
                    text: 'حذف',
                    action: function () {
                        switch (teamType) {
                            case 'internal':
                                $timeout(function () {
                                    $scope.internalTeamArr.splice(index, 1);
                                    $log.debug("Internal team");
                                    $log.debug($scope.internalTeamArr);
                                    $scope.$apply();
                                });
                                break;
                            case 'external':
                                $timeout(function () {
                                    $scope.externalTeamArr.splice(index, 1);
                                    $log.debug("External team");
                                    $log.debug($scope.externalTeamArr);
                                    $scope.$apply();
                                });
                                break;

                        }
                    }
                },
                cancel: {
                    text: 'إلغاء',
                    action: function () {
                        console.log("Cancelled");
                    }
                }

            }
        });
    };

    function serialize(obj, lstCmpl, lstCrnt) {
        lstCmpl = lstCmpl || [];
        lstCrnt = lstCrnt || [];

        for (var key in obj) {
            var lstCrntSub = lstCrnt.slice();

            lstCrntSub.push(key);

            if (obj[key] && Object.keys(obj[key]).length > 0) {
                serialize(obj[key], lstCmpl, lstCrntSub);
            } else {
                lstCmpl.push(lstCrntSub);
            }
        }

        return lstCmpl;
    };

    function convert(arr) {
        var res = [];

        for (var i in arr) {
            var obj = {};

            for (var j in arr[i]) {
                obj["l" + (Number(j) + 1)] = arr[i][j];
            }

            res.push(obj);
        }

        return res;
    };
    $scope.onEntitySelected = function (type) {
        switch (type) {
            case 'level1':
                for (var index = 0; index < $scope.associations.length; index++) {
                    if ($scope.associations[index]._id == $scope.entityl1) {
                        $scope.selectedUniversity = $scope.associations[index];
                    }
                }
                $scope.entityl2 = '';
                $scope.entityl3 = '';
                $scope.entityl4 = '';


                break;
            case 'level2':
                $scope.selectedFaculty = $scope.selectedUniversity.children[$scope.entityl2];
                $scope.entityl3 = '';
                $scope.entityl4 = '';
                break;
            case 'level3':
                $scope.selectedSector = $scope.selectedUniversity.children[$scope.entityl2].children[$scope.entityl3];
                $scope.entityl4 = '';
                break;
            case 'level4':
                $scope.selectedDepartmentKey = $scope.entityl4;
                break;
        }
    };

    $scope.addEntityToProgram = function () {
        $ngConfirm({
            title: 'إضافة جهة',
            contentUrl: 'add-entity-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                add: {
                    text: 'إضافة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
                        if ($scope.entityl1 != undefined && $scope.entityl1 != '') {
                            $timeout(function () {
                                // var newEntityObject = {};
                                debugger;
                                if (!($scope.entityl1 in $scope.selectedEntitiesArray)) {
                                    $scope.selectedEntitiesArray[$scope.entityl1] = null;
                                }
                                if ($scope.entityl2 != undefined && $scope.entityl2 != '') {
                                    var secondLevel = $scope.selectedEntitiesArray[$scope.entityl1];
                                    if (secondLevel == null || (!($scope.entityl2 in secondLevel))) {
                                        if (secondLevel == null) {
                                            secondLevel = {};
                                        }
                                        secondLevel[$scope.entityl2] = null;
                                    }

                                    if ($scope.entityl3 != undefined && $scope.entityl3 != '') {
                                        var thirdLevel = secondLevel[$scope.entityl2];
                                        if (thirdLevel == null || (!($scope.entityl3 in thirdLevel))) {
                                            if (thirdLevel == null) {
                                                thirdLevel = {};
                                            }
                                            thirdLevel[$scope.entityl3] = null;
                                        }

                                        if ($scope.entityl4 != undefined && $scope.entityl4 != '') {
                                            var fourthLevel = thirdLevel[$scope.entityl3];
                                            if (fourthLevel == null || (!($scope.entityl4 in fourthLevel))) {
                                                if (fourthLevel == null) {
                                                    fourthLevel = {};
                                                }
                                                fourthLevel[$scope.entityl4] = null;
                                            }

                                            thirdLevel[$scope.entityl3] = fourthLevel;

                                        }
                                        secondLevel[$scope.entityl2] = thirdLevel;

                                    }
                                    $scope.selectedEntitiesArray[$scope.entityl1] = secondLevel;
                                }
                                $log.debug("Entities object after adding");
                                $log.debug($scope.selectedEntitiesArray);
                                $scope.$apply();
                            });
                        }
                        else {
                            $ngConfirm('يجب اختيار المستوى الأول');
                            return false;
                        }


                    }
                },
                cancel: {
                    text: 'إلغاء',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                    }
                },
            }
        });
    };
    $scope.onGoalSelected = function (type) {
        if (type == "strategic") {
            for (var i = 0; i < $scope.strategicGoals.length; i++) {
                if ($scope.strategicGoals[i]._id == $scope.strategicGoal) {
                    $scope.selectedFirstLevelGoal = $scope.strategicGoals[i];
                }
            }
            $scope.secondaryGoal = "";

        }
        else if (type == "secondary") {
            // $log.debug("selected secondary goal");
            // $log.debug($scope.secondaryGoal);

        }
    };
    $scope.addGoalToProgram = function () {
        $ngConfirm({
            title: 'إضافة هدف',
            contentUrl: 'add-goal-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                add: {
                    text: 'إضافة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
                        if ($scope.strategicGoal != undefined && $scope.strategicGoal != "") {
                            $timeout(function () {
                                if (!($scope.strategicGoal in $scope.selectedGoalsArray)) {
                                    $scope.selectedGoalsArray[$scope.strategicGoal] = null;
                                }
                                if ($scope.secondaryGoal != undefined && $scope.secondaryGoal != '') {
                                    var secondLevel = $scope.selectedGoalsArray[$scope.strategicGoal];
                                    if (secondLevel == null || (!($scope.secondaryGoal in secondLevel))) {
                                        if (secondLevel == null) {
                                            secondLevel = {};
                                        }
                                        secondLevel[$scope.secondaryGoal] = null;
                                    }
                                    $scope.selectedGoalsArray[$scope.strategicGoal] = secondLevel;

                                }
                                $log.debug("Goals array after adding");
                                $log.debug($scope.selectedGoalsArray);
                                $scope.$apply();
                            });
                        }
                        else {
                            $ngConfirm('يجب اختيار هدف استراتيجي على الأقل');
                            return false;
                        }



                    }
                },
                cancel: {
                    text: 'إلغاء',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                    }
                },
            }
        });
    };
    $scope.deletGoalFromProgram = function (type, key1, key2) {
        $.confirm({
            title: '',
            content: 'هل ترغب بحذف الهدف من هذه القائمة؟',
            buttons: {
                confirm: {
                    text: 'حذف',
                    action: function () {
                        $timeout(function () {
                            if (type == "firstLevel") {
                                delete $scope.selectedGoalsArray[key1];

                            }
                            else if (type == "secondLevel") {
                                delete $scope.selectedGoalsArray[key1][key2];
                            }
                            $log.debug("Goals after deleting item");
                            $log.debug($scope.selectedGoalsArray);
                            $scope.$apply();
                        });

                    }
                },
                cancel: {
                    text: 'إلغاء',
                    action: function () {
                        console.log("Cancelled");
                    }
                }

            }
        });

    };
    $scope.deleteEntityFromProgram = function (type, key1, key2, key3, key4) {
        $.confirm({
            title: '',
            content: 'هل ترغب بحذف الجهة من هذه القائمة؟',
            buttons: {
                confirm: {
                    text: 'حذف',
                    action: function () {
                        $timeout(function () {
                            if (type == "firstLevel") {
                                delete $scope.selectedEntitiesArray[key1];

                            }
                            else if (type == "secondLevel") {
                                delete $scope.selectedEntitiesArray[key1][key2];
                            }
                            else if (type == "thirdLevel") {
                                delete $scope.selectedEntitiesArray[key1][key2][key3];
                            }
                            else if (type == "fourthLevel") {
                                delete $scope.selectedEntitiesArray[key1][key2][key3][key4];
                            }
                            $log.debug("Entities after deleting item");
                            $log.debug($scope.selectedEntitiesArray);
                            $scope.$apply();
                        });

                    }
                },
                cancel: {
                    text: 'إلغاء',
                    action: function () {
                        console.log("Cancelled");
                    }
                }

            }
        });
    };

});