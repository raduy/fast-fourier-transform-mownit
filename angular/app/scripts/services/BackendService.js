/**
 * Created by raduy on 22.05.14.
 */

var services = angular.module('fft.services', []);

services.factory('BackendService', ['$resource', function ($resource) {
    return $resource('http://localhost\\:8080/fft/data/:components/:diversity', {
        components: "@components",
        diversity: "@diversity"}, {
    });
}]);