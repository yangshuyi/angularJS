'use strict';
angular.module("common.easyui").provider("easyDialogProvider", [function () {

    var defaultOptions = {
        appendTo: $('body'),
        autoOpen: true,
        closeOnEscape: false, //不支持
        destroyOnClose: true,
        closeText: 'close',
        dialogClass: '',
        draggable: true,
        dialogMinHeight: 300,
        dialogHeight: 400,
        dialogMaxHeight: 600,
        hide: '',//不支持
        dialogMinWidth: 400,
        dialogWidth: 500,
        dialogMaxWidth: 800,
        modal: true,
        position: '',//不支持
        resizable: false,//不支持
        show: false,//不支持
        title: ''
    };

    var dialogIdGenerator = 0;

    var nextDialogId = function () {
        dialogIdGenerator++;
        return 'easy-dialog_' + dialogIdGenerator;
    };

    return {
        $get: function ($templateRequest, $rootScope, $compile, $document, $q, $timeout) {
            return {
                //return as promise
                openDialog: function (templateUrl, options) {
                    options = _.assign(defaultOptions, options);
                    //var dialogOptions = angular.extend({}, options.dialogOptions);

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    var $dialogScope = null;
                    $templateRequest(templateUrl).then(function (tplContent) {
                        var template = angular.element(tplContent);
                        $dialogScope = $rootScope.$new(); //TODO: when to invoke $destroy?

                        _.forEach(options, function (n, key) {
                            $dialogScope[key] = n;
                        });
                        $dialogScope.dialogId = nextDialogId();
                        $dialogScope.dialogAPI = {};

                        var content = $compile(template)($dialogScope);
                        $(options.appendTo).append(content);

                        $timeout(function () {
                            deferred.resolve($dialogScope);
                        });
                    });

                    return promise;
                }
            };
        }
    };
}]);