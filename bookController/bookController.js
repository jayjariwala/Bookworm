var model=require('../model/bookmodel');
var connection=model.getConnection();
var user = model.createSchema(connection);
var uuid=require('node-uuid');
var bcrypt = require('bcrypt');
const saltRounds = 10;




module.exports = function(app)
{

  app.get('/',function(req,res){
    res.render('index');
  })

  app.get('/signup',function(req,res){
    res.render('signup');
  })

  app.get('/login',function(req,res){
    res.render('login');
  })

  app.get('/mybooks',function(req,res){

    console.log("The User Name is: >> "+req.session.user.u_name);
  })

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
                  user_id:uid,
                  name:name,
                  email:email,
                  Address:address,
                  Pass:hash
                });

                new_usr.save(function(err,data){
                  if(err) throw err;

                  var session_usr= {
                    user_id:uid,
                    u_name:name,
                    u_email:email,
                    u_add:address
                  }
                  req.session.user=session_usr;
                  res.redirect('/mybooks');


                })

            });
        }); 



        }
    })
    console.log("Recieved data name:"+name+"email:"+email+"Address:"+address+"Pass:"+pass);

/*
  */


  }





  });



}
