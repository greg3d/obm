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
		.filter('renderBool', renderBoolFun)
		.filter('onlyActive', onlyActiveFun)

	function onlyActiveFun() {
		return function (items) {
			var result = {};
			angular.forEach(items, function (value, key) {
				if (value.active) {
					result[key] = value;
				};
			});
			return result;
		};
	}

	function renderBoolFun() {
		return function (input) {
			var out = 0;
			if (input == true) {
				out = 1;
			} else {
				out = 0;
			}
			return out;
		}
	}

	function AlarmService($rootScope) {

		this._list = [];
		this._num = 0;

		this.addNew = function (sensor, max, min, type) {

			this._list.push({
				"sensor": sensor,
				"max": max,
				"min": min,
				"type": type,
				"active": false
			});
		}

		this.check = function () {
			this._num = 0;

			this._list.forEach(function (item, i, arr) {
				var val = item.sensor.value[0];
				if (val < item.min) {
					item.active = true;
					this._num++;
					$rootScope.$broadcast('warning', {
						"name": item.sensor.title,
						"value": val,
						"type": "lower"
					});
				} else {
					item.active = false;
				}
			});
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