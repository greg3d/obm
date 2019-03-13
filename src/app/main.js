;
(function () {
	'use scrict';

	angular
		.module('obm', [
			'ui.bootstrap',
			'ui.router',
			'ui-notification',
			//'ngAnimate',
			'obm.intouch',
			'obm.settings',
			//	'obm.users',
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
		.service('Modules', ModulesService)

	function ModulesService() {
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

		var _list = [];

		this.show = function () {
			return _list;
		}

		this.prepare = function (mods, needNums, titles, switches) {
			_list = [];
			var posi = 0;
			mods.forEach(function (item, i, arr) {
				var iname = " " + item.name;
				var nn = inArray(iname, needNums);
				if (nn > -1) {
					item.title = titles[iname];
					item.switch = false;
					item.pos = nn;
					posi = posi + 1;

					switches.forEach(function (nnum, j, brr) {
						if (" " + nnum == iname) {
							//console.log(nnum + ' ' + item.name);
							item.switch = true;
						}
					});

					item.visible = true;
					_list.push(item);
				}

			});
		}
	}

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

	/** 
	 * Главный контроллер
	 * Предварительные настройки, алармы, нотификации, время, обработка сенсоров и модулей
	 */
	function MainController($scope, $interval, IntServ, ALRM, Notification, Sets, TIME, Sensors, Modules) {


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
			" 2005": "ETCS Balise Reader",
			" 2008": "ETCS Balise Emitter",
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

		/**
		 * Функция загрузки настроек и данных в первый раз после запуска приложения
		 * возвращает Promise (success => все хорошо, error => все плохо)
		 * error задержка 2000 мс
		 * success 200 мс
		 */
		function firstLoading() {
			return new Promise(function (resolve, reject) {
				var o = this;
				Sets.Load();
				var req = JSON.stringify({
					"action": "get",
					"type": "status"
				});
				IntServ.PostRequest(req).then(function (resp) {
					//$scope.mainError = false;
					var sens = resp.data.sensors;
					var mods = resp.data.modules;
					Sensors.prepare(sens, needNums, titles);
					Modules.prepare(mods, needNums, titles, switches);
					setTimeout(function () {
						resolve("success");
					}, 200);
				}, function (resp) {
					setTimeout(function () {
						reject("error");
					}, 2000);
					
				});
			});
		}

		/**
		 * Обертка для FirstLoading
		 * конфигурирование Алармов, 
		 * генерация периодического запроса, 
		 * рекурсивный вызов в случае неудачи первой загрузки.
		 */
		function doFirstLoading() {
			//console.log('ddd');
			firstLoading().then(
				function(success) {
					// Убераем плашку об ошибке
					$scope.mainError = false;
					
					// Добавляем нужные алармы
					ALRM.addNew(9000, Sets.settings.max_frame_temp.value, -50, 'error');
					ALRM.addNew(9011, null, Sets.settings.ext_power_runtime.value, 'error');
					ALRM.addNew(9012, null, Sets.settings.battery_ups_level_value.value, 'error');
					ALRM.addPack(Modules.show());
					//// INTERVAL 1 SEC REQUEST /////
					$interval(function () {
						tRequest();
						ALRM.check();
					}, 1000);
				},
				function(error) {
					// Выводим плашку об ошибке
					$scope.mainError = true;
					console.log('Error of First Loading!');
					return doFirstLoading();
				}
			)
		}

		// GO!
		doFirstLoading();

		// слушаем алармы
		$scope.$on('alarm', function (event, data) {
			console.log(data);
			Notification({
				message: data.alarm.message,
				title: data.title
			}, data.alarm.type);
		});

		// функция постоянных запросов
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

				var mods = resp.data.modules;
				var sens = resp.data.sensors;


				var arr1 = [];
				var arr2 = [];
				var arr3 = [];
				var arr4 = [];

				// Готовим все
				Modules.prepare(mods, needNums, titles, switches);
				Sensors.prepare(sens, needNums, titles);

				Modules.show().forEach(function (item, i, arr) {
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
				});

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

	/**
	 * Конфиг приложения 
	 */
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

	/**
	 * Инициализация
	 */
	function runObm($rootScope, $locale, $state, $location, auth, Sensors, Modules) {

		$rootScope.Sensors = Sensors;
		$rootScope.Modules = Modules;

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