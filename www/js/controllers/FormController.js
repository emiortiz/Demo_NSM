"user strict";

angular.module('NacionSegurosApp')

    .controller('FormController', FormController);

HomeController.$inject = ['$scope', '$rootScope'];

function FormController($scope, $rootScope) {
    $rootScope.dataSeguros = {
        planFamiliar:null,
        planAccidentes: null,
        planCompra: null,
        CompraCuota: '1500',
        carteraCuota: '2000',
        cajeroCuota: '1700',
        prevFamiliarCuota:'2000'
    };
    

}