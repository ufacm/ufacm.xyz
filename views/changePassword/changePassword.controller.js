$(function(){

  var passwordMatching = function(){
    var newPassword1 = $("#newPassword1").val();
    var newPassword2 = $("#newPassword2").val();

    if(newPassword1 !== newPassword2)
    {
      $("#NP1Label").attr("data-error", "Passwords do not match");
      $("#NP2Label").attr("data-error", "Passwords do not match");

      $("#newPassword1").removeClass("valid").addClass("invalid");
      $("#newPassword2").removeClass("valid").addClass("invalid");
      return false;
    }

    if(newPassword1 === newPassword2)
    {
      $("#newPassword1").removeClass("invalid").addClass("valid");
      $("#newPassword2").removeClass("invalid").addClass("valid");
      return true;
    }
  };

  //begin password validation
  $("#newPassword2").blur(function(){
    passwordMatching();
  });

  //begin password validation if password 2 is already filled
  $("#newPassword1").blur(function(){
    if(!$("#newPassword2").val())
    {
      return;
    }

    passwordMatching();
  });

  //if they go to change the password, remove validation level stuff
  $("#newPassword2").keypress(function(){
    $("#newPassword1").removeClass("valid").removeClass("invalid");
    $("#newPassword2").removeClass("valid").removeClass("invalid");
  });

  //if they go to change the password, remove validation level stuff
  $("#newPassword1").keypress(function(){
    $("#newPassword1").removeClass("valid").removeClass("invalid");
    $("#newPassword2").removeClass("valid").removeClass("invalid");
  });

  //go ahead and submit for the change. Await response.
  $("#submitButton").click(function(){

    var oldPassword = $("#oldPassword").val();

    var newPassword1 = $("#newPassword1").val();
    var newPassword2 = $("#newPassword2").val();

    //do not do anything because the other functions should already handle this
    if(!passwordMatching()){
      return;
    }

    if(newPassword1 === ""){
      $("#NP1Label").attr("data-error", "Please fill out this field");
      $("#newPassword1").removeClass("valid").addClass("invalid");
    }

    if(newPassword2 === ""){
      $("#NP2Label").attr("data-error", "Please fill out this field");
      $("#newPassword2").removeClass("valid").addClass("invalid");
    }

    console.log("passwords matched");
  });

  //need to implement ajax call

});
