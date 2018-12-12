"user strict";

angular.module('NacionSegurosApp')

.directive('hasSubmenu', hasSubmenu);

hasSubmenu.$inject = ['$stateParams', '$rootScope'];

function hasSubmenu($stateParams, $rootScope) {
    var directive = {
        link: link,
        scope: true,
        restrict: 'A'
    };

    return directive;

    function link (scope, element, attrs) {

        element.on('click', function(e) {
            if(e.target.className != 'relative-parent')
                return true;
            element.toggleClass('open');
        });
    }
}
