'use strict';
angular.module("common.easyui").directive("easyDialog", ['$templateCache', '$compile', function ($templateCache, $compile) {
    var defaultTmplUrl = 'template/common/easyui/Dialog.html';
    $templateCache.put(defaultTmplUrl,
        '<div ng-show="isVisible" style="{{style}};width:{{width}};height:{{height}};" class="panel panel-default" class="{{panelCls}}">' +
        '   <div ng-mousedown="headMouseDown($event)" class="panel-heading" class="{{headCls}}" style="display:flex;">' +
        '       <div style="flex:1">{{title}}</div>' +
        '       <div style="margin-left:15px;">' +
        '           <span ng-if="collapsible" ng-click="toggle()" ng-class="{true:\'glyphicon glyphicon-triangle-top\',false:\'glyphicon glyphicon-triangle-bottom\'}[collapsed]" style="cursor: pointer;"/>' +
        '           <span ng-if="closable" title="{{closeText}}" ng-click="api.close()" class="glyphicon glyphicon-remove" style="cursor: pointer;"/>' +
        '       </div>' +
        '   </div>' +
        '   <div class="panel-body" class="{{bodyCls}}" style="{{bodyStyle}};overflow: auto;" ng-show="!collapsed">' +
        '       <div ng-transclude>/' +
        '   </div>' +
        '</div>'
    );
    //
    //var defaultMaskTmplUrl = 'template/common/easyui/Dialog-Mask.html';
    //$templateCache.put(defaultTmplUrl,
    //    '<div ng-show="isVisible" style="width:{{width}};height:{{height}};" class="panel panel-default" class="{{panelCls}}">' +
    //   '</div>'
    //);

    return {
        restrict: 'EA',
        scope: {
            dialogId: '@',
            title: '@',
            header: '=', //The panel header
            isVisible: '@',
            collapsible: '=',  //Defines if to show collapsible button.
            collapsed: '=', //Defines if the panel is collapsed at initialization.
            closable: '@',
            destroyOnClose: '@',
            closeText: '@',
            enableDrag: '@',
            modal: '@',

            panelCls: '@',  //Add a CSS class to the panel.
            headCls: '@',  //Add a CSS class to the panel header.
            bodyCls: '@', //Add a CSS class to the panel body.
            bodyStyle: '@',

            minHeight: '@',
            height: '@',
            maxHeight: '@',
            minWidth: '@',
            width: '@',
            maxWidth: '@',


            api: '='
        },
        replace: false,
        transclude: true,
        controller: function ($scope, $element) {
            console.log($scope);
        },
        link: function ($scope, $element, attrs) {
            //Options
            if (!attrs.dialogId) {
                attrs.$set('dialogId', 'easy-dialog_' + (new Date()).getTime());
            }
            if (!attrs.title) {
                attrs.$set('title', '');
            }
            if (!attrs.isVisible) {
                attrs.$set('isVisible', true);
            }
            if (!attrs.collapsible) {
                attrs.$set('collapsible', false);
            }
            if (!attrs.closable) {
                attrs.$set('closable', true);
            }
            if (!attrs.closeOnEscape) {
                attrs.$set('closeOnEscape', false);
            }
            if (!attrs.destroyOnClose) {
                attrs.$set('destroyOnClose', true);
            }
            if (!attrs.closeText) {
                attrs.$set('closeText', 'close');
            }
            if (!attrs.enableDrag) {
                attrs.$set('enableDrag', true);
            }
            if (!attrs.modal) {
                attrs.$set('modal', true);
            }

            //Class
            if (!attrs.panelCls) {
                attrs.$set('panelCls', '');
            }
            if (!attrs.headCls) {
                attrs.$set('headCls', '');
            }

            if (!attrs.bodyCls) {
                attrs.$set('bodyCls', '');
            }
            if (!attrs.bodyStyle) {
                attrs.$set('bodyStyle', '');
            }

            if (!attrs.height) {
                attrs.$set('height', '300px');
            }
            if (!attrs.width) {
                attrs.$set('width', '100%');

            }

            //public method
            $scope.headMouseDown = function ($event) {
                $scope.api.setToTopLayer();

                if ($scope.enableDrag) {
                    $scope.headMouseUp();

                    $scope.dragging = true;

                    var headEle = $('.panel-heading', $element);
                    headEle.css({'cursor': 'move'});
                    //设置捕获范围
                    if (headEle.setCapture) {
                        headEle.setCapture();
                    }

                    $scope.diviation.x = $event.pageX - $element.offset().left;
                    $scope.diviation.y = $event.pageY - $element.offset().top;

                    $scope.mouseMoveHandler = $(window).bind('mousemove', function ($event) {
                        $scope.headMouseMove($event);
                    });

                    $scope.mouseUpHandler = $(window).bind('mouseup', function ($event) {
                        $scope.headMouseUp($event);
                    });
                }
            };

            $scope.headMouseMove = function ($event) {
                if ($scope.enableDrag) {
                    if (!$scope.dragging) {
                        return;
                    }
                    console.log(2);
                    $element.css('left', $event.pageX - $scope.diviation.x + 'px');
                    $element.css('top', $event.pageY - $scope.diviation.y + 'px');
                }
            };

            $scope.headMouseUp = function () {
                if ($scope.enableDrag) {
                    $scope.dragging = false;

                    var headEle = $('.panel-heading', $element);
                    headEle.css({'cursor': 'auto'});

                    if ($scope.mouseMoveHandler != null) {
                        $(window).unbind('mousemove', $scope.mouseMoveHandler);
                        $scope.mouseMoveHandler = null;
                    }
                    if ($scope.mouseUpHandler != null) {
                        $(window).unbind('mouseup', $scope.mouseUpHandler);
                        $scope.mouseUpHandler = null;
                    }

                    //取消捕获范围
                    if (headEle.releaseCapture) {
                        headEle.releaseCapture();
                    }
                }
            };

            $scope.toggle = function () {
                if ($scope.collapsed) {
                    $scope.expand();
                } else {
                    $scope.collapse();
                }
            };

            $scope.expand = function () {
                $scope.collapsed = false;
            };

            $scope.collapse = function () {
                $scope.collapsed = true;
            };

            $scope.collapseFlag = function () {
                if (typeof  $scope.collapsed === 'undefined') {
                    $scope.collapsed = false;
                }
                return $scope.collapsed;
            };

            $scope.api.open = function () {
                $scope.isVisible = true;
            };

            $scope.api.isOpened = function () {
                return $scope.isVisible;
            };

            $scope.api.close = function () {
                $scope.isVisible = false;
            };

            $scope.api.setToTopLayer = function () {
                var dialogElements = $('easy-dialog');
                if(dialogElements===0){
                    return;
                }

                var maxZIndexElement = _.max(dialogElements, function (divElement) {
                    var zIndex = parseInt(divElement.style.zIndex);
                    return isNaN(zIndex) ? 0 : zIndex;
                });

                var zIndex = parseInt(maxZIndexElement.style.zIndex);
                zIndex = (isNaN(zIndex) ? 0 : zIndex)
                if (zIndex === 0 || $(maxZIndexElement).attr('dialog-id') != $element.attr('dialog-id')) {
                    $element.css('z-index', zIndex + 1);
                }
            };

            $scope.api.setToCenter = function () {
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var dialogWidth = $element.width();
                var dialogHeight = $element.height();
                var left = (windowWidth - dialogWidth) / 2 + $(document).scrollLeft();
                var top = (windowHeight - dialogHeight) / 2 + $(document).scrollTop();

                $element.css({'left': left+'px', 'top': top + 'px'});
            };

            $element.css('position', 'absolute');
            $scope.api.setToCenter();
            $scope.maskElement = null;

            $scope.diviation = {x: 0, y: 0};
            $scope.mouseMoveHandler = null;
            $scope.mouseUpHandler = null;


            $scope.$watch('isVisible', function (newValue, oldValue) {
                if (newValue == true && $element.parent() == null) {
                    window.alert('error');
                    return;
                }

                if (newValue == true) {
                    $scope.api.setToTopLayer();
                }

                if (newValue == true && $scope.modal == true) {
                    if ($scope.maskElement == null) {
                        var maskElement = '<div style="background: rgba(0,0,0,0.4);z-index:0;position:absolute;top:0;left:0;"></div>';
                        $scope.maskElement = $(maskElement);
                    }
                    var width = $(document).outerWidth() > $(window).width() ? $(document).outerWidth() : $(document.body).width();
                    var height = $(document).outerHeight() > $(window).height() ? $(document).outerHeight() : $(window).height();
                    $scope.maskElement.width(width);
                    $scope.maskElement.height(height);

                    $('body').append($scope.maskElement);
                }
                if (newValue == false && $scope.modal == true) {
                    if ($scope.maskElement != null) {
                        $scope.maskElement.remove();
                    }
                }

                if (newValue == false && $scope.destroyOnClose == true) {
                    $element.remove();
                }
            });

        },
        templateUrl: function (element, attrs) {
            return defaultTmplUrl;
        }
    };
}]);