;(function(){
    'use scrict';

    angular
        .module('obm.time', [])

        .config(configTime)
        .run(runTime)
        .service('TIME',TimeService)

        function TimeService($filter){
            this.num = 0;
            this.tzone = '';

            this.valid = false;

            this.GetDate = function GetDate(){
                var format = 'dd MMMM yyyy | HH:mm';
                var timezone = this.tzone;

                if (timezone=='CET') {
                    timezone = '+0100';
                }
                if (timezone=='CEST') {
                    timezone = '+0200';
                }

                var date = new Date(this.num * 1000);

                if (this.num > 0){
                    this.valid = true;
                } else {
                    this.valid = false;
                }

                return $filter('date')(date, format, timezone);
            }
        }

        function runTime($rootScope,$log,TIME){
            $rootScope.TIME = TIME;
        }

        function configTime(){

        }


})();