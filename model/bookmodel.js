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
      uid:String,
      book_id:String,
      book_name:String,
      book_cover:String,
      trade_status:String,
      time:String
    });

    return book=mongoose.model('books',bookSchema);

  }




}
