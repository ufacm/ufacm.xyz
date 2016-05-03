$(function() {


  //savechanges button
  $("#submitButton").click(function()
  {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var phoneNumber = $("#phoneNumber").val();
    var listServe = $("#listServe").is(':checked')


    var request = $.ajax(
      {
        url: "/settings",
        type: "post",
        data: {"firstName" : firstName,
                "lastName" : lastName,
                "email" : email,
                "phoneNumber" : phoneNumber,
                "listServe" : listServe}
      });

      request.done(function()
      {
        window.location.href = location.origin + "/profile";
      });

<<<<<<< HEAD
      request.fail(function()
      {
        console.log("Server 500, contact ACM officer/webmaster");
        window.location.href = location.origin + "/";
      });
=======
      request.fail(function())
      {
        console.log("Server 500, contact ACM officer/webmaster");
        window.location.href = location.origin + "/";
      }
>>>>>>> b0cf80efb79faa38b8e85f85fced9be970a6b441

  });




})
