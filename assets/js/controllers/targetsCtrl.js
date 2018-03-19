/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('targetsCtrl', function ($log, $scope, $rootScope, $location, user, $ngConfirm) {


    // start "added by heba"

    $scope.min = 0;
    $scope.max = 100;

    $scope.result = false;
    $scope.reportForm = {
        strategic:{
            goal: true,
            projects: true,
            programs: true,
            wt: true,
            completed: true
        },
        secondary:{
            goal: true,
            projects: true,
            programs: true,
            wt: true,
            completed: true
        }
    };
    //end "added by heba"


    $scope.selectedStrategicGoalIndex = 0;
    $scope.selectedSecondaryGoalIndex = 0;
    $scope.selectedSecondaryGoal      = {};
    $scope.showSecondaryGoalsColumn = false;
    $scope.strategicGoalModel = '';
    $scope.secondaryGoalModel = '';
    $scope.relatedProjects = [];
    $scope.MainrelatedProjects = [];
    $scope.arrayOfPrograms = [];
    $scope.MainarrayOfPrograms = [];
    $scope.relatedPrograms = [];
    $scope.MainrelatedPrograms = [];
    $scope.selectedStrategicComplete = 0;


    // start "added by heba"
    $scope.reportTempate = function () {
        $ngConfirm({
            title: 'تقرير اﻷهداف اﻷستراتيجية',
            contentUrl: 'target-report-template.html',
            scope: $scope,
            rtl: true,
            columnClass: 'col-md-6 col-md-offset-3',
            buttons: {
                add: {
                    text: 'طباعة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {
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
                    }
                }
            }
        });
        
    };

    $scope.printReport = function (reportForm) {
        $ngConfirm({
            title: '',
            contentUrl: 'target-print-template.html',
            scope: $scope,
            rtl: true,
            columnClass: 'col-md-8 col-md-offset-3',
            onOpenBefore: function (scope) {
                
            },
            buttons: {
                add: {
                    text: 'طباعة',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {

                        var htmlPrint = document.getElementById("printArea");
                        var mywindow = window.open('', 'PRINT', 'height=400,width=600');
                        mywindow.document.write($('<div/>').append($(htmlPrint).clone()).html());
                        mywindow.document.close(); // necessary for IE >= 10
                        mywindow.focus(); // necessary for IE >= 10*/
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
    // end "added by heba"

    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            //debugger;
            $scope.strategicGoals = goals.sort((a,b)=> a.name.localeCompare(b.name));//objs.sort((a, b) => a.last_nom.localeCompare(b.last_nom));
            console.log("final selected Strategic Goal Index is: ",$scope.selectedStrategicGoalIndex , $scope.selectedStrategicGoal );
            $scope.selectedStrategicGoal = goals[$scope.selectedStrategicGoalIndex];
            $scope.onStrategicGoalSelected($scope.selectedStrategicGoal,$scope.selectedStrategicGoalIndex);
            
            let value = Object.values( $scope.selectedStrategicGoal.subgoals ).sort( (a,b) => a.name.localeCompare(b.name))[$scope.selectedSecondaryGoalIndex];
            if( $scope.isSecondaryGoalUpdate){
                $scope.selectedSecondaryGoalIndex = index;
                $scope.selectedSecondaryObjectKey = key;
                $scope.onSecondaryGoalSelected($scope.selectedSecondaryObjectKey,$scope.selectedSecondaryGoalIndex,value)
            }
            

        });
    };
    $scope.renderGoals();
    $scope.onStrategicGoalSelected = function (selectedGoal, index) {
        $scope.selectedStrategicComplete = 0;
        $scope.selectedStrategicGoalIndex = index;
        $scope.selectedStrategicGoal = selectedGoal;
        //$scope.subgoals = Object.values($scope.selectedStrategicGoal.subgoals);
        $scope.subgoals = Object.keys($scope.selectedStrategicGoal.subgoals).map( key => {
            return {
                "_id" : key,
                "name":$scope.selectedStrategicGoal.subgoals[key]['name'],
                "wt":$scope.selectedStrategicGoal.subgoals[key]['wt'],
                "completed":$scope.selectedStrategicGoal.subgoals[key]['completed']
            }
        }) 
        $scope.showSecondaryGoalsColumn = true;
        $scope.strategicGoalModel = selectedGoal.name;
        // (function CalcGoalCompleted(){
        // })()
        user.getPrograms({}).then( data => {
             finalData = [];
             $scope.MainarrayOfPrograms = [];
             data.map( program => {
               program.goals.map( goal => {
                  (goal.l1 && goal.l1 == selectedGoal._id) ?  finalData.push(program) : "null";
                  (goal.l1 && goal.l1 == selectedGoal._id) ?  $scope.MainarrayOfPrograms.push(program._id) : "null"
               })
             })
             return finalData
         }).then(data => {
            $scope.MainrelatedProjects = data;
         })
         user.getProjects({}).then( data => {
           finalData = [];
           data.map( Project => {$scope.MainarrayOfPrograms.includes(Project.program) ? finalData.push(Project) : "null" })
           return finalData
         }).then(data => {$scope.MainrelatedPrograms = data });

        if(!$scope.isSecondaryGoalUpdate) $scope.secondaryGoalModel = '';
        $scope.relatedProjects = [];
        $scope.arrayOfPrograms = [];
        $scope.relatedPrograms = [];
    };
    $scope.addStrategicGoal = function (valid) {
        $scope.strategicGoalModel = "";
        delete $scope.selectedStrategicGoal;

        // if (valid) {
        //     user.addGoal($scope.strategicGoalModel).then(function (resolved) {
        //         debugger;
        //         $scope.strategicGoalModel = '';
        //         $scope.secondaryGoalModel = '';
        //         $scope.renderGoals();
        //     });
        // }

    };
    $scope.deleteStrategicGoal = function () {
        $.confirm({
            title: '',
            content: 'تأكيد حذف هدف استراتيجي؟',
            buttons: {
                confirm: {
                    text: 'تأكيد',
                    action: function () {
                        user.deleteGoal($scope.selectedStrategicGoal._id).then(function (resloved) {
                            $.alert("تم حذف هدف رئيسي!");
                            $scope.showSecondaryGoalsColumn = false;
                            $scope.renderGoals();
                        });
                        $scope.strategicGoalModel = '';
                        $scope.secondaryGoalModel = '';
                    }
                },
                cancel: {
                    text: 'إلغاء',
                    action: function () {
                    }
                }

            }
        });

    };
    $scope.addSecondaryGoal = function (valid) {
        delete $scope.selectedSecondaryObjectKey;
        $scope.secondaryGoalModel = "";
        $scope.selectedSecondaryGoal = undefined;
        $scope.relatedPrograms = [];
        $scope.relatedProjects = [];
        // if (valid) {
        //     var timestampString = new Date().getTime() + '';
        //     var goalObject = angular.copy($scope.selectedStrategicGoal);
        //     goalObject.subgoals[timestampString] = {"name": $scope.secondaryGoalModel};
        //     user.updateGoal(goalObject).then(function (resolved) {
        //         debugger;
        //         $scope.strategicGoalModel = '';
        //         $scope.secondaryGoalModel = '';
        //         $scope.renderGoals();
        //     });
        // }
    };
    $scope.onSecondaryGoalSelected = function (key, index, value) {
        $scope.selectedSecondaryGoal = value;
        $scope.selectedSecondaryGoalIndex = index;
        $scope.selectedSecondaryObjectKey = key;
        $scope.secondaryGoalModel = value.name;
        
        user.getPrograms({}).then( data => {
             finalData = [];
             $scope.arrayOfPrograms = [];
             data.map( program => {
               program.goals.map( goal => {
                  (goal.l2 && goal.l2 == key) ?  finalData.push(program) : "null";
                  (goal.l2 && goal.l2 == key) ?  $scope.arrayOfPrograms.push(program._id) : "null"
               })
             })
             return finalData
         }).then(data => {
            $scope.relatedProjects = data;
         })
        user.getProjects({}).then( data => {
          finalData = [];
          data.map( Project => {$scope.arrayOfPrograms.includes(Project.program) ? finalData.push(Project) : "null" })
          return finalData
        }).then(data => {$scope.relatedPrograms = data });

    }
    $scope.deleteSecondaryGoal = function () {
        if ($scope.selectedSecondaryObjectKey) {
            $.confirm({
                title: '',
                content: 'تأكيد حذف هدف فرعي؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            var goalObject = angular.copy($scope.selectedStrategicGoal);
                            delete goalObject.subgoals[$scope.selectedSecondaryObjectKey];
                            user.updateGoal(goalObject).then(function (resolved) {
                                $.alert("تم حذف هدف فرعي بنجاح!");
                                $scope.strategicGoalModel = '';
                                $scope.secondaryGoalModel = '';
                                $scope.selectedSecondaryGoal = '';
                                $scope.renderGoals();
                            });
                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        action: function () {
                        }
                    }

                }
            });
        } else {
            $.alert("لم يتم اختيار أي هدف فرعي");
        }

    };
    $scope.editSecondaryGoal = function (valid) {

        if (valid || 1) {
            if ($scope.selectedStrategicGoal != undefined) {

                if ($scope.selectedSecondaryObjectKey != undefined) {
                    $.confirm({
                        title: '',
                        content: 'تأكيد تعديل هدف فرعي؟',
                        buttons: {
                            confirm: {
                                text: 'تأكيد',
                                action: function () {
                                    var goalObject = angular.copy($scope.selectedStrategicGoal);
                                    //goalObject.subgoals[$scope.selectedSecondaryObjectKey].name = $scope.secondaryGoalModel;
                                    
                                    let subgoals = {};
                                    $scope.subgoals.map( subGoal => {
                                        console.log(JSON.stringify(subGoal));
                                        subgoals[subGoal._id] = {
                                            "name": subGoal.name || "",
                                            "wt": subGoal.wt || 0,
                                            "completed":subGoal.completed || 0
                                        }
                                    })
                                    goalObject.subgoals  = subgoals;
                                    user.updateGoal(goalObject).then(function (resolved) {
                                        $.alert("تم تعديل هدف فرعي بنجاح!");
                                        //$scope.strategicGoalModel = '';
                                        //$scope.secondaryGoalModel = '';
                                        $scope.isSecondaryGoalUpdate = true;
                                        $scope.renderGoals();
                                    });
                                }
                            },
                            cancel: {
                                text: 'إلغاء',
                                action: function () {
                                }
                            }

                        }
                    });

                }
                else {
                    $.confirm({
                        title: '',
                        content: 'تأكيد إضافة هدف فرعي؟',
                        buttons: {
                            confirm: {
                                text: 'تأكيد',
                                action: function () {
                                    var timestampString = new Date().getTime() + '';
                                    var goalObject = angular.copy($scope.selectedStrategicGoal);
                                    goalObject.subgoals[timestampString] = { "name": $scope.secondaryGoalModel };
                                    user.updateGoal(goalObject).then(function (resolved) {
                                        $.alert("تمت إضافة هدف فرعي بنجاح!");
                                        $scope.strategicGoalModel = '';
                                        $scope.secondaryGoalModel = '';
                                        $scope.renderGoals();
                                    });
                                }
                            },
                            cancel: {
                                text: 'إلغاء',
                                action: function () {
                                }
                            }

                        }
                    });

                }

            }
            else {
                $.alert("من فضلك قم باختيار هدف استراتيجي لإضافة أو تعديل الهدف التفصيلي")
            }
        }
    };
    $scope.editStrategicGoal = function (valid) {
        if (valid || 1) {
            if ($scope.selectedStrategicGoal == undefined) {
                $.confirm({
                    title: '',
                    content: 'تأكيد إضافة هدف استراتيجي؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                user.addGoal($scope.strategicGoalModel).then(function (resolved) {
                                    $.alert("تمت إضافة هدف استراتيجي بنجاح!");
                                    $scope.strategicGoalModel = '';
                                    $scope.secondaryGoalModel = '';
                                    delete $scope.selectedSecondaryObjectKey;
                                    $scope.renderGoals();
                                });
                            }
                        },
                        cancel: {
                            text: 'إلغاء',
                            action: function () {
                            }
                        }

                    }
                });

            }
            else {
                $.confirm({
                    title: '',
                    content: 'تأكيد تعديل هدف استراتيجي؟',
                    buttons: {
                        confirm: {
                            text: 'تأكيد',
                            action: function () {
                                var goalObject = angular.copy($scope.selectedStrategicGoal);
                                goalObject.name = $scope.strategicGoalModel;
                                
                                $scope.tempStrategicID = goalObject._id;
                                user.updateGoal(goalObject).then(function (resolved) {
                                    $.alert("تم تعديل هدف استراتيجي بنجاح!");
                                    //$scope.strategicGoalModel = '';
                                    //$scope.secondaryGoalModel = '';
                                    $scope.isSecondaryGoalUpdate = false;
                                    $scope.renderGoals();
                                });
                            }
                        },
                        cancel: {
                            text: 'إلغاء',
                            action: function () {
                            }
                        }

                    }
                });

            }
        }

    };
})
.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput > 100) {
                        transformedInput = 100
                        return transformedInput;
                    }

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
