;
(function () {
	'use scrict';

	angular
		.module('obm.trends', [
			'ui.router',
			'chart.js',
		])

		.config(configTrends)
		.controller('LineCtrl', LineController)
		.controller('DbgCtrl', DebugController)
		.controller('ChCtrl', ChartController)
		.service('Trends', TrendsService)
		.run(runTrends)

	function TrendsService(IntServ, $interval) {
		cc = this;
		cc.bufList = [];
		cc.chList = [];
		cc.selectedList = [];
		cc.data = [];
		cc.bufName = "";

		cc.options = {
			elements: {
				point: {
					radius: 0
				},
				line: {
					borderColor: 'rgba(0,0,0)',
					tension: 0,
					fill: false
				}
			},

			
			scales: {
				xAxes: [{
					ticks: {
						autoSkip: true,
						autoSkipPadding: 10,

					}
				}]
			},


			animation: {
				duration: 0
			},

		};



		cc.showStartButton = false;

		cc.showChList = false;

		cc.url = "readbufs";

		cc.int = undefined;

		cc.start = function () {
			cc.showChList = false;
			cc.stop();

			var type = "data";
			var req = JSON.stringify({
				"action": "get",
				"type": type,
				"name": cc.bufName
			});

			cc.selectedList = [];
			cc.chList.forEach(function (channel, index) {
				if (channel.selected) {

					var ch = channel;
					ch.index = index;
					ch.x = [];
					ch.y = [];
					cc.selectedList.push(ch);
				}
			});

			var j = 0;
			cc.int = $interval(function () {
				//cc.num = cc.num + 1;

				IntServ.Custom(cc.url, req).then(function (response) {

					cc.response = response.data;

					cc.data = cc.response.readbufs.data;

					cc.selectedList.forEach(function (channel, index) {
						var i = channel.index;
						channel.y.push(cc.data[i]);
						channel.x.push(j);
					});


				}, function () {
					cc.response = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
				});

				j++;

			}, 500);

		}

		cc.checkBufStatus = function () {

			var type = "buffers";

			cc.stop();

			var req = JSON.stringify({
				"action": "get",
				"type": type
			});

			cc.int = $interval(function () {
				//cc.num = cc.num + 1;

				IntServ.Custom(cc.url, req).then(function (response) {
					var res = response.data.readbufs.list;



					var _bufList = [];
					res.forEach(function (element, index) {

						if ((typeof element) == "string") {
							var st = res[index + 1].status;

							var disabled = true;
							if (st > 0) {
								disabled = false;
							}

							var newitem = {
								name: element,
								status: res[index + 1].status,
								disabled: disabled
							}

							_bufList.push(newitem);
						}
					});

					cc.bufList = _bufList;
					cc.response = res;


				}, function () {
					//cc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
				});

			}, 1000);

		}

		cc.selectBuffer = function (index) {

			cc.stop();

			var type = "channels";


			cc.bufName = cc.bufList[index].name;

			var req = JSON.stringify({
				"action": "get",
				"type": type,
				"name": cc.bufName

			});

			//console.log(cc.bufName);

			IntServ.Custom(cc.url, req).then(function (response) {

				cc.response = response.data.readbufs;
				cc.chList = cc.response.channels;
				cc.showChList = true;

			}, function () {
				cc.showChList = false;
				//cc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
			});


		}

		cc.stop = function stop() {
			if (angular.isDefined(cc.int)) {

				//console.log('Был экземпляр');

				$interval.cancel(cc.int);
				cc.int = undefined;
			} else {
				//console.log('не Было экземпляр');
			}

		}
	}


	function DebugController(IntServ, $interval) {

		var dbc = this;

		if (angular.isDefined(dbc.int1)) {

		} else {
			dbc.int1 = undefined;
			dbc.num = 0;


			dbc.dbgStatus = "";
			dbc.dbgRequest = "";

			dbc.dbgUrl = 'readbufs';
			dbc.dbgAction = 'get';
			dbc.dbgType = 'data';
			dbc.dbgName = 'MWAY';


			dbc.once = function once() {
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

				dbc.dbgRequest = JSON.parse(req);

				IntServ.Custom(url, req).then(function (response) {
					dbc.dbgStatus = response.data;
				}, function (resp) {
					dbc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще. " + resp.data;
				});
			}

			dbc.interval = function interval() {
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

				dbc.int1 = $interval(function () {
					dbc.num = dbc.num + 1;
					IntServ.Custom(url, req).then(function (response) {
						dbc.dbgStatus = response.data;
					}, function () {
						dbc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
					});



				}, 1000);

			}

			dbc.stop = function stop() {
				if (angular.isDefined(dbc.int1)) {

					console.log(dbc.int1);

					$interval.cancel(dbc.int1);
					dbc.int1 = undefined;
				}
			}


		}


	}



	function ChartController(Trends) {
		Trends.checkBufStatus();

		this.selectBuffer = function selectBuffer(index) {
			Trends.selectBuffer(index);
		}

		this.selectChannel = function (chnum) {
			if (Trends.chList[chnum].selected == true) {
				Trends.chList[chnum].selected = false;
			} else {
				Trends.chList[chnum].selected = true;
			}

			Trends.showStartButton = false;
			Trends.chList.forEach(function (element, index) {
				if (element.selected) {
					Trends.showStartButton = true;
				}
			});

		}

		this.startTrends = function () {
			Trends.start();
		}


	}

	function LineController($scope) {

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

	function configTrends($stateProvider, ChartJsProvider) {
		var mName = 'trends';
		ChartJsProvider.setOptions({
			colors: ['#000000', '#000000']
		});

		$stateProvider.state(mName, {
			url: '/' + mName,
			templateUrl: 'app/' + mName + '/index.html'
		});
	}

	function runTrends($rootScope, Trends, $transitions) {

		$rootScope.Trends = Trends;

		$transitions.onStart({
			from: 'trends'
		}, function (trans) {
			Trends.stop();
			console.log("statechange from trends start");
		});
	}


})();