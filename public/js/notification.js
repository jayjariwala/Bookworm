
$.ajax({
url : "/notification",
type: "POST",
success: function(data, textStatus, jqXHR)
{

  if(data.notify.unapproved > 0)
  {
    $('.unapproved').html(data.notify.unapproved);


  }
  $('.outstanding').html(data.notify.outstanding);

},
error: function (jqXHR, textStatus, errorThrown)
{

}
});
