"user strict";

angular.module('NacionSegurosApp')

.factory('ProductsService', ProductsService);

ProductsService.$inject = ['$q'];

/* @ngInject */
function ProductsService($q) {
	var products = [
		{ id: 1, name: 'Producto familiar', image: 'productos_hogar.png', category: 'cards', description: '',value :false},
		{ id: 2, name: 'Producto robo cajero', image: 'productos_atm.png', category: 'cards', description: '',value: false},
		{ id: 3, name: 'Producto robo cartera', image: 'productos_carteramdpi.png', category: 'cards', description: '',value: false},
		{ id: 4, name: 'Producto compra', image: 'productos_compra.png', category: 'cards', description: '',value: false},
		{ id: 5, name: 'Producto tecnologia', image: 'productos_tpmdpi.png', category: 'cards', description: '', value: false},
		{ id: 6, name: 'Producto personal', image: 'productos_apmdpi.png', category: 'cards', description: '',value: false},
		{ id: 7, name: 'Producto prevFamiliar', image: 'productos_auto.png', category: 'cards', description: '',value: false}
        
	];

	var service = {
		getProductsByCategory: getProductsByCategory,
		getProductById: getProductById,
		getAll: getAll
	};

	return service;							

	function getAll() {
		var deferred = $q.defer();

		setTimeout(function() {
			deferred.resolve(products);
		}, 250);

		return deferred.promise;
	}

	function getProductsByCategory(category) {
		var deferred = $q.defer();

		var result = [];
		var i = 0;
		for(i; i<products.length; i++) {
			if(products[i].category === category)
				result.push(products[i]);
        }

        setTimeout(function() {
            deferred.resolve(result);
		}, 250);

		return deferred.promise;
	}

	function getProductById(id) {
		var deferred = $q.defer();

		var result = undefined;
		var i = 0;
		for(i; i<products.length; i++) {
			if(products[i].id == id)
				result = products[i];
		}

		setTimeout(function() {
			deferred.resolve(result);
		}, 250);

		return deferred.promise;
	}
}
