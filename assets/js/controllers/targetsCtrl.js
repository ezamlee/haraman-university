/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('targetsCtrl', function ($log, $scope, $rootScope, $location, user) {

    console.log("Welcome to targetsCtrl");
    $scope.selectedStrategicGoalIndex = 0;
    $scope.selectedSecondaryGoalIndex = 0;
    $scope.showSecondaryGoalsColumn = false;
    $scope.strategicGoalModel = '';
    $scope.secondaryGoalModel = '';
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            //debugger;
            $scope.strategicGoals = goals;
            $scope.selectedStrategicGoal = goals[$scope.selectedStrategicGoalIndex];

        });
    };
    $scope.renderGoals();
    $scope.onStrategicGoalSelected = function (selectedGoal, index) {
        $scope.selectedStrategicGoalIndex = index;
        $scope.selectedStrategicGoal = selectedGoal;
        $scope.showSecondaryGoalsColumn = true;
        $scope.strategicGoalModel = selectedGoal.name;
        $scope.secondaryGoalModel = '';
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
                        console.log("Cancelled");
                    }
                }

            }
        });
     
    };
    $scope.addSecondaryGoal = function (valid) {
        delete $scope.selectedSecondaryObjectKey;
        $scope.secondaryGoalModel = "";
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
        $scope.selectedSecondaryGoalIndex = index;
        $scope.secondaryGoalModel = value.name;
        $scope.selectedSecondaryObjectKey = key;
    };
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
                                $scope.renderGoals();
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
            $.alert("لم يتم اختيار أي هدف فرعي");
        }

    };
    $scope.editSecondaryGoal = function (valid) {
        if (valid) {
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
                                    goalObject.subgoals[$scope.selectedSecondaryObjectKey].name = $scope.secondaryGoalModel;
                                    debugger;
                                    user.updateGoal(goalObject).then(function (resolved) {
                                        $.alert("تم تعديل هدف فرعي بنجاح!");
                                        $scope.strategicGoalModel = '';
                                        $scope.secondaryGoalModel = '';
                                        $scope.renderGoals();
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
                                    console.log("Cancelled");
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
        if (valid) {
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
                                console.log("Cancelled");
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
                                user.updateGoal(goalObject).then(function (resolved) {
                                    $.alert("تم تعديل هدف استراتيجي بنجاح!");
                                    $scope.strategicGoalModel = '';
                                    $scope.secondaryGoalModel = '';
                                    $scope.renderGoals();
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

    };
});