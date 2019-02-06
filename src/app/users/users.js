;(function(){
	'use scrict';

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