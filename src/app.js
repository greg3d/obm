;(function(){
	'use scrict';

		configObm.$inject = ["$urlRouterProvider", "NotificationProvider"];
		runObm.$inject = ["$rootScope", "$locale", "$state", "$location", "auth"];
		MainController.$inject = ["$scope", "$http", "$interval", "$filter", "IntServ", "ALRM", "Notification", "Sets", "TIME"];
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

		function MainController($scope,$http,$interval,$filter,IntServ,ALRM,Notification,Sets,TIME){

			// Функция inArray - проверят, есть ли указанное значение в массиве
			var inArray = function(needle, haystack, strict) {
					var found = -1, key, strict = !!strict;
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

			$scope.fullTree = " ";
			$scope.mainError = false;

			// дизаблим кнопки
			$scope.startDisabled=true;
			$scope.stopDisabled=true;
			$scope.onDisabled=true;
			$scope.offDisabled=true;
			$scope.offAllDiabled=false;

			$scope.ajaxloading=false;

			// Загружаем настроечки один раз
			Sets.Load();

			//// REQUEST /////
			$interval(function() {
				testRequest();
			},1000);


			// req function
			var testRequest = function(){

				// Берем главное дерево
				var req = JSON.stringify({"action": "get","type": "status"});

				IntServ.PostRequest(req).then(function(resp){
					IntServ.intervalBusy = false;
					$scope.fullTree = resp.data;
					$scope.mainError = false;
					// Гланый режим
					$scope.mode = resp.data.mode;

					if (angular.isDefined($scope.fullTree.time)) {
						TIME.num = $scope.fullTree.time.time_t;
						TIME.tzone = $scope.fullTree.time.tm_zone;
					}

				    if (Sets.settings.debug.value == false){
						if ($scope.mode == 'MR_STAND_BY' || $scope.mode == 'MR_OFF' || $scope.mode == 'MR_RUN_STAND_BY' || $scope.mode == 'MR_PRE_STAND_BY'){
							$scope.startDisabled=true;
							$scope.stopDisabled=true;
							$scope.onDisabled=false;
							$scope.offDisabled=true;
							$scope.offAllDiabled=false;
						}

						if ($scope.mode == 'MR_READY'){
							$scope.startDisabled=false;
							$scope.stopDisabled=true;
							$scope.onDisabled=true;
							$scope.offDisabled=false;
							$scope.offAllDiabled=false;
						}

						if ($scope.mode == 'MR_MEASURE' || $scope.mode == 'MR_RUN_MEASURE'){
							$scope.startDisabled=true;
							$scope.stopDisabled=false;
							$scope.onDisabled=true;
							$scope.offDisabled=true;
							$scope.offAllDiabled=true;
						}

						if ($scope.mode == 'MR_RUN_READY'){
							$scope.startDisabled=true;
							$scope.stopDisabled=true;
							$scope.onDisabled=true;
							$scope.offDisabled=false;
							$scope.offAllDiabled=false;
						}


					} else {
						$scope.startDisabled=false;
						$scope.stopDisabled=false;
						$scope.onDisabled=false;
						$scope.offDisabled=false;
						$scope.offAllDiabled=false;
					}


					//var needNums = [1005,1006,1003,2002,2005,2008,2011,2014,2017,2020,2041,3001,3008,3013,4001,4003,4005,9000,9001,9002,9004,9011,9012,9013,9016];
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

						" 1005":"UPS Input",
						" 1006":"UPS Output",
						" 1003":"UPS Status",


						" 2002":"Odometer",
						" 2005":"EuroBalis Recv",
						" 2008":"EuroBalis Emitter",
						" 2011":"IMU",
						" 2014":"Rail Moisture Sensor",
						" 2017":"Tensometrics",
						" 2020":"ADC",
						" 2041":"Synchronisation",

						" 3001":"NAS 1",
						" 3008":"Main Controller K000",
						//3013:"K DOP",
						//4001:"Hardware Button",
						" 4003":"Record Indicator 1",
						" 4005":"Record Indicator 2",

						" 9000":"Rack temperature",
						" 9001":"Outdoor sernsor 1",
						" 9002":"Outdoor sernsor 2",
						" 9004":"Relative Hum",
						" 9011":"UPS Remaining time",
						" 9012":"UPS Charge",
						" 9013":"UPS Output freq",
						" 9016":"UPS Load",
						" 9017":"Input Voltage",
						" 9014":"Output Voltage"
					};

					/// alarm notifications///

					/*if (ALRM.hasNew1()) {
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
						//var al = ALRM.getLast();
						//Notification({message: al.message, title: al.title, onClose: ALRM.ack(al.id)},al.type);
					};*/

					var needNums = Object.keys(titles);
					//
					$scope.testNums=titles;

					var modules = resp.data.modules;
					var sensors = resp.data.sensors;
					var uNum = 0;

					var arr1 = [];
					var arr2 = [];
					var arr3 = [];
					var arr4 = [];

					var posi = 0;

					modules.forEach(function(item, i, arr){
						var iname = " "+item.name;
						var nn = inArray(iname,needNums);
						if (nn>-1){
							item.title = titles[iname];
							item.switch = false;
							item.pos = nn;
							posi++;

							switches.forEach(function(nnum,j,brr){
								if (" "+nnum == iname) {
									//console.log(nnum + ' ' + item.name);
									item.switch = true;
								}
							});

							item.visible = true;

							if (Math.floor(item.name/1000)==1){
								arr1.push(item);
							}
							if (Math.floor(item.name/1000)==2){
								arr2.push(item);
							}
							if (Math.floor(item.name/1000)==3){
								arr3.push(item);
							}
							if (Math.floor(item.name/1000)==4){
								arr4.push(item);
							}
						}
					});

					sensors.forEach(function(item, i, arr){
						var iname = " "+item.name;
						var nn = inArray(iname,needNums);
						item.visible = false;

						if (nn>-1){

							item.visible = true;
							item.title = titles[iname];

							if (iname == ' 9011') {
								var newVal = Math.floor(item.value[0]/60);
								item.value[0] = newVal;
								item.unit = 'min';
							}
						}
					});

					$scope.ups = arr1;
					$scope.units = arr2;
					$scope.controllers = arr3;
					$scope.ses = arr4;
					$scope.sensors = sensors;

				}, function errorCalback(response){
					console.log('Error reading status tree');
					$scope.mainError = true;
					IntServ.intervalBusy = false;

				});

			}


		}


		function configObm($urlRouterProvider,NotificationProvider){
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

		function runObm($rootScope,$locale,$state,$location,auth){
			$locale.NUMBER_FORMATS.GROUP_SEP = ' ';

			// ПРОВЕРЯЕМ НА ЛОГИН
			$rootScope.$on('$locationChangeStart', function(event,toState,toParams,fromState,fromParams,options){
				//console.log('dd');
				//window.alert('Смена локации');
				var publicPages = ['login'];
				var restrictedPage = publicPages.indexOf($location.path()) === -1;
				if (restrictedPage && !auth.isLoggedIn()){
					$state.go('login');
					event.preventDefault();
				}
			});
		}

})();
;(function(){
	'use scrict';

		configAlarms.$inject = ["$stateProvider"];
		runAlarms.$inject = ["$rootScope", "$log", "ALRM"];
		AlarmService.$inject = ["$rootScope"];
	angular
		.module('obm.alarms', [
			'ui.router',
		])

		.config(configAlarms)
		.run(runAlarms)
		.service('ALRM',AlarmService)
		.filter('renderBool',renderBoolFun)
		.filter('onlyActive',onlyActiveFun)

		function onlyActiveFun(){
			return function (items){
				var result = {};
				angular.forEach(items, function(value,key){
					if (value.active){
						result[key] = value;
					};
				});
				return result;
			};
		}

		function renderBoolFun(){
			return function(input) {
				var out = 0;
				if (input == true) {
					out=1;
				} else {
					out=0;
				}
				return out;
			}
		}

		function AlarmService($rootScope){

			//this.hasNew = false;
			this.last = "0";
			this.num = 0;
			this.hasNew = false;

			//this.get
			//this.idList = [];

			this.getIdList = function(){
				var idList = Object.keys($rootScope.alarms);
				return idList;
			}

			this.number = function number(){
				var keys = Object.keys($rootScope.alarms);
				var num = 0;
				keys.forEach(function(item, i, arr){
                    if ($rootScope.alarms[item].active == true){
                    	num++;
                    };
                });
                return num;
			}

			this.get = function(id){
                return $rootScope.alarms[id];
            };

            this.getLast = function(){
                return $rootScope.alarms[this.last];
                this.hasNew = false;
            };

            this.activate = function activate(id){
            	var old = $rootScope.alarms[id].active;
            	if (old==false) {
            		this.last = id;
            		this.hasNew = true;
            	} else {
            		this.hasNew = false;
            	}
                $rootScope.alarms[id].active = true;
            };

            this.deactivate = function deactivate(id){
                $rootScope.alarms[id].active = false;
                $rootScope.alarms[id].ack = false;
            };

            this.ack = function ack(id){
                $rootScope.alarms[id].ack = true;
            };
		}


		function runAlarms($rootScope,$log,ALRM){
			$rootScope.ALRM = ALRM;
			$rootScope.alarms = {
				"20001": {
					"id":"20001",
					"title":"_title20001",
					"message":"_message20001",
					"type":"warning"
				},
				"20002": {
					"id":"20002",
					"title":"_title20002",
					"message":"_message20002",
					"type":"error"
				},

				"20003": {
					"id":"20003",
					"title":"_title20003",
					"message":"_message20003",
					"type":"error"
				},

				"20004": {
					"id":"20004",
					"title": "_title20004",
					"message":"_message20004",
					"type":"error"
				},

				"20005": {
					"id":"20005",
					"title":"_title20005",
					"message":"_message20005",
					"type":"error"
				},

				"20006": {
					"id":"20006",
					"title":"_title20006",
					"message":"_message20006",
					"type":"error"
				},

			}

			var keys = Object.keys($rootScope.alarms);

			keys.forEach(function(item, i, arr){
				$rootScope.alarms[item].ack=false;
				$rootScope.alarms[item].active=false;
				$rootScope.alarms[item].new=false;

            });
		}

		function configAlarms($stateProvider){
			var mName = 'alarms';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});



		}


})();
;(function(){
	'use scrict';

		AuthService.$inject = ["$http", "session", "$state"];
        sessionService.$inject = ["$log", "localStorage"];
        localStorageServiceFactory.$inject = ["$window"];
	angular
		.module('obm.auth', ['ui.router'])
		.config(configAuth)
		.service('auth',AuthService)
        .service('session',sessionService)
        .factory('localStorage',localStorageServiceFactory)
        .run(assServToRootScope)

        function assServToRootScope($rootScope,session,auth) {
           $rootScope.auth = auth;
            $rootScope.session = session;
        }
        assServToRootScope.$inject = ['$rootScope','session','auth'];

        function localStorageServiceFactory($window){
            if ($window.localStorage) {
                return $window.localStorage;
            }
            throw new Error('Local storage support is needed');
        }

        function sessionService($log,localStorage){
            this._user = JSON.parse(localStorage.getItem('session.user'));
            this._accessToken = localStorage.getItem('session.accessToken');

            this.getUser = function(){
                //this._user = localStorage.getItem('session.user');
                return this._user;
            };

            this.setUser = function(user){
                this._user = user;
                localStorage.setItem('session.user',JSON.stringify(user));
                return this;
            };

            this.getAccessToken = function(){
                return this._accessToken;
            };

            this.setAccessToken = function(token){
                this._accessToken = token;
                localStorage.setItem('session.accessToken',token);
                return this;
            };

            this.destroy = function destroy(){
                this.setUser(null);
                this.setAccessToken(null);
            };

        }

		function AuthService($http,session,$state) {
            // Проверяем залогинен ли
            this.isLoggedIn = function isLoggedIn() {
                //console.log(session.getUser());
                var vvv = session.getUser();
                if (vvv=="null" || vvv=='null' || vvv==null ){
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

            this.logIn = function(uuu){

                return $http
                    .get('/'+uuu+'.json')
                    //.post('/login.json',credentials)
                        .then(function(response){
                           console.log(response.data);
                            var data = response.data;
                            session.setUser(data.user);
                            session.setAccessToken(data.accessToken);
                            $state.go('home');
                    });
            };

            // log out

            this.logOut = function(){
                return $http
                    .get('/logout.json')
                    .then(function(response){
                        // убиваем сессию
                        session.destroy();
                        $state.go('login');
                    });
            };
		}


		function configAuth(){

		}

})();
;(function(){
	'use scrict';

		configDiag.$inject = ["$stateProvider"];
		getTreeController.$inject = ["$scope"];
	angular
		.module('obm.diag', [
			'ui.router',
		])

		.config(configDiag)
		.controller('GetTreeCtrl', getTreeController)

		function getTreeController($scope){

			//console.log('fffe');
			//console.log($scope.onTable.lengtмh);

						//$scope.list1 = $scope.fullTree.modules;
						var uNum = 0;

						/*$scope.list1.forEach(function(item, i, arr){
							uNum = uNum + 1;
							item.id = uNum;
							item.coord = i.toString();

							if (item.nodes) {
								item.nodes.forEach(function(item2,i2,arr2){
									uNum = uNum + 1;
									item2.id = uNum;
									item2.coord = i.toString() + i2.toString();

									if (item2.nodes) {
										item2.nodes.forEach(function(item3,i3,arr3){
											uNum = uNum + 1;
											item3.id = uNum;
											item3.coord = i.toString() + i2.toString() + i3.toString();
										})
									}

								})
							}
						});*/


					$scope.doSomething = function(ev) {
					    var element = ev.srcElement ? ev.srcElement : ev.target;
					    angular.element(element).toggleClass('collapsed');
					    if (angular.element(element).hasClass('collapsed')){
					    	angular.element(element).html('+');
					    } else {
					    	angular.element(element).html('-');
					    }


					    //console.log(element, angular.element(element));
					}



					/*$scope.putOnTable = function(numer) {

					    if (numer.length == 2) {
					    	//window.alert ('Два');

					    	console.log('putting ' + numer);

					    	var x = numer[0];
					    	var y = numer[1];

					    	var arr = $scope.list1[x].nodes[y];
					    	var yes = 0;
					    	$scope.onTable.forEach(function(item,i,ar){

					    		if (item.id == arr.id) {
					    			yes = 1;
					    			//window.alert(item.id.toString() + " " + arr.id.toString() );
					    		}
					    	});
					    	if (yes==0) {
									$scope.onTable.push(arr);
					    	}



					    }
					    if (numer.length == 3) {
								//window.alert ('Три');
								var x = numer[0];
					    	var y = numer[1];
					    	var z = numer[2];

					    	var arr = $scope.list1[x].nodes[y].nodes[z];
					    	var yes = 0;
					    	$scope.onTable.forEach(function(item,i,ar){

					    		if (item.id == arr.id) {
					    			yes = 1;
					    			//window.alert(item.id.toString() + " " + arr.id.toString() );
					    		}
					    	});
					    	if (yes==0) {
									$scope.onTable.push(arr);
					    	}
					    }

					    //console.log(element, angular.element(element));
					} */


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
;(function(){
	'use scrict';

		configHome.$inject = ["$stateProvider"];
		HomeController.$inject = ["IntServ", "$scope", "$log"];
	angular
		.module('obm.home', [
			'ui.router',
		])

		.config(configHome)
		.controller('HomeCtrl', HomeController)


		function HomeController(IntServ,$scope,$log){
/*
		action - set
		type - mode
		name - 10001 - standby 10002 - ready 10003 - measure


*/

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

			$scope.startMeasure = function (){
				if ($scope.startDisabled) {
					//return;
				}
				var req = JSON.stringify({ "action": "set","type": "mode","name": "10003","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			};
			$scope.stopMeasure = function (){
				if ($scope.stopDisabled) {
					//console.log('Button disabled');
					///return;
				}
				var req = JSON.stringify({ "action": "set","type": "mode","name": "10002","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			};
			$scope.powerOn = function (){
				if ($scope.onDisabled) {
					//console.log('Button disabled');
					//return;
				}
				var req = JSON.stringify({ "action": "set","type": "mode","name": "10002","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			};
			$scope.powerOff = function (){
				if ($scope.offDisabled) {
					//console.log('Button disabled');
					//return;
				}
				var req = JSON.stringify({ "action": "set","type": "mode","name": "10001","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			};
			$scope.powerOffAll = function (){
				if ($scope.offDisabled) {
					//console.log('Button disabled');
					//return;
				}
				var req = JSON.stringify({ "action": "set","type": "mode","name": "10000","value": "1" });
				IntServ.PostRequest(req).then(onSuccess,onError);
			};
		}

		function configHome($stateProvider){
			var mName = 'home';


			$stateProvider.state(mName, {
				url: '/',
				templateUrl: 'app/' + mName + '/index.html',
				controller: 'HomeCtrl',
				controllerAs: 'hc'
			});
		}
})();
;(function(){
    'use scrict';

        IntouchServer.$inject = ["$http"];
    angular
        .module('obm.intouch',[])
        .config(configIntouch)

        .service('IntServ',IntouchServer)

        /*
        .run(IntServStatus)

        function IntServStatus($rootScope,IntServ){
            $rootScope.IntServ = IntServ;
        }*/

        function IntouchServer($http) {

            this.intervalBusy = false;



            this.Custom = function(url,req) {

                return $http({
                    method: 'POST',
                    url: '/' + url,
                    data: req,
                    timeout: 1000,
                    headers: { 'Content-Type': 'application/json' }
                });
            };

            this.PostRequest = function(req) {
                this.intervalBusy = true;
                return $http({
                    method: 'POST',
                    url: '/intouch_serv',
                    data: req,
                    timeout: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            };

            this.TasksRequest = function() {

                var req = JSON.stringify({"action": "get","type": "schedule"});
                return $http({
                    method: 'POST',
                    url: '/scheduler',
                    data: req,
                    timeout: 1000,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            this.Scheduler = function(req) {
                return $http({
                    method: 'POST',
                    url: '/scheduler',
                    data: req,
                    timeout: 1000,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

        }

        function configIntouch() {

        }

})();
;(function(){
    'use scrict';

        configLogin.$inject = ["$stateProvider"];
        LoginController.$inject = ["$scope", "auth"];
    angular
        .module('obm.login', [
            'ui.router',
        ])

        .config(configLogin)
        .controller('LgnCtrl',LoginController)

        function LoginController($scope,auth){
          //console.log('d');
          var vm = this;

          vm.logIn = function(user,pass){

            switch(user) {
              case 'obm':  // if (x === 'value1')

                if (pass=='obm'){
                  auth.logIn(user);
                } else {
                  //console.log('Ъуй' + pass + user);
                  vm.error = 'WRONG USERNAME OR PASSWORD!'
                };

                break;

              case 'admin':  // if (x === 'value2')

                if (pass=='admin'){
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


        function configLogin($stateProvider){
            var mName = 'login';
            $stateProvider.state(mName, {
                url: '/' + mName,
                templateUrl: 'app/' + mName + '/index.html',
                controller: 'LgnCtrl',
                controllerAs: 'vm'
            });
        }


})();
;(function(){
	'use scrict';

		configOdo.$inject = ["$stateProvider"];
		odometerController.$inject = ["$scope", "$log", "IntServ"];
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
;(function(){
	'use scrict';

		configSchedule.$inject = ["$stateProvider"];
		schController.$inject = ["$scope", "$uibModal", "IntServ"];
        modalInstanceController.$inject = ["$uibModalInstance", "$scope", "status", "schedule", "IntServ"];
	angular
		.module('obm.schedule', [
			'ui.router',
		])

		.config(configSchedule)
		.controller('SchCtrl',schController)
        .controller('ModalInstanceCtrl',modalInstanceController)

        function modalInstanceController($uibModalInstance,$scope,status,schedule,IntServ) {
             var $ctrl = this;

             $ctrl.schedule = schedule;
             $ctrl.status = status;

            $scope.today = function() {
                var cur = new Date().getTime();
                cur = Math.round(cur/3600000)*3600000;

                var stdate = new Date( cur + 3600000 );

                var endate = new Date( cur + 18000000 + 3600000);



                //console.log(stdate.getMinutes());
                $ctrl.FormData = { };
                $ctrl.FormData.dt = stdate;
                $ctrl.FormData.edt = endate;

            };

            $scope.today();



            $scope.$watch("$ctrl.FormData.dt", function(newValue, oldValue) {

                var msdt = $ctrl.FormData.dt.getTime();
                var msedt = $ctrl.FormData.edt.getTime();

                if (msdt >= msedt ) {

                   $ctrl.FormData.edt = new Date(msdt + 18000000);
                }
            });

            $scope.plusMin = function(x){
                //var mins = $scope.dt.getMinutes;
                if (x==1) {
                    var ttime = $ctrl.FormData.dt.getTime();

                    $ctrl.FormData.dt = new Date(ttime + 1800000);
                     //$scope.FormData.dt = $scope.FormData.dt;
                } else {
                   var ttime = $ctrl.FormData.edt.getTime();

                    $ctrl.FormData.edt = new Date(ttime + 1800000);
                     //$scope.edt = $scope.edt;
                }

            }

            $scope.minusMin = function(x){
                if (x==1) {
                   var ttime = $ctrl.FormData.dt.getTime();

                    $ctrl.FormData.dt = new Date(ttime - 1800000);

                } else {
                    var ttime = $ctrl.FormData.edt.getTime();

                    $ctrl.FormData.edt = new Date(ttime - 1800000);

                }

            }


            $scope.clear = function() {
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

              $scope.toggleMin = function() {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
              };

              $scope.toggleMin();

              $scope.open1 = function() {
                $scope.popup1.opened = true;
              };

              $scope.open2 = function() {
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
                  var dayToCheck = new Date(date).setHours(0,0,0,0);

                  for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                    }
                  }
                }

                return '';
              }

              $ctrl.ok = function () {

                var newTask = {
                "action":"add",
                "type":"schedule",
                "task": {
                    "begin_time":{
                        "year": 1970,
                        "month":1,
                        "day": 1,
                        "hour": 0,
                        "minutes": 0
                    },
                    "end_time":{
                      "year":2018,
                      "month":7,
                      "day":25,
                      "hour":18,
                      "minutes":0
                        }
                    }
                };


                if ($ctrl.FormData.dt === null || $ctrl.FormData.edt === null || $ctrl.FormData.dt === undefined || $ctrl.FormData.edt === undefined) {


                } else {
                    newTask.task.begin_time.year = $ctrl.FormData.dt.getFullYear();
                    newTask.task.begin_time.month = $ctrl.FormData.dt.getMonth()+1;
                    newTask.task.begin_time.day = $ctrl.FormData.dt.getDate();
                    newTask.task.begin_time.hour = $ctrl.FormData.dt.getHours();
                    newTask.task.begin_time.minutes = $ctrl.FormData.dt.getMinutes();

                    newTask.task.end_time.year = $ctrl.FormData.edt.getFullYear();
                    newTask.task.end_time.month = $ctrl.FormData.edt.getMonth()+1;
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

		function schController($scope,$uibModal,IntServ){

            var $ctrl = this;
            $ctrl.scheduleValid = false;
            $ctrl.schedule = [];

            $ctrl.dateFormats = [
                'yyyy MMMM dd | HH:mm',
                'dd MMMM yyyy | HH:mm'
            ];

            $ctrl.dateFormat = $ctrl.dateFormats[0];

            $ctrl.getSchedule = function(){
                var status = '5';
                IntServ.TasksRequest().then(function(resp){

                    $ctrl.schedule = resp.data.schedule;
                    $ctrl.schedule.forEach(function(item,i,arr){

                       item.TimeStart = new Date(item.begin_time.year,
                                                    item.begin_time.month-1,
                                                    item.begin_time.day,
                                                    item.begin_time.hour,
                                                    item.begin_time.minutes, 0, 0);

                       item.TimeEnd = new Date(item.end_time.year,
                                                    item.end_time.month-1,
                                                    item.end_time.day,
                                                    item.end_time.hour,
                                                    item.end_time.minutes, 0, 0);

                    });

                    $ctrl.readstatus = "Reading OK!";
                    $ctrl.scheduleValid = true;

                },function(resp){
                    //console.log(resp);
                   $ctrl.status  = "Error reading schedule!";
                   $ctrl.scheduleValid = false;
                });

                //return status;
            };
            /////////////////
            $ctrl.getSchedule();
            //$ctrl.status = $ctrl.readstatus;
            ////////////////////


            $scope.deleteTask = function(num){
                var id = $ctrl.schedule[num].id;

                var cmd = {
                    "action":"del",
                    "type":"schedule",
                    "task": {
                        "id": id
                    }
                };

                var req = JSON.stringify(cmd);

                console.log(req);
                IntServ.Scheduler(req).then(function(resp){
                        console.log(resp.data);
                        //$ctrl.getSchedule();
                        $ctrl.status = 'Task deleted!';
                        $ctrl.schedule.splice(num, 1);
                        $ctrl.getSchedule();
                    },function(resp){
                        console.log('Error deleting Task!');
                        $ctrl.status = 'Error deleting task!';
                    });


            }



            $ctrl.open = function(size) {
                var modalInstance = $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'newTask.html',
                  controller: 'ModalInstanceCtrl',
                  controllerAs: '$ctrl',
                  size: size,
                  resolve: {
                    status: function() {
                        return $ctrl.status;
                    },
                    schedule: function () {
                      return $ctrl.schedule;
                    }
                  }
                });

                modalInstance.result.then(function (status) {
                    //console.log(status);
                    IntServ.Scheduler(status).then(function(resp){
                        console.log(resp.data);
                        $ctrl.getSchedule();
                        $ctrl.status = 'Task added!';

                    },function(resp){
                        console.log('Error adding new Task!');
                        $ctrl.status = 'Error adding new task!';
                    });



                }, function () {
                  //$log.info('Modal dismissed at: ' + new Date());
                });
            };

		}


		function configSchedule($stateProvider){
			var mName = 'schedule';


			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();
;(function(){
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
        .service('Sets',SettingsService)
        .run(setsToRootScope)

        function setsToRootScope($rootScope,Sets) {
           $rootScope.Sets = Sets;

        }
        setsToRootScope.$inject = ['$rootScope','Sets'];

        function SettingsService(IntServ){

            var s = this;

            s.Settings = function Settings(){
                return s.settings;
            }
            s.Keys = function Keys(){
                return s.settingsKeys;
            }
            //s.settings = {};
            //s.status = {};


            s.Load = function(){

                var req = JSON.stringify({"action": "get","type": "settings"});
                IntServ.PostRequest(req).then(function(resp){
                    var tempSets = resp.data.settings;
                    //console.log('sets');
                    s.settings = tempSets;
                    var keys = Object.keys(tempSets);
                    s.settingsKeys = [];
                    keys.forEach(function(item, i, arr) {
                      s.settingsKeys[i] = {};
                      var obj = s.settings[item];

                      s.settingsKeys[i].name = item;
                      s.settingsKeys[i].admin = obj.admin;
                      s.settingsKeys[i].max = obj.max;
                      s.settingsKeys[i].min = obj.min;
                      s.settingsKeys[i].type = obj.type;
                      s.settingsKeys[i].unit = obj.unit;

                      if (!obj.hasOwnProperty('category') ){
                        s.settings[item].category = '# General';
                      }
                      s.settingsKeys[i].category = s.settings[item].category;
                    });


                },function(resp){
                    s.settings = "Error!";
                });
            }

            s.Save = function(){
                //$scope.save = {"settings":"s"};

                var out = {};

                s.settingsKeys.forEach(function(item, i, arr){
                    if ( s.settings[item.name].type == 'int' || s.settings[item.name].type == 'double' || s.settings[item.name].type == 'select'){
                        s.settings[item.name].value = parseFloat(s.settings[item.name].value);
                    };
                    s.settings[item.name].value;
                });

                out["settings"] = s.settings;

                var req = JSON.stringify(out);
                s.status = req;
                IntServ.PostRequest(req).then(function(resp){
                    //s.Load();

                },function(resp){
                    //s.Load();
                    //window.alert('Error!');
                });
            }

        }

        function numValidatorDirective(){
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl){
                    function myValidation(value){
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

        function SettingsController($scope,IntServ,Sets){


            Sets.Load();


        }

        function configSettings($stateProvider){
            var mName = 'settings';


            $stateProvider.state(mName, {
                url: '/' + mName,
                templateUrl: 'app/' + mName + '/index.html',
            });
        }


})();
;(function(){
    'use scrict';

        runTime.$inject = ["$rootScope", "$log", "TIME"];
        TimeService.$inject = ["$filter"];
    angular
        .module('obm.time', [])

        .config(configTime)
        .run(runTime)
        .service('TIME',TimeService)

        function TimeService($filter){
            this.num = 0;
            this.tzone = '';

            this.valid = false;

            this.GetDate = function GetDate(){
                var format = 'dd MMMM yyyy | HH:mm';
                var timezone = this.tzone;
                var date = new Date(this.num * 1000);

                if (this.num > 0){
                    this.valid = true;
                } else {
                    this.valid = false;
                }

                return $filter('date')(date, format, timezone);
            }
        }

        function runTime($rootScope,$log,TIME){
            $rootScope.TIME = TIME;
        }

        function configTime(){

        }


})();
;(function(){
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
		  '_main':'Main',
		 	'_power':'Power',
			'_odo':'Odometer',
			'_diag':'Diagnostics',
			'_tasks':'Scheduler',
			'_alarms':'Alarms',
			'_settings':'Settings',
			'_connlost':'Server connection lost',
			'_save':'Save',
			'create_new_task':'Create New Task',

			'ON':'ON',
			'WAIT':'WAIT',
			'OFF':'OFF',
			'NA':'n/a',
			'ERROR':'ERROR',

			'degC':'°C',

			'MR_STAND_BY': 'StandBy',
			'MR_PRE_STAND_BY': 'Pre StandBy',
		  	'MR_MEASURE': 'Measure',
		  	'MR_READY': 'Ready',
		  	'MR_RUN_READY': 'Starting...',
		  	'MR_RUN_MEASURE': 'Starting measure...',
		  	'MR_RUN_STAND_BY': 'Stopping...',
		  	'MR_OFF':'System Off',
		  	'MR_ERROR':'System Error!',
		  	'MR_RUN_OFF':'Shutdown...',
		  	'_STDBY':'StdBy',
		  	'_OFF': 'OFF',
		  	'_OFFALL': 'Switch Off',
		  	'_ON': 'ON',
		  	'_START': 'Start',
		  	'_STOP': 'Stop',
		  	'_title':'Title',
		  	'_timestart':'Time of start',
		  	'_timeend':'Time of end',
		  	'_finished':'Finished',
		  	'_delete':'Delete',
		  	'_upserror':'UPS Error',
		  	'_error':'Fehler',
		  	'_emulatorspeed':'Emulator speed',
		  	'_emulatordirection':'Emulator direction',
		  	'_emulatormode':'Emulator mode',
		  	'_forward':'Forward',
		  	'_backward':'Backward',
		  	'_powersupply':'Power and supply',
		  	'_centralsystem': 'Central system',
		  	'_auxsystem':'Aux systems',
		  	'_networks':'Networks',
		  	'_sensors':'Sensors',
		  	'_storage':'Storage',
		  	'_automode':'Auto',
		  	'_manualmode':'Manual',
		  	'_speed':'Speed',
		  'CENTRAL_SYSTEM': 'Central system',
		  'ses': 'SES',
		  'UPS': 'UPS',
		  'Units': 'Units',
		  'MAIN_ERROR':'Server connection error!',
		  'control_mode':'Control mode',
		  'max_frame_temp':'Maximal frame temperature alarm',
		  'max_frame_sign':'Max frame sign',
		  'automeasure_speed_record':'Automeasure speed threshold',
		  'automeasure_staying_time':'Automeasure staying time',
		  'debug':'Debug mode',
		  'send_data_email':'Email for sending data',
		  'send_data_sms':'Mobile number for sending sms',
		  'wheel_d':'Odometer wheel diameter',
		  'cut_measure':'Cut Measure',
		  'balis_speed_on':'Balisa switch on speed',
		  'balis_speed_off':'Balisa switch off speed',
		  'ext_power_time':'Time to work on Battery',
		  'ext_power_runtime':'Remaining battery time alarm'
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
		.controller('TransCtrl',TranslateController);




		function configTranslate($translateProvider) {
		  	$translateProvider.translations('en', translationsEN);
		  	$translateProvider.translations('ru', translationsRU);

		  	$translateProvider.preferredLanguage('en');
  			$translateProvider.fallbackLanguage('en');
		}

		function TranslateController($translate,$scope,localStorage){
			//console.log('Language ctrl');

			var lk = localStorage.getItem('language-obm');

			if (!(lk==null)) {
				//console.log(lk);
				$translate.use(lk);
			}


			 $scope.changeLanguage = function (langKey) {
			 	//console.log('Language change ' + langKey);
			    $translate.use(langKey);
			    localStorage.setItem('language-obm',langKey);
			  };
		}

})();
;(function(){
	'use scrict';

		configTrends.$inject = ["$stateProvider", "ChartJsProvider"];
		LineController.$inject = ["$scope"];
		DebugController.$inject = ["IntServ", "$interval"];
		runTrends.$inject = ["$rootScope", "$locale", "$state", "$location"];
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
;(function(){
	'use scrict';

		configUsers.$inject = ["$stateProvider"];
	angular
		.module('obm.users', [
			'ui.router',
		])

		.config(configUsers)

		function configUsers($stateProvider){
			var mName = 'users';

			$stateProvider.state(mName, {
				url: '/' + mName,
				templateUrl: 'app/' + mName + '/index.html',
			});
		}


})();