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

	function AlarmService($rootScope, Sensors) {

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

		this._list = [];
		this._num = 0;
		this._lastId = 0;

		this.getList = function () {
			return this._list;
		}

		this.addNew = function (sensor, max, min, type) {

			this._list.push({
				"id": this._lastId,
				"sensorId": sensor,
				"max": max,
				"min": min,
				"type": type,
				"active": false,
				"ack": false,
				"message": "Test"
			});

			this._lastId++;
		}

		this.check = function () {
			var _num = 0;

			this._list.forEach(function (item, i, arr) {
				var s = Sensors.show()[item.sensorId];
				var val = s.value[0];
				var bcast = true;

				if (item.active == true) {
					bcast = false;
				}
				var text = " ";
				if (val < item.min) {
					text = "lower";
					//console.log(val);
					item.active = true;
					_num++;
				} else {
					if (val > item.max) {
						text = "higher";
						//console.log(val);
						item.active = true;
						_num++;
					} else {
						item.active = false;
					}
				}

				item.message = "Value of " + s.title + " is " + text + " than threshold!";


				if (item.active == true && bcast == true) {

					$rootScope.$broadcast('alarm', {
						"alarm": item,
						"title": item.type
					});
				}
			});

			this._num = _num;
		}

		this.getNum = function () {
			return this._num;
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