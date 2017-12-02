(function () {
    var mapsKey = 'AIzaSyBQDWcAaNt5ZTYNMQdx3VwqPQkjoAYH0dU';
    var module = angular.module('Starbox', ['ngRoute', 'ngSanitize']);
    module.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/views/home.html', // done
            controller: 'HomeController'
        });
        $routeProvider.when('/search', {
            templateUrl: '/views/search.html', //done
            controller: 'SearchController'
        });
        $routeProvider.when('/result', {
            templateUrl: '/views/result.html',
            controller: 'ResultsController'
        });
        $routeProvider.when('/offerings/:id', {
            templateUrl: '/views/offering.html', //done
            controller: 'OfferingController'
        });
        $routeProvider.when('/locations/:id', {
            templateUrl: '/views/location.html', //done
            controller: 'LocationController'
        });
    });
    module.run(function ($rootScope, $location, $route) {
        $rootScope.searchFor = function (search) {
            search.searchType = search.searchType || 'ALL';
            $rootScope.search = search;
            $location.url('/result');
            $route.reload();
        };
    });
    module.controller('HomeController', function ($scope, $http) {
        $scope.menu = {};
        $http.get('/api/rest/v1/menu').then(function (menu) {
            $scope.menu = menu.data;
        });
    });
    module.controller('SearchController', function ($scope, $rootScope, $location) {
        $scope.localSearch = {
            searchType: "ALL",
            name: "",
            type: "",
            tags: "",
            ingredients: ""
        };
        if ($rootScope.search) {
            $scope.localSearch = {
                searchType: $rootScope.search.searchType || "ALL",
                name: $rootScope.search.name || "",
                type: $rootScope.search.type || "",
                tags: ($rootScope.search.tags || []).join(','),
                ingredients: ($rootScope.search.ingredients || []).join(',')
            };
        }
        $scope.lookup = function () {
            var tags = $scope.localSearch.tags.trim();
            var ingredients = $scope.localSearch.ingredients.trim();
            $rootScope.search = {
                searchType: $scope.localSearch.searchType,
                name: $scope.localSearch.name,
                type: $scope.localSearch.type,
                tags: tags !== "" ? tags.split(/\s*,\s*/) : [],
                ingredients: ingredients !== "" ? ingredients.split(/\s*,\s*/) : []
            };
            $location.url('/result');
        };
    });
    module.controller('ResultsController', function ($scope, $rootScope, $location, $http) {
        $scope.result = [];
        if (!$rootScope.search) {
            $location.url('/search');
        } else {
            $http.post('/api/rest/v1/offerings/search', $rootScope.search).then(function (response) {
                $scope.result = response.data;
            });
        }
    });
    module.controller('OfferingController', function ($scope, $http, $routeParams) {
        $scope.offering = {};
        $http.get('/api/rest/v1/offerings/' + $routeParams.id).then(function (response) {
            $scope.offering = response.data;
        });
    });
    module.controller('LocationController', function ($scope, $http, $routeParams, $sce) {
        $scope.location = {};
        $scope.menu = {};
        $http.get('/api/rest/v1/locations/' + $routeParams.id).then(function (response) {
            $scope.location = response.data;
            $scope.location.mapAddress = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?q=' + encodeURI($scope.location.address) + '&key=' + mapsKey);
        });
        $http.get('/api/rest/v1/menu/' + $routeParams.id).then(function (response) {
            $scope.menu = response.data;
        });
    });
})();