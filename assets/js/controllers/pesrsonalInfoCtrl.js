/**
 * Created by Khalid on 10/30/2017.
 */

app.controller('personalInfoScreenCtrl', function ($log, $scope, $rootScope) {

    //console.log("Welcome to personal info screen");
    $scope.selectedTask = false;
    $scope.showAddTaskForm = false;
    $scope.selectedPersonalTaskIndex = 0;
    $scope.taskFormObject = {};
    $scope.personalTasks = [{
        "title": "إعداد مذكرة التفاهم الخاصة بآليات التطوير",
        "isDone": true,
        "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
    }, {
        "title": "إعداد مذكرة التفاهم الخاصة بآليات التطوير",
        "isDone": false,
        "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
    }, {
        "title": "إعداد مذكرة التفاهم الخاصة بآليات التطوير",
        "isDone": false,
        "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
    }, {
        "title": "إعداد مذكرة التفاهم الخاصة بآليات التطوير",
        "isDone": true,
        "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
    }];

    $scope.onTaskSelected = function (task, index) {
        $scope.showAddTaskForm = false;
        $scope.selectedTaskTitle = task.title;
        $scope.selectedTaskDesc = task.description;
        $scope.selectedTask = true;
        $scope.selectedPersonalTaskIndex = index;

    };
    $scope.addTask = function () {
        $scope.selectedTask = false;
        $scope.showAddTaskForm = true;

    };
    $scope.submitAddTaskForm = function (validation, formData) {
        if (validation) {
            var newTask = {
                "title": formData.title,
                "isDone": false,
                "description": formData.desc
            };
            $scope.personalTasks.push(newTask);
        }
    };
    $scope.markAsDone = function () {
        $scope.showAddTaskForm = false;
        $scope.personalTasks[$scope.selectedPersonalTaskIndex].isDone = true;
    };
    $scope.deleteTask = function () {
        $scope.showAddTaskForm = false;
        $scope.selectedTask = false;
        $scope.personalTasks.splice($scope.selectedPersonalTaskIndex, 1);
    };
    /*----------------------------messages control --------------------*/
    $scope.selectedMessageIndex = 0;
    $scope.showMessageDetails = false;
    $scope.messages = [
        {
            "title": "بخصوص اجتماع لجنة التطوير",
            "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
        },
        {
            "title": "محضر اجتماع اللجنة",
            "description": "اجتماع آخر"
        }
    ];
    $scope.deleteMessage = function () {
        $scope.showMessageDetails = false;
        $scope.messages.splice($scope.selectedMessageIndex, 1);
    };
    $scope.onMessageSelected = function (message, index) {
        $scope.showMessageDetails = true;
        $scope.selectedMessageIndex = index;
        $scope.messageTitle = message.title;
        $scope.messageDescription = message.description;
    };
    /*----------------------------projects and tasks control --------------------*/
    $scope.tasks = [
        {
            "title": "مهمة 1",
            "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
        },
        {
            "title": "مهمة2",
            "description": "اجتماع آخر"
        },
        {
            "title": "مهمة 3",
            "description": "اجتماع آخر"
        }
    ];
    $scope.projects = [
        {
            "title": "مشروع 1",
            "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
        },
        {
            "title": "مشروع 2",
            "description": "اجتماع آخر"
        }
    ];

});