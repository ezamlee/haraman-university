/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('createTaskCtrl', function ($log, $scope, $rootScope, $location, user, $timeout, $ngConfirm) {
    console.log("Welcome to tasks screen");
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
        $scope.renderPrograms($scope.filterationModel);

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

    };
    $scope.onTaskClicked = function (task) {
        $scope.selectedTask = task;
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
        if (valid) {
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
});