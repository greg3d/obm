!function(){function t(i,e,n,o,a,u,f,d){var c=[1003,2002,2005,2008,2011,2014,2017,2020,2041,3001,3008,3013,4001],m={" 1005":"UPS Input"," 1006":"UPS Output"," 1003":"UPS Status"," 2002":"Odometer"," 2005":"EuroBalis Recv"," 2008":"EuroBalis Emitter"," 2011":"IMU"," 2014":"Rail Moisture Sensor"," 2017":"Tensometrics"," 2020":"ADC"," 2041":"Synchronisation"," 3001":"NAS 1"," 3008":"Main Controller K000"," 4003":"Record Indicator 1"," 4005":"Record Indicator 2"," 9000":"Rack temperature"," 9001":"Outdoor sernsor 1"," 9002":"Outdoor sernsor 2"," 9004":"Relative Hum"," 9011":"UPS Remaining time"," 9012":"UPS Charge"," 9013":"UPS Output freq"," 9016":"UPS Load"," 9017":"Input Voltage"," 9014":"Output Voltage"},b=Object.keys(m);i.fullTree=" ",i.mainError=!1,i.startDisabled=!0,i.stopDisabled=!0,i.onDisabled=!0,i.offDisabled=!0,i.offAllDiabled=!1,i.ajaxloading=!1,new Promise(function(o,t){u.Load();var e=JSON.stringify({action:"get",type:"status"});n.PostRequest(e).then(function(t){var e=t.data.sensors;d.prepare(e,b,m),o("result")})}).then(function(t){o.addNew(d.find(9e3),5,-5,"warning"),e(function(){s(),o.check()},1e3)},function(t){console.log("error")}),i.$on("alarm",function(t,e){console.log(e),a({message:e.alarm.message,title:e.title},e.alarm.type)});var s=function(){var t=JSON.stringify({action:"get",type:"status"});n.PostRequest(t).then(function(t){n.intervalBusy=!1,i.fullTree=t.data,i.mainError=!1,i.mode=t.data.mode,angular.isDefined(i.fullTree.time)&&(f.num=i.fullTree.time.time_t,f.tzone=i.fullTree.time.tm_zone),0==u.settings.debug.value?("MR_STAND_BY"!=i.mode&&"MR_OFF"!=i.mode&&"MR_RUN_STAND_BY"!=i.mode&&"MR_PRE_STAND_BY"!=i.mode||(i.startDisabled=!0,i.stopDisabled=!0,i.onDisabled=!1,i.offDisabled=!0,i.offAllDiabled=!1),"MR_READY"==i.mode&&(i.startDisabled=!1,i.stopDisabled=!0,i.onDisabled=!0,i.offDisabled=!1,i.offAllDiabled=!1),"MR_MEASURE"!=i.mode&&"MR_RUN_MEASURE"!=i.mode||(i.startDisabled=!0,i.stopDisabled=!1,i.onDisabled=!0,i.offDisabled=!0,i.offAllDiabled=!0),"MR_RUN_READY"==i.mode&&(i.startDisabled=!0,i.stopDisabled=!0,i.onDisabled=!0,i.offDisabled=!1,i.offAllDiabled=!1)):(i.startDisabled=!1,i.stopDisabled=!1,i.onDisabled=!1,i.offDisabled=!1,i.offAllDiabled=!1);var e=t.data.modules,o=t.data.sensors,a=[],s=[],r=[],l=[];e.forEach(function(i,t,e){var n=" "+i.name,o=function(t,e,o){var i,n=-1,a=(o=!!o,0);for(i in e){if(o&&e[i]===t||!o&&e[i]==t){n=a;break}a++}return n}(n,b);-1<o&&(i.title=m[n],i.switch=!1,i.pos=o,0,c.forEach(function(t,e,o){" "+t==n&&(i.switch=!0)}),i.visible=!0,1==Math.floor(i.name/1e3)&&a.push(i),2==Math.floor(i.name/1e3)&&s.push(i),3==Math.floor(i.name/1e3)&&r.push(i),4==Math.floor(i.name/1e3)&&l.push(i))}),d.prepare(o,b,m),i.ups=a,i.units=s,i.controllers=r,i.ses=l},function(t){console.log("Error reading status tree"),i.mainError=!0,n.intervalBusy=!1})}}function e(t,e){t.otherwise("/"),e.setOptions({delay:5e3,startTop:20,startRight:20,verticalSpacing:20,horizontalSpacing:20,positionX:"center",positionY:"bottom",maxCount:2})}function o(t,e,s,r,l,o){t.Sensors=o,e.NUMBER_FORMATS.GROUP_SEP=" ",t.$on("$locationChangeStart",function(t,e,o,i,n,a){-1===["login"].indexOf(r.path())&&!l.isLoggedIn()&&(s.go("login"),t.preventDefault())})}e.$inject=["$urlRouterProvider","NotificationProvider"],o.$inject=["$rootScope","$locale","$state","$location","auth","Sensors"],t.$inject=["$scope","$interval","IntServ","ALRM","Notification","Sets","TIME","Sensors"],angular.module("obm",["ui.bootstrap","ui.router","ui-notification","ngAnimate","obm.intouch","obm.settings","obm.home","obm.diag","obm.alarms","obm.power","obm.schedule","obm.trends","obm.odo","obm.translate","obm.auth","obm.login","obm.time"]).config(e).run(o).controller("MainCtrl",t).service("Sensors",function(){this._list=[],this.assign=function(t){this._list=t},this.show=function(){return this._list},this.find=function(i){var n="000";return this._list.forEach(function(t,e,o){t.name==i&&(n=e)}),n},this.prepare=function(t,s,r){this._list=t,this._list.forEach(function(t,e,o){var i=" "+t.name,n=function(t,e,o){var i,n=-1,o=!!o,a=0;for(i in e){if(o&&e[i]===t||!o&&e[i]==t){n=a;break}a++}return n}(i,s);if(t.visible=!1,-1<n&&(t.visible=!0,t.title=r[i]," 9011"==i)){var a=Math.floor(t.value[0]/60);t.value[0]=a,t.unit="min"}})}})}();
!function(){function s(c,h){this._messages=["Message 1","Message 2","Message 3","Message 4","Message 5","Message 6","Message 7","Message 8","Message 9"],this._list=[],this._num=0,this._lastId=0,this.getList=function(){return this._list},this.addNew=function(s,t,e,i){this._list.push({id:this._lastId,sensorId:s,max:t,min:e,type:i,active:!1,ack:!1,message:"Test"}),this._lastId++},this.check=function(){var o=0;this._list.forEach(function(s,t,e){var i=h.show()[s.sensorId],a=i.value[0],n=!0;1==s.active&&(n=!1);var r=" ";a<s.min?(r="lower",s.active=!0,o++):a>s.max?(r="higher",s.active=!0,o++):s.active=!1,s.message="Value of "+i.title+" is "+r+" than threshold!",1==s.active&&1==n&&c.$broadcast("alarm",{alarm:s,title:s.type})}),this._num=o},this.getNum=function(){return this._num}}function t(s,t,e){s.ALRM=e}function e(s){var t="alarms";s.state(t,{url:"/"+t,templateUrl:"app/"+t+"/index.html"})}e.$inject=["$stateProvider"],t.$inject=["$rootScope","$log","ALRM"],s.$inject=["$rootScope","Sensors"],angular.module("obm.alarms",["ui.router"]).config(e).run(t).service("ALRM",s)}();
!function(){function e(e,s,t){e.auth=t,e.session=s}function s(e){if(e.localStorage)return e.localStorage;throw new Error("Local storage support is needed")}function t(e,s){this._user=JSON.parse(s.getItem("session.user")),this._accessToken=s.getItem("session.accessToken"),this.getUser=function(){return this._user},this.setUser=function(e){return this._user=e,s.setItem("session.user",JSON.stringify(e)),this},this.getAccessToken=function(){return this._accessToken},this.setAccessToken=function(e){return this._accessToken=e,s.setItem("session.accessToken",e),this},this.destroy=function(){this.setUser(null),this.setAccessToken(null)}}function n(s,t,n){this.isLoggedIn=function(){var e=t.getUser();return"null"!=e&&"null"!=e&&null!=e&&"null"!==t.getUser()},this.isAdmin=function(){return"admin"==t.getUser().name},this.logIn=function(e){return s.get(e+".json").then(function(e){console.log(e.data);var s=e.data;t.setUser(s.user),t.setAccessToken(s.accessToken),n.go("home")})},this.logOut=function(){return s.get("/logout.json").then(function(e){t.destroy(),n.go("login")})}}n.$inject=["$http","session","$state"],t.$inject=["$log","localStorage"],s.$inject=["$window"],angular.module("obm.auth",["ui.router"]).config(function(){}).service("auth",n).service("session",t).factory("localStorage",s).run(e),e.$inject=["$rootScope","session","auth"]}();
!function(){function e(e){e.doSomething=function(e){var t=e.srcElement?e.srcElement:e.target;angular.element(t).toggleClass("collapsed"),angular.element(t).hasClass("collapsed")?angular.element(t).html("+"):angular.element(t).html("-")}}function t(e){var t="diag";e.state(t,{url:"/"+t,templateUrl:"app/diag/index.html",controller:"GetTreeCtrl"})}t.$inject=["$stateProvider"],e.$inject=["$scope"],angular.module("obm.diag",["ui.router"]).config(t).controller("GetTreeCtrl",e)}();
!function(){function t(e,o,n){var a=function(t){var e=t.data;n.log(e),o.status=e},s=function(t){var e="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;n.log(e),o.status=e};o.startMeasure=function(){o.startDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10003",value:"1"});e.PostRequest(t).then(a,s)},o.stopMeasure=function(){o.stopDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10002",value:"1"});e.PostRequest(t).then(a,s)},o.powerOn=function(){o.onDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10002",value:"1"});e.PostRequest(t).then(a,s)},o.powerOff=function(){o.offDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10001",value:"1"});e.PostRequest(t).then(a,s)},o.powerOffAll=function(){o.offDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10000",value:"1"});e.PostRequest(t).then(a,s)}}function e(t){var e="home";t.state(e,{url:"/",templateUrl:"app/home/index.html",controller:"HomeCtrl",controllerAs:"hc"})}e.$inject=["$stateProvider"],t.$inject=["IntServ","$scope","$log"],angular.module("obm.home",["ui.router"]).config(e).controller("HomeCtrl",t)}();
!function(){function t(n){this.intervalBusy=!1,this.Test=function(t){return this.intervalBusy=!0,n({method:"GET",url:"tree.json"})},this.Custom=function(t,e){return n({method:"POST",url:"/"+t,data:e,timeout:1e3,headers:{"Content-Type":"application/json"}})},this.PostRequest=function(t){return this.intervalBusy=!0,n({method:"POST",url:"/intouch_serv",data:t,timeout:500,headers:{"Content-Type":"application/json"}})},this.TasksRequest=function(){var t=JSON.stringify({action:"get",type:"schedule"});return n({method:"POST",url:"/scheduler",data:t,timeout:1e3,headers:{"Content-Type":"application/json"}})},this.Scheduler=function(t){return n({method:"POST",url:"/scheduler",data:t,timeout:1e3,headers:{"Content-Type":"application/json"}})}}t.$inject=["$http"],angular.module("obm.intouch",[]).config(function(){}).service("IntServ",t)}();
!function(){function r(r,n){var t=this;t.logIn=function(r,o){switch(r){case"obm":"obm"==o?n.logIn(r):t.error="WRONG USERNAME OR PASSWORD!";break;case"admin":"admin"==o?n.logIn(r):t.error="WRONG USERNAME OR PASSWORD!";break;default:t.error="WRONG USERNAME OR PASSWORD!"}}}function o(r){var o="login";r.state(o,{url:"/"+o,templateUrl:"app/login/index.html",controller:"LgnCtrl",controllerAs:"vm"})}o.$inject=["$stateProvider"],r.$inject=["$scope","auth"],angular.module("obm.login",["ui.router"]).config(o).controller("LgnCtrl",r)}();
!function(){function t(n,o,a){n.status={status:"null"};var i=function(t){var e=t.data;o.log(e),n.status=e},s=function(t){var e="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;o.log(e),n.status=e};n.odoEmul=function(t){if(1==t)var e=JSON.stringify({action:"set",type:"switch",name:"201",value:"1"});else e=JSON.stringify({action:"set",type:"switch",name:"202",value:"1"});a.PostRequest(e).then(i,s)},n.odoSpeedUp=function(){var t=JSON.stringify({action:"set",type:"switch",name:"205",value:"1"});a.PostRequest(t).then(i,s)},n.odoSpeedDown=function(){var t=JSON.stringify({action:"set",type:"switch",name:"206",value:"1"});a.PostRequest(t).then(i,s)},n.odoDir=function(t){if(1==t)var e=JSON.stringify({action:"set",type:"switch",name:"207",value:"1"});else e=JSON.stringify({action:"set",type:"switch",name:"208",value:"1"});a.PostRequest(e).then(i,s)}}function e(t){var e="odo";t.state(e,{url:"/"+e,templateUrl:"app/odo/index.html"})}e.$inject=["$stateProvider"],t.$inject=["$scope","$log","IntServ"],angular.module("obm.odo",["ui.router"]).config(e).filter("direction",function(){return function(t){var e;return 1==t&&(e="Backward"),0==t&&(e="Forward"),e}}).controller("OdoCtrl",t)}();
!function(){function t(a,n,e){a.status={status:"null"};var o=function(t){var r=t.data;n.log(r),a.status=r},s=function(t){var r="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;n.log(r),a.status=r};a.switch=function(t,r){console.log("Switch"),3001==t&&1==r&&(t=3002,r=1),3001==t&&0==r&&(t=3004,r=1),3008==t&&1==r&&(t=3009,r=1),3008==t&&0==r&&(t=3011,r=1),3013==t&&1==r&&(t=3014,r=1),3013==t&&0==r&&(t=3016,r=1),4001==t&&1==r&&(t=4003,r=1),4001==t&&0==r&&(t=4005,r=1);var a=JSON.stringify({action:"set",type:"switch",name:String(t),value:String(r)});e.PostRequest(a).then(o,s)}}function r(t){var r="power";t.state(r,{url:"/"+r,templateUrl:"app/power/index.html"})}r.$inject=["$stateProvider"],t.$inject=["$scope","$log","IntServ"],angular.module("obm.power",["ui.router"]).config(r).controller("PwrCtrl",t)}();
!function(){function e(a,i,e,t,n){var o=this;o.schedule=t,o.status=e,i.today=function(){var e=(new Date).getTime();e=36e5*Math.round(e/36e5);var t=new Date(e+36e5),a=new Date(e+18e6+36e5);o.FormData={},o.FormData.dt=t,o.FormData.edt=a},i.today(),i.$watch("$ctrl.FormData.dt",function(e,t){var a=o.FormData.dt.getTime();o.FormData.edt.getTime()<=a&&(o.FormData.edt=new Date(a+18e6))}),i.plusMin=function(e){if(1==e){var t=o.FormData.dt.getTime();o.FormData.dt=new Date(t+18e5)}else{t=o.FormData.edt.getTime();o.FormData.edt=new Date(t+18e5)}},i.minusMin=function(e){if(1==e){var t=o.FormData.dt.getTime();o.FormData.dt=new Date(t-18e5)}else{t=o.FormData.edt.getTime();o.FormData.edt=new Date(t-18e5)}},i.clear=function(){o.FormData.dt=null,o.FormData.edt=null},i.inlineOptions={customClass:function(e){var t=e.date;if("day"===e.mode)for(var a=new Date(t).setHours(0,0,0,0),n=0;n<i.events.length;n++){var o=new Date(i.events[n].date).setHours(0,0,0,0);if(a===o)return i.events[n].status}return""},minDate:new Date,showWeeks:!0},i.formats=["dd MMMM yyyy | HH:mm","yyyy MMMM dd | HH:mm"],i.format=i.formats[0],i.altInputFormats=["dd MMMM yyyy | HHmm"],i.dateOptions={formatYear:"yy",startingDay:1},i.toggleMin=function(){i.inlineOptions.minDate=i.inlineOptions.minDate?null:new Date,i.dateOptions.minDate=i.inlineOptions.minDate},i.toggleMin(),i.open1=function(){i.popup1.opened=!0},i.open2=function(){i.popup2.opened=!0},i.popup1={opened:!1},i.popup2={opened:!1},o.ok=function(){var e={action:"add",type:"schedule",task:{begin_time:{year:1970,month:1,day:1,hour:0,minutes:0},end_time:{year:2018,month:7,day:25,hour:18,minutes:0}}};if(null===o.FormData.dt||null===o.FormData.edt||void 0===o.FormData.dt||void 0===o.FormData.edt);else{e.task.begin_time.year=o.FormData.dt.getFullYear(),e.task.begin_time.month=o.FormData.dt.getMonth()+1,e.task.begin_time.day=o.FormData.dt.getDate(),e.task.begin_time.hour=o.FormData.dt.getHours(),e.task.begin_time.minutes=o.FormData.dt.getMinutes(),e.task.end_time.year=o.FormData.edt.getFullYear(),e.task.end_time.month=o.FormData.edt.getMonth()+1,e.task.end_time.day=o.FormData.edt.getDate(),e.task.end_time.hour=o.FormData.edt.getHours(),e.task.end_time.minutes=o.FormData.edt.getMinutes();var t=JSON.stringify(e);a.close(t)}},o.cancel=function(){a.dismiss("cancel")}}function t(e,t,n){var o=this;o.scheduleValid=!1,o.schedule=[],o.dateFormats=["yyyy MMMM dd | HH:mm","dd MMMM yyyy | HH:mm"],o.dateFormat=o.dateFormats[0],o.getSchedule=function(){n.TasksRequest().then(function(e){o.schedule=e.data.schedule,o.schedule.forEach(function(e,t,a){e.TimeStart=new Date(e.begin_time.year,e.begin_time.month-1,e.begin_time.day,e.begin_time.hour,e.begin_time.minutes,0,0),e.TimeEnd=new Date(e.end_time.year,e.end_time.month-1,e.end_time.day,e.end_time.hour,e.end_time.minutes,0,0)}),o.readstatus="Reading OK!",o.scheduleValid=!0},function(e){o.status="Error reading schedule!",o.scheduleValid=!1})},o.getSchedule(),e.deleteTask=function(t){var e={action:"del",type:"schedule",task:{id:o.schedule[t].id}},a=JSON.stringify(e);console.log(a),n.Scheduler(a).then(function(e){console.log(e.data),o.status="Task deleted!",o.schedule.splice(t,1),o.getSchedule()},function(e){console.log("Error deleting Task!"),o.status="Error deleting task!"})},o.open=function(e){t.open({animation:!0,ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"newTask.html",controller:"ModalInstanceCtrl",controllerAs:"$ctrl",size:e,resolve:{status:function(){return o.status},schedule:function(){return o.schedule}}}).result.then(function(e){n.Scheduler(e).then(function(e){console.log(e.data),o.getSchedule(),o.status="Task added!"},function(e){console.log("Error adding new Task!"),o.status="Error adding new task!"})},function(){})}}function a(e){var t="schedule";e.state(t,{url:"/"+t,templateUrl:"app/"+t+"/index.html"})}a.$inject=["$stateProvider"],t.$inject=["$scope","$uibModal","IntServ"],e.$inject=["$uibModalInstance","$scope","status","schedule","IntServ"],angular.module("obm.schedule",["ui.router"]).config(a).controller("SchCtrl",t).controller("ModalInstanceCtrl",e)}();
!function(){function t(t,e){t.Sets=e}function e(n){var i=this;i.Settings=function(){return i.settings},i.Keys=function(){return i.settingsKeys},i.Load=function(){var t=JSON.stringify({action:"get",type:"settings"});n.PostRequest(t).then(function(t){var e=t.data.settings;if(null!=e){i.settings=e;var n=Object.keys(e);i.settingsKeys=[],n.forEach(function(t,e,n){i.settingsKeys[e]={};var s=i.settings[t];i.settingsKeys[e].name=t,i.settingsKeys[e].admin=s.admin,i.settingsKeys[e].max=s.max,i.settingsKeys[e].min=s.min,i.settingsKeys[e].type=s.type,i.settingsKeys[e].unit=s.unit,s.hasOwnProperty("category")||(i.settings[t].category="# General"),i.settingsKeys[e].category=i.settings[t].category})}else console.log("Settings returned undefined")},function(t){i.settings="Error!"})},i.Save=function(){var t={};i.settingsKeys.forEach(function(t,e,n){"int"!=i.settings[t.name].type&&"double"!=i.settings[t.name].type&&"select"!=i.settings[t.name].type||(i.settings[t.name].value=parseFloat(i.settings[t.name].value)),i.settings[t.name].value}),t.settings=i.settings;var e=JSON.stringify(t);i.status=e,n.PostRequest(e).then(function(t){},function(t){})}}function n(t,e,n){n.Load()}function s(t){var e="settings";t.state(e,{url:"/"+e,templateUrl:"app/"+e+"/index.html"})}s.$inject=["$stateProvider"],n.$inject=["$scope","IntServ","Sets"],e.$inject=["IntServ"],angular.module("obm.settings",["ui.router"]).config(s).controller("SetCtrl",n).directive("numValidator",function(){return{require:"ngModel",link:function(t,e,n,s){s.$parsers.push(function(t){var e=parseFloat(t);e>=n.min&&e<=n.max?s.$setValidity("charE",!0):s.$setValidity("charE",!1);return t})}}}).service("Sets",e).run(t),t.$inject=["$rootScope","Sets"]}();
!function(){function t(n){this.num=0,this.tzone="",this.valid=!1,this.GetDate=function(){var t=this.tzone;"CET"==t&&(t="+0100"),"CEST"==t&&(t="+0200");var i=new Date(1e3*this.num);return 0<this.num?this.valid=!0:this.valid=!1,n("date")(i,"dd MMMM yyyy | HH:mm",t)}}function i(t,i,n){t.TIME=n}i.$inject=["$rootScope","$log","TIME"],t.$inject=["$filter"],angular.module("obm.time",[]).config(function(){}).run(i).service("TIME",t)}();
!function(){function e(e){e.translations("en",translationsEN),e.translations("ru",translationsRU),e.preferredLanguage("en"),e.fallbackLanguage("en")}function t(t,e,a){var r=a.getItem("language-obm");null!=r&&t.use(r),e.changeLanguage=function(e){t.use(e),a.setItem("language-obm",e)}}e.$inject=["$translateProvider"],t.$inject=["$translate","$scope","localStorage"],translationsEN={mainButton:"Main",odoButton:"Odometer",diagnosticsButton:"Diagnostics",powerControlButton:"PowerCtrl",schedulerButton:"Scheduler",signalsButton:"Signals",upsButton:"UPS Status",MAIN_TITLE:"OBM Control System",BUTTON_LANG_DE:"Deutsch",BUTTON_LANG_EN:"English",BUTTON_LANG_RU:"Русский",WEB_SITE:"Web-site",SPC_INFOTRANS:"SPC INFOTRANS",LEGAL_INFO:"Legal Info",_main:"Main",_power:"Power",_odo:"Odometer",_diag:"Diagnostics",_tasks:"Scheduler",_alarms:"Alarms",_settings:"Settings",_connlost:"Server connection lost",_save:"Save",create_new_task:"Create New Task",ON:"ON",WAIT:"WAIT",OFF:"OFF",NA:"n/a",ERROR:"ERROR",degC:"°C",MR_STAND_BY:"StandBy",MR_PRE_STAND_BY:"Pre StandBy",MR_MEASURE:"Measure",MR_READY:"Ready",MR_RUN_READY:"Starting...",MR_RUN_MEASURE:"Starting measure...",MR_RUN_STAND_BY:"Stopping...",MR_OFF:"System Off",MR_ERROR:"System Error!",MR_RUN_OFF:"Shutdown...",_STDBY:"StdBy",_OFF:"OFF",_OFFALL:"Switch Off",_ON:"ON",_START:"Start",_STOP:"Stop",_title:"Title",_timestart:"Time of start",_timeend:"Time of end",_finished:"Finished",_delete:"Delete",_upserror:"UPS Error",_error:"Fehler",_emulatorspeed:"Emulator speed",_emulatordirection:"Emulator direction",_emulatormode:"Emulator mode",_forward:"Forward",_backward:"Backward",_powersupply:"Power and supply",_centralsystem:"Central system",_auxsystem:"Aux systems",_networks:"Networks",_sensors:"Sensors",_storage:"Storage",_automode:"Auto",_manualmode:"Manual",_speed:"Speed",CENTRAL_SYSTEM:"Central system",ses:"SES",UPS:"UPS",Units:"Units",MAIN_ERROR:"Server connection error!",control_mode:"Control mode",max_frame_temp:"Maximal frame temperature alarm",max_frame_sign:"Max frame sign",automeasure_speed_record:"Automeasure speed threshold",automeasure_staying_time:"Automeasure staying time",debug:"Debug mode",send_data_email:"Email for sending data",send_data_sms:"Mobile number for sending sms",wheel_d:"Odometer wheel diameter",cut_measure:"Cut Measure",balis_speed_on:"Balisa switch on speed",balis_speed_off:"Balisa switch off speed",ext_power_time:"Time to work on Battery",ext_power_runtime:"Remaining battery time alarm"},translationsRU={},translationsDE={},angular.module("obm.translate",["pascalprecht.translate"]).config(e).controller("TransCtrl",t)}();
!function(){function t(r,a){var c=this;angular.isDefined(c.int1)||(c.int1=void 0,c.num=0,c.dbgStatus="response",c.dbgUrl="readbufs",c.dbgAction="get",c.dbgType="readbufs",c.dbgName="MWAY",c.once=function(){c.num=0,c.stop();var t=c.dbgUrl,n=c.dbgAction,o=c.dbgType,e=c.dbgName,i=JSON.stringify({action:n,type:o,name:e});r.Custom(t,i).then(function(t){c.dbgStatus=t.data},function(){c.dbgStatus="Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще."})},c.interval=function(){c.num=0,c.stop();var t=c.dbgUrl,n=c.dbgAction,o=c.dbgType,e=c.dbgName,i=JSON.stringify({action:n,type:o,name:e});c.int1=a(function(){c.num=c.num+1,r.Custom(t,i).then(function(t){c.dbgStatus=t.data},function(){c.dbgStatus="Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще."})},1e3)},c.stop=function(){angular.isDefined(c.int1)&&(console.log(c.int1),a.cancel(c.int1),c.int1=void 0)})}function n(t){}function o(t,n){var o="trends";n.setOptions({colors:["#000000","#000000"]}),t.state(o,{url:"/"+o,templateUrl:"app/"+o+"/index.html",controller:"DbgCtrl",controllerAs:"dbc"})}function e(t,n,o,e){}o.$inject=["$stateProvider","ChartJsProvider"],n.$inject=["$scope"],t.$inject=["IntServ","$interval"],e.$inject=["$rootScope","$locale","$state","$location"],angular.module("obm.trends",["ui.router","chart.js"]).config(o).controller("LineCtrl",n).controller("DbgCtrl",t).run(e)}();
!function(){function t(t){var u="ups";t.state(u,{url:"/"+u,templateUrl:"app/ups/index.html"})}t.$inject=["$stateProvider"],angular.module("obm.ups",["ui.router"]).config(t)}();
!function(){function e(e){var r="users";e.state(r,{url:"/"+r,templateUrl:"app/users/index.html"})}e.$inject=["$stateProvider"],angular.module("obm.users",["ui.router"]).config(e)}();
