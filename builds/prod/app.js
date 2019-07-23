!function(){function e(s,o,l,i,n,u,f,d,c){var m=[1003,2002,2005,2008,2011,2014,2017,2020,2041,3001,3008,3013,4001],b={" 1005":"UPS Input"," 1006":"UPS Output"," 1003":"UPS Status"," 2002":"Odometer"," 2005":"ETCS Balise Reader"," 2008":"ETCS Balise Emitter"," 2011":"IMU"," 2014":"Rail Moisture Sensor"," 2017":"Tensometrics"," 2020":"ADC"," 2041":"Synchronisation"," 3001":"NAS 1"," 3008":"Main Controller K000"," 4003":"Record Indicator 1"," 4005":"Record Indicator 2"," 9000":"Rack temperature"," 9001":"Outdoor sernsor 1"," 9002":"Outdoor sernsor 2"," 9004":"Relative Hum"," 9011":"UPS Remaining time"," 9012":"UPS Charge"," 9013":"UPS Output freq"," 9016":"UPS Load"," 9017":"Input Voltage"," 9014":"Output Voltage"},h=Object.keys(b);s.fullTree=" ",s.mainError=!1,s.startDisabled=!0,s.stopDisabled=!0,s.onDisabled=!0,s.offDisabled=!0,s.offAllDiabled=!1,s.ajaxloading=!1,function t(){new Promise(function(i,t){u.Load();var e=JSON.stringify({action:"get",type:"status"});l.PostRequest(e).then(function(e){var t=e.data.sensors,o=e.data.modules;d.prepare(t,h,b),c.prepare(o,h,b,m),setTimeout(function(){i("success")},200)},function(e){setTimeout(function(){t("error")},2e3)})}).then(function(e){s.mainError=!1,i.addNew(9e3,u.settings.max_frame_temp.value,-50,"error"),i.addNew(9011,null,u.settings.ext_power_runtime.value,"error"),i.addNew(9012,null,u.settings.battery_ups_level_value.value,"error"),i.addPack(c.show()),o(function(){a(),i.check()},1e3)},function(e){return s.mainError=!0,console.log("Error of First Loading!"),t()})}(),s.$on("alarm",function(e,t){console.log(t),n({message:t.alarm.message,title:t.title},t.alarm.type)});var a=function(){var e=JSON.stringify({action:"get",type:"status"});l.PostRequest(e).then(function(e){l.intervalBusy=!1,s.fullTree=e.data,s.mainError=!1,s.mode=e.data.mode,angular.isDefined(s.fullTree.time)&&(f.num=s.fullTree.time.time_t,f.tzone=s.fullTree.time.tm_zone),0==u.settings.debug.value?("MR_STAND_BY"!=s.mode&&"MR_OFF"!=s.mode&&"MR_RUN_STAND_BY"!=s.mode&&"MR_PRE_STAND_BY"!=s.mode||(s.startDisabled=!0,s.stopDisabled=!0,s.onDisabled=!1,s.offDisabled=!0,s.offAllDiabled=!1),"MR_READY"==s.mode&&(s.startDisabled=!1,s.stopDisabled=!0,s.onDisabled=!0,s.offDisabled=!1,s.offAllDiabled=!1),"MR_MEASURE"!=s.mode&&"MR_RUN_MEASURE"!=s.mode||(s.startDisabled=!0,s.stopDisabled=!1,s.onDisabled=!0,s.offDisabled=!0,s.offAllDiabled=!0),"MR_RUN_READY"==s.mode&&(s.startDisabled=!0,s.stopDisabled=!0,s.onDisabled=!0,s.offDisabled=!1,s.offAllDiabled=!1)):(s.startDisabled=!1,s.stopDisabled=!1,s.onDisabled=!1,s.offDisabled=!1,s.offAllDiabled=!1);var t=e.data.modules,o=e.data.sensors,i=[],n=[],a=[],r=[];c.prepare(t,h,b,m),d.prepare(o,h,b),c.show().forEach(function(e,t,o){1==Math.floor(e.name/1e3)&&i.push(e),2==Math.floor(e.name/1e3)&&n.push(e),3==Math.floor(e.name/1e3)&&a.push(e),4==Math.floor(e.name/1e3)&&r.push(e)}),s.ups=i,s.units=n,s.controllers=a,s.ses=r},function(e){console.log("Error reading status tree"),s.mainError=!0,l.intervalBusy=!1})}}function t(e,t){e.otherwise("/"),t.setOptions({delay:5e3,startTop:20,startRight:20,verticalSpacing:20,horizontalSpacing:20,positionX:"center",positionY:"bottom",maxCount:2})}function o(e,t,r,s,l,o,i){e.Sensors=o,e.Modules=i,t.NUMBER_FORMATS.GROUP_SEP=" ",e.$on("$locationChangeStart",function(e,t,o,i,n,a){-1===["login"].indexOf(s.path())&&!l.isLoggedIn()&&(r.go("login"),e.preventDefault())})}t.$inject=["$urlRouterProvider","NotificationProvider"],o.$inject=["$rootScope","$locale","$state","$location","auth","Sensors","Modules"],e.$inject=["$scope","$interval","IntServ","ALRM","Notification","Sets","TIME","Sensors","Modules"],angular.module("obm",["ui.bootstrap","ui.router","ui-notification","obm.intouch","obm.settings","obm.home","obm.diag","obm.alarms","obm.power","obm.schedule","obm.trends","obm.odo","obm.translate","obm.auth","obm.login","obm.time"]).config(t).run(o).controller("MainCtrl",e).service("Sensors",function(){this._list=[],this.assign=function(e){this._list=e},this.show=function(){return this._list},this.find=function(i){var n="000";return this._list.forEach(function(e,t,o){e.name==i&&(n=t)}),n},this.prepare=function(e,r,s){this._list=e,this._list.forEach(function(e,t,o){var i=" "+e.name,n=function(e,t,o){var i,n=-1,o=!!o,a=0;for(i in t){if(o&&t[i]===e||!o&&t[i]==e){n=a;break}a++}return n}(i,r);if(e.visible=!1,-1<n&&(e.visible=!0,e.title=s[i]," 9011"==i)){var a=Math.floor(e.value[0]/60);e.value[0]=a,e.unit="min"}})}}).service("Modules",function(){var l=[];this.show=function(){return l},this.prepare=function(e,a,r,s){l=[];e.forEach(function(i,e,t){var n=" "+i.name,o=function(e,t,o){var i,n=-1,o=!!o,a=0;for(i in t){if(o&&t[i]===e||!o&&t[i]==e){n=a;break}a++}return n}(n,a);-1<o&&(i.title=r[n],i.switch=!1,i.pos=o,1,s.forEach(function(e,t,o){" "+e==n&&(i.switch=!0)}),i.visible=!0,l.push(i))})}})}();
!function(){function e(l,m,g){this._messages=["Message 1","Message 2","Message 3","Message 4","Message 5","Message 6","Message 7","Message 8","Message 9"];var n=[],h=0,r=0;this.getList=function(){return n},this.addPack=function(e){e.forEach(function(e,a,s){n.push({id:r,sensorId:a,max:"ERROR",min:"ERROR",type:"error",active:!1,ack:!1,message:e.title+" is in ERROR State!"}),r++})},this.addNew=function(e,a,s,t){var i=m.find(e);n.push({id:r,sensorId:i,max:a,min:s,type:t,active:!1,ack:!1,message:"Test"}),r++},this.check=function(){h=0,n.forEach(function(e,a,s){if("ERROR"==e.max){var t=g.show()[e.sensorId].value[0],i=!0;1==e.active&&(i=!1);var n=!1;"ERROR"==t&&(n=!0,h++),e.active=n}else{var r=m.show()[e.sensorId];t=r.value[0],i=!0;1==e.active&&(i=!1);var o=" ",c=(n=!1,!1),u=!1;null===e.max&&(u=!0),null===e.min&&(c=!0),!c&&t<e.min&&(o="lower",n=!0,h++),!u&&t>e.max&&(o="higher",n=!0,h++),e.active=n,e.message="Value of "+r.title+" is "+o+" than threshold!"}1==e.active&&1==i&&l.$broadcast("alarm",{alarm:e,title:e.type})})},this.getNum=function(){return h}}function a(e,a,s){e.ALRM=s}function s(e){var a="alarms";e.state(a,{url:"/"+a,templateUrl:"app/"+a+"/index.html"})}s.$inject=["$stateProvider"],a.$inject=["$rootScope","$log","ALRM"],e.$inject=["$rootScope","Sensors","Modules"],angular.module("obm.alarms",["ui.router"]).config(s).run(a).service("ALRM",e)}();
!function(){function e(e,s,t){e.auth=t,e.session=s}function s(e){if(e.localStorage)return e.localStorage;throw new Error("Local storage support is needed")}function t(e,s){this._user=JSON.parse(s.getItem("session.user")),this._accessToken=s.getItem("session.accessToken"),this.getUser=function(){return this._user},this.setUser=function(e){return this._user=e,s.setItem("session.user",JSON.stringify(e)),this},this.getAccessToken=function(){return this._accessToken},this.setAccessToken=function(e){return this._accessToken=e,s.setItem("session.accessToken",e),this},this.destroy=function(){this.setUser(null),this.setAccessToken(null)}}function n(s,t,n){this.isLoggedIn=function(){var e=t.getUser();return"null"!=e&&"null"!=e&&null!=e&&"null"!==t.getUser()},this.isAdmin=function(){return"admin"==t.getUser().name},this.logIn=function(e){return s.get(e+".json").then(function(e){console.log(e.data);var s=e.data;t.setUser(s.user),t.setAccessToken(s.accessToken),n.go("home")})},this.logOut=function(){return s.get("/logout.json").then(function(e){t.destroy(),n.go("login")})}}n.$inject=["$http","session","$state"],t.$inject=["$log","localStorage"],s.$inject=["$window"],angular.module("obm.auth",["ui.router"]).config(function(){}).service("auth",n).service("session",t).factory("localStorage",s).run(e),e.$inject=["$rootScope","session","auth"]}();
!function(){function t(t,e,o,r){}function e(t){var e="diag";t.state(e,{url:"/"+e,templateUrl:"app/diag/index.html",controller:"GetTreeCtrl"})}e.$inject=["$stateProvider"],t.$inject=["$scope","$rootScope","$document","Notification"],angular.module("obm.diag",["ui.router"]).config(e).controller("GetTreeCtrl",t)}();
!function(){function t(e,o,n){var a=function(t){var e=t.data;n.log(e),o.status=e},s=function(t){var e="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;n.log(e),o.status=e};o.startMeasure=function(){o.startDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10003",value:"1"});e.PostRequest(t).then(a,s)},o.stopMeasure=function(){o.stopDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10002",value:"1"});e.PostRequest(t).then(a,s)},o.powerOn=function(){o.onDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10002",value:"1"});e.PostRequest(t).then(a,s)},o.powerOff=function(){o.offDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10001",value:"1"});e.PostRequest(t).then(a,s)},o.powerOffAll=function(){o.offDisabled;var t=JSON.stringify({action:"set",type:"mode",name:"10000",value:"1"});e.PostRequest(t).then(a,s)}}function e(t){var e="home";t.state(e,{url:"/",templateUrl:"app/home/index.html",controller:"HomeCtrl",controllerAs:"hc"})}e.$inject=["$stateProvider"],t.$inject=["IntServ","$scope","$log"],angular.module("obm.home",["ui.router"]).config(e).controller("HomeCtrl",t)}();
!function(){function t(n){this.intervalBusy=!1,this.Test=function(t){return this.intervalBusy=!0,n({method:"GET",url:"tree.json"})},this.Custom=function(t,e){return n({method:"POST",url:"/"+t,data:e,timeout:1e3,headers:{"Content-Type":"application/json"}})},this.PostRequest=function(t){return this.intervalBusy=!0,n({method:"POST",url:"/intouch_serv",data:t,timeout:1e3,headers:{"Content-Type":"application/json"}})},this.TasksRequest=function(){var t=JSON.stringify({action:"get",type:"schedule"});return n({method:"POST",url:"/scheduler",data:t,timeout:1e3,headers:{"Content-Type":"application/json"}})},this.Scheduler=function(t){return n({method:"POST",url:"/scheduler",data:t,timeout:1e3,headers:{"Content-Type":"application/json"}})}}t.$inject=["$http"],angular.module("obm.intouch",[]).config(function(){}).service("IntServ",t)}();
!function(){function r(r,n){var t=this;t.logIn=function(r,o){switch(r){case"obm":"obm"==o?n.logIn(r):t.error="WRONG USERNAME OR PASSWORD!";break;case"admin":"admin"==o?n.logIn(r):t.error="WRONG USERNAME OR PASSWORD!";break;default:t.error="WRONG USERNAME OR PASSWORD!"}}}function o(r){var o="login";r.state(o,{url:"/"+o,templateUrl:"app/login/index.html",controller:"LgnCtrl",controllerAs:"vm"})}o.$inject=["$stateProvider"],r.$inject=["$scope","auth"],angular.module("obm.login",["ui.router"]).config(o).controller("LgnCtrl",r)}();
!function(){function t(n,o,a){n.status={status:"null"};var i=function(t){var e=t.data;o.log(e),n.status=e},s=function(t){var e="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;o.log(e),n.status=e};n.odoEmul=function(t){if(1==t)var e=JSON.stringify({action:"set",type:"switch",name:"201",value:"1"});else e=JSON.stringify({action:"set",type:"switch",name:"202",value:"1"});a.PostRequest(e).then(i,s)},n.odoSpeedUp=function(){var t=JSON.stringify({action:"set",type:"switch",name:"205",value:"1"});a.PostRequest(t).then(i,s)},n.odoSpeedDown=function(){var t=JSON.stringify({action:"set",type:"switch",name:"206",value:"1"});a.PostRequest(t).then(i,s)},n.odoDir=function(t){if(1==t)var e=JSON.stringify({action:"set",type:"switch",name:"207",value:"1"});else e=JSON.stringify({action:"set",type:"switch",name:"208",value:"1"});a.PostRequest(e).then(i,s)}}function e(t){var e="odo";t.state(e,{url:"/"+e,templateUrl:"app/odo/index.html"})}e.$inject=["$stateProvider"],t.$inject=["$scope","$log","IntServ"],angular.module("obm.odo",["ui.router"]).config(e).filter("direction",function(){return function(t){var e;return 1==t&&(e="Backward"),0==t&&(e="Forward"),e}}).controller("OdoCtrl",t)}();
!function(){function t(a,n,e){a.status={status:"null"};var o=function(t){var r=t.data;n.log(r),a.status=r},s=function(t){var r="Error! Data: "+String(t.data)+" StatusText: "+t.statusText+" xhrStatus: "+t.xhrStatus;n.log(r),a.status=r};a.switch=function(t,r){console.log("Switch"),3001==t&&1==r&&(t=3002,r=1),3001==t&&0==r&&(t=3004,r=1),3008==t&&1==r&&(t=3009,r=1),3008==t&&0==r&&(t=3011,r=1),3013==t&&1==r&&(t=3014,r=1),3013==t&&0==r&&(t=3016,r=1),4001==t&&1==r&&(t=4003,r=1),4001==t&&0==r&&(t=4005,r=1);var a=JSON.stringify({action:"set",type:"switch",name:String(t),value:String(r)});e.PostRequest(a).then(o,s)}}function r(t){var r="power";t.state(r,{url:"/"+r,templateUrl:"app/power/index.html"})}r.$inject=["$stateProvider"],t.$inject=["$scope","$log","IntServ"],angular.module("obm.power",["ui.router"]).config(r).controller("PwrCtrl",t)}();
!function(){function e(a,i,e,t,n){var o=this;o.schedule=t,o.status=e,i.today=function(){var e=(new Date).getTime();e=36e5*Math.round(e/36e5);var t=new Date(e+36e5),a=new Date(e+18e6+36e5);o.FormData={},o.FormData.dt=t,o.FormData.edt=a},i.today(),i.$watch("$ctrl.FormData.dt",function(e,t){var a=o.FormData.dt.getTime();o.FormData.edt.getTime()<=a&&(o.FormData.edt=new Date(a+18e6))}),i.plusMin=function(e){if(1==e){var t=o.FormData.dt.getTime();o.FormData.dt=new Date(t+18e5)}else{t=o.FormData.edt.getTime();o.FormData.edt=new Date(t+18e5)}},i.minusMin=function(e){if(1==e){var t=o.FormData.dt.getTime();o.FormData.dt=new Date(t-18e5)}else{t=o.FormData.edt.getTime();o.FormData.edt=new Date(t-18e5)}},i.clear=function(){o.FormData.dt=null,o.FormData.edt=null},i.inlineOptions={customClass:function(e){var t=e.date;if("day"===e.mode)for(var a=new Date(t).setHours(0,0,0,0),n=0;n<i.events.length;n++){var o=new Date(i.events[n].date).setHours(0,0,0,0);if(a===o)return i.events[n].status}return""},minDate:new Date,showWeeks:!0},i.formats=["dd MMMM yyyy | HH:mm","yyyy MMMM dd | HH:mm"],i.format=i.formats[0],i.altInputFormats=["dd MMMM yyyy | HHmm"],i.dateOptions={formatYear:"yy",startingDay:1},i.toggleMin=function(){i.inlineOptions.minDate=i.inlineOptions.minDate?null:new Date,i.dateOptions.minDate=i.inlineOptions.minDate},i.toggleMin(),i.open1=function(){i.popup1.opened=!0},i.open2=function(){i.popup2.opened=!0},i.popup1={opened:!1},i.popup2={opened:!1},o.ok=function(){var e={action:"add",type:"schedule",task:{begin_time:{year:1970,month:1,day:1,hour:0,minutes:0},end_time:{year:2018,month:7,day:25,hour:18,minutes:0}}};if(null===o.FormData.dt||null===o.FormData.edt||void 0===o.FormData.dt||void 0===o.FormData.edt);else{e.task.begin_time.year=o.FormData.dt.getFullYear(),e.task.begin_time.month=o.FormData.dt.getMonth()+1,e.task.begin_time.day=o.FormData.dt.getDate(),e.task.begin_time.hour=o.FormData.dt.getHours(),e.task.begin_time.minutes=o.FormData.dt.getMinutes(),e.task.end_time.year=o.FormData.edt.getFullYear(),e.task.end_time.month=o.FormData.edt.getMonth()+1,e.task.end_time.day=o.FormData.edt.getDate(),e.task.end_time.hour=o.FormData.edt.getHours(),e.task.end_time.minutes=o.FormData.edt.getMinutes();var t=JSON.stringify(e);a.close(t)}},o.cancel=function(){a.dismiss("cancel")}}function t(e,t,n){var o=this;o.scheduleValid=!1,o.schedule=[],o.dateFormats=["yyyy MMMM dd | HH:mm","dd MMMM yyyy | HH:mm"],o.dateFormat=o.dateFormats[0],o.getSchedule=function(){n.TasksRequest().then(function(e){o.schedule=e.data.schedule,o.schedule.forEach(function(e,t,a){e.TimeStart=new Date(e.begin_time.year,e.begin_time.month-1,e.begin_time.day,e.begin_time.hour,e.begin_time.minutes,0,0),e.TimeEnd=new Date(e.end_time.year,e.end_time.month-1,e.end_time.day,e.end_time.hour,e.end_time.minutes,0,0)}),o.readstatus="Reading OK!",o.scheduleValid=!0},function(e){o.status="Error reading schedule!",o.scheduleValid=!1})},o.getSchedule(),e.deleteTask=function(t){var e={action:"del",type:"schedule",task:{id:o.schedule[t].id}},a=JSON.stringify(e);console.log(a),n.Scheduler(a).then(function(e){console.log(e.data),o.status="Task deleted!",o.schedule.splice(t,1),o.getSchedule()},function(e){console.log("Error deleting Task!"),o.status="Error deleting task!"})},o.open=function(e){t.open({animation:!0,ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"newTask.html",controller:"ModalInstanceCtrl",controllerAs:"$ctrl",size:e,resolve:{status:function(){return o.status},schedule:function(){return o.schedule}}}).result.then(function(e){n.Scheduler(e).then(function(e){console.log(e.data),o.getSchedule(),o.status="Task added!"},function(e){console.log("Error adding new Task!"),o.status="Error adding new task!"})},function(){})}}function a(e){var t="schedule";e.state(t,{url:"/"+t,templateUrl:"app/"+t+"/index.html"})}a.$inject=["$stateProvider"],t.$inject=["$scope","$uibModal","IntServ"],e.$inject=["$uibModalInstance","$scope","status","schedule","IntServ"],angular.module("obm.schedule",["ui.router"]).config(a).controller("SchCtrl",t).controller("ModalInstanceCtrl",e)}();
!function(){function t(t,e){t.Sets=e}function e(n){var a=this;a.tags="h",a.searchText="",a.applyFilter=function(e){0==e?(a.searchText="",a.tags.forEach(function(t){t.active=!1})):(a.searchText=e,a.tags.forEach(function(t){t.active=!1,t.value==e&&(t.active=!0)}))},a.Settings=function(){return a.settings},a.Keys=function(){return a.settingsKeys},a.Load=function(){var t=JSON.stringify({action:"get",type:"settings"});n.PostRequest(t).then(function(t){var e=t.data.settings;if(null!=e){a.settings=e;var n=Object.keys(e);a.settingsKeys=[],a.tags=[],n.forEach(function(t,e,n){a.settingsKeys[e]={};var s=a.settings[t];a.settingsKeys[e].name=t,a.settingsKeys[e].admin=s.admin,a.settingsKeys[e].max=s.max,a.settingsKeys[e].min=s.min,a.settingsKeys[e].type=s.type,a.settingsKeys[e].unit=s.unit,s.hasOwnProperty("category")||(a.settings[t].category="# General");var i=a.settings[t].category;yes=!1,a.tags.forEach(function(t,e){i==t.value&&(yes=!0)}),yes||a.tags.push({value:a.settings[t].category,active:!1}),a.settingsKeys[e].category=a.settings[t].category})}else console.log("Settings returned undefined")},function(t){a.settings="Error!",console.log("Error reading settings!")})},a.Save=function(){var t={};a.settingsKeys.forEach(function(t,e,n){"int"!=a.settings[t.name].type&&"double"!=a.settings[t.name].type&&"select"!=a.settings[t.name].type||(a.settings[t.name].value=parseFloat(a.settings[t.name].value)),a.settings[t.name].value}),t.settings=a.settings;var e=JSON.stringify(t);a.status=e,n.PostRequest(e).then(function(t){},function(t){})}}function n(t,e,n){n.Load()}function s(t){var e="settings";t.state(e,{url:"/"+e,templateUrl:"app/"+e+"/index.html"})}s.$inject=["$stateProvider"],n.$inject=["$scope","IntServ","Sets"],e.$inject=["IntServ"],angular.module("obm.settings",["ui.router"]).config(s).controller("SetCtrl",n).directive("numValidator",function(){return{require:"ngModel",link:function(t,e,n,s){s.$parsers.push(function(t){var e=parseFloat(t);e>=n.min&&e<=n.max?s.$setValidity("charE",!0):s.$setValidity("charE",!1);return t})}}}).service("Sets",e).run(t),t.$inject=["$rootScope","Sets"]}();
!function(){function t(n){this.num=0,this.tzone="",this.valid=!1,this.GetDate=function(){var t=this.tzone;"CET"==t&&(t="+0100"),"CEST"==t&&(t="+0200");var i=new Date(1e3*this.num);return 0<this.num?this.valid=!0:this.valid=!1,n("date")(i,"dd MMMM yyyy | HH:mm",t)}}function i(t,i,n){t.TIME=n}i.$inject=["$rootScope","$log","TIME"],t.$inject=["$filter"],angular.module("obm.time",[]).config(function(){}).run(i).service("TIME",t)}();
!function(){function _(_){_.translations("en",translationsEN),_.translations("ru",translationsRU),_.preferredLanguage("en"),_.fallbackLanguage("en")}function e(e,_,s){var n=s.getItem("language-obm");null!=n&&e.use(n),_.changeLanguage=function(_){e.use(_),s.setItem("language-obm",_)}}_.$inject=["$translateProvider"],e.$inject=["$translate","$scope","localStorage"],translationsEN={mainButton:"Main",odoButton:"Odometer",diagnosticsButton:"Diagnostics",powerControlButton:"PowerCtrl",schedulerButton:"Scheduler",signalsButton:"Signals",upsButton:"UPS Status",MAIN_TITLE:"OBM Control System",BUTTON_LANG_DE:"Deutsch",BUTTON_LANG_EN:"English",BUTTON_LANG_RU:"Русский",WEB_SITE:"Web-site",SPC_INFOTRANS:"SPC INFOTRANS",LEGAL_INFO:"Legal Info",_main:"Main",_power:"Power",_odo:"Odometer",_diag:"Diagnostics",_tasks:"Scheduler",_alarms:"Alarms",_settings:"Settings",_connlost:"Server connection lost",_save:"Save",create_new_task:"Create New Task",ON:"ON",WAIT:"WAIT",OFF:"OFF",NA:"n/a",ERROR:"ERROR",degC:"°C",MR_STAND_BY:"StandBy",MR_PRE_STAND_BY:"Pre StandBy",MR_MEASURE:"Measure",MR_READY:"Ready",MR_RUN_READY:"Starting...",MR_RUN_MEASURE:"Starting measure...",MR_RUN_STAND_BY:"Stopping...",MR_OFF:"System Off",MR_ERROR:"System Error!",MR_RUN_OFF:"Shutdown...",_STDBY:"StdBy",_OFF:"OFF",_OFFALL:"Switch Off",_ON:"ON",_START:"Start",_STOP:"Stop",_title:"Title",_timestart:"Time of start",_timeend:"Time of end",_finished:"Finished",_delete:"Delete",_upserror:"UPS Error",_error:"Fehler",_emulatorspeed:"Emulator speed",_emulatordirection:"Emulator direction",_emulatormode:"Emulator mode",_forward:"Forward",_backward:"Backward",_powersupply:"Power and supply",_centralsystem:"Central system",_auxsystem:"Aux systems",_networks:"Networks",_sensors:"Sensors",_storage:"Storage",_automode:"Auto",_manualmode:"Manual",_speed:"Speed",CENTRAL_SYSTEM:"Central system",ses:"SES",UPS:"UPS",Units:"Units",MAIN_ERROR:"Server connection error!",control_mode:"Control mode",max_frame_temp:"Maximal frame temperature alarm",max_frame_sign:"Max frame sign",automeasure_speed_record:"Automeasure speed threshold",automeasure_staying_time:"Automeasure staying time",debug:"Debug mode",send_data_email:"Email for sending data",send_data_sms:"Mobile number for sending sms",wheel_d:"Odometer wheel diameter",cut_measure:"Cut Measure",balis_speed_on:"ETCS Balise Reader switch on speed",balis_speed_off:"ETCS Balise Reader switch off speed",ext_power_time:"Time to work on Battery",ext_power_runtime:"Remaining battery time alarm",Balisa:"ETCS Balise Reader",DYNSYS:"Axle box acceleration sensors",y_axle_11_sens_k:"y_axle_11_sens, K",y_axle_12_sens_k:"y_axle_12_sens, K",y_axle_21_sens_k:"y_axle_21_sens, K",y_axle_22_sens_k:"y_axle_22_sens, K",y_axle_42_sens_k:"y_axle_42_sens, K",y_axle_41_sens_k:"y_axle_41_sens, K",z_axle_11_sens_k:"z_axle_11_sens, K",z_axle_12_sens_k:"z_axle_12_sens, K",z_axle_21_sens_k:"z_axle_21_sens, K",z_axle_22_sens_k:"z_axle_22_sens, K",z_axle_41_sens_k:"z_axle_41_sens, K",z_axle_42_sens_k:"z_axle_42_sens, K",y_bogie_1_sens_k:"y_bogie_1_sens, K",y_bogie_2_sens_k:"y_bogie_2_sens, K",y_bogie_3_sens_k:"y_bogie_3_sens, K",y_bogie_4_sens_k:"y_bogie_4_sens, K",y_body_I_sens_k:"y_body_I_sens, K",y_body_II_sens_k:"y_body_II_sens, K",z_body_I_sens_k:"z_body_I_sens, K",z_body_II_sens_k:"z_body_II_sens, K",y_axle_11_sens_b:"y_axle_11_sens, B",y_axle_12_sens_b:"y_axle_12_sens, B",y_axle_21_sens_b:"y_axle_21_sens, B",y_axle_22_sens_b:"y_axle_22_sens, B",y_axle_42_sens_b:"y_axle_42_sens, B",y_axle_41_sens_b:"y_axle_41_sens, B",z_axle_11_sens_b:"z_axle_11_sens, B",z_axle_12_sens_b:"z_axle_12_sens, B",z_axle_21_sens_b:"z_axle_21_sens, B",z_axle_22_sens_b:"z_axle_22_sens, B",z_axle_41_sens_b:"z_axle_41_sens, B",z_axle_42_sens_b:"z_axle_42_sens, B",y_bogie_1_sens_b:"y_bogie_1_sens, B",y_bogie_2_sens_b:"y_bogie_2_sens, B",y_bogie_3_sens_b:"y_bogie_3_sens, B",y_bogie_4_sens_b:"y_bogie_4_sens, B",y_body_I_sens_b:"y_body_I_sens, B",y_body_II_sens_b:"y_body_II_sens, B",z_body_I_sens_b:"z_body_I_sens, B",z_body_II_sens_b:"z_body_II_sens, B",aq_sens_k:"aq_sens, K",aq_sens_b:"aq_sens, B",z_d_ps_11_k:"z_d_ps_11, K",z_d_ps_11_b:"z_d_ps_11, b",z_d_ps_12_k:"z_d_ps_12, K",z_d_ps_12_b:"z_d_ps_12, b",z_d_ps_21_k:"z_d_ps_21, K",z_d_ps_21_b:"z_d_ps_21, b",z_d_ps_22_k:"z_d_ps_22, K",z_d_ps_22_b:"z_d_ps_22, b"},translationsRU={},translationsDE={},angular.module("obm.translate",["pascalprecht.translate"]).config(_).controller("TransCtrl",e)}();
!function(){function t(a,r){var c=this;angular.isDefined(c.int1)||(c.int1=void 0,c.num=0,c.dbgStatus="",c.dbgRequest="",c.dbgUrl="readbufs",c.dbgAction="get",c.dbgType="data",c.dbgName="MWAY",c.once=function(){c.num=0,c.stop();var t=c.dbgUrl,n=c.dbgAction,e=c.dbgType,o=c.dbgName,i=JSON.stringify({action:n,type:e,name:o});c.dbgRequest=JSON.parse(i),a.Custom(t,i).then(function(t){c.dbgStatus=t.data},function(t){c.dbgStatus="Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще. "+t.data})},c.interval=function(){c.num=0,c.stop();var t=c.dbgUrl,n=c.dbgAction,e=c.dbgType,o=c.dbgName,i=JSON.stringify({action:n,type:e,name:o});c.int1=r(function(){c.num=c.num+1,a.Custom(t,i).then(function(t){c.dbgStatus=t.data},function(){c.dbgStatus="Какая-то ошибочка. Вернулся плохой или пустой ответ. Или не вернулся вообще."})},1e3)},c.stop=function(){angular.isDefined(c.int1)&&(console.log(c.int1),r.cancel(c.int1),c.int1=void 0)})}function n(t){}function e(t,n){var e="trends";n.setOptions({colors:["#000000","#000000"]}),t.state(e,{url:"/"+e,templateUrl:"app/"+e+"/index.html",controller:"DbgCtrl",controllerAs:"dbc"})}function o(t,n,e,o){}e.$inject=["$stateProvider","ChartJsProvider"],n.$inject=["$scope"],t.$inject=["IntServ","$interval"],o.$inject=["$rootScope","$locale","$state","$location"],angular.module("obm.trends",["ui.router","chart.js"]).config(e).controller("LineCtrl",n).controller("DbgCtrl",t).run(o)}();
!function(){function t(t){var u="ups";t.state(u,{url:"/"+u,templateUrl:"app/ups/index.html"})}t.$inject=["$stateProvider"],angular.module("obm.ups",["ui.router"]).config(t)}();
!function(){function e(e){var r="users";e.state(r,{url:"/"+r,templateUrl:"app/users/index.html"})}e.$inject=["$stateProvider"],angular.module("obm.users",["ui.router"]).config(e)}();