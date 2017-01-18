module.exports =
{
getoutstandingcount : function(trade,req)
{
  trade.count({req_userId:req.session.user.user_id,req_status:'NA'},function(err,count){
    if(err)throw err;
    console.log("count>>"+count);
    return count;
  });

},
getunapprovedcount: function(trade,req)
{

  trade.count({book_userId:req.session.user.user_id,req_status:'NA'},function(err,count){
    if(err)throw err;
    console.log("count>>"+count);
    return count;
  });

}

}
