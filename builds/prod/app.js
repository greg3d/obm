;
(function () {
	'use scrict';

	configObm.$inject = ["$urlRouterProvider", "NotificationProvider"];
	runObm.$inject = ["$rootScope", "$locale", "$state", "$location", "auth", "Sensors", "Modules"];
	MainController.$inject = ["$scope", "$interval", "IntServ", "ALRM", "Notification", "Sets", "TIME", "Sensors", "Modules"];
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
;
(function () {
	'use scrict';

	configAlarms.$inject = ["$stateProvider"];
	runAlarms.$inject = ["$rootScope", "$log", "ALRM"];
	AlarmService.$inject = ["$rootScope", "Sensors", "Modules"];
	angular
		.module('obm.alarms', [
			'ui.router',
		])

		.config(configAlarms)
		.run(runAlarms)
		.service('ALRM', AlarmService)
	//		.filter('renderBool', renderBoolFun)
	//		.filter('onlyActive', onlyActiveFun)

	/*function onlyActiveFun() {
		return function (items) {
			var result = {};
			angular.forEach(items, function (value, key) {
				if (value.active) {
					result[key] = value;
				};
			});
			return result;
		};
	}*/

	/*function renderBoolFun() {
		return function (input) {
			var out = 0;
			if (input == true) {
				out = 1;
			} else {
				out = 0;
			}
			return out;
		}
	}*/

	function AlarmService($rootScope, Sensors, Modules) {

		this._messages = [
			"Message 1",
			"Message 2",
			"Message 3",
			"Message 4",
			"Message 5",
			"Message 6",
			"Message 7",
			"Message 8",
			"Message 9"
		];

		var _list = [];
		var _num = 0;
		var _lastId = 0;

		this.getList = function () {
			return _list;
		}

		this.addPack = function (arr) {
			arr.forEach(function (item, i, arr) {
				//console.log(item.name);
				_list.push({
					"id": _lastId,
					"sensorId": i,
					"max": 'ERROR',
					"min": 'ERROR',
					"type": 'error',
					"active": false,
					"ack": false,
					"message": item.title + " is in ERROR State!"
				});
				_lastId++;
			})
		}

		this.addNew = function (sensor, max, min, type) {
			var sensorId = Sensors.find(sensor);
			_list.push({
				"id": _lastId,
				"sensorId": sensorId,
				"max": max,
				"min": min,
				"type": type,
				"active": false,
				"ack": false,
				"message": "Test"
			});
			_lastId++;
		}

		this.check = function () {
			_num = 0;

			_list.forEach(function (item, i, arr) {

				// ерроры модулей
				if (item.max == 'ERROR') {
					var m = Modules.show()[item.sensorId];
					var val = m.value[0];
					var bcast = true;

					if (item.active == true) {
						bcast = false;
					}

					var activeness = false;
					if (val == 'ERROR') {
						activeness = true;
						_num++;
					}
					item.active = activeness;

				} else {
					// ерроры сенсоров
					var s = Sensors.show()[item.sensorId];
					var val = s.value[0];
					var bcast = true;

					if (item.active == true) {
						bcast = false;
					}

					var text = " ";
					var activeness = false;
					var onlyMax = false;
					var onlyMin = false;
					if (item.max === null) {
						onlyMin = true;
						//console.log('onlyMin');
					}
					if (item.min === null) {
						onlyMax = true;
						//console.log('onlyMax');
					}

					if (!onlyMax && val < item.min) {
						text = "lower";
						activeness = true;
						_num++;
					}
					if (!onlyMin && val > item.max) {
						text = "higher";
						activeness = true;
						_num++;
					}

					item.active = activeness;
					item.message = "Value of " + s.title + " is " + text + " than threshold!";

				}

				// бродкастим аларм
				if (item.active == true && bcast == true) {
					$rootScope.$broadcast('alarm', {
						"alarm": item,
						"title": item.type
					});
				}
			});

			
		}

		this.getNum = function () {
			return _num;
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
;
(function () {
    'use scrict';

    AuthService.$inject = ["$http", "session", "$state"];
    sessionService.$inject = ["$log", "localStorage"];
    localStorageServiceFactory.$inject = ["$window"];
    angular
        .module('obm.auth', ['ui.router'])
        .config(configAuth)
        .service('auth', AuthService)
        .service('session', sessionService)
        .factory('localStorage', localStorageServiceFactory)
        .run(assServToRootScope)

    function assServToRootScope($rootScope, session, auth) {
        $rootScope.auth = auth;
        $rootScope.session = session;
    }
    assServToRootScope.$inject = ['$rootScope', 'session', 'auth'];

    function localStorageServiceFactory($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }

    function sessionService($log, localStorage) {
        this._user = JSON.parse(localStorage.getItem('session.user'));
        this._accessToken = localStorage.getItem('session.accessToken');

        this.getUser = function () {
            //this._user = localStorage.getItem('session.user');
            return this._user;
        };

        this.setUser = function (user) {
            this._user = user;
            localStorage.setItem('session.user', JSON.stringify(user));
            return this;
        };

        this.getAccessToken = function () {
            return this._accessToken;
        };

        this.setAccessToken = function (token) {
            this._accessToken = token;
            localStorage.setItem('session.accessToken', token);
            return this;
        };

        this.destroy = function destroy() {
            this.setUser(null);
            this.setAccessToken(null);
        };

    }

    function AuthService($http, session, $state) {
        // Проверяем залогинен ли
        this.isLoggedIn = function isLoggedIn() {
            //console.log(session.getUser());
            var vvv = session.getUser();
            if (vvv == "null" || vvv == 'null' || vvv == null) {
                return false;
                //console.log('false');
            } else {
                return session.getUser() !== "null";
            }

        };

        this.isAdmin = function isAdmin() {

            //var uuu = session.getUser();
            // var name = uuu.name;
            // console.log(uuu + uuu.name);

            return session.getUser().name == 'admin';


        };


        // Логин

        this.logIn = function (uuu) {

            return $http
                .get(uuu + '.json')
                //.post('/login.json',credentials)
                .then(function (response) {
                    console.log(response.data);
                    var data = response.data;
                    session.setUser(data.user);
                    session.setAccessToken(data.accessToken);
                    $state.go('home');
                });
        };

        // log out

        this.logOut = function () {
            return $http
                .get('/logout.json')
                .then(function (response) {
                    // убиваем сессию
                    session.destroy();
                    $state.go('login');
                });
        };
    }


    function configAuth() {

    }

})();
;(function(){
	'use scrict';

		configDiag.$inject = ["$stateProvider"];
		getTreeController.$inject = ["$scope", "$rootScope", "$document", "Notification"];
	angular
		.module('obm.diag', [
			'ui.router',
		])

		.config(configDiag)
		.controller('GetTreeCtrl', getTreeController)

		function getTreeController($scope,$rootScope,$document,Notification){


		}

		function configDiag($stateProvider){

			var mName = 'diag';
			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
				controller: 'GetTreeCtrl'
			});
		}


})();
;
(function () {
	'use scrict';

	configHome.$inject = ["$stateProvider"];
	HomeController.$inject = ["IntServ", "$scope", "$log"];
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
;
(function () {
    'use scrict';

    IntouchServer.$inject = ["$http"];
    angular
        .module('obm.intouch', [])
        .config(configIntouch)

        .service('IntServ', IntouchServer)

    /*
    .run(IntServStatus)

    function IntServStatus($rootScope,IntServ){
        $rootScope.IntServ = IntServ;
    }*/

    function IntouchServer($http) {

        this.intervalBusy = false;

        this.Test = function (req) {
            this.intervalBusy = true;
            return $http({
                method: 'GET',
                url: 'tree.json'
            });
        };


        this.Custom = function (url, req) {

            return $http({
                method: 'POST',
                url: '/' + url,
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        this.PostRequest = function (req) {
            this.intervalBusy = true;
            return $http({
                method: 'POST',
                url: '/intouch_serv',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        this.TasksRequest = function () {

            var req = JSON.stringify({
                "action": "get",
                "type": "schedule"
            });
            return $http({
                method: 'POST',
                url: '/scheduler',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        this.Scheduler = function (req) {
            return $http({
                method: 'POST',
                url: '/scheduler',
                data: req,
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    }

    function configIntouch() {

    }

})();
;
(function () {
  'use scrict';

  configLogin.$inject = ["$stateProvider"];
  LoginController.$inject = ["$scope", "auth"];
  angular
    .module('obm.login', [
      'ui.router',
    ])

    .config(configLogin)
    .controller('LgnCtrl', LoginController)

  function LoginController($scope, auth) {
    //console.log('d');
    var vm = this;

    vm.logIn = function (user, pass) {

      switch (user) {
        case 'obm': // if (x === 'value1')

          if (pass == 'obm') {
            auth.logIn(user);
          } else {
            //console.log('Ъуй' + pass + user);
            vm.error = 'WRONG USERNAME OR PASSWORD!'
          };

          break;

        case 'admin': // if (x === 'value2')

          if (pass == 'admin') {
            auth.logIn(user);
          } else {
            //console.log('Ъуй' + pass + user);
            vm.error = 'WRONG USERNAME OR PASSWORD!'
          };

          break;

        default:

          //console.log('Ъуй' + pass + user);
          vm.error = 'WRONG USERNAME OR PASSWORD!'
          break;
      }

    }


  }


  function configLogin($stateProvider) {
    var mName = 'login';
    $stateProvider.state(mName, {
      url: '/' + mName,
      templateUrl: 'app/' + mName + '/index.html',
      controller: 'LgnCtrl',
      controllerAs: 'vm'
    });
  }


})();
;
(function () {
	'use scrict';

	configOdo.$inject = ["$stateProvider"];
	odometerController.$inject = ["$scope", "$log", "IntServ"];
	angular
		.module('obm.odo', [
			'ui.router',
		])

		.config(configOdo)

		.filter('direction', odoDirectionFilter)
		.controller('OdoCtrl', odometerController)

	function odoDirectionFilter() {
		return function (input) {
			var out;
			if (input == 1) {
				out = 'Backward';
			}

			if (input == 0) {
				out = 'Forward';
			}
			return out;

		}
	}

	function odometerController($scope, $log, IntServ) {

		$scope.status = {
			"status": "null"
		};

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

		$scope.odoEmul = function (value) {
			if (value == 1) {
				var req = JSON.stringify({
					"action": "set",
					"type": "switch",
					"name": "201",
					"value": "1"
				});
			} else {
				var req = JSON.stringify({
					"action": "set",
					"type": "switch",
					"name": "202",
					"value": "1"
				});
			}
			IntServ.PostRequest(req).then(onSuccess, onError);
		}

		$scope.odoSpeedUp = function () {

			var req = JSON.stringify({
				"action": "set",
				"type": "switch",
				"name": "205",
				"value": "1"
			});
			IntServ.PostRequest(req).then(onSuccess, onError);
		}

		$scope.odoSpeedDown = function () {
			var req = JSON.stringify({
				"action": "set",
				"type": "switch",
				"name": "206",
				"value": "1"
			});

			IntServ.PostRequest(req).then(onSuccess, onError);
		}

		$scope.odoDir = function (value) {
			if (value == 1) {
				var req = JSON.stringify({
					"action": "set",
					"type": "switch",
					"name": "207",
					"value": "1"
				});
			} else {
				var req = JSON.stringify({
					"action": "set",
					"type": "switch",
					"name": "208",
					"value": "1"
				});
			}

			IntServ.PostRequest(req).then(onSuccess, onError);
		}
	}


	function configOdo($stateProvider) {
		var mName = 'odo';

		$stateProvider.state(mName, {
			url: '/' + mName,
			templateUrl: 'app/' + mName + '/index.html',
		});
	}


})();
;(function(){
	'use scrict';

		configPower.$inject = ["$stateProvider"];
		PowerController.$inject = ["$scope", "$log", "IntServ"];
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
;
(function () {
  'use scrict';

  configSchedule.$inject = ["$stateProvider"];
  schController.$inject = ["$scope", "$uibModal", "IntServ"];
  modalInstanceController.$inject = ["$uibModalInstance", "$scope", "status", "schedule", "IntServ"];
  angular
    .module('obm.schedule', [
      'ui.router',
    ])

    .config(configSchedule)
    .controller('SchCtrl', schController)
    .controller('ModalInstanceCtrl', modalInstanceController)

  function modalInstanceController($uibModalInstance, $scope, status, schedule, IntServ) {
    var $ctrl = this;

    $ctrl.schedule = schedule;
    $ctrl.status = status;

    $scope.today = function () {
      var cur = new Date().getTime();
      cur = Math.round(cur / 3600000) * 3600000;

      var stdate = new Date(cur + 3600000);

      var endate = new Date(cur + 18000000 + 3600000);

      $ctrl.FormData = {};
      $ctrl.FormData.dt = stdate;
      $ctrl.FormData.edt = endate;

    };

    $scope.today();

    $scope.$watch("$ctrl.FormData.dt", function (newValue, oldValue) {

      var msdt = $ctrl.FormData.dt.getTime();
      var msedt = $ctrl.FormData.edt.getTime();

      if (msdt >= msedt) {
        $ctrl.FormData.edt = new Date(msdt + 18000000);
      }
    });

    $scope.plusMin = function (x) {
      //var mins = $scope.dt.getMinutes;
      if (x == 1) {
        var ttime = $ctrl.FormData.dt.getTime();
        $ctrl.FormData.dt = new Date(ttime + 1800000);
      } else {
        var ttime = $ctrl.FormData.edt.getTime();
        $ctrl.FormData.edt = new Date(ttime + 1800000);
      }

    }

    $scope.minusMin = function (x) {
      if (x == 1) {
        var ttime = $ctrl.FormData.dt.getTime();
        $ctrl.FormData.dt = new Date(ttime - 1800000);

      } else {
        var ttime = $ctrl.FormData.edt.getTime();
        $ctrl.FormData.edt = new Date(ttime - 1800000);
      }

    }

    $scope.clear = function () {
      $ctrl.FormData.dt = null;
      $ctrl.FormData.edt = null;

    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.formats = ['dd MMMM yyyy | HH:mm', 'yyyy MMMM dd | HH:mm'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['dd MMMM yyyy | HHmm'];

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
      $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    }

    $ctrl.ok = function () {

      var newTask = {
        "action": "add",
        "type": "schedule",
        "task": {
          "begin_time": {
            "year": 1970,
            "month": 1,
            "day": 1,
            "hour": 0,
            "minutes": 0
          },
          "end_time": {
            "year": 2018,
            "month": 7,
            "day": 25,
            "hour": 18,
            "minutes": 0
          }
        }
      };


      if ($ctrl.FormData.dt === null || $ctrl.FormData.edt === null || $ctrl.FormData.dt === undefined || $ctrl.FormData.edt === undefined) {


      } else {
        newTask.task.begin_time.year = $ctrl.FormData.dt.getFullYear();
        newTask.task.begin_time.month = $ctrl.FormData.dt.getMonth() + 1;
        newTask.task.begin_time.day = $ctrl.FormData.dt.getDate();
        newTask.task.begin_time.hour = $ctrl.FormData.dt.getHours();
        newTask.task.begin_time.minutes = $ctrl.FormData.dt.getMinutes();

        newTask.task.end_time.year = $ctrl.FormData.edt.getFullYear();
        newTask.task.end_time.month = $ctrl.FormData.edt.getMonth() + 1;
        newTask.task.end_time.day = $ctrl.FormData.edt.getDate();
        newTask.task.end_time.hour = $ctrl.FormData.edt.getHours();
        newTask.task.end_time.minutes = $ctrl.FormData.edt.getMinutes();

        var req = JSON.stringify(newTask);

        $uibModalInstance.close(req);


      }

    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  function schController($scope, $uibModal, IntServ) {

    var $ctrl = this;
    $ctrl.scheduleValid = false;
    $ctrl.schedule = [];

    $ctrl.dateFormats = [
      'yyyy MMMM dd | HH:mm',
      'dd MMMM yyyy | HH:mm'
    ];

    $ctrl.dateFormat = $ctrl.dateFormats[0];

    $ctrl.getSchedule = function () {
      var status = '5';
      IntServ.TasksRequest().then(function (resp) {

        $ctrl.schedule = resp.data.schedule;
        $ctrl.schedule.forEach(function (item, i, arr) {

          item.TimeStart = new Date(item.begin_time.year,
            item.begin_time.month - 1,
            item.begin_time.day,
            item.begin_time.hour,
            item.begin_time.minutes, 0, 0);

          item.TimeEnd = new Date(item.end_time.year,
            item.end_time.month - 1,
            item.end_time.day,
            item.end_time.hour,
            item.end_time.minutes, 0, 0);

        });

        $ctrl.readstatus = "Reading OK!";
        $ctrl.scheduleValid = true;

      }, function (resp) {
        //console.log(resp);
        $ctrl.status = "Error reading schedule!";
        $ctrl.scheduleValid = false;
      });

      //return status;
    };
    /////////////////
    $ctrl.getSchedule();
    //$ctrl.status = $ctrl.readstatus;
    ////////////////////


    $scope.deleteTask = function (num) {
      var id = $ctrl.schedule[num].id;

      var cmd = {
        "action": "del",
        "type": "schedule",
        "task": {
          "id": id
        }
      };

      var req = JSON.stringify(cmd);

      console.log(req);
      IntServ.Scheduler(req).then(function (resp) {
        console.log(resp.data);
        //$ctrl.getSchedule();
        $ctrl.status = 'Task deleted!';
        $ctrl.schedule.splice(num, 1);
        $ctrl.getSchedule();
      }, function (resp) {
        console.log('Error deleting Task!');
        $ctrl.status = 'Error deleting task!';
      });


    }



    $ctrl.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'newTask.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        resolve: {
          status: function () {
            return $ctrl.status;
          },
          schedule: function () {
            return $ctrl.schedule;
          }
        }
      });

      modalInstance.result.then(function (status) {
        //console.log(status);
        IntServ.Scheduler(status).then(function (resp) {
          console.log(resp.data);
          $ctrl.getSchedule();
          $ctrl.status = 'Task added!';

        }, function (resp) {
          console.log('Error adding new Task!');
          $ctrl.status = 'Error adding new task!';
        });



      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

  }


  function configSchedule($stateProvider) {
    var mName = 'schedule';


    $stateProvider.state(mName, {
      url: '/' + mName,
      templateUrl: 'app/' + mName + '/index.html',
    });
  }


})();
;
(function () {
    'use scrict';

    configSettings.$inject = ["$stateProvider"];
    SettingsController.$inject = ["$scope", "IntServ", "Sets"];
    SettingsService.$inject = ["IntServ"];
    angular
        .module('obm.settings', [
            'ui.router',
        ])

        .config(configSettings)
        .controller('SetCtrl', SettingsController)
        .directive('numValidator', numValidatorDirective)
        .service('Sets', SettingsService)
        .run(setsToRootScope)

    function setsToRootScope($rootScope, Sets) {
        $rootScope.Sets = Sets;
    }
    setsToRootScope.$inject = ['$rootScope', 'Sets'];

    function SettingsService(IntServ) {
        
        var s = this;
        s.tags = 'h';
        s.searchText = '';

        s.applyFilter = function applyFilter(str){
            if (str == 0) {
                s.searchText = '';
                s.tags.forEach(function(item){
                    item.active = false;
                });
            } else {
                s.searchText = str;
                s.tags.forEach(function(item){
                    item.active = false;
                    if (item.value == str) {
                        item.active = true;
                    }
                });
            }
        }

        s.Settings = function Settings() {
            return s.settings;
        }
        s.Keys = function Keys() {
            return s.settingsKeys;
        }

        s.Load = function () {

            var req = JSON.stringify({
                "action": "get",
                "type": "settings"
            });
            IntServ.PostRequest(req).then(function (resp) {
                var tempSets = resp.data.settings;

                if (tempSets === null || tempSets === undefined) {
                    console.log('Settings returned undefined');
                    return;
                }

                s.settings = tempSets;
                var keys = Object.keys(tempSets);
                s.settingsKeys = [];

                s.tags = [];
                keys.forEach(function (item, i, arr) {
                    s.settingsKeys[i] = {};
                    var obj = s.settings[item];
                    s.settingsKeys[i].name = item;
                    s.settingsKeys[i].admin = obj.admin;
                    s.settingsKeys[i].max = obj.max;
                    s.settingsKeys[i].min = obj.min;
                    s.settingsKeys[i].type = obj.type;
                    s.settingsKeys[i].unit = obj.unit;

                    if (!obj.hasOwnProperty('category')) {
                        s.settings[item].category = '# General';
                    }
                    var current = s.settings[item].category;

                    yes = false;
                    s.tags.forEach(function(item,i){
                        if (current == item.value) {
                            yes = true;
                        } 
                    });
                    if (!yes) {
                        s.tags.push(
                            {
                                "value":s.settings[item].category,
                                "active":false
                            } 
                        )
                    } 

                    s.settingsKeys[i].category = s.settings[item].category;
                });


                //console.log(s.tags);
            }, function (resp) {
                s.settings = "Error!";
                console.log('Error reading settings!');
            });
        }

        s.Save = function () {
            var out = {};
            s.settingsKeys.forEach(function (item, i, arr) {
                if (s.settings[item.name].type == 'int' || s.settings[item.name].type == 'double' || s.settings[item.name].type == 'select') {
                    s.settings[item.name].value = parseFloat(s.settings[item.name].value);
                };
                s.settings[item.name].value;
            });

            out["settings"] = s.settings;

            var req = JSON.stringify(out);
            s.status = req;
            IntServ.PostRequest(req).then(function (resp) {
                //s.Load();

            }, function (resp) {
                //s.Load();
                //window.alert('Error!');
            });
        }
    }

    function numValidatorDirective() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function myValidation(value) {
                    var val = parseFloat(value);
                    if (val >= attr.min && val <= attr.max) {
                        mCtrl.$setValidity('charE', true);
                    } else {
                        mCtrl.$setValidity('charE', false);
                    }
                    return value;
                }
                mCtrl.$parsers.push(myValidation);
            }
        };
    }

    function SettingsController($scope, IntServ, Sets) {
        Sets.Load();
    }

    function configSettings($stateProvider) {
        var mName = 'settings';
        $stateProvider.state(mName, {
            url: '/' + mName,
            templateUrl: 'app/' + mName + '/index.html',
        });
    }


})();
;
(function () {
    'use scrict';

    runTime.$inject = ["$rootScope", "$log", "TIME"];
    TimeService.$inject = ["$filter"];
    angular
        .module('obm.time', [])

        .config(configTime)
        .run(runTime)
        .service('TIME', TimeService)

    function TimeService($filter) {
        this.num = 0;
        this.tzone = '';

        this.valid = false;

        this.GetDate = function GetDate() {
            var format = 'dd MMMM yyyy | HH:mm';
            var timezone = this.tzone;

            if (timezone == 'CET') {
                timezone = '+0100';
            }
            if (timezone == 'CEST') {
                timezone = '+0200';
            }

            var date = new Date(this.num * 1000);

            if (this.num > 0) {
                this.valid = true;
            } else {
                this.valid = false;
            }

            return $filter('date')(date, format, timezone);
        }
    }

    function runTime($rootScope, $log, TIME) {
        $rootScope.TIME = TIME;
    }

    function configTime() {

    }


})();
;
(function () {
	'use scrict';

	configTranslate.$inject = ["$translateProvider"];
	TranslateController.$inject = ["$translate", "$scope", "localStorage"];
	translationsEN = {
		'mainButton': 'Main',
		'odoButton': 'Odometer',
		'diagnosticsButton': 'Diagnostics',
		'powerControlButton': 'PowerCtrl',
		'schedulerButton': 'Scheduler',
		'signalsButton': 'Signals',
		'upsButton': 'UPS Status',
		'MAIN_TITLE': 'OBM Control System',
		'BUTTON_LANG_DE': 'Deutsch',
		'BUTTON_LANG_EN': 'English',
		'BUTTON_LANG_RU': 'Русский',
		'WEB_SITE': 'Web-site',
		'SPC_INFOTRANS': 'SPC INFOTRANS',
		'LEGAL_INFO': 'Legal Info',
		'_main': 'Main',
		'_power': 'Power',
		'_odo': 'Odometer',
		'_diag': 'Diagnostics',
		'_tasks': 'Scheduler',
		'_alarms': 'Alarms',
		'_settings': 'Settings',
		'_connlost': 'Server connection lost',
		'_save': 'Save',
		'create_new_task': 'Create New Task',

		'ON': 'ON',
		'WAIT': 'WAIT',
		'OFF': 'OFF',
		'NA': 'n/a',
		'ERROR': 'ERROR',

		'degC': '°C',

		'MR_STAND_BY': 'StandBy',
		'MR_PRE_STAND_BY': 'Pre StandBy',
		'MR_MEASURE': 'Measure',
		'MR_READY': 'Ready',
		'MR_RUN_READY': 'Starting...',
		'MR_RUN_MEASURE': 'Starting measure...',
		'MR_RUN_STAND_BY': 'Stopping...',
		'MR_OFF': 'System Off',
		'MR_ERROR': 'System Error!',
		'MR_RUN_OFF': 'Shutdown...',
		'_STDBY': 'StdBy',
		'_OFF': 'OFF',
		'_OFFALL': 'Switch Off',
		'_ON': 'ON',
		'_START': 'Start',
		'_STOP': 'Stop',
		'_title': 'Title',
		'_timestart': 'Time of start',
		'_timeend': 'Time of end',
		'_finished': 'Finished',
		'_delete': 'Delete',
		'_upserror': 'UPS Error',
		'_error': 'Fehler',
		'_emulatorspeed': 'Emulator speed',
		'_emulatordirection': 'Emulator direction',
		'_emulatormode': 'Emulator mode',
		'_forward': 'Forward',
		'_backward': 'Backward',
		'_powersupply': 'Power and supply',
		'_centralsystem': 'Central system',
		'_auxsystem': 'Aux systems',
		'_networks': 'Networks',
		'_sensors': 'Sensors',
		'_storage': 'Storage',
		'_automode': 'Auto',
		'_manualmode': 'Manual',
		'_speed': 'Speed',
		'CENTRAL_SYSTEM': 'Central system',
		'ses': 'SES',
		'UPS': 'UPS',
		'Units': 'Units',
		'MAIN_ERROR': 'Server connection error!',
		'control_mode': 'Control mode',
		'max_frame_temp': 'Maximal frame temperature alarm',
		'max_frame_sign': 'Max frame sign',
		'automeasure_speed_record': 'Automeasure speed threshold',
		'automeasure_staying_time': 'Automeasure staying time',
		'debug': 'Debug mode',
		'send_data_email': 'Email for sending data',
		'send_data_sms': 'Mobile number for sending sms',
		'wheel_d': 'Odometer wheel diameter',
		'cut_measure': 'Cut Measure',
		'balis_speed_on': 'ETCS Balise Reader switch on speed',
		'balis_speed_off': 'ETCS Balise Reader switch off speed',
		'ext_power_time': 'Time to work on Battery',
		'ext_power_runtime': 'Remaining battery time alarm',

		'Balisa':'ETCS Balise Reader',
		'DYNSYS':'Axle box acceleration sensors',

		'y_axle_11_sens_k':'y_axle_11_sens, K',
		'y_axle_12_sens_k':'y_axle_12_sens, K',
		'y_axle_21_sens_k':'y_axle_21_sens, K',
		'y_axle_22_sens_k':'y_axle_22_sens, K',
		'y_axle_42_sens_k':'y_axle_42_sens, K',
		'y_axle_41_sens_k':'y_axle_41_sens, K',
		'z_axle_11_sens_k':'z_axle_11_sens, K',
		'z_axle_12_sens_k':'z_axle_12_sens, K',
		'z_axle_21_sens_k':'z_axle_21_sens, K',
		'z_axle_22_sens_k':'z_axle_22_sens, K',
		'z_axle_41_sens_k':'z_axle_41_sens, K',
		'z_axle_42_sens_k':'z_axle_42_sens, K',
		'y_bogie_1_sens_k':'y_bogie_1_sens, K',
		'y_bogie_2_sens_k':'y_bogie_2_sens, K',
		'y_bogie_3_sens_k':'y_bogie_3_sens, K',
		'y_bogie_4_sens_k':'y_bogie_4_sens, K',
		'y_body_I_sens_k' : 'y_body_I_sens, K',
		'y_body_II_sens_k':'y_body_II_sens, K',
		'z_body_I_sens_k' : 'z_body_I_sens, K', 
		'z_body_II_sens_k':'z_body_II_sens, K',

		'y_axle_11_sens_b':'y_axle_11_sens, B',
		'y_axle_12_sens_b':'y_axle_12_sens, B',
		'y_axle_21_sens_b':'y_axle_21_sens, B',
		'y_axle_22_sens_b':'y_axle_22_sens, B',
		'y_axle_42_sens_b':'y_axle_42_sens, B',
		'y_axle_41_sens_b':'y_axle_41_sens, B',
		'z_axle_11_sens_b':'z_axle_11_sens, B',
		'z_axle_12_sens_b':'z_axle_12_sens, B',
		'z_axle_21_sens_b':'z_axle_21_sens, B',
		'z_axle_22_sens_b':'z_axle_22_sens, B',
		'z_axle_41_sens_b':'z_axle_41_sens, B',
		'z_axle_42_sens_b':'z_axle_42_sens, B',
		'y_bogie_1_sens_b':'y_bogie_1_sens, B',
		'y_bogie_2_sens_b':'y_bogie_2_sens, B',
		'y_bogie_3_sens_b':'y_bogie_3_sens, B',
		'y_bogie_4_sens_b':'y_bogie_4_sens, B',
		'y_body_I_sens_b' : 'y_body_I_sens, B',
		'y_body_II_sens_b':'y_body_II_sens, B',
		'z_body_I_sens_b' : 'z_body_I_sens, B', 
		'z_body_II_sens_b':'z_body_II_sens, B',
		
		'aq_sens_k':'aq_sens, K',
		'aq_sens_b':'aq_sens, B',

		'z_d_ps_11_k':'z_d_ps_11, K',
		'z_d_ps_11_b':'z_d_ps_11, b',
		'z_d_ps_12_k':'z_d_ps_12, K',
		'z_d_ps_12_b':'z_d_ps_12, b',
		'z_d_ps_21_k':'z_d_ps_21, K',
		'z_d_ps_21_b':'z_d_ps_21, b',
		'z_d_ps_22_k':'z_d_ps_22, K',
		'z_d_ps_22_b':'z_d_ps_22, b'
	}

	translationsRU = {



	}

	translationsDE = {

	}

	angular
		.module('obm.translate', [
			'pascalprecht.translate'

		])
		.config(configTranslate)
		.controller('TransCtrl', TranslateController);

	function configTranslate($translateProvider) {
		$translateProvider.translations('en', translationsEN);
		$translateProvider.translations('ru', translationsRU);

		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en');
	}

	function TranslateController($translate, $scope, localStorage) {
		//console.log('Language ctrl');

		var lk = localStorage.getItem('language-obm');

		if (!(lk == null)) {
			//console.log(lk);
			$translate.use(lk);
		}


		$scope.changeLanguage = function (langKey) {
			//console.log('Language change ' + langKey);
			$translate.use(langKey);
			localStorage.setItem('language-obm', langKey);
		};
	}

})();
;
(function () {
	'use scrict';

	configTrends.$inject = ["$stateProvider"];
	ChartController.$inject = ["Trends", "Canvas", "$rootScope"];
	TrendsService.$inject = ["IntServ", "$interval", "$rootScope"];
	CanvasService.$inject = ["Trends"];
	runTrends.$inject = ["$rootScope", "Trends", "$transitions"];
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
		var canvas = null;
		var ctx = null

		var xx = 2.5;
		var leftMargin = 0;
		var bottomMargin = 30;
		var rightMargin = 40;
		var yy = 2.5;

		var plotHeight = 170; //px

		var xMin = 0;
		var xMax = 300;
		var yMax = -1024000;
		var yMin = 1024000;

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
			canvasCont = document.getElementById("CanvasContainer");
			canvas = document.getElementById("TrendCanvas");
			ctx = canvas.getContext('2d');

			if (Trends.active) {

				numberOfPlots = Trends.selectedList.length;

				canvas.width = Math.round(canvasCont.getBoundingClientRect().width);
				canvas.height = numberOfPlots * (plotHeight) + yy;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				ctx.lineWidth = 1;

				kk = 0;

				for (var i = 0; i < numberOfPlots; i++) {

					var f = 0;
					if (i > 0) {
						f = 1;
					}

					curPlot = {
						x1: xx + leftMargin,
						y1: yy + i * plotHeight,
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
					var tickGap = 10;
					var tnum = xMax / tickGap;

					for (var k = curPlot.xMin + tickGap; k < curPlot.xMax; k = k + tickGap) {
						ctx.beginPath();
						ctx.strokeStyle = "#CCC";
						
						var tickPoint=Point2D(curPlot,k,0);

						ctx.moveTo(tickPoint.x, curPlot.y2-2);
						ctx.lineTo(tickPoint.x, curPlot.y1+2);
						ctx.stroke();
					}

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
;(function(){
	'use scrict';

		configUps.$inject = ["$stateProvider"];
	angular
		.module('obm.ups', [
			'ui.router',
		])

		.config(configUps)

		function configUps($stateProvider){
			var mName = 'ups';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();
;
(function () {
	'use scrict';

	configUsers.$inject = ["$stateProvider"];
	angular
		.module('obm.users', [
			'ui.router',
		])

		.config(configUsers)

	function configUsers($stateProvider) {
		var mName = 'users';

		$stateProvider.state(mName, {
			url: '/' + mName,
			templateUrl: 'app/' + mName + '/index.html',
		});
	}


})();