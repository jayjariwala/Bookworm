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



}
