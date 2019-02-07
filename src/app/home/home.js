;
(function () {
	'use scrict';

	angular
		.module('obm.home', [
			'ui.router',
		])
		.config(configHome)
		.controller('HomeCtrl', HomeController)

	function HomeController(IntServ, $scope, $log) {

		var onSuccess = function (response) {
			var status1 = response.data;
			$log.log(status1);
			$scope.status = status1;
		};

		var onError = function (response) {
			var status1 = "Error! Data: " + String(response.data) + " StatusText: " + response.statusText + " xhrStatus: " + response.xhrStatus;
			$log.log(status1);
			$scope.status = status1;
		};

		$scope.startMeasure = function () {
			if ($scope.startDisabled) {
				//return;
			}
			var req = JSON.stringify({
				"action": "set",
				"type": "mode",
				"name": "10003",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		};
		$scope.stopMeasure = function () {
			if ($scope.stopDisabled) {
				//console.log('Button disabled');
				///return;
			}
			var req = JSON.stringify({
				"action": "set",
				"type": "mode",
				"name": "10002",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		};
		$scope.powerOn = function () {
			if ($scope.onDisabled) {
				//console.log('Button disabled');
				//return;
			}
			var req = JSON.stringify({
				"action": "set",
				"type": "mode",
				"name": "10002",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		};
		$scope.powerOff = function () {
			if ($scope.offDisabled) {
				//console.log('Button disabled');
				//return;
			}
			var req = JSON.stringify({
				"action": "set",
				"type": "mode",
				"name": "10001",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		};
		$scope.powerOffAll = function () {
			if ($scope.offDisabled) {
				//console.log('Button disabled');
				//return;
			}
			var req = JSON.stringify({
				"action": "set",
				"type": "mode",
				"name": "10000",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		};
	}

	function configHome($stateProvider) {
		var mName = 'home';


		$stateProvider.state(mName, {
			url: '/',
			templateUrl: 'app/' + mName + '/index.html',
			controller: 'HomeCtrl',
			controllerAs: 'hc'
		});
	}
})();