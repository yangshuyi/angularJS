angular.module('bsdemo', []);

angular.module('bsdemo').controller('bsdemoCtrl', ['$scope','easyDialogProvider', function ($scope, easyDialogProvider) {
    var $showEasyDialogScope = null;
    $scope.showEasyDialog = function($event){

        var templateUrl = 'ngapp/bsdemo/panelContent.html';
        if($showEasyDialogScope==null) {
            easyDialogProvider.openDialog(templateUrl, {'title': 'Modal Dialog', 'autoOpen': true, 'destroyOnClose':false}).then(function($dialogScope){
                $showEasyDialogScope = $dialogScope;

                $showEasyDialogScope.dialogAPI.open();
            });
        }else{
            //if($showEasyDialogScope.dialogAPI.isOpened()){
            //    $showEasyDialogScope.dialogAPI.close();
            //}else{
            //    $showEasyDialogScope.dialogAPI.open();
            //}
        }




    };

    $scope.showMultiEasyDialog = function($event){

        var templateUrl = 'ngapp/bsdemo/panelContent.html';
        easyDialogProvider.openDialog(templateUrl, {'title': 'Modal Dialog Instance', 'autoOpen': true, 'destroyOnClose':true});

    };
}]);