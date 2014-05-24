'use strict';

angular.module('angularApp', [
        'fft.services',
        'ngResource',
        'ngRoute'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
