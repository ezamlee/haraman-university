/**
 * Created by Khalid on 11/2/2017.
 */
app.controller('createProjectCtrl', function ($log, $scope, $rootScope, $location, user, $timeout,$ngConfirm) {

    console.log("Welcome to project screen");
    $scope.goalsModel = {};
    $scope.entitiesModel = {};
    $scope.projectObject = {};
    $scope.projectObject.stages = [];
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
    //$scope.selectedEntitiesArray=[];

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
        $scope.renderPrograms($scope.filterationModel);

    };
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            //debugger;
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
                //debugger;
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
        if ($scope.programId != undefined) {
            if ($scope.programId === "") {
                $scope.renderProjects();
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
    $scope.setProjectObject = function (object) {
        $scope.projectObject._id = object._id;
        $scope.projectObject.name = object.name;
        $scope.projectObject.program = object.program;
        $scope.projectObject.manager = object.manager;
        $scope.projectObject.active = object.active ? "true" : "false";
        $scope.projectObject.approxCost = object.approxCost;
        $scope.projectObject.datePlannedStart = new Date(object.datePlannedStart);
        $scope.projectObject.datePlannedEnd = new Date(object.datePlannedEnd);
        $scope.projectObject.dateActualStart = new Date(object.dateActualStart);
        $scope.projectObject.dateActualEnd = new Date(object.dateActualEnd);
        // internalTeamSelect.val(object.teamInt).trigger('change');
        // externalTeamSelect.val(object.teamExt).trigger('change');
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
        $scope.projectObject.description = object.description;
        if(object.outputs)
          $scope.projectObject.outputs = object.outputs[0] || null;
        $scope.projectObject.stages = object.stages;
        $scope.projectObject.wt = object.wt;
        $scope.projectObject.completed = object.completed;
        $scope.projectObject.quality = object.quality;
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
    $scope.onProjectClicked = function (project) {
        console.log(project)
        $scope.selectedProject = project;
        $scope.projectObject = project;
        $scope.projectObject = $scope.selectedProject;
        $log.debug("Clicked project");
        $log.debug(project);
        $scope.setProjectObject($scope.selectedProject);

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
    $scope.deleteProject = function () {
        if($scope.selectedProject){
        $.confirm({
            title: '',
            content: 'تأكيد حذف المشروع؟',
            buttons: {
                confirm:{
                    text: 'تأكيد',
                    action: function(){
                        user.deleteProject($scope.selectedProject._id).then(function (resolved) {
                            $scope.projectObject = {};
                            delete $scope.selectedProject;
                            // internalTeamSelect.val([]).trigger('change');
                            // externalTeamSelect.val([]).trigger('change');
                            $scope.internalTeamArr = [];
                            $scope.externalTeamArr = [];
                            $scope.filterProjects();
                            $.alert("تم حذف المشروع بنجاح")
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
          $.alert("لم يتم اختيار أي مشروع");
      }

      };
    $scope.addNewProject = function (newProjectObject, valid, form) {
        $scope.projectObject = {};
        $scope.projectObject.stages = [];
        $scope.projectObject.outputs = [];
        delete $scope.selectedProject;
        delete $scope.selectedProjectStage;
        // internalTeamSelect.val([]).trigger('change');
        // externalTeamSelect.val([]).trigger('change');
        $scope.internalTeamArr = [];
        $scope.externalTeamArr = [];
        $scope.indicatorName = "";
        $scope.goalValue = "";
        $scope.actualValue = "";
        $scope.stageName = "";
        $scope.outputName = "";
        // if (valid) {
        //     var submittedForm = angular.copy(newProjectObject);
        //     submittedForm._id = new Date().getTime() + '';
        //     submittedForm.manager = newProjectObject.manager ? newProjectObject.manager : "";
        //     submittedForm.approxCost = newProjectObject.approxCost ? newProjectObject.approxCost : 0;
        //     submittedForm.teamInt = newProjectObject.teamInt ? newProjectObject.teamInt : [];
        //     submittedForm.teamExt = newProjectObject.teamExt ? newProjectObject.teamExt : [];
        //     submittedForm.description = newProjectObject.description ? newProjectObject.description : "";
        //     submittedForm.stages = newProjectObject.stages ? newProjectObject.stages : [];
        //     submittedForm.datePlannedStart = $rootScope.formatDate(newProjectObject.datePlannedStart);
        //     submittedForm.datePlannedEnd = $rootScope.formatDate(newProjectObject.datePlannedEnd);
        //     submittedForm.dateActualStart = $rootScope.formatDate(newProjectObject.dateActualStart);
        //     submittedForm.dateActualEnd = $rootScope.formatDate(newProjectObject.dateActualEnd);
        //     submittedForm.active = newProjectObject.active === "true";
        //     submittedForm.outputs = [];
        //     submittedForm.outputs[0] = newProjectObject.outputs ? newProjectObject.outputs : "";
        //     $log.debug("Submit program form");
        //     $log.debug(submittedForm);
        //     user.addProject(submittedForm).then(function (resolved) {
        //         $scope.renderProjects();
        //     });
        // }
        // else {
        //     window.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        // }
    };
    $scope.initializeProjectForm = function (projectObject) {
        var submittedForm = angular.copy(projectObject);
        submittedForm.manager = projectObject.manager ? projectObject.manager : "";
        submittedForm.approxCost = projectObject.approxCost ? projectObject.approxCost : 0;
        // submittedForm.teamInt = projectObject.teamInt ? projectObject.teamInt : [];
        // submittedForm.teamExt = projectObject.teamExt ? projectObject.teamExt : [];
        submittedForm.teamInt = [];
        for (var index3 in $scope.internalTeamArr) {
            submittedForm.teamInt[index3] = $scope.internalTeamArr[index3]._id;
        }
        submittedForm.teamExt = [];
        for (var index4 in $scope.externalTeamArr) {
            submittedForm.teamExt[index4] = $scope.externalTeamArr[index4]._id;
        }
        console.log($scope.selectedEntitiesArray)
        submittedForm.entities = convert(serialize($scope.selectedEntitiesArray));
        submittedForm.description = projectObject.description ? projectObject.description : "";
        submittedForm.stages = projectObject.stages ? projectObject.stages : [];
        submittedForm.datePlannedStart = $rootScope.formatDate(projectObject.datePlannedStart);
        submittedForm.datePlannedEnd = $rootScope.formatDate(projectObject.datePlannedEnd);
        submittedForm.dateActualStart = $rootScope.formatDate(projectObject.dateActualStart);
        submittedForm.dateActualEnd = $rootScope.formatDate(projectObject.dateActualEnd);
        submittedForm.active = projectObject.active === "true";
        submittedForm.outputs = [];
        submittedForm.outputs[0] = projectObject.outputs ? projectObject.outputs : "";
        return submittedForm;
    };
    $scope.editProject = function (projectObject, valid) {
        console.log("from editProject: ProjectObject is: " , projectObject)
        if (valid || 1) {
            if ($scope.selectedProject == undefined) {
                $.confirm({
                    title: '',
                    content: 'تأكيد إضافة مشروع؟',
                    buttons: {
                        confirm:{
                            text: 'تأكيد',
                            action: function(){
                                var submittedForm = $scope.initializeProjectForm(projectObject);
                                submittedForm._id = new Date().getTime() + '';
                                 $log.debug("Submit program form");
                                 $log.debug(submittedForm);
                                 user.addProject(submittedForm).then(function (resolved) {
                                     $scope.filterProjects();
                                     $.alert("تمت إضافة مشروع بنجاح!");
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
                    content: 'تأكيد تعديل مشروع؟',
                    buttons: {
                        confirm:{
                            text: 'تأكيد',
                            action: function(){
                                var submittedForm = $scope.initializeProjectForm(projectObject);
                                submittedForm._id = $scope.selectedProject._id;
                                $log.debug("Submit program form");
                                $log.debug(submittedForm);
                                user.editProject(submittedForm).then(function (resolved) {
                                    $scope.filterProjects();
                                    $.alert("تم تعديل المشروع بنجاح!");
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
        else {
            $.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        }

    };
    // var internalTeamSelect = $("#sel1");
    // internalTeamSelect.select2();
    // internalTeamSelect.change(function () {
    //     $scope.projectObject.teamInt = internalTeamSelect.val();
    // });
    // var externalTeamSelect = $("#sel2");
    // externalTeamSelect.select2();
    // externalTeamSelect.change(function () {
    //     $scope.projectObject.teamExt = externalTeamSelect.val();
    // });
    $scope.internalTeamArr = [];
    $scope.externalTeamArr = [];
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
    $scope.setStageModel = function () {
        $scope.stageModel = {
            "name": '',
            "outputs": [],
            "indices": []
        };
    };
    $scope.onProgramStageSelected = function (stage, index) {
        $scope.selectedProjectStage = stage;
        $scope.selectedProjectStageIndex = index;
        $scope.stageName = stage.name;
    };
    $scope.addProjectStage = function () {
        delete $scope.selectedProjectStage;
        delete $scope.selectedProjectStageIndex;
        $scope.stageName = "";
    };
    $scope.editProjectStage = function () {
        if ($scope.selectedProjectStage == undefined) {
            $scope.setStageModel();
            var newStage = $scope.stageModel;
            newStage.name = $scope.stageName;
            $scope.projectObject.stages.push(newStage);
            $scope.onProgramStageSelected($scope.projectObject.stages[$scope.projectObject.stages.length - 1], $scope.projectObject.stages.length - 1);
        }
        else {
            $scope.projectObject.stages[$scope.selectedProjectStageIndex].name = $scope.stageName;
            $scope.stageName = "";
        }

    };
    $scope.deleteProjectStage = function () {
        if ($scope.selectedProjectStageIndex != undefined) {
            $scope.projectObject.stages.splice($scope.selectedProjectStageIndex, 1);
            $scope.stageName = "";
        }

    };
    $scope.addOutput = function () {
        $scope.outputName = "";
        delete $scope.selectedProjectStageOutput;
        delete $scope.selectedProjectStageOutputIndex;

    };
    $scope.onProgramStageOutputSelected = function (output, index) {
        $scope.selectedProjectStageOutput = output;
        $scope.selectedProjectStageOutputIndex = index;
        $scope.outputName = output.name;
    };
    $scope.deleteProjectStageOutput = function () {
        if ($scope.selectedProjectStageOutputIndex != undefined) {
            $scope.selectedProjectStage.outputs.splice($scope.selectedProjectStageOutputIndex, 1);
            $scope.outputName = "";
        }
    };
    $scope.editProjectStageOutput = function () {
        if ($scope.selectedProjectStageOutput == undefined) {
            var newOutput = {
                "name": $scope.outputName
            };
            $scope.selectedProjectStage.outputs.push(newOutput);
            $scope.outputName = "";
        }
        else {
            $scope.selectedProjectStage.outputs[$scope.selectedProjectStageOutputIndex].name = $scope.outputName;
            $scope.outputName = "";
        }
    };
    $scope.onIndicatorSelected = function (indicator, index) {
        $scope.selectedIndicator = indicator;
        $scope.selectedIndicatorIndex = index;
        $scope.indicatorName = indicator.name;
        $scope.goalValue = indicator.goal;
        $scope.actualValue = indicator.actual;
    };
    $scope.addIndicator = function () {
        $scope.indicatorName = "";
        $scope.goalValue = "";
        $scope.actualValue = "";
        delete $scope.selectedIndicator;
        delete $scope.selectedIndicatorIndex;
    };
    $scope.editIndicator = function () {
        if ($scope.selectedIndicator == undefined) {
            var newIndicator = {
                "name": $scope.indicatorName,
                "goal": $scope.goalValue,
                "actual": $scope.actualValue
            };
            $scope.selectedProjectStage.indices.push(newIndicator);
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";

        }
        else {
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].name = $scope.indicatorName;
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].goal = $scope.goalValue;
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].actual = $scope.actualValue;
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";
        }
    };
    $scope.deleteIndicator = function () {
        if ($scope.selectedIndicatorIndex != undefined) {
            $scope.selectedProjectStage.indices.splice($scope.selectedIndicatorIndex, 1);
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";
        }
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

    // start team modal "added by heba"
    $scope.addTeamToProject = function () {
        $ngConfirm({
            title: 'إضافة فريق العمل',
            contentUrl: 'add-project-team-template.html',
            scope: $scope,
            rtl: true,
            buttons: {
                
                cancel: {
                    text: 'إغلاق',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                    }
                },
            }
        });
    };
    // end team modal "added by heba"
    
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
