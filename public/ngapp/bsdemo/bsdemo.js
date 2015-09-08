angular.module('bsdemo', []);

angular.module('bsdemo').controller('bsdemoCtrl', ['$scope', 'easyDialogProvider', function ($scope, easyDialogProvider) {
    var $showEasyDialogScope = null;
    $scope.showEasyDialog = function ($event) {

        var templateUrl = 'ngapp/bsdemo/panelContent.html';
        if ($showEasyDialogScope == null) {
            easyDialogProvider.openDialog(templateUrl, {
                'title': 'Modal Dialog',
                'autoOpen': true,
                'destroyOnClose': false
            }).then(function ($dialogScope) {
                $showEasyDialogScope = $dialogScope;

                $showEasyDialogScope.dialogAPI.open();
            });
        } else {
            if ($showEasyDialogScope.dialogAPI.isOpened()) {
                $showEasyDialogScope.dialogAPI.close();
            } else {
                $showEasyDialogScope.dialogAPI.open();
            }
        }
    };

    $scope.showMultiEasyDialog = function ($event) {
        var templateUrl = 'ngapp/bsdemo/panelContent.html';
        easyDialogProvider.openDialog(templateUrl, {
            'title': 'Modal Dialog Instance',
            'autoOpen': true,
            'destroyOnClose': true
        });
    };

    //grid
    $scope.firstGridApi = {};

    $scope.firstGridColumns = [
        {
            displayName: 'Topic Id',
            field: 'topicId',
            sortable: true
        },
        {
            displayName: 'Subject',
            field: 'subject',
            sortable: true

        },
        {
            displayName: 'Type',
            field: 'type',
            sortable: true

        },
        {
            displayName: 'Date',
            field: 'date',
            sortable: false

        },
    ];


    $scope.firstGridOnLoad = function () {
        var gridDataArray = new Array(0);
        for (var i = 1; i < 100; i++) {
            var obj = {topicId: i, subject: 'subject-' + i, type: i % 5, date: new Date()};
            gridDataArray.push(obj);
        }

        $scope.firstGridData = {
            data: gridDataArray,
            pagination: {}
        };
    };
}]);