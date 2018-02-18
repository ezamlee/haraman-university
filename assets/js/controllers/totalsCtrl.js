/**
 * Created by Heba.
 */
app.controller('totalsCtrl', function ($log, $scope, $rootScope, $location, user, $timeout) {

	$scope.completedGoals = 0;
	$scope.completedPrograms = 0;

	$scope.renderGoals = function () {
		console.log("hello from totalsCtrl");
        user.getGoals().then(function (goals) {
            //debugger;
            $scope.strategicGoals = goals;

            $scope.completedGoal = 0;
            if (goals) {
                for (var i in goals) {
                	if (goals[i].wt == undefined || goals[i].wt == NaN) { goals[i].wt = 0; }
                	if (goals[i].completed == undefined || goals[i].completed == NaN) {goals[i].completed = 0}
                	
                	$scope.goalprogramWT = goals[i].wt /100;
                	$scope.goalprogramCompleted = goals[i].completed /100;
                	$scope.completedGoal += $scope.goalprogramWT * $scope.goalprogramCompleted;
                }

                $scope.completedGoals = $scope.completedGoal * 100;
            }
        });
    };
    $scope.renderGoals();

    $scope.renderPrograms = function (filter) {
        user.getPrograms(filter).then(function (resolved) {
            console.log("programs", resolved);

            // $timeout(function () {
                $scope.programs = resolved;
                // $scope.$apply();
            // });
            $scope.completedProgram = 0;
            if (resolved) {
                for (var i in resolved) {
                	if (resolved[i].wt == undefined || resolved[i].wt == NaN) { resolved[i].wt = 0; }
                	if (resolved[i].completed == undefined || resolved[i].completed == NaN) {resolved[i].completed = 0}
                	if (resolved[i].quality == undefined || resolved[i].quality == NaN) {resolved[i].quality = 0}
                	
                	$scope.programWT = resolved[i].wt /100;
                	$scope.programCompleted = resolved[i].completed /100;
                	$scope.completedProgram += $scope.programWT * $scope.programCompleted;
                }

                $scope.completedPrograms = $scope.completedProgram * 100;
            }


        });
    };
    $scope.renderPrograms();
});