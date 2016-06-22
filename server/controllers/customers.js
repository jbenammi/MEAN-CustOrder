var customer = mongoose.model('customers');

module.exports = {
	index: function(request, response){
		customer.find({}).populate('_orders').exec(function(err, customers){
			if(err) {
				response.json(err);
			}
			else{
				response.json(customers);
			}
		})
	},
	create: function(request, response){
		var newCustomer = new customer(request.body);

		newCustomer.save(function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	},
	delete: function(request, response){
		customer.remove({_id: request.params.id}, function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	}
}