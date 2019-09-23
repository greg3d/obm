;
(function () {
	'use scrict';

	angular
		.module('obm.trends', [
			'ui.router',
			//'chart.js',
		])

		.config(configTrends)
		//.controller('LineCtrl', LineController)
		//.controller('DbgCtrl', DebugController)
		.controller('ChCtrl', ChartController)
		.service('Trends', TrendsService)
		.service('Canvas', CanvasService)
		.run(runTrends)

	function TrendsService(IntServ, $interval, $rootScope) {
		cc = this;
		cc.bufList = [];
		cc.chList = [];
		cc.selectedList = [];
		cc.data = [];
		cc.bufName = "";

		cc.active = false;

		cc.options = {
			elements: {
				point: {
					radius: 0
				},
				line: {
					borderColor: 'rgba(0,0,0)',
					tension: 0,
					fill: false,
					stepped: true
				}
			},

			responsive: true,
			maintainAspectRatio: false,
			aspectRatio: 1,

			layout: {

				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
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

		cc.clear = function () {
			cc.showChList = false;
			cc.showStartButton = false;
			cc.selectedList = [];
		}

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
					ch.x = new Array(512);
					ch.y = new Array(512);

					var opts = JSON.parse(JSON.stringify(cc.options));
					ch.options = opts;

					//<h3><strong>{{ trend.name }}</strong> &mdash; ({{ trend.type }}) &mdash; current value: <i>{{ trend.y[1023] }}</i></h3>


					ch.options.title = {
						display: true,
						text: ch.name + " (" + ch.type + ") - " + ch.comment
					}

					cc.selectedList.push(ch);
				}
			});

			var j = 0;
			cc.int = $interval(function () {
				//cc.num = cc.num + 1;

				cc.active = true;

				IntServ.Custom(cc.url, req).then(function (response) {

					cc.response = response.data;

					cc.data = cc.response.readbufs.data;

					cc.selectedList.forEach(function (channel, index) {
						var i = channel.index;
						channel.x.shift();
						channel.y.shift();

						var val = 0;


						if (channel.type.indexOf('real', 0) >= 0) {
							//console.log(channel.type);
							val = Math.round(cc.data[i] * 100) / 100;
						} else {
							val = cc.data[i];
						}

						channel.y.push(val);
						channel.x.push(j / 2);

						//channel.options.title.text

						//Canvas.Redraw();

					});

					$rootScope.$broadcast('redraw', {});


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
					cc.dbgStatus = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
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

			cc.active = false;

			if (angular.isDefined(cc.int)) {

				//console.log('Был экземпляр');

				$interval.cancel(cc.int);
				cc.int = undefined;
			} else {
				//console.log('не Было экземпляр');
			}

		}
	}

	function CanvasService(Trends) {
		cs = this;
		var canvas = null;
		var ctx = null

		var xx = 2.5;
		var yy = 2.5;

		var xMin = 0;
		var xMax = 256;
		var yMax = -1024;
		var yMin = 1024;

		var nPoints = 512;

		cs.Point2D = function (x, y) {

			if (x == null) {
				x = 0;
			}

			if (y == null) {
				y = 0;
			}

			if (x < xMin || x > xMax || y < yMin || y > yMax) {
				x = NaN;
				y = NaN;
			}

			var X = (x - xMin) * canvas.width / (xMax - xMin) + yy;
			var Y = canvas.height - (y - yMin) * canvas.height / (yMax - yMin) - yy;

			return {
				"x": X,
				"y": Y
			};
		}

		cs.Redraw = function () {
			canvasCont = document.getElementById("CanvasContainer");
			canvas = document.getElementById("TrendCanvas");
			ctx = canvas.getContext('2d');

			canvas.width = Math.round(canvasCont.getBoundingClientRect().width);
			canvas.height = Math.round(canvasCont.getBoundingClientRect().height);
			
			//if (!Trends.active) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.strokeRect(xx, yy, canvas.width - xx * 2, canvas.height - yy * 2);
				ctx.lineWidth = 1;
			//}
			


			if (Trends.active) {
				var channel = Trends.selectedList[0];

				ctx.beginPath();
				

				channel.y.forEach(function(val,ii,arr){
					if (val > yMax) {
						yMax = val;
					}
	
					if (val < yMin) {
						yMin = val;
					}
	
				});

				

				
				console.log(yMax);
				console.log(yMin);

				var stPoint = cs.Point2D(channel.x[0], channel.y[0]);
								
				ctx.moveTo(stPoint.x, stPoint.y);

				//console.log(stPoint);
				
				for (var i = 1; i < nPoints; i++) {

					

					var curPoint = cs.Point2D(channel.x[i], channel.y[i]);
					ctx.lineTo(curPoint.x, curPoint.y);
					//ctx.lineTo(i, 50);
					

					//console.log(curPoint);
				}

				ctx.lineWidth = 2;
				ctx.stroke();

				//console.log(canvas.height);

			}



		}
	}


	/*function DebugController(IntServ, $interval) {

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


	}*/



	function ChartController(Trends, Canvas, $rootScope) {


		Trends.checkBufStatus();
		Canvas.Redraw();

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

		$rootScope.$on('redraw', function (event, data) {

			Canvas.Redraw();
		});


	}



	function configTrends($stateProvider) {
		var mName = 'trends';

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