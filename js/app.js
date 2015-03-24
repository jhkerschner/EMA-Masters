var currHole = 1;
var userID;
var myApp = angular.module("EMAMasters", ["ngRoute","firebase"]);
var totalScore = 0;

myApp.controller('player', ['$scope', '$firebase', '$location',
  function($scope, $firebase, $location) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://ema-masters.firebaseio.com/players");
    var sync = $firebase(ref);
    
    $scope.save = function() {
      if($scope.item.player != null){
        sync.$push({ player:$scope.item.player, total:0 }).then(function(ref) {
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
    var sync = $firebase(ref).$asArray();

    var ref_total_score = new Firebase("https://ema-masters.firebaseio.com/players/"+userID+"/");
    var sync_total_score = $firebase(ref_total_score).$asObject();

    $scope.nextHole = currHole;
    next = currHole + 1;
    $scope.saveScore = function() {
      if($scope.item.score != null){
        totalScore += parseInt($scope.item.score);

        sync_total_score.total = totalScore;
        sync_total_score.$save();

        sync.$add({ hole:currHole, score:$scope.item.score }).then(function(ref) {
          if(next == 19){
           $location.path('/round-complete/');
          }else{
            $location.path('/scorecard/hole/'+(next)+'/');
          }
          currHole++;
        });
      }
      
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





