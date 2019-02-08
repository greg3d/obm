;
(function () {
	'use scrict';

	angular
		.module('obm.alarms', [
			'ui.router',
		])

		.config(configAlarms)
		.run(runAlarms)
		.service('ALRM', AlarmService)
	//		.filter('renderBool', renderBoolFun)
	//		.filter('onlyActive', onlyActiveFun)

	/*function onlyActiveFun() {
		return function (items) {
			var result = {};
			angular.forEach(items, function (value, key) {
				if (value.active) {
					result[key] = value;
				};
			});
			return result;
		};
	}*/

	/*function renderBoolFun() {
		return function (input) {
			var out = 0;
			if (input == true) {
				out = 1;
			} else {
				out = 0;
			}
			return out;
		}
	}*/

	function AlarmService($rootScope, Sensors, Modules) {

		this._messages = [
			"Message 1",
			"Message 2",
			"Message 3",
			"Message 4",
			"Message 5",
			"Message 6",
			"Message 7",
			"Message 8",
			"Message 9"
		];

		var _list = [];
		var _num = 0;
		var _lastId = 0;

		this.getList = function () {
			return _list;
		}

		this.addPack = function (arr) {
			arr.forEach(function (item, i, arr) {
				//console.log(item.name);
				_list.push({
					"id": _lastId,
					"sensorId": i,
					"max": 'ERROR',
					"min": 'ERROR',
					"type": 'error',
					"active": false,
					"ack": false,
					"message": item.title + " is in ERROR State!"
				});
				_lastId++;
			})
		}

		this.addNew = function (sensor, max, min, type) {
			var sensorId = Sensors.find(sensor);
			_list.push({
				"id": _lastId,
				"sensorId": sensorId,
				"max": max,
				"min": min,
				"type": type,
				"active": false,
				"ack": false,
				"message": "Test"
			});
			_lastId++;
		}

		this.check = function () {
			_num = 0;

			_list.forEach(function (item, i, arr) {

				// ерроры модулей
				if (item.max == 'ERROR') {
					var m = Modules.show()[item.sensorId];
					var val = m.value[0];
					var bcast = true;

					if (item.active == true) {
						bcast = false;
					}

					var activeness = false;
					if (val == 'ERROR') {
						activeness = true;
						_num++;
					}
					item.active = activeness;

				} else {
					// ерроры сенсоров
					var s = Sensors.show()[item.sensorId];
					var val = s.value[0];
					var bcast = true;

					if (item.active == true) {
						bcast = false;
					}

					var text = " ";
					var activeness = false;
					var onlyMax = false;
					var onlyMin = false;
					if (item.max === null) {
						onlyMin = true;
						//console.log('onlyMin');
					}
					if (item.min === null) {
						onlyMax = true;
						//console.log('onlyMax');
					}

					if (!onlyMax && val < item.min) {
						text = "lower";
						activeness = true;
						_num++;
					}
					if (!onlyMin && val > item.max) {
						text = "higher";
						activeness = true;
						_num++;
					}

					item.active = activeness;
					item.message = "Value of " + s.title + " is " + text + " than threshold!";

				}

				// бродкастим аларм
				if (item.active == true && bcast == true) {
					$rootScope.$broadcast('alarm', {
						"alarm": item,
						"title": item.type
					});
				}
			});

			
		}

		this.getNum = function () {
			return _num;
		}

	}

	function runAlarms($rootScope, $log, ALRM) {
		$rootScope.ALRM = ALRM;
	}

	function configAlarms($stateProvider) {
		var mName = 'alarms';

		$stateProvider.state(mName, {
			url: '/' + mName,
			templateUrl: 'app/' + mName + '/index.html',
		});

	}

})();