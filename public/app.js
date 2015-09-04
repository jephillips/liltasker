/**
 * Created by josh on 9/2/15.
 */

require('angular');

function ManagerController(loginService, noteRepository, AuthTokenFactory) {
    let ctrl = this;

    ctrl.getNote = function () {
        noteRepository.getNote().then(function (result) {
            ctrl.testNote = result.data;
            console.log(ctrl.testNote);
        })
    };

    ctrl.login = function(username, password){
        console.log('Login');
       loginService.login(username, password).then(function success(response){
           AuthTokenFactory.setToken(response.data);
       }, function handleError(response){
           alert('Error: ' + response.data);
       })
    }
}

const app = angular.module('app', [], function config($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
});

app.controller('ManagerController', ManagerController);

app.constant('API_URL', 'http://localhost:8080');

app.service('loginService', function($http, API_URL){
    var service = this;

    service.login = function(username, password){
        return $http.post(API_URL + '/login', {
            username: username,
            password: password
        })
    }
});

app.service('noteRepository', function ($http, API_URL) {

    var service = this;

    service.getNote = function () {
        return $http.get(API_URL + '/notes');
    };

    return service;

});

app.factory('AuthTokenFactory', function AuthTokenFactory($window){
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
        getToken: getToken,
        setToken: setToken
    };

    function getToken(){
        return store.getItem(key);
    }

    function setToken(token){
        if (token){
            store.setItem(key, token)
        } else {
            store.removeItem(key);
        }
    }
});

app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
    'use strict';
    return {
        request: addToken
    };

    function addToken(config){
        var token = AuthTokenFactory.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    }
});
