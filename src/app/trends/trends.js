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
					ch.x = new Array(300);
					ch.y = new Array(300);

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
						var val = 0;

						if (channel.type.indexOf('real', 0) >= 0) {
							//console.log(channel.type);
							val = Math.round(cc.data[i] * 100) / 100;
						} else {
							val = cc.data[i];
						}

						var n = channel.x.length;

						var oldY = channel.y.slice();
						var oldX = channel.x.slice();

						for (var jjj = n - 2; jjj >= 0; jjj--) {

							channel.y[jjj] = oldY[jjj + 1];
							channel.x[jjj] = oldX[jjj + 1];

							if (channel.x[jjj] == NaN) {
								channel.x[jjj] = j;
							}

							if (channel.y[jjj] == NaN) {
								channel.y[jjj] = val;
							}
						}

						channel.y[n - 1] = val;
						channel.x[n - 1] = j;

						//channel.options.title.text
						//Canvas.Redraw();

					});

					$rootScope.$broadcast('redraw', {});


				}, function () {
					cc.response = "Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще.";
				});

				j++;

			}, 1000);

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

		var canvasCont = document.getElementById("CanvasContainer");
		var canvas = document.getElementById("TrendCanvas");
		var ctx = canvas.getContext('2d');

		var xx = 2.5;
		var leftMargin = 0;
		var bottomMargin = 28;
		var topMargin = 5;
		var rightMargin = 50;
		var yy = 2.5;

		var plotHeight = 170; //px

		var xMin = 0;
		var xMax = 300;
		var yMax = -1e9;
		var yMin = 1e9;

		var nPoints = 300;

		var numberOfPlots = 1;

		plots = [];

		var colors = ['darkred', 'darkblue', 'darkgreen', 'black'];

		var Point2D = function (curPlot, x, y) {



			if (x == null) {
				x = NaN;
			}

			if (y == null) {
				y = NaN;
			}

			/*
			if (x < xMin || x > xMax || y < curPlot.yMin || y > curPlot.yMax) {
				x = NaN;
				y = NaN;
			}*/

			var X = curPlot.x1 + (x - curPlot.xMin) * (curPlot.x2 - curPlot.x1) / (curPlot.xMax - curPlot.xMin);
			var Y = curPlot.y2 - (y - curPlot.yMin) * (curPlot.y2 - curPlot.y1) / (curPlot.yMax - curPlot.yMin);

			return {
				"x": X,
				"y": Y
			};
		}

		cs.Redraw = function () {

			if (Trends.active) {

				numberOfPlots = Trends.selectedList.length;
				canvas.width = Math.round(canvasCont.getBoundingClientRect().width);
				canvas.height = numberOfPlots * (plotHeight) + yy;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.lineWidth = 1;

				kk = 0;

				for (var i = 0; i < numberOfPlots; i++) {

					/*
					var f = 0;
					if (i > 0) {
						f = 1;
					}*/

					var curPlot = {
						x1: xx + leftMargin,
						y1: yy + i * plotHeight + topMargin,
						x2: canvas.width - xx - rightMargin,
						y2: yy + i * plotHeight + plotHeight - bottomMargin,
						yMin: yMin,
						yMax: yMax,
					}
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#000000";
					ctx.strokeRect(curPlot.x1, curPlot.y1, curPlot.x2 - curPlot.x1, curPlot.y2 - curPlot.y1);

					var channel = Trends.selectedList[i];

					//ctx.lineWidth = 2;

					channel.y.forEach(function (val, k, arr) {
						if (val > curPlot.yMax) {
							curPlot.yMax = val;
						}

						if (val < curPlot.yMin) {
							curPlot.yMin = val;
						}

						if (curPlot.yMax == curPlot.yMin) {
							curPlot.yMax = curPlot.yMax + 1;
							curPlot.yMin = curPlot.yMin - 1;
						}

					});

					curPlot.xMax = channel.x[nPoints - 1];
					curPlot.xMin = curPlot.xMax - xMax;

					// ticks and grid
					var tickGap = 30; //sec
					var tnum = xMax / tickGap;

					for (var k = curPlot.xMin + tickGap; k < curPlot.xMax; k = k + tickGap) {
						ctx.beginPath();
						ctx.strokeStyle = "#CCC";

						var tickPoint = Point2D(curPlot, k, 0);

						ctx.moveTo(tickPoint.x, curPlot.y2 - 2);
						ctx.lineTo(tickPoint.x, curPlot.y1 + 2);
						ctx.stroke();

						ctx.fillStyle = "#000";
						ctx.font = "12px Arial";
						ctx.textAlign = "center";
						ctx.textBaseline = "alphabetic";
						ctx.fillText(k, tickPoint.x, curPlot.y2 + bottomMargin / 2);
					}

					// крайний нижний тик справа
					ctx.textAlign = "center";
					ctx.textBaseline = "alphabetic";
					ctx.fillText(curPlot.xMax, curPlot.x2, curPlot.y2 + bottomMargin / 2);

					// расчет тиков для Y
					var realPlotHeight = curPlot.y2 - curPlot.y1;
					var yTickCount = Math.ceil(realPlotHeight / 30);

					var yTickGap = (curPlot.yMax - curPlot.yMin) / yTickCount;
					var realYTickGap = 1.0e+020;
					while (realYTickGap > yTickGap) {
						realYTickGap = realYTickGap / 10;
					}

					realYTickGap = realYTickGap * 10;

					if (realYTickGap > (curPlot.yMax - curPlot.yMin)) {
						realYTickGap = realYTickGap / 2;
					}

					var minYTick = Math.floor(curPlot.yMin / realYTickGap) * realYTickGap;

					for (var k = minYTick + realYTickGap; k < curPlot.yMax; k = k + realYTickGap) {
						ctx.beginPath();
						ctx.strokeStyle = "#CCC";

						var tickPoint = Point2D(curPlot, channel.y[nPoints - 1], k);

						ctx.moveTo(curPlot.x1 + 1, tickPoint.y);
						ctx.lineTo(curPlot.x2 - 1, tickPoint.y);
						ctx.stroke();

						ctx.fillStyle = "#CCC";
						ctx.textAlign = "left";
						ctx.textBaseline = "middle";
						ctx.font = "10px Arial";
						ctx.fillText(k, curPlot.x2 + 4, tickPoint.y);
					}

					// yMax и yMin
					ctx.fillStyle = "#000";
					ctx.textAlign = "left";
					ctx.textBaseline = "middle";
					ctx.font = "10px Arial";
					ctx.fillText(curPlot.yMax, curPlot.x2 + 4, curPlot.y1);
					ctx.fillText(curPlot.yMin, curPlot.x2 + 4, curPlot.y2);
					
					// текущее значение
					ctx.fillStyle = "#eee";
					ctx.fillRect(curPlot.x1 + 1, curPlot.y1 + 1 , 150, 22);
					ctx.fillStyle = "#000";
					ctx.textAlign = "left";
					ctx.textBaseline = "top";
					ctx.font = "14px Arial";
					ctx.fillText(channel.name + ": " + channel.y[nPoints - 1], curPlot.x1 + 4, curPlot.y1 + 4);


					//console.log("real tick gap: " + realYTickGap + "   minYTick: " + minYTick + "   Amplitude: " + (curPlot.yMax - curPlot.yMin) + "   max and min: " + curPlot.yMax + " " + curPlot.yMin);

					// Drawing plot 

					var stPoint = Point2D(curPlot, channel.x[nPoints - 1], channel.y[nPoints - 1]);

					ctx.beginPath();
					ctx.strokeStyle = colors[kk];
					kk++;
					if (kk >= colors.length) {
						kk = 0;
					}

					ctx.moveTo(stPoint.x, stPoint.y);

					for (var j = nPoints - 2; j >= 0; j--) {
						var curPoint = Point2D(curPlot, channel.x[j], channel.y[j]);
						ctx.lineTo(curPoint.x, curPoint.y);
					}

					ctx.stroke();

				}

			}

		}
	}

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