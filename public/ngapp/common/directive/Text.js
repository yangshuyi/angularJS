angular.module('common').directive('text'), function(){
    return {
        scope:{
            value:'='
        },
        link:function(scope, elem, attrs, ngModel){

        },
        template:'<input type="text" value="{{value}}">'


    }
}