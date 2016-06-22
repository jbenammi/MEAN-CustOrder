var order = mongoose.model('orders');
var customer = mongoose.model('customers');

module.exports = {
	index: function(request, response){
		order.find({}).populate('_customer').exec(function(err, results){
			if(err) {
				response.json(err);
			}
			else{
				response.json(results);
			}
		})
	},
	create: function(request, response){
		var newOrder = new order(request.body);

		newOrder.save(function(err){
			if(err){
				response.json(err);
			}
			else{
				customer.findOne({_id: request.params.id}, function(err, results){
					results._orders.push(newOrder._id)
					results.save(function(err){
						if(err){
							response.json(err)
						}
						else{
							response.json({success: true});
						}
					})
				})
			}
		})
	},
	delete: function(request, response){
		order.remove({_id: request.params.id}, function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	}	
}