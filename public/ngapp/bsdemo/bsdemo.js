angular.module('bsdemo', []);

angular.module('bsdemo').controller('bsdemoCtrl', ['$scope','easyDialogProvider', function ($scope, easyDialogProvider) {
    var $showEasyDialogScope = null;
    $scope.showEasyDialog = function($event){

        var templateUrl = 'ngapp/bsdemo/panelContent.html';
        if($showEasyDialogScope==null) {
            easyDialogProvider.openDialog(templateUrl, {'title': 'Modal Dialog', 'autoOpen': false, 'destroyOnClose':false}).then(function($dialogScope){
                $showEasyDialogScope = $dialogScope;
                $showEasyDialogScope.open();
            });
        }



    }
}]);