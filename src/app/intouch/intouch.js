;
(function () {
    'use scrict';

    angular
        .module('obm.intouch', [])
        .config(configIntouch)

        .service('IntServ', IntouchServer)

    /*
    .run(IntServStatus)

    function IntServStatus($rootScope,IntServ){
        $rootScope.IntServ = IntServ;
    }*/

    function IntouchServer($http) {

        this.intervalBusy = false;

        this.Test = function (req) {
            this.intervalBusy = true;
            return $http({
                method: 'GET',
                url: 'tree.json'
            });
        };


        this.Custom = function (url, req) {

            return $http({
                method: 'POST',
                url: '/' + url,
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        this.PostRequest = function (req) {
            this.intervalBusy = true;
            return $http({
                method: 'POST',
                url: '/intouch_serv',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        this.TasksRequest = function () {

            var req = JSON.stringify({
                "action": "get",
                "type": "schedule"
            });
            return $http({
                method: 'POST',
                url: '/scheduler',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        this.Scheduler = function (req) {
            return $http({
                method: 'POST',
                url: '/scheduler',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        this.AlarmEvents = async function() {
            let promise = new Promise((resolve, reject) => {
                $http({
                    method: 'POST',
                    url: '/intouch_serv',
                    data: {
                        "action":"get",
                        "type":"alarm_events"
                    },
                    timeout: 1000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(){
                    resolve(resp);
                }, function(){
                    reject("error");
                });
            })

            let res = await promise;

            return res;
        }
    }

    function configIntouch() {

    }

})();