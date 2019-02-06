;(function(){
	'use scrict';

	angular
		.module('obm.odo', [
			'ui.router',
		])

		.config(configOdo)

		.filter('direction',odoDirectionFilter)
		.controller('OdoCtrl', odometerController)

		function odoDirectionFilter(){
			return function(input) {
				var out;
				if (input==1) {
					out = 'Backward';
				}

				if (input==0) {
					out = 'Forward';
				}
				return out;

			}
		}

		function odometerController($scope,$log,IntServ){

			$scope.status = {"status":"null"};

			var onSuccess = function (response){
				var status1 = response.data;
				$log.log(status1);
				$scope.status = status1;
			};

			var onError  = function (response){
				var status1 = "Error! Data: " + String(response.data) + " StatusText: " + response.statusText + " xhrStatus: " + response.xhrStatus;
				$log.log(status1);
				$scope.status = status1;
			};

			$scope.odoEmul = function(value) {
				if (value == 1) {
					var req = JSON.stringify({ "action": "set","type": "switch","name": "201","value": "1" });
				} else {
					var req = JSON.stringify({ "action": "set","type": "switch","name": "202","value": "1" });
				}
				IntServ.PostRequest(req).then(onSuccess,onError);
			}

			$scope.odoSpeedUp = function() {

				var req = JSON.stringify({ "action": "set","type": "switch","name": "205","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			}

			$scope.odoSpeedDown = function() {
				var req = JSON.stringify({ "action": "set","type": "switch","name": "206","value": "1" });

				IntServ.PostRequest(req).then(onSuccess,onError);
			}

			$scope.odoDir = function(value) {
				if (value == 1) {
					var req = JSON.stringify({ "action": "set","type": "switch","name": "207","value": "1" });
				} else {
					var req = JSON.stringify({ "action": "set","type": "switch","name": "208","value": "1" });
				}

				IntServ.PostRequest(req).then(onSuccess,onError);
			}
		}


		function configOdo($stateProvider){
			var mName = 'odo';

			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();