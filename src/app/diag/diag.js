;(function(){
	'use scrict';

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