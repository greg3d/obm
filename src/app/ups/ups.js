;(function(){
	'use scrict';

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