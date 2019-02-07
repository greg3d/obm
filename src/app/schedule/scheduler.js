;
(function () {
  'use scrict';

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