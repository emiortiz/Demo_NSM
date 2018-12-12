"user strict";

angular.module('NacionSegurosApp')

.controller('ProductsController', ProductsController);

ProductsController.$inject = ['$scope', 'products', '$rootScope'];

function ProductsController($scope, products, $rootScope) {
    $rootScope.products = products;
    
}
