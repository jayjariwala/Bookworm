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
    var status=req.param('success');
    console.log("Status"+status);
    res.render('login',{status:status,failure:0});
  })

  app.get('/mybooks',function(req,res){

    res.render('mybooks',{user:req.session.user});
    console.log("The User Name is: >> "+req.session.user.u_name);
  })


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

      }
      else {
        respond.render('login',{failure:1,status:0});
      }
    });
  }

});



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

/*
  */


  }





  });



}
