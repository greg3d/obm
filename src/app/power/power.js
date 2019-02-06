;(function(){
	'use scrict';

	angular
		.module('obm.power', [
			'ui.router',
		])

		.config(configPower)
		.controller('PwrCtrl', PowerController)

		function PowerController($scope,$log,IntServ){

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


			$scope.switch = function(name,value) {

				console.log('Switch');

				if (name == 3001 && value == 1) {
					name = 3002;
					value = 1;
				}

				if (name == 3001 && value == 0) {
					name = 3004;
					value = 1;
				}

				if (name == 3008 && value == 1) {
					name = 3009;
					value = 1;
				}

				if (name == 3008 && value == 0) {
					name = 3011;
					value = 1;
				}

				if (name == 3013 && value == 1) {
					name = 3014;
					value = 1;
				}

				if (name == 3013 && value == 0) {
					name = 3016;
					value = 1;
				}

				if (name == 4001 && value == 1) {
					name = 4003;
					value = 1;
				}

				if (name == 4001 && value == 0) {
					name = 4005;
					value = 1;
				}

				var req = JSON.stringify({ "action": "set", "type": "switch","name": String(name), "value": String(value) });

				IntServ.PostRequest(req).then(onSuccess,onError);


			}


		}

		function configPower($stateProvider){
			var mName = 'power';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();