var mongoose=require('mongoose');
module.exports =
{

  getConnection: function()
  {
    return mongoose.connect("mongodb://test:test@ds055594.mlab.com:55594/bookclub");
  },
  createSchema : function()
  {

    var schema = mongoose.Schema;

    var userSchema= new schema({
      user_id:String,
      name:String,
      email:String,
      Address:String,
      Pass:String

    });

    return user=mongoose.model('Users',userSchema);

  }




}
