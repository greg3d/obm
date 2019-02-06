;(function(){
	'use scrict';

	angular
		.module('obm.trends', [
			'ui.router',
			'chart.js',
		])

		.config(configTrends)
		.controller('LineCtrl', LineController)
		.controller('DbgCtrl', DebugController)
		.run(runTrends)

		function DebugController(IntServ,$interval){

			var dbc = this;

			if (angular.isDefined(dbc.int1)){

			} else {
				dbc.int1 = undefined;
				dbc.num = 0;


				dbc.dbgStatus = "response";

				dbc.dbgUrl = 'readbufs';
				dbc.dbgAction = 'get';
				dbc.dbgType = 'readbufs';
				dbc.dbgName = 'MWAY';


				dbc.once = function once(){
					dbc.num = 0;
					dbc.stop();

					var url = dbc.dbgUrl;
					var action = dbc.dbgAction;
					var type = dbc.dbgType;
					var name = dbc.dbgName;

					var req = JSON.stringify({
						"action": action,
						"type": type,
						"name": name
					});

					IntServ.Custom(url,req).then(function(response){
						dbc.dbgStatus = response.data;
					},function(){
						dbc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
					});
				}

				dbc.interval = function interval(){
					dbc.num = 0;
					dbc.stop();

					var url = dbc.dbgUrl;
					var action = dbc.dbgAction;
					var type = dbc.dbgType;
					var name = dbc.dbgName;

					var req = JSON.stringify({
						"action": action,
						"type": type,
						"name": name
					});

					dbc.int1 = $interval(function() {
						dbc.num=dbc.num+1;
			            IntServ.Custom(url,req).then(function(response){
							dbc.dbgStatus = response.data;
						},function(){
							dbc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
						});



			          }, 1000);

				}

				dbc.stop = function stop(){
					if (angular.isDefined(dbc.int1)) {

						console.log(dbc.int1);

			            $interval.cancel(dbc.int1);
			            dbc.int1 = undefined;
			        }
				}


			}


		}

		function LineController($scope){

		  		/*

				Chart.defaults.global.animation.easing = 'linear';
				Chart.defaults.global.animation.duration = 0;


			$scope.series = ['Series A'];

			$scope.labels = dataAcq.datax;
		  $scope.data = dataAcq.datay;
		  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };
		  $scope.datasetOverride = {
		  	yAxisID: 'y-axis-1',
		  	fill: false,
		  	lineTension: 0,
		  	borderColor: '#000',
		  	pointRadius: 0,

		  };
		  $scope.options = {

		    scales: {
		      yAxes: [
		        {
		          id: 'y-axis-1',
		          type: 'linear',
		          display: true,
		          position: 'left'
		        }
		      ]
		    }
		  };*/
		}

		function configTrends($stateProvider,ChartJsProvider){
			var mName = 'trends';
			ChartJsProvider.setOptions({ colors : [ '#000000', '#000000'] });

			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
				controller: 'DbgCtrl',
				controllerAs: 'dbc'
			});
		}

		function runTrends($rootScope,$locale,$state,$location){
			/*$rootScope.$on('$locationChangeStart', function(event,toState,toParams,fromState,fromParams,options){


			});*/
		}


})();