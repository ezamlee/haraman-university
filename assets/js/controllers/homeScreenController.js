/**
 * Created by Khalid on 10/21/2017.
 */
app.controller('homeScreenController', function ($log, $scope, $rootScope, $location, connector, user) {
    console.log("Welcome to home screen");

    //connector.send(null, 'posts', 'GET').then(function (resolved) {
    //    console.log("Resolved to controller");
    //    console.log(resolved);
    //});
    $scope.editEnabled = false;
    $scope.enableEdit = function () {
        $scope.editEnabled = true;
    };
    $scope.disableEdit = function () {
        $scope.editEnabled = false;
    };
    $scope.updateContents = function () {
        $.confirm({
            title: '',
            content: 'تأكيد تغيير محتوى الرسالة والرؤية والقيم؟',
            buttons: {
                confirm:{
                    text: 'تأكيد',
                    action: function(){
                        user.updateHomeContents($scope.message, $scope.vision, $scope.principles).then(function (resolved) {
                            $.alert("ثم التحديث بنجاح");
                            $scope.editEnabled = false;
                
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
      
    };
    $scope.getContents = function () {
        debugger;
        user.getHomeContents().then(function (resolved) {
            for (var index in resolved) {
                if (resolved[index]._id == "homeContents") {
                    $scope.message = resolved[index].data.message;
                    $scope.vision = resolved[index].data.vision;
                    $scope.principles = resolved[index].data.principles;
                }
            }
        });
    };
    $scope.getContents();

});