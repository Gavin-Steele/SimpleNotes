(function(){

var app = angular.module('notes', ['ionic', 'ngCordova', 'notes.notestore']);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'views/list.html'
  });
    $stateProvider.state('edit', {
    url: '/edit/:noteId',
    templateUrl: 'views/edit.html',
    controller: 'EditCtrl'
  });
    $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'views/edit.html',
    controller: 'AddCtrl'
  });

  $urlRouterProvider.otherwise('/list');
});

app.controller('ListCtrl', function($scope, NoteStore) {

  
  $scope.reorder = false;

  $scope.notes = NoteStore.list();
  $scope.remove = function (noteId) {
    NoteStore.remove(noteId);
  };

  $scope.move = function(note, fromIndex, toIndex){
    NoteStore.move(note, fromIndex, toIndex);
  };

  $scope.toggleReordering =function(){
    $scope.reordering = !$scope.reordering;
  };
});

app.controller('AddCtrl', function($scope, $state, NoteStore){
  
  $scope.note = {
    id: new Date().getTime().toString(),
    title: '',
    description: '',
    pictureUrl: ''
  };

  $scope.save = function(){
    NoteStore.create($scope.note);
    $state.go('list');
  };
});

app.controller('EditCtrl', function($scope, $state, $cordovaCamera, NoteStore){
  
  $scope.note = angular.copy(NoteStore.get($state.params.noteId));

  $scope.pictureUrl = 'http://placehold.it/200x200';

  $scope.takePicture = function() {
    var options = {
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG
    }
    $cordovaCamera.getPicture(options)
      .then(function(data) {
        //console.log('camera data: ' + angular.toJson(data));
        $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
      }, function(error) {
        console.log('camera error: ' + angular.toJson(error));
      });
  };

  $scope.save = function(){
    NoteStore.update($scope.note);
    $state.go('list');
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
}());