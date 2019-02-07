;(function(){
	'use scrict';

	angular
		.module('obm.alarms', [
			'ui.router',
		])

		.config(configAlarms)
		.run(runAlarms)
		.service('ALRM',AlarmService)
		.filter('renderBool',renderBoolFun)
		.filter('onlyActive',onlyActiveFun)

		function onlyActiveFun(){
			return function (items){
				var result = {};
				angular.forEach(items, function(value,key){
					if (value.active){
						result[key] = value;
					};
				});
				return result;
			};
		}

		function renderBoolFun(){
			return function(input) {
				var out = 0;
				if (input == true) {
					out=1;
				} else {
					out=0;
				}
				return out;
			}
		}

		function AlarmService($rootScope){

			
			this._list = [];

			this.addNew = function(sensor,max,min){
				//console.log(sensor);
				if (sensor.value[0]<min) {
					$rootScope.$broadcast('warning',{
						"name": sensor.title,
						"value": sensor.value[0],
						"type": "lower"
					});
				}
			}

			this.getIdList = function(){
				var idList = Object.keys($rootScope.alarms);
				return idList;
			}

			this.number = function number(){
				var keys = Object.keys($rootScope.alarms);
				var num = 0;
				keys.forEach(function(item, i, arr){
                    if ($rootScope.alarms[item].active == true){
                    	num++;
                    };
                });
                return num;
			}

			this.get = function(id){
                return $rootScope.alarms[id];
            };

            this.getLast = function(){
                return $rootScope.alarms[this.last];
                this.hasNew = false;
            };

            this.activate = function activate(id){
            	var old = $rootScope.alarms[id].active;
            	if (old==false) {
            		this.last = id;
            		this.hasNew = true;
            	} else {
            		this.hasNew = false;
            	}
                $rootScope.alarms[id].active = true;
            };

            this.deactivate = function deactivate(id){
                $rootScope.alarms[id].active = false;
                $rootScope.alarms[id].ack = false;
            };

            this.ack = function ack(id){
                $rootScope.alarms[id].ack = true;
            };
		}


		function runAlarms($rootScope,$log,ALRM){
			$rootScope.ALRM = ALRM;
			$rootScope.alarms = {
				"20001": {
					"id":"20001",
					"title":"_title20001",
					"message":"_message20001",
					"type":"warning"
				},
				"20002": {
					"id":"20002",
					"title":"_title20002",
					"message":"_message20002",
					"type":"error"
				},

				"20003": {
					"id":"20003",
					"title":"_title20003",
					"message":"_message20003",
					"type":"error"
				},

				"20004": {
					"id":"20004",
					"title": "_title20004",
					"message":"_message20004",
					"type":"error"
				},

				"20005": {
					"id":"20005",
					"title":"_title20005",
					"message":"_message20005",
					"type":"error"
				},

				"20006": {
					"id":"20006",
					"title":"_title20006",
					"message":"_message20006",
					"type":"error"
				},

			}

			var keys = Object.keys($rootScope.alarms);

			keys.forEach(function(item, i, arr){
				$rootScope.alarms[item].ack=false;
				$rootScope.alarms[item].active=false;
				$rootScope.alarms[item].new=false;

            });
		}

		function configAlarms($stateProvider){
			var mName = 'alarms';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});



		}


})();