;
(function () {
  'use scrict';

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