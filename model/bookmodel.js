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

  },
  createbookSchema : function(mongoose)
  {

    var Schema = mongoose.Schema;

    var bookSchema= new Schema({
      user_id:String,
      book_id:String,
      book_name:String,
      book_cover:String,
      trade_status:String,
      time:String
    });

    return book=mongoose.model('books',bookSchema);

  },
  tradeSchema : function(mongoose)
  {

    var Schema = mongoose.Schema;

    var tradeSchema= new Schema({
      book_userId:String,
      book_userName:String,
      book_userEmail:String,
      req_userId:String,
      req_userEmail:String,
      req_userAddress:String,
      req_status:String
    });

    return trade=mongoose.model('trade',tradeSchema);

  }




}
