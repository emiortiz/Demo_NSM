"user strict";

angular.module('NacionSegurosApp')

    .controller('RequestSentController', RequestSentController);

RequestSentController.$inject = [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$cordovaToast',
    '$cordovaFile',
    '$cordovaFileOpener2',
    '$ionicHistory',
    '$ionicLoading',
    'generatePDFService'
];

function RequestSentController(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $cordovaToast,
    $cordovaFile,
    $cordovaFileOpener2,
    $ionicHistory,
    $ionicLoading,
    generatePDFService
) {
    if (ionic.Platform.isAndroid()) {
        var path = cordova.file.externalCacheDirectory;
    } else if (ionic.Platform.isIOS()) {
        var path = cordova.file.documentsDirectory;
    }

    $scope.form = {
        pinNumber: ''
    };
    
    var clean = function (){
        for(var i = 0; i < $rootScope.products.length ; i++) {
            $rootScope.products[i].value = false;
        }
    };

    $scope.showRequestSigned = function () {
        $cordovaFileOpener2.open (path + 'formulario.pdf', 'application/pdf');
    };

     $scope.showSuccessMessage = function () {
         if ($scope.form.pinNumber.length == 4) {
             if (ionic.Platform.isAndroid()) {
                 $cordovaToast.showShortBottom('La solicitud ha sido ingresada correctamente.');
             }

             $cordovaFile.removeFile(path, 'formulario.pdf' );
             $ionicHistory.nextViewOptions({
                 disableBack: true
             });

             clean();
             $state.go('app.products',{type: 'cards'});

         } else {
             if (ionic.Platform.isAndroid()) {
                 $cordovaToast.showShortBottom('El código PIN debe ser de 4 dígitos!');
             }
         }
     };

     

}
