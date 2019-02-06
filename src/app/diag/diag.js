;(function(){
	'use scrict';

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