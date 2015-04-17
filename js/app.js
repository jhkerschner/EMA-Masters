var currHole = 1;
var userID;
var myApp = angular.module("EMAMasters", ["ngRoute","firebase"]);
var totalScore = 0;
var NUMBER_REGEXP = /^\d+$/;

myApp.directive('number', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (NUMBER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('number', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('number', false);
          return undefined;
        }
      });
    }
  };
});

myApp.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);

myApp.controller('player', ['$scope', '$firebase', '$location',
  function($scope, $firebase, $location) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://ema-masters.firebaseio.com/players");
    var sync = $firebase(ref);
    
    $scope.save = function() {
      if($scope.item.player != null){
        holes = {'h1':0,'h2':0,'h3':0,'h4':0,'h5':0,'h6':0,'h7':0,'h8':0,'h9':0,'h10':0,'h11':0,'h12':0,'h13':0,'h14':0,'h15':0,'h16':0,'h17':0,'h18':0};
        sync.$push({ player:$scope.item.player, total:0, holes:holes }).then(function(ref) {
          userID = ref.key();
          $location.path('/scorecard/hole/'+currHole+'/');
        });
      }
    };
  }
]);

myApp.controller('scorecard', ['$scope', '$firebase', '$location',
  function($scope, $firebase, $location) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://ema-masters.firebaseio.com/players/"+userID+"/holes/");
    var sync = $firebase(ref).$asObject();

    var ref_total_score = new Firebase("https://ema-masters.firebaseio.com/players/"+userID+"/");
    var sync_total_score = $firebase(ref_total_score).$asObject();

    $scope.nextHole = currHole;
    next = currHole + 1;
    $scope.saveScore = function() {
      if($scope.item.score != null){
        totalScore += parseInt($scope.item.score);

        sync_total_score.total = totalScore;
        sync_total_score.$save();

        //objectHole = 'h'+currHole;

        switch(currHole) {
          case 1:
              sync.h1 = $scope.item.score;
              break;
          case 2:
              sync.h2 = $scope.item.score;
              break;
          case 3:
              sync.h3 = $scope.item.score;
              break;
          case 4:
              sync.h4 = $scope.item.score;
              break;
          case 5:
              sync.h5 = $scope.item.score;
              break;
          case 6:
              sync.h6 = $scope.item.score;
              break;
          case 7:
              sync.h7 = $scope.item.score;
              break;
          case 8:
              sync.h8 = $scope.item.score;
              break;
          case 9:
              sync.h9 = $scope.item.score;
              break;
          case 10:
              sync.h10 = $scope.item.score;
              break;
          case 11:
              sync.h11 = $scope.item.score;
              break;
          case 12:
              sync.h12 = $scope.item.score;
              break;
          case 13:
              sync.h13 = $scope.item.score;
              break;
          case 14:
              sync.h14 = $scope.item.score;
              break;
          case 15:
              sync.h15 = $scope.item.score;
              break;
          case 16:
              sync.h16 = $scope.item.score;
              break;
          case 17:
              sync.h17 = $scope.item.score;
              break;
          case 18:
              sync.h18 = $scope.item.score;
              break;
         
      }

        sync.$save().then(function(ref) {
          if(next == 19){
           $location.path('/round-complete/');
          }else{
            $location.path('/scorecard/hole/'+(next)+'/');
          }
          currHole++;
        });
        /*sync.h1.$save(function(){
          if(next == 19){
           $location.path('/round-complete/');
          }else{
            $location.path('/scorecard/hole/'+(next)+'/');
          }
          currHole++;
        });*/


        }
        /*sync.$add({ hole:currHole, score:$scope.item.score }).then(function(ref) {
          if(next == 19){
           $location.path('/round-complete/');
          }else{
            $location.path('/scorecard/hole/'+(next)+'/');
          }
          currHole++;
        });
      }*/
      
    };
  }
]);

myApp.controller('round-complete', ['$scope', '$firebase', '$location',
  function($scope, $firebase, $location) {
    $scope.total = totalScore;
  }
]);

myApp.controller('leaderboard', ['$scope', '$firebase',
  function($scope, $firebase) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://ema-masters.firebaseio.com/players/");
    var sync = $firebase(ref.orderByChild("total"));
    var list = sync.$asArray();
    list.$loaded();

    // we can add it directly to $scope if we want to access this from the DOM
    $scope.list = list;
  }
]);

myApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'player',
      templateUrl:'player.html'
    })
    .when('/scorecard/hole/:hole',{
       controller:'scorecard',
       templateUrl:'scorecard.html'
    })
    .when('/scorecard/', {
      controller:'scorecard',
      templateUrl:'scorecard.html'
    })
    .when('/leaderboard/', {
      controller:'leaderboard',
      templateUrl:'leaderboard.html'
    }).when('/round-complete/',{
      controller:'round-complete',
      templateUrl:'round-complete.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})





