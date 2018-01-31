/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('addGoals', function ($log, $scope, $rootScope, $location, user) {
    $log.debug("goals ctrl");
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {

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

});