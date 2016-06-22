		var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);

		myApp.config(function($routeProvider){
			$routeProvider
				.when('/customers', {
					templateUrl: 'static/partials/customers.html'
				})
				.when('/orders', {
					templateUrl: 'static/partials/orders.html'
				})
				.otherwise({
					redirectTo: '/'
				})
		})

		myApp.factory('customerFactory', function($http){
			var customers = [];
			var factory = {};

			factory.index = function(callback){
				$http.get('/customers').success(function(results){
					customers = results;
					console.log(customers);
					callback(customers);
				})
			}

			factory.create = function(customer, callback){
				if(customers.length == 0){
					$http.post('/customers', customer).success(function(results){
							callback();
						})
						return true
				}
				else{
					for (var i = 0; i < customers.length; i++) {
						if(customers[i].name == customer.name){
							return false
						}
						else{
							$http.post('/customers', customer).success(function(results){
								callback();
							})
							return true
						}
					}
				}
			}
			factory.delete = function(customer_id, callback){
				$http.delete('/customers/' + customer_id).success(function(results){
					callback();
				})
			}
			return factory;
		})

		myApp.factory('orderFactory', function($http){
			var orders = [];
			var factory = {};

			factory.index = function(callback){
				$http.get('/orders').success(function(data){
					orders = data;
					callback(orders);
				})
			}
			factory.create = function(id, order, callback){
				$http.post('/orders/' + id, order).success(function(results){
					callback();
				})
			}

			factory.delete = function(customer_id, callback){
				$http.delete('/orders/' + customer_id).success(function(results){
					callback();
				})
			}			
			return factory;
		})

		myApp.controller('customersController', function(customerFactory){
			var self = this
			self.customers = []
			self.newCustomer = {}
			self.userExists = {exists: false}

			customerFactory.index(function(data){
				self.customers = data;
			});

			self.create = function(){
				self.userExists.exists = false;
				var valid = customerFactory.create(self.newCustomer, function(){
					customerFactory.index(function(data){
						self.customers = data;
					})
				});
				if(valid){
					self.newCustomer = {};
				}
				else{
					self.userExists.exists = true;
					self.newCustomer = {};
				}
			}

			self.delete = function(customer_id){
				customerFactory.delete(customer_id, function(){
					customerFactory.index(function(data){
						self.customers = data;
					})
				});
			}
		})

		myApp.controller('ordersController', function(customerFactory, orderFactory){
			var self = this
			self.customers = [];
			self.orders = [];
			self.newOrder = {};

			customerFactory.index(function(data){
				self.customers = data;
			})

			orderFactory.index(function(data){
				self.orders = data;
			})

			self.create = function(){
				for (var i = 0; i < self.customers.length; i++) {
					if(self.customers[i]._id == self.newOrder.customer){
						var customer_id = self.newOrder.customer;
						self.newOrder.customer = self.customers[i].name;
					}
				}
				orderFactory.create(customer_id, self.newOrder, function(){
					orderFactory.index(function(data){
						self.orders = data;
					})
				});
				self.newOrder = {};
			}

			self.delete = function(customer_id){
				orderFactory.delete(customer_id, function(){
					orderFactory.index(function(data){
						self.orders = data;
					})
				});
			}			

		})