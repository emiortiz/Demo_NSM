"user strict";

angular.module('NacionSegurosApp')

    .controller('ScannerController', ScannerController);

HomeController.$inject = [
    '$scope',
    '$rootScope',
    '$state',
    '$cordovaCamera',
    '$cordovaToast',
    '$cordovaFile',
    '$cordovaBarcodeScanner',
    '$ionicLoading',
    '$ionicHistory',
    'RequestsService',
    'ProcessDniInfoService',
    'ThubanConfigService',
    'generatePDFService'
];

function ScannerController(
    $scope,
    $rootScope,
    $state,
    $cordovaCamera,
    $cordovaToast,
    $cordovaFile,
    $cordovaBarcodeScanner,
    $ionicLoading,
    $ionicHistory,
    RequestsService,
    ProcessDniInfoService,
    ThubanConfigService,
    generatePDFService) {
    $scope.form = {
        dni: null,
        address: '',
        email: '',
    }

    $scope.showDniImage = false;
    $scope.showDataForm = false;

    var dniImage = null;


    document.addEventListener('deviceready', function () {

        var cameraOptions = {
            encodingType: Camera.EncodingType.PNG,
            quality: 100,
            targetWidth: 750,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: false
        };

        $rootScope.dataUsuario = $scope.form;

        $scope.takePicture = function () {
            $cordovaCamera.getPicture(cameraOptions)
                .then(function (imageData) {

                    $rootScope.dniImage = imageData;
                    $scope.showDniImage = true;
                    var image = document.getElementById('dni-image');
                    image.src = 'data:image/png;base64,' + imageData;

                }, function (err) {
                    console.log(err);
                    if (ionic.Platform.isAndroid()) {
                        $cordovaToast.showShortBottom('No se pudo tomar la foto. Intentelo de nuevo.');
                    }
                });
        };

        $scope.scanDni = function () {
            var config = {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: false, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: false, // Android, save scan history (default false)
                prompt: "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: true // iOS and Android
            }

            document.addEventListener("deviceready", function () {
                $cordovaBarcodeScanner.scan(config)
                    .then(function (result) {
                        var dataSplit = result.text.split('@');
                        $scope.form.dni = ProcessDniInfoService.getInfo(dataSplit);
                        $scope.showDataForm = true;
                    })
                    .catch(function (error) {
                        console.error(error);
                        if (ionic.Platform.isAndroid()) {
                            $cordovaToast.showShortBottom(error);
                        }
                    });
            });
        };



        $scope.proxima = function () {
            if ($scope.showDniImage) {

                if ($scope.showDataForm) {

                    /* $ionicLoading.show({
                        content: 'Loading',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                     RequestsService.newRequest($scope.form)
                    .then(function(docId) {
                        fileId = docId;
                        
                        var docData = {
                            nroSolicitud: docId,
                            dni: $scope.form.dni.dniNumber,
                            name: $scope.form.dni.name,
                            lastName: $scope.form.dni.lastName
                        };
 
                        return RequestsService.newIdentificationDocument(docData, dniImage, encodingType);
                    }).then(function(success) {
                        return RequestsService.getRequestFile(fileId);
                    }).then(function(file) {
                        if(ionic.Platform.isAndroid()) {
                            return $cordovaFile.writeFile(cordova.file.externalDataDirectory, fileId + '.pdf', file, true);
                        } else if(ionic.Platform.isIOS()) {
                            return $cordovaFile.writeFile(cordova.file.documentsDirectory, fileId + '.pdf', file, true);
                        }
                    }).then(function(success) {
                        if(ionic.Platform.isAndroid()) {
                            $cordovaToast.showShortBottom('Sus datos fueron enviados correctamente!');
                        }
 
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
 
                        $state.go('app.viewRequest', {type: product.category, itemId: product.id, fileName: fileId});
                    })
                    .catch(function(error) {
                        console.error(error);
                        if(ionic.Platform.isAndroid()) {
                            $cordovaToast.showShortBottom('Sus datos no fueron enviados correctamente. Intente de nuevo por favor!');
                        }
                    })
                    .finally(function() {
                        $ionicLoading.hide();
                    }); */
                    $rootScope.dataCliente = $scope.form;
                    $state.go('app.viewRequest');
                   

                } else {
                    if (ionic.Platform.isAndroid()) {
                        $cordovaToast.showShortBottom('Realice un scan de su DNI por favor.');
                    }
                }
            } else {
                if (ionic.Platform.isAndroid()) {
                    $cordovaToast.showShortBottom('Tome una foto de su DNI por favor.');
                }
            }
            
        };


        $scope.clearDniImage = function () {
            $scope.showDniImage = false;
            var image = document.getElementById('dni-image');
            image.src = '';
            dniImage = null;
        };

        $scope.clearDataForm = function () {
            $scope.showDataForm = false;
            $scope.form = {
                dni: {
                    lastName: null,
                    name: null,
                    gender: null,
                    birthDate: null,
                    number: null,
                },
                address: null,
                email: null,
            }
        };
    }, false);
}