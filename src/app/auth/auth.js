;
(function () {
    'use scrict';

    angular
        .module('obm.auth', ['ui.router'])
        .config(configAuth)
        .service('auth', AuthService)
        .service('session', sessionService)
        .factory('localStorage', localStorageServiceFactory)
        .run(assServToRootScope)

    function assServToRootScope($rootScope, session, auth) {
        $rootScope.auth = auth;
        $rootScope.session = session;
    }
    assServToRootScope.$inject = ['$rootScope', 'session', 'auth'];

    function localStorageServiceFactory($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }

    function sessionService($log, localStorage) {
        this._user = JSON.parse(localStorage.getItem('session.user'));
        this._accessToken = localStorage.getItem('session.accessToken');

        this.getUser = function () {
            //this._user = localStorage.getItem('session.user');
            return this._user;
        };

        this.setUser = function (user) {
            this._user = user;
            localStorage.setItem('session.user', JSON.stringify(user));
            return this;
        };

        this.getAccessToken = function () {
            return this._accessToken;
        };

        this.setAccessToken = function (token) {
            this._accessToken = token;
            localStorage.setItem('session.accessToken', token);
            return this;
        };

        this.destroy = function destroy() {
            this.setUser(null);
            this.setAccessToken(null);
        };

    }

    function AuthService($http, session, $state) {
        // Проверяем залогинен ли
        this.isLoggedIn = function isLoggedIn() {
            //console.log(session.getUser());
            var vvv = session.getUser();
            if (vvv == "null" || vvv == 'null' || vvv == null) {
                return false;
                //console.log('false');
            } else {
                return session.getUser() !== "null";
            }

        };

        this.isAdmin = function isAdmin() {

            //var uuu = session.getUser();
            // var name = uuu.name;
            // console.log(uuu + uuu.name);

            return session.getUser().name == 'admin';


        };


        // Логин

        this.logIn = function (uuu) {

            return $http
                .get(uuu + '.json')
                //.post('/login.json',credentials)
                .then(function (response) {
                    console.log(response.data);
                    var data = response.data;
                    session.setUser(data.user);
                    session.setAccessToken(data.accessToken);
                    $state.go('home');
                });
        };

        // log out

        this.logOut = function () {
            return $http
                .get('/logout.json')
                .then(function (response) {
                    // убиваем сессию
                    session.destroy();
                    $state.go('login');
                });
        };
    }


    function configAuth() {

    }

})();