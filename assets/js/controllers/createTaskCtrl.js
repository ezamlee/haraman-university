/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('createTaskCtrl', function ($log, $scope, $rootScope, $location, user, $timeout, $ngConfirm) {
    console.log("Welcome to tasks screen");


    // start "added by heba"
    $scope.min = 0;
    $scope.max = 100;

    $scope.result = false;
    $scope.reportForm = {
        mainData: true,
        quality: true,
        dates: true,
        team: true,
        kpis: true,
        requirements: true,
        users: true
    };
    //end "added by heba"

    $scope.entitiesModel = {};

    $scope.goalsModel = {};
    $scope.entitiesModel = {};
    $scope.taskObject = {};
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
                debugger;
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
        // $scope.renderPrograms($scope.filterationModel);
        $scope.renderTasks();

    };
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            $scope.strategicGoals = goals;
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

    $scope.renderProjects = function (filtrationProgram) {

        user.getProjects(filtrationProgram).then(function (projects) {
            $timeout(function () {
                $scope.projects = projects;
                $scope.$apply();
            });

        });
    };
    $scope.renderProjects();
    $scope.filterProjects = function () {
        $scope.projectId = '';
        $scope.stageName = '';
        if ($scope.programId != undefined) {
            if ($scope.programId === "") {
                $scope.renderProjects();
                $scope.renderTasks();
            }
            else {
                var object = { "program": $scope.programId }
                $scope.renderProjects(object);
            }
        }
        else {
            $scope.renderProjects();
        }

    };
    $scope.renderTasks = function (projectId, stageName) {
        user.getTasks(projectId, stageName).then(function (tasks) {
            $timeout(function () {
                console.log(tasks);
                $scope.tasks = tasks;
                $scope.$apply();
            });
        });
    };
    $scope.renderTasks();
    $scope.onProjectSelected = function () {
        $scope.stageName = '';
        // $scope.internalTeamArr = [];
        // $scope.externalTeamArr = [];
        if ($scope.projectId != undefined && $scope.projectId != '') {
            for (var index in $scope.projects) {
                if ($scope.projects[index]._id == $scope.projectId) {
                    $scope.selectedProject = $scope.projects[index];
                    console.log("Selected project");
                    console.log($scope.selectedProject);
                    $scope.setUsersList();
                }
            }
        }
        else {
            delete $scope.selectedProject;
            $scope.usersList = []
        }

        $scope.renderTasks($scope.projectId, $scope.stageName);

    };
    $scope.onStageSelected = function () {
        $scope.renderTasks($scope.projectId, $scope.stageName);
    };
    $scope.usersList = [];
    $scope.setUsersList = function () {

        $timeout(function () {
            $scope.usersList = [];
            for (var index in $scope.selectedProject.teamInt) {
                for (var index2 in $scope.allUsers) {
                    if ($scope.selectedProject.teamInt[index] == $scope.allUsers[index2]._id) {
                        $scope.usersList.push($scope.allUsers[index2]);
                    }
                }
            }
            for (var index3 in $scope.selectedProject.teamExt) {
                for (var index4 in $scope.allUsers) {
                    if ($scope.selectedProject.teamExt[index3] == $scope.allUsers[index4]._id) {
                        $scope.usersList.push($scope.allUsers[index4]);
                    }
                }
            }
            $scope.$apply();
        });

    };

    $scope.setTaskObject = function (object) {
        $scope.taskObject._id = object._id;
        $scope.taskObject.name = object.name;
        $scope.taskObject.project = object.project;
        $scope.usersList = [];
        if ($scope.selectedProject) {
            delete $scope.selectedProject;
        }
        for (var index in $scope.projects) {
            if ($scope.projects[index]._id == $scope.taskObject.project) {
                $scope.selectedProject = $scope.projects[index];
                console.log("Selected project");
                console.log($scope.selectedProject);
                $scope.setUsersList();
            }
        }
        $scope.taskObject.manager = object.manager;
        $scope.taskObject.active = object.active ? "true" : "false";
        $scope.taskObject.approxCost = object.approxCost;
        $scope.taskObject.datePlannedStart = new Date(object.datePlannedStart);
        $scope.taskObject.datePlannedEnd = new Date(object.datePlannedEnd);
        $scope.taskObject.dateActualStart = new Date(object.dateActualStart);
        $scope.taskObject.dateActualEnd = new Date(object.dateActualEnd);
        $scope.internalTeamArr = [];
        $scope.externalTeamArr = [];
        if ($scope.allUsers != undefined) {
            for (var userIndex in $scope.allUsers) {
                if (object.teamInt.indexOf($scope.allUsers[userIndex]._id) > -1) {
                    $scope.internalTeamArr.push($scope.allUsers[userIndex]);
                }
                if (object.teamExt.indexOf($scope.allUsers[userIndex]._id) > -1) {
                    $scope.externalTeamArr.push($scope.allUsers[userIndex]);
                }
            }
        }
        $scope.taskObject.description = object.description;
        $scope.taskObject.stage = object.stage;
        $scope.taskObject.requirements = object.requirements;
        $scope.taskObject.kpis = object.kpis;
        $scope.taskObject.wt = object.wt;
        $scope.taskObject.completed = object.completed;
        $scope.taskObject.quality = object.quality;
        $scope.selectedEntitiesArray = {};
        var lvls = object.entities;

        var o = {};
        if(lvls)
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
    };
    $scope.onTaskClicked = function (task) {
        console.log(task)
        $scope.selectedTask = task;
        $scope.taskObject = task;
        $log.debug("Clicked task");
        $log.debug(task);
        $scope.setTaskObject($scope.selectedTask);
    };

    $scope.renderUsers = function () {
        user.getUsers(undefined).then(function (resolved) {
            $scope.allUsers = resolved;
        });
    };
    $scope.renderUsers();
    $scope.deleteTask = function () {
        if ($scope.selectedTask) {
            $.confirm({
                title: '',
                content: 'تأكيد حذف المهمة؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            user.deleteTask($scope.selectedTask._id).then(function (resolved) {
                                $scope.taskObject = {};
                                delete $scope.selectedTask;
                                $scope.internalTeamArr = [];
                                $scope.externalTeamArr = [];
                                $scope.renderTasks($scope.projectId, $scope.stageName);
                                $.alert("تم حذف المهمة بنجاح")
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
            $.alert("لم يتم اختيار أي مهمة");
        }

    };
    $scope.addNewTask = function () {
        $scope.taskObject = {};
        delete $scope.selectedTask;
        $scope.internalTeamArr = [];
        $scope.externalTeamArr = [];
    };
    $scope.initializeTaskForm = function (taskObject) {
        var submittedForm = angular.copy(taskObject);
        submittedForm.manager = taskObject.manager ? taskObject.manager : "";
        submittedForm.approxCost = taskObject.approxCost ? taskObject.approxCost : 0;
        submittedForm.teamInt = [];
        for (var index3 in $scope.internalTeamArr) {
            submittedForm.teamInt[index3] = $scope.internalTeamArr[index3]._id;
        }
        submittedForm.teamExt = [];
        for (var index4 in $scope.externalTeamArr) {
            submittedForm.teamExt[index4] = $scope.externalTeamArr[index4]._id;
        }
        submittedForm.entities = convert(serialize($scope.selectedEntitiesArray));
        submittedForm.description = taskObject.description ? taskObject.description : "";
        submittedForm.datePlannedStart = $rootScope.formatDate(taskObject.datePlannedStart);
        submittedForm.datePlannedEnd = $rootScope.formatDate(taskObject.datePlannedEnd);
        submittedForm.dateActualStart = $rootScope.formatDate(taskObject.dateActualStart);
        submittedForm.dateActualEnd = $rootScope.formatDate(taskObject.dateActualEnd);
        submittedForm.active = taskObject.active === "true";
        submittedForm.requirements = taskObject.requirements ? taskObject.requirements : "";
        submittedForm.kpis = taskObject.kpis ? taskObject.kpis : "";
        submittedForm.stage = taskObject.stage ? taskObject.stage : "";
        submittedForm.project = $scope.projectId ? $scope.projectId : "";
        return submittedForm;
    };
    $scope.editTask = function (taskObject, valid) {
        if (valid || 1) {
            if ($scope.selectedTask == undefined) {
                $.confirm({
                    title: '',
                    content: 'تأكيد إضافة مهمة؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                var submittedForm = $scope.initializeTaskForm(taskObject);
                                submittedForm._id = new Date().getTime() + '';
                                $log.debug("Submit task form");
                                $log.debug(submittedForm);
                                user.addTask(submittedForm).then(function (resolved) {
                                    $scope.renderTasks($scope.projectId, $scope.stageName);
                                    $.alert("تمت إضافة مهمة بنجاح!");
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
                    content: 'تأكيد تعديل مهمة؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                var submittedForm = $scope.initializeTaskForm(taskObject);
                                submittedForm._id = $scope.selectedTask._id;
                                $log.debug("Submit task form");
                                $log.debug(submittedForm);
                                user.editTask(submittedForm).then(function (resolved) {
                                    $scope.renderTasks($scope.projectId, $scope.stageName);
                                    $.alert("تم تعديل المهمة بنجاح!");
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


    // start team modal "added by heba"

    $scope.filterTeamArr = [];
    $scope.filterUsingTeam = function (user) {
        $.confirm({
            title: '',
            content: 'اختيار لﻷشخاص ذوي العلاقة',
            buttons: {
                add: {
                    text: 'اختيار',
                    action: function () {
                        $timeout(function () {
                            $scope.filterTeamArr.push(user);
                            $scope.tasks = $scope.tasks.filter(prog => prog["teamInt"].indexOf(user._id) > -1 || prog["teamExt"].indexOf(user._id) > -1 );
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
    $scope.deleteTeamMember = function (index) {
        $.confirm({
            title: '',
            content: 'هل ترغب بحذف العضو من هذه القائمة؟',
            buttons: {
                confirm: {
                    text: 'حذف',
                    action: function () {
                        $timeout(function () {
                            $scope.filterTeamArr.splice(index, 1);
                            $scope.renderTasks();
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
    $scope.filterTaskTeam = function () {
        $ngConfirm({
            title: '',
            contentUrl: 'filter-task-team-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                add: {
                    text: 'تم',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
                    }
                }
            }
        });
    };

    $scope.filterTaskEntity = function () {
        $ngConfirm({
            title: '',
            contentUrl: 'filter-task-entity-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                add: {
                    text: 'تم',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
                        if ($scope.entitiesModel.firstLevel != undefined && $scope.entitiesModel.firstLevel != '') {                            
                        }
                        else {
                            $ngConfirm('يجب اختيار المستوى الأول');
                            return false;
                        }
                    }
                }
            }
        });
    };

    $scope.addTeamToTask = function () {
        $ngConfirm({
            title: 'إضافة فريق العمل',
            contentUrl: 'add-task-team-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                // add: {
                //     text: 'تم',
                //     btnClass: 'btn-blue',
                //     action: function (scope, button) {
                //     }
                // },
                cancel: {
                    text: 'إغلاق',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                    }
                }
            }
        });
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

    // end team modal "added by heba"

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
    // start "added by heba"

    $scope.reportTempate = function () {
        $ngConfirm({
            title: 'تقرير المهام',
            contentUrl: 'task-report-template.html',
            scope: $scope,
            rtl: true,
            columnClass: 'col-md-6 col-md-offset-3',
            buttons: {
                add: {
                    text: 'طباعة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
                        console.log("scope.result", scope.result)
                        if(!scope.result){
                            $scope.printReport(false);
                        }else{
                            $scope.printReport(true);
                        }
                    }
                },
                cancel: {
                    text: 'إغلاق',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                        console.log("Cancelled");
                    }
                }
            }
        });
    };

    // end "added by heba"

    $scope.exportReport = function () {
        if ($scope.selectedTask) {
            $.confirm({
                title: '',
                content: 'هل ترغب بطباعة جميع المهام المفلترة أم المهمة التي تم تحديدها فقط؟',
                buttons: {
                    printSelectedTask: {
                        text: 'طباعة المهمة فقط',
                        action: function () {
                            $scope.printReport(false);
                        }
                    },
                    printAllTasks: {
                        text: 'طباعة جميع المهام',
                        action: function () {
                            $scope.printReport(true);
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
            $scope.printReport(true);
        }

    };
    $scope.printReport = function (printAllTasks) {
        console.log("printAllTasks", printAllTasks)
        $ngConfirm({
            title: '',
            contentUrl: 'task-print-template.html',
            scope: $scope,
            rtl: true,
            columnClass: 'col-md-8 col-md-offset-3',
            onOpenBefore: function (scope) {
                scope.printAllTasks = printAllTasks;
                scope.entityl1 = '';
                scope.entityl2 = '';
                scope.entityl3 = '';
                scope.entityl4 = '';
                if ($scope.selectedFirstLevelObject) {
                    for (var x in $scope.associations) {
                        if ($scope.selectedFirstLevelObject._id === $scope.associations[x]._id) {
                            scope.entityl1 = $scope.associations[x].name;
                            if ($scope.entitiesModel.secondLevel != undefined && $scope.entitiesModel.secondLevel != '') {
                                scope.entityl2 = "| " + $scope.associations[x].children[$scope.entitiesModel.secondLevel].name;
                                if ($scope.entitiesModel.thirdLevel != undefined && $scope.entitiesModel.thirdLevel != '') {
                                    scope.entityl3 = "| " + $scope.associations[x].children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel].name;
                                    if ($scope.entitiesModel.fourthLevel != undefined && $scope.entitiesModel.fourthLevel != '') {
                                        scope.entityl4 = "| " + $scope.associations[x].children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel].children[$scope.entitiesModel.fourthLevel].name;
                                    }
                                }
                            }

                        }
                    }
                }
            },
            buttons: {
                add: {
                    text: 'طباعة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {

                        var htmlPrint = document.getElementById("printArea");
                        console.log("Parsed html");
                        console.log(htmlPrint);
                        var mywindow = window.open('', 'PRINT', 'height=400,width=600');
                        mywindow.document.write($('<div/>').append($(htmlPrint).clone()).html());
                        mywindow.document.close(); // necessary for IE >= 10
                        mywindow.focus(); // necessary for IE >= 10*/
                        console.log("To be printed");
                        console.log(mywindow.document);
                        mywindow.print();
                        mywindow.close();


                        return false;

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
    }
    $scope.calcAuto =function(){
      console.log('hi')
    }
    $scope.passed = "10%"
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
                              //  debugger;
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
