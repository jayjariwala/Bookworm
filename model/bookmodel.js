var mongoose=require('mongoose');
module.exports =
{

  getConnection: function()
  {
    return mongoose.connect("mongodb://test:test@ds055594.mlab.com:55594/bookclub");
  },
  createSchema : function(mongoose)
  {

    var Schema = mongoose.Schema;

    var userSchema= new Schema({
      uid:String,
      name:String,
      email:String,
      address:String,
      password:String

    });

    return user=mongoose.model('Users',userSchema);

  }




}
