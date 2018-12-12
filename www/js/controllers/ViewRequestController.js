"user strict";

angular.module('NacionSegurosApp')

    .controller('ViewRequestController', ViewRequestController);

ViewRequestController.$inject = [
    '$q',
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    '$ionicModal',
    '$ionicLoading',
    '$cordovaToast',
    '$cordovaFile',
    '$cordovaFileOpener2',
    'RequestsService',
    'ThubanMainServices',
    'generatePDFService',
    'DocumentServices',
    'DatesService'
];

function ViewRequestController(
    $q,
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $ionicHistory,
    $ionicModal,
    $ionicLoading,
    $cordovaToast,
    $cordovaFile,
    $cordovaFileOpener2,
    RequestsService,
    ThubanMainServices,
    generatePDFService,
    DocumentServices,
    DatesService
) {

    if (ionic.Platform.isAndroid()) {
        var path = cordova.file.externalDataDirectory;
    } else if (ionic.Platform.isIOS()) {
        var path = cordova.file.documentsDirectory;
    }
    //sacar el 0 hacer una funcion generica
    $rootScope.dateNow = DatesService.getNowDate();
    //fecha inversa
    $scope.dateInverse = DatesService.getThubanDate();
    //params de thuban

    var fields = [
        { key: 'NRO_SOLICITUD', value: '', dataType: 'string' },
        { key: 'N_DOCUMENTO', value: $rootScope.dataCliente.dni.dniNumber, dataType: 'string' },
        { key: 'D_APELLIDO', value: $rootScope.dataCliente.dni.lastName, dataType: 'string' },
        { key: 'D_NOMBRE', value: $rootScope.dataCliente.dni.name, dataType: 'string' },
        { key: 'D_SEXO', value: $rootScope.dataCliente.dni.gender, dataType: 'string' },
        { key: 'F_NACIMIENTO', value: $rootScope.dataCliente.dni.birthDate, dataType: 'string' },
        { key: 'F_SOLICITUD', value: $scope.dateInverse, dataType: 'date' },
        { key: 'ESTADO', value: 'OBSERVAR', dataType: 'string' },
        { key: 'D_EMAIL', value: $rootScope.dataCliente.email, dataType: 'string' },
        { key: 'D_DIRECCION', value: $rootScope.dataCliente.address, dataType: 'string' },
        { key: 'B_PFAMILIAR', value: $rootScope.products[0].value, dataType: 'bool' },
        { key: 'B_PCAJERO', value: $rootScope.products[1].value, dataType: 'bool' },
        { key: 'N_CCAJERO', value: $rootScope.dataSeguros.cajeroCuota, dataType: 'decimal' },
        { key: 'B_PCARTERA', value: $rootScope.products[2].value, dataType: 'bool' },
        { key: 'N_CCARTERA', value: $rootScope.dataSeguros.carteraCuota, dataType: 'decimal' },
        { key: 'B_PCOMPRA', value: $rootScope.products[3].value, dataType: 'bool' },
        { key: 'N_TIPOCOMPRA', value: $rootScope.dataSeguros.CompraCuota, dataType: 'decimal' },
        { key: 'B_PTECNOLOGIA', value: $rootScope.products[4].value, dataType: 'bool' },
        { key: 'B_PACCPERSONAL', value: $rootScope.products[5].value, dataType: 'bool' },
        { key: 'B_PPREVFAMILIAR', value: $rootScope.products[6].value, dataType: 'bool' },
        { key: 'N_CPREVFAMILIAR', value: $rootScope.dataSeguros.prevFamiliarCuota, dataType: 'decimal' }

    ];
    var token = 'xOir4xDkMmuVpK4FxLvpm2chgShjKSIwksNUxJpjE9s%3D';
    var params = {
        tokenAuthentication: token,
        documentClass: 'NS_SOLICITUD',
        fields: fields,
        resource: {
            extension: "pdf",
            stream: ""
        }
    }
    //token del admin para thuban


    //datos para enviar a generarPDFservice

    $scope.data = {
        name: $rootScope.dataCliente.dni.name + ' ' + $rootScope.dataCliente.dni.lastName,
        gender: $rootScope.dataCliente.dni.gender,
        dni: $rootScope.dataCliente.dni.dniNumber,
        domicilio: $rootScope.dataCliente.address,
        email: $rootScope.dataCliente.email,
        familiar: $rootScope.products[0].value,
        cajero: $rootScope.products[1].value,
        cajeroCuota: $rootScope.dataSeguros.cajeroCuota,
        cartera: $rootScope.products[2].value,
        carteraCuota: $rootScope.dataSeguros.carteraCuota,
        compra: $rootScope.products[3].value,
        CompraCuota: $rootScope.dataSeguros.CompraCuota,
        compraClasico: $rootScope.dataSeguros.planCompra,
        compraPremium: $rootScope.dataSeguros.planCompra,
        tecnologia: $rootScope.products[4].value,
        personal: $rootScope.products[5].value,
        prevFamiliar: $rootScope.products[6].value,
        prevFamiliarCuota: $rootScope.dataSeguros.prevFamiliarCuota,
        firma: $rootScope.firma,
        fecha: $rootScope.dateNow
    };

    $scope.showSingatureImage = false;

    var signaturePad = null;

    //funcion generar pdf con la firma

    function generatePDFFirmado() {
        var deferred = $q.defer();

        generatePDFService.generatePDF($scope.data)
            .then(function (pdf) {
                deferred.resolve(pdf);
            })
            .catch(function (error) {
                console.log(error);
                deferred.reject(error);
                $cordovaToast.showShortBottom('No se pudo generar el pdf. Intente nuevamente.');
            });

        return deferred.promise;
    };

    function createReadTempFileBase64(file, name) {
        var deferred = $q.defer();
        var result = null;

        $cordovaFile.writeFile(cordova.file.externalCacheDirectory, name, file, true)
            .then(function (success) {
                return $cordovaFile.readAsDataURL(cordova.file.externalCacheDirectory, name);
            })
            .then(function (fileDataURL) {
                result = fileDataURL;
                return $cordovaFile.removeFile(cordova.file.externalCacheDirectory, name);
            })
            .then(function (success) {
                deferred.resolve(result);
            })
            .catch(function (error) {
                console.log(error);
                deferred.reject(error);
            })

        return deferred.promise;
    }


    document.addEventListener('deviceready', function () {
        $ionicModal.fromTemplateUrl('templates/partials/signature.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.requestModal = modal;
        });

        $scope.openSignatureModal = function () {
            $scope.requestModal.show();
            signaturePad = new SignaturePad(document.getElementById('signature-pad'));
        };

        $scope.closeSignatureModal = function () {
            signaturePad.clear();
            $scope.requestModal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.requestModal.remove();
        });

        $scope.$on('modal.shown', function () {
            if (typeof globalCanvas === "undefined") {
                globalCanvas = document.getElementById('signature-pad');
                globalCtx = globalCanvas.getContext("2d");
            }

            var canvas = globalCanvas;
            var ctx = globalCtx;

            var PIXEL_RATIO = (function () {
                var dpr = window.devicePixelRatio || 1,
                    bsr = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1;

                return dpr / bsr;
            })();

            var ratio = PIXEL_RATIO;
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetWidth * ratio;
            canvas.style.width = canvas.offsetWidth + "px";
            canvas.style.height = canvas.offsetWidth + "px";
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        });

        $scope.clearButton = function () {
            signaturePad.clear();
        };

        $scope.saveSignature = function () {
            if (signaturePad.isEmpty()) {
                if (ionic.Platform.isAndroid()) {
                    $cordovaToast.showShortBottom('Firme arriba primero por favor');
                }
            } else {
                var image = document.getElementById('signature-image');
                image.src = signaturePad.toDataURL();
                $scope.data.firma = image.src;
                $scope.showSingatureImage = true;
                $scope.requestModal.hide();
            }
        };

        $scope.clearSignatureImage = function () {
            $scope.showSingatureImage = false;
            var image = document.getElementById('signature-image');
            image.src = '';
            signaturePad.clear();
        };


        $scope.proximo = function () {
            if ($scope.showSingatureImage) {
                $ionicLoading.show();
                generatePDFFirmado()
                    .then(function (pdfBlob) {
                        return createReadTempFileBase64(pdfBlob, 'formularioBase64');
                    })
                    .then(function (pdfStream) {
                        params.resource.stream = pdfStream.substring(pdfStream.lastIndexOf(';base64,') + 8, pdfStream.length);
                        return DocumentServices.createDocument(params);
                    })
                    .then(function (solicitudID) {
                        $scope.nroSolicitud = solicitudID.documentID;

                        params = {
                            tokenAuthentication: token,
                            documentID: solicitudID.documentID,
                            fields: [{ key: 'NRO_SOLICITUD', value: solicitudID.documentID, dataType: 'string' }]
                        }
                        return DocumentServices.updateDocument(params)
                    })
                    .then(function () {
                        var params = {
                            tokenAuthentication: token,
                            documentClass: "NS_DOCUMENTO",
                            fields: [                                
                                { key: "NRO_SOLICITUD", value: $scope.nroSolicitud, dataType: "string" },
                                { key: "N_DOCUMENTO", value: $rootScope.dataCliente.dni.dniNumber, dataType: "string" },
                                { key: "D_NOMBRE", value: $rootScope.dataCliente.dni.name, dataType: "string" },
                                { key: "D_APELLIDO", value: $rootScope.dataCliente.dni.lastName, dataType: "string" },
                                { key: "D_TIPOLOGIA", value: $scope.nroSolicitud, dataType: "string" },
                                { key: "F_DIGITALIZACION", value: $scope.dateInverse, dataType: "date" },
                                { key: "D_DIGITALIZADOR", value: "Mobile App", dataType: "string" },

                            ],
                            resource:
                            {
                                extension: "png",
                                stream: $rootScope.dniImage
                            }
                        }
                        DocumentServices.createDocument(params);

                    })
                    .then(function (success) {
                        // este success deevuelve el ID del documento si se creó bien
                        if (ionic.Platform.isAndroid()) {
                            $cordovaToast.showShortBottom('La solicitud ha sido enviada correctamente!');
                            $state.go('app.requestSent');
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                        if (ionic.Platform.isAndroid()) {
                            $cordovaToast.showShortBottom('La solicitud no se pudo enviar correctamente. Intentelo de nuevo!');
                        }
                    })
                    .finally(function () {
                        $ionicLoading.hide();
                    });
            } else {
                if (ionic.Platform.isAndroid()) {
                    $cordovaToast.showShortBottom('Firme la solicitud primero para poder enviarla.');
                }
            }
        };
    }, false);
}
