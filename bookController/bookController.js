var model=require('../model/bookmodel');
var connection=model.getConnection();
var user = model.createSchema(connection);
var book = model.createbookSchema(connection);
var trade = model.tradeSchema(connection);
var uuid=require('node-uuid');
var bcrypt = require('bcrypt');
var request = require('request');
var outstanding=require('./outstanding');

const saltRounds = 10;


module.exports = function(app)
{

  app.get('/',function(req,res){

    if(typeof req.session.user !== "undefined") {
    // obj is a valid variable, do something here.
    res.render('mybooks',{user:req.session.user});
    }
    else {
          res.render('index');
    }

  })

app.get('/outstanding',function(req,res){

  if(typeof req.session.user == "undefined") {
  // obj is a valid variable, do something here.
  res.redirect('/');
  }
  else {

    res.render('outstanding',{user:req.session.user});
  }

});

app.post('/outstanding',function(req,res){

    trade.find({req_userId:req.session.user.user_id},{'timestamp':0},function(err,bookreq){
        res.send(bookreq);
      }).sort({'timestamp':-1});



});


app.get('/unapproved',function(req,res){

  if(typeof req.session.user == "undefined") {
  // obj is a valid variable, do something here.
  res.redirect('/');
  }
  else {

    var count= outstanding.getunapprovedcount(trade,req);
    console.log("The outstanding request"+count);
    res.render('unapproved',{user:req.session.user});
  }

});

app.post('/unapproved',function(req,res){

  trade.find({book_userId:req.session.user.user_id,req_status:'NA'},{'timestamp':0},function(err,bookreq){
        res.send(bookreq);
      }).sort({'timestamp':-1});

});

app.get('/allbooks',function(req,res){
  if(typeof req.session.user == "undefined") {
  // obj is a valid variable, do something here.
  res.redirect('/');
  }
  else {
    res.render('allbooks',{user:req.session.user});
  }

});

app.get('/settings',function(req,res){
  if(typeof req.session.user == "undefined") {
  // obj is a valid variable, do something here.
  res.redirect('/');
  }
  else {
    res.render('settings',{user:req.session.user});
  }
});



  app.get('/signup',function(req,res){
    res.render('signup');
  })

  app.get('/login',function(req,res){
    var status=req.param('success');
    console.log("Status"+status);
    res.render('login',{status:status,failure:0});
  })

app.post('/myallbooks',function(req,res){
console.log("MY ALLL BOOKS"+req.session.user_id);
  book.find({user_id:req.session.user.user_id},{'time':0},function(err,userBooks){
      console.log("DATA>>>>>>>"+userBooks);
        res.send(userBooks);
      }).sort({'time':-1});

});

app.post('/delmybook',function(req,res){

    book.findOneAndRemove({user_id:req.session.user.user_id,book_id:req.body.bookid},function(err,docs){
        if(err) throw err;

       trade.findOneAndRemove({book_userId:req.session.user.user_id,book_id:req.body.bookid},function(err,docs){
         if(err) throw err;
         book.find({user_id:req.session.user.user_id},{'time':0},function(err,userBooks){
            console.log("DATA>>>>>>>"+userBooks);
              res.send(userBooks);
            }).sort({'time':-1});

       })

      });

});


app.post('/trade_books',function(req,res){

  book.find({},{'time':0},function(err,userBooks){
      console.log("DATA>>>>>>>"+userBooks);
        userBooks.forEach(function (each){
              if(each.user_id == req.session.user.user_id || each.trade_status == 0 )
              {
                each.book_id ='notrade'
              }
       });


        res.send(userBooks);

      }).sort({'time':-1});

});

  app.get('/mybooks',function(req,res){
    if(typeof req.session.user == "undefined") {
    // obj is a valid variable, do something here.
    res.redirect('/');
    }
    else {

      res.render('mybooks',{user:req.session.user});
    }
    //res.render('mybooks',{user:req.session.user});

  })

app.post('/addbook',function(req,res){
var timestamp = Math.floor(Date.now() /1000);
var ranNum = Math.random() * (100 - 0) + 100;
var random= timestamp+ranNum;
var title1=req.body.title;

request("https://www.googleapis.com/books/v1/volumes?q="+title1+"&intitle:"+title1+"&maxResults=1&key=AIzaSyCYtf_bNICpqwIi3R71Q7bkbOi5QOEiPok", function (error, response, body) {
var p = JSON.parse(body)

  if (!error && response.statusCode == 200) {
    var save_book = new book({
      user_id:req.session.user.user_id,
      book_id:random,
      book_name:title1,
      book_cover:'/img/book-placeholder.png',
      trade_status:'1',
      time:timestamp
    });

    if(p.totalItems == 0 || p.items[0].volumeInfo.imageLinks == undefined)
    {

      save_book.save(function(err,data){
        if(err) throw err;
        book.find({user_id:req.session.user.user_id},{'time':0},function(err,userBooks){
              res.send(userBooks);
            }).sort({'time':-1});
      });
    }
    else {
      save_book.book_name=p.items[0].volumeInfo.title;
    save_book.book_cover=p.items[0].volumeInfo.imageLinks.smallThumbnail;
    save_book.save(function(err,data){
      if(err) throw err;
        book.find({user_id:req.session.user.user_id},{'time':0},function(err,userBooks){
            res.send(userBooks);
          }).sort({'time':-1});
        });


    }

  }
})


});

app.post('/trade',function(req,res){
var timestamp = Math.floor(Date.now() /1000);
var bookid=req.body.bookid;

console.log("The book id is"+bookid);
  if(!bookid == 0)
  {
      trade.count({book_id:bookid},function(err,count){
        if(err) throw err;
        if(count == 1)
        {
            trade.update({book_id:bookid},{$set:{req_status:'NA',req_userId:req.session.user.user_id,req_userName:req.session.user.u_name,req_userEmail:req.session.user.u_email,req_userAddress:req.session.user.u_add}},function(data){
              trade.count({req_userId:req.session.user.user_id,req_status:'NA'},function(err,Ocount){
                if(err)throw err;
                res.send({status:bookid,count:Ocount});
              });
            })
        }
        else {

          book.update({book_id:bookid},{ $set: {trade_status:'0'}}, function(data){
            book.find({book_id:bookid},function(err,bookData){
              var bookfrom=bookData[0].user_id;
              var bookname=bookData[0].book_name;

                  user.find({uid:bookfrom},function(err,Userinfo){
                    var email=Userinfo[0].email;
                    var book_userName=Userinfo[0].name;
                    var book_trade = new trade({

                      book_userId:bookfrom,
                      book_userName:book_userName,
                      book_userEmail:email,
                      req_userId:req.session.user.user_id,
                      req_userName:req.session.user.u_name,
                      req_userEmail:req.session.user.u_email,
                      req_userAddress:req.session.user.u_add,
                      req_status:'NA',
                      book_id:bookid,
                      book_name:bookname,
                      timestamp:timestamp
                    });

                    book_trade.save(function(err,data){

                      trade.count({req_userId:req.session.user.user_id,req_status:'NA'},function(err,Ocount){
                        if(err)throw err;
                        res.send({status:bookid,count:Ocount});
                      });

                    });

                  });


              });
            });

        }
      });


  }

});







app.post('/userAuthentication',function(req,respond){

var email=  req.body.email;
var pass = req.body.password;

user.find({email:email},function(err,data){
  if(data  == "")
  {
    console.log("TRUE");
    respond.render('login',{failure:1,status:0});
  }
  else {
    bcrypt.compare(pass, data[0].password, function(err, res) {
      if(res== true)
      {
        var session_usr= {
        user_id:data[0].uid,
        u_name:data[0].name,
             u_email:data[0].email,
        u_add:data[0].address
      }
    req.session.user=session_usr;
       respond.redirect('/');

      }
      else {
        respond.render('login',{failure:1,status:0});
      }
    });
  }

});



});

app.get('/logout',function(req,res){

  req.session.destroy();
  res.redirect('/');

});

  app.post('/signup',function(req,res){


  var name =  req.body.name;
  var email =  req.body.email;
  var address =  req.body.address;
  var pass =  req.body.pass;
  var uid = uuid.v4();

  if(pass.length < 5)
  {
    res.send("password");
  }
  else {
    user.count({email:email},function(err,count){
        if(!count == 0)
        {
          res.send("email");
        }
        else {
          //save the data
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
                // Store hash in your password DB.
                var new_usr = new user({
                  uid:uid,
                  name:name,
                  email:email,
                  address:address,
                  password:hash
                });

                new_usr.save(function(err,data){
                  if(err) throw err;

                  res.send("success");


                })

            });
        });


        }
    })
    console.log("Recieved data name:"+name+"email:"+email+"Address:"+address+"Pass:"+pass);
  }





  });

app.post('/notification',function(req,res){

  trade.count({req_userId:req.session.user.user_id,req_status:'NA'},function(err,Ocount){
    if(err)throw err;

    trade.count({book_userId:req.session.user.user_id,req_status:'NA'},function(err,Ucount){
      if(err)throw err;
      res.send({notify:{outstanding:Ocount,unapproved:Ucount}});

    });

  });

});

app.post('/acceptreq',function(req,res){
      console.log("come to accept");
      trade.update({book_id:req.body.book_id,book_userId:req.session.user.user_id},{ $set: {req_status:'A'}}, function(data){
        book.update({book_id:req.body.book_id,user_id:req.session.user.user_id},{ $set: {trade_status:'0'}},function(acceted){
          trade.find({book_userId:req.session.user.user_id,req_status:'NA'},{'timestamp':0},function(err,bookreq){
                res.send(bookreq);
              }).sort({'timestamp':-1});

        })

      });

});


app.post('/rejectreq',function(req,res){

  trade.update({book_id:req.body.book_id,book_userId:req.session.user.user_id},{ $set: {req_status:'R'}}, function(data){
    trade.find({book_userId:req.session.user.user_id,req_status:'NA'},{'timestamp':0},function(err,bookreq){
          book.update({book_id:req.body.book_id},{ $set: {trade_status:'1'}},function(success){
              res.send(bookreq);
          })

        }).sort({'timestamp':-1});
  });

});

app.post('/cancelreq',function(req,res){

  trade.findOneAndRemove({req_userId:req.session.user.user_id,book_id:req.body.bookid},function(err,docs){
      if(err) throw err;
      book.update({book_id:req.body.bookid},{ $set: {trade_status:'1'}}, function(data){
        trade.find({req_userId:req.session.user.user_id},{'timestamp':0},function(err,bookreq){
            res.send(bookreq);
          }).sort({'timestamp':-1});
      });

    });

});


}
