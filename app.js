(function(){
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
//.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");
.directive('foundItems', FoundItems)
.directive('foundItemDescription', FoundItemDescription);

function FoundItems() {
  var ddo = {
    templateUrl: 'menuItems.html',
  };
  return ddo;
}

function FoundItemDescription() {
  var ddo = {
    template: '<b>Name : </b> {{value.name}} <br><b>Short Name : </b>{{value.short_name}} <br><b>Description : </b>{{value.description}}<br>' 
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
   var ctrl = this;
   var found = [];

  ctrl.displayMatchedMenuItems = function (searchTerm) {

    var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

    promise.then(function (success){
      //console.log("response from:  " + success);
      ctrl.found = success;
      //console.log("Found is " + success[0].name);
    })
    .catch(function (error){
      console.log("error in ctrl func");
    });
};

  ctrl.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){
  var service = this;
  var foundItems = [];
//  var found = [];

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    }).then(function(response){
        //console.log(response.data);
        var allMenuItems = response.data;
        console.log("Search term is " + searchTerm);

        for(var i=0; i<allMenuItems.menu_items.length; i++) {
          var x = allMenuItems.menu_items[i].description;
          if(x.toLowerCase().indexOf(searchTerm) !== -1){
            foundItems.push(allMenuItems.menu_items[i]);
            //console.log(allMenuItems.menu_items[i]);
          }
        }
        console.log(foundItems[1]);
        return foundItems;
    });
  };

  service.removeItem = function(itemIndex) {
    foundItems.splice(itemIndex, 1);
  };

}


})();
