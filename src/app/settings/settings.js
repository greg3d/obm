;(function(){
    'use scrict';

    angular
        .module('obm.settings', [
            'ui.router',
        ])

        .config(configSettings)
        .controller('SetCtrl', SettingsController)
        .directive('numValidator', numValidatorDirective)
        .service('Sets',SettingsService)
        .run(setsToRootScope)

        function setsToRootScope($rootScope,Sets) {
           $rootScope.Sets = Sets;

        }
        setsToRootScope.$inject = ['$rootScope','Sets'];

        function SettingsService(IntServ){

            var s = this;

            s.Settings = function Settings(){
                return s.settings;
            }
            s.Keys = function Keys(){
                return s.settingsKeys;
            }
            //s.settings = {};
            //s.status = {};


            s.Load = function(){

                var req = JSON.stringify({"action": "get","type": "settings"});
                IntServ.PostRequest(req).then(function(resp){
                    var tempSets = resp.data.settings;
                    //console.log('sets');
                    s.settings = tempSets;
                    var keys = Object.keys(tempSets);
                    s.settingsKeys = [];
                    keys.forEach(function(item, i, arr) {
                      s.settingsKeys[i] = {};
                      var obj = s.settings[item];

                      s.settingsKeys[i].name = item;
                      s.settingsKeys[i].admin = obj.admin;
                      s.settingsKeys[i].max = obj.max;
                      s.settingsKeys[i].min = obj.min;
                      s.settingsKeys[i].type = obj.type;
                      s.settingsKeys[i].unit = obj.unit;

                      if (!obj.hasOwnProperty('category') ){
                        s.settings[item].category = '# General';
                      }
                      s.settingsKeys[i].category = s.settings[item].category;
                    });


                },function(resp){
                    s.settings = "Error!";
                });
            }

            s.Save = function(){
                //$scope.save = {"settings":"s"};

                var out = {};

                s.settingsKeys.forEach(function(item, i, arr){
                    if ( s.settings[item.name].type == 'int' || s.settings[item.name].type == 'double' || s.settings[item.name].type == 'select'){
                        s.settings[item.name].value = parseFloat(s.settings[item.name].value);
                    };
                    s.settings[item.name].value;
                });

                out["settings"] = s.settings;

                var req = JSON.stringify(out);
                s.status = req;
                IntServ.PostRequest(req).then(function(resp){
                    //s.Load();

                },function(resp){
                    //s.Load();
                    //window.alert('Error!');
                });
            }

        }

        function numValidatorDirective(){
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl){
                    function myValidation(value){
                        var val = parseFloat(value);
                        if (val >= attr.min && val <= attr.max) {
                            mCtrl.$setValidity('charE', true);
                        } else {
                            mCtrl.$setValidity('charE', false);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        }

        function SettingsController($scope,IntServ,Sets){


            Sets.Load();


        }

        function configSettings($stateProvider){
            var mName = 'settings';


            $stateProvider.state(mName, {
                url: '/' + mName,
                templateUrl: 'app/' + mName + '/index.html',
            });
        }


})();