"user strict";

angular.module('NacionSegurosApp', ['ionic', 'ngCordova', 'ThubanServices', 'pdf'])

.constant('WS_EXP_COD_RET', '98')
.constant('WS_ACC_COD_RET', '97')
.constant('WS_SUC_COD_RET', '00')
.constant('VALUES_SEPARATOR', '|')
.constant('VALUES_SEPARATOR_2', ',')

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/partials/menu.html',
                controller: 'AppController'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/home.html',
                        controller: 'HomeController'
                    }
                }
            })

            .state('app.products', {
                url: '/products/:type',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/products.html',
                        controller: 'ProductsController'
                    }
                },
                productsService: 'ProductsService',
                resolve: {
                    products: function (ProductsService, $stateParams, $ionicLoading) {
                        $ionicLoading.show({
                            content: 'Loading',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        return ProductsService.getProductsByCategory($stateParams.type)
                            .then(function (data) {
                                $ionicLoading.hide();
                                return data;
                            })
                            .catch(function (error) {
                                $ionicLoading.hide();
                                console.log(error);
                            });
                    }
                }
            })

            
            .state('app.form', {
                url: '/form',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/form.html',
                        controller: 'FormController'
                    }
                }
            })

            .state('app.scanner', {
                url: '/scanner',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/scanner.html',
                        controller: 'ScannerController'
                    }
                }
            })

            .state('app.checks', {
                url: '/checks/:type',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/checks.html',
                        controller: 'ChecksController'
                    }
                }
            })

            .state('app.viewRequest', {
                url: '/firma',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/view-request.html',
                        controller: 'ViewRequestController'
                    }
                }
            })

            .state('app.requestSent', {
                url: '/request-sent/',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/request-sent.html',
                        controller: 'RequestSentController'
                    }
                }
            })

            .state('app.config', {
                url: '/configuration',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pages/configuration.html',
                        controller: 'ConfigurationController'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/products/cards');
    })


    .run(function ($ionicPlatform, ThubanConfigService, $rootScope) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            ThubanConfigService.initializeConfig()
                .then(function (success) {
                    console.log('Configuración inicializada corractamente.');
                })
                .catch(function (error) {
                    console.error(error);
                });
        });
    });
