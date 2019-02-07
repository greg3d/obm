;
(function () {
	'use scrict';

	angular
		.module('obm', [
			'ui.bootstrap',
			'ui.router',
			'ui-notification',
			'ngAnimate',
			'obm.intouch',
			'obm.settings',
			//		'obm.users',
			'obm.home',
			'obm.diag',
			'obm.alarms',
			'obm.power',
			'obm.schedule',
			'obm.trends',
			//	'obm.ups',
			'obm.odo',
			'obm.translate',
			'obm.auth',
			'obm.login',
			'obm.time'
		])
		.config(configObm)
		.run(runObm)
		.controller('MainCtrl', MainController)
		.service('Sensors', SensorsService)

	function SensorsService() {

		var inArray = function (needle, haystack, strict) {
			var found = -1,
				key, strict = !!strict;
			var ii = 0;
			for (key in haystack) {
				if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
					found = ii;
					break;
				}
				ii++;
			}
			return found;
		}

		this._list = [];
		this.assign = function (obj) {
			this._list = obj;
		}
		this.show = function () {
			return this._list;
		}

		this.find = function (id) {
			var res = "000";
			this._list.forEach(function (item, i, arr) {
				if (item.name == id) {
					res = i;
				}
			});

			return res;
		}

		this.prepare = function (sens, needNums, titles) {
			this._list = sens;
			this._list.forEach(function (item, i, arr) {
				var iname = " " + item.name;
				var nn = inArray(iname, needNums);
				item.visible = false;

				if (nn > -1) {

					item.visible = true;
					item.title = titles[iname];

					if (iname == ' 9011') {
						var newVal = Math.floor(item.value[0] / 60);
						item.value[0] = newVal;
						item.unit = 'min';
					}
				}
			});
		}

	}

	function MainController($scope, $interval, IntServ, ALRM, Notification, Sets, TIME, Sensors) {

		var inArray = function (needle, haystack, strict) {
			var found = -1,
				key, strict = !!strict;
			var ii = 0;
			for (key in haystack) {
				if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
					found = ii;
					break;
				}
				ii++;
			}
			return found;
		}

		var switches = [
			1003,
			2002,
			2005,
			2008,
			2011,
			2014,
			2017,
			2020,
			2041,
			3001,
			3008,
			3013,
			4001
		];

		var visibles = [
			9000,
			9001,
			9002,
			9004,
			9011,
			9012,
			9013,
			9017,
			9014,
			9016,
			9020
		];

		var titles = {

			" 1005": "UPS Input",
			" 1006": "UPS Output",
			" 1003": "UPS Status",

			" 2002": "Odometer",
			" 2005": "EuroBalis Recv",
			" 2008": "EuroBalis Emitter",
			" 2011": "IMU",
			" 2014": "Rail Moisture Sensor",
			" 2017": "Tensometrics",
			" 2020": "ADC",
			" 2041": "Synchronisation",

			" 3001": "NAS 1",
			" 3008": "Main Controller K000",
			//3013:"K DOP",
			//4001:"Hardware Button",
			" 4003": "Record Indicator 1",
			" 4005": "Record Indicator 2",

			" 9000": "Rack temperature",
			" 9001": "Outdoor sernsor 1",
			" 9002": "Outdoor sernsor 2",
			" 9004": "Relative Hum",
			" 9011": "UPS Remaining time",
			" 9012": "UPS Charge",
			" 9013": "UPS Output freq",
			" 9016": "UPS Load",
			" 9017": "Input Voltage",
			" 9014": "Output Voltage"
		};

		var needNums = Object.keys(titles);

		/////////////////////////////////////////////////////////////////////////////////
		$scope.fullTree = " ";
		$scope.mainError = false;

		// дизаблим кнопки
		$scope.startDisabled = true;
		$scope.stopDisabled = true;
		$scope.onDisabled = true;
		$scope.offDisabled = true;
		$scope.offAllDiabled = false;

		$scope.ajaxloading = false;

		// Загружаем настроечки один раз
		var firstLoading = new Promise(function (resolve, reject) {
			Sets.Load();
			var req = JSON.stringify({
				"action": "get",
				"type": "status"
			});
			IntServ.PostRequest(req).then(function (resp) {
				var sens = resp.data.sensors;
				Sensors.prepare(sens, needNums, titles);
				setTimeout(function () {
					resolve("result");
				}, 500);
			});
		});

		firstLoading.then(
			result => {
				ALRM.addNew(Sensors._list[Sensors.find(9000)], 5, -5);

				//// REQUEST /////
				$interval(function () {
					tRequest();
					Sensors._list[0].value[0]=Sensors._list[0].value[0]-6;
					ALRM.check();
				}, 1000);

			},
			error => {
				console.log('error');
			}
		)

		$scope.$on('warning', function (event, data) {
			console.log(data);
		});

		// req function
		var tRequest = function () {

			// Берем главное дерево
			var req = JSON.stringify({
				"action": "get",
				"type": "status"
			});

			IntServ.PostRequest(req).then(function (resp) {
				IntServ.intervalBusy = false;
				$scope.fullTree = resp.data;
				$scope.mainError = false;
				// Гланый режим
				$scope.mode = resp.data.mode;

				if (angular.isDefined($scope.fullTree.time)) {
					TIME.num = $scope.fullTree.time.time_t;
					TIME.tzone = $scope.fullTree.time.tm_zone;
				}

				if (Sets.settings.debug.value == false) {
					if ($scope.mode == 'MR_STAND_BY' || $scope.mode == 'MR_OFF' || $scope.mode == 'MR_RUN_STAND_BY' || $scope.mode == 'MR_PRE_STAND_BY') {
						$scope.startDisabled = true;
						$scope.stopDisabled = true;
						$scope.onDisabled = false;
						$scope.offDisabled = true;
						$scope.offAllDiabled = false;
					}

					if ($scope.mode == 'MR_READY') {
						$scope.startDisabled = false;
						$scope.stopDisabled = true;
						$scope.onDisabled = true;
						$scope.offDisabled = false;
						$scope.offAllDiabled = false;
					}

					if ($scope.mode == 'MR_MEASURE' || $scope.mode == 'MR_RUN_MEASURE') {
						$scope.startDisabled = true;
						$scope.stopDisabled = false;
						$scope.onDisabled = true;
						$scope.offDisabled = true;
						$scope.offAllDiabled = true;
					}

					if ($scope.mode == 'MR_RUN_READY') {
						$scope.startDisabled = true;
						$scope.stopDisabled = true;
						$scope.onDisabled = true;
						$scope.offDisabled = false;
						$scope.offAllDiabled = false;
					}


				} else {
					$scope.startDisabled = false;
					$scope.stopDisabled = false;
					$scope.onDisabled = false;
					$scope.offDisabled = false;
					$scope.offAllDiabled = false;
				}

				/// alarm notifications///
				/*
				if (ALRM.hasNew1()) {
					//console.log('has new');
					var idList = ALRM.getIdList();
					idList.forEach(function(item,i,arr){
						var ala = ALRM.get(item);
						if (ala.active){
							var realMessage = $filter('translate')(ala.message);
							var realTitle = $filter('translate')(ala.title);
							Notification({message: realMessage, title: realTitle},ala.type);
						};

					});
					var al = ALRM.getLast();
					Notification({message: al.message, title: al.title, onClose: ALRM.ack(al.id)},al.type);
				};

				*/

				var modules = resp.data.modules;
				var sens = resp.data.sensors;
				var uNum = 0;

				var arr1 = [];
				var arr2 = [];
				var arr3 = [];
				var arr4 = [];

				var posi = 0;

				modules.forEach(function (item, i, arr) {
					var iname = " " + item.name;
					var nn = inArray(iname, needNums);
					if (nn > -1) {
						item.title = titles[iname];
						item.switch = false;
						item.pos = nn;
						posi++;

						switches.forEach(function (nnum, j, brr) {
							if (" " + nnum == iname) {
								//console.log(nnum + ' ' + item.name);
								item.switch = true;
							}
						});

						item.visible = true;

						if (Math.floor(item.name / 1000) == 1) {
							arr1.push(item);
						}
						if (Math.floor(item.name / 1000) == 2) {
							arr2.push(item);
						}
						if (Math.floor(item.name / 1000) == 3) {
							arr3.push(item);
						}
						if (Math.floor(item.name / 1000) == 4) {
							arr4.push(item);
						}
					}
				});

				Sensors.prepare(sens, needNums, titles);

				$scope.ups = arr1;
				$scope.units = arr2;
				$scope.controllers = arr3;
				$scope.ses = arr4;

			}, function errorCalback(response) {
				console.log('Error reading status tree');
				$scope.mainError = true;
				IntServ.intervalBusy = false;
			});

		}


	}

	function configObm($urlRouterProvider, NotificationProvider) {
		//console.log('obm-config');
		$urlRouterProvider.otherwise('/');

		NotificationProvider.setOptions({
			delay: 5000,
			startTop: 20,
			startRight: 20,
			verticalSpacing: 20,
			horizontalSpacing: 20,
			positionX: 'center',
			positionY: 'bottom',
			maxCount: 2,
		});
	}

	function runObm($rootScope, $locale, $state, $location, auth, Sensors) {

		$rootScope.Sensors = Sensors;

		$locale.NUMBER_FORMATS.GROUP_SEP = ' ';

		// ПРОВЕРЯЕМ НА ЛОГИН
		$rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			//console.log('dd');
			//window.alert('Смена локации');
			var publicPages = ['login'];
			var restrictedPage = publicPages.indexOf($location.path()) === -1;
			if (restrictedPage && !auth.isLoggedIn()) {
				$state.go('login');
				event.preventDefault();
			}
		});
	}

})();