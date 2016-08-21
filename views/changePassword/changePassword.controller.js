$(function () {

  var passwordMatching = function () {
    var newPassword1 = $('#newPassword1').val();
    var newPassword2 = $('#newPassword2').val();

    if (newPassword1 !== newPassword2)
    {
      $('#NP1Label').attr('data-error', 'Passwords do not match');
      $('#NP2Label').attr('data-error', 'Passwords do not match');

      $('#newPassword1').removeClass('valid').addClass('invalid');
      $('#newPassword2').removeClass('valid').addClass('invalid');
      return false;
    }

    if (newPassword1 === newPassword2)
    {
      $('#newPassword1').removeClass('invalid').addClass('valid');
      $('#newPassword2').removeClass('invalid').addClass('valid');
      return true;
    }
  };

  //begin password validation
  $('#newPassword2').blur(function () {
    passwordMatching();
  });

  //begin password validation if password 2 is already filled
  $('#newPassword1').blur(function () {
    if (!$('#newPassword2').val())
    {
      return;
    }

    passwordMatching();
  });

  //if they go to change the password, remove validation level stuff
  $('#newPassword2').keypress(function () {
    $('#newPassword1').removeClass('valid').removeClass('invalid');
    $('#newPassword2').removeClass('valid').removeClass('invalid');
  });

  $('#oldPassword').keypress(function () {
    $('#oldPassword').removeClass('valid').removeClass('invalid');
  });

  //if they go to change the password, remove validation level stuff
  $('#newPassword1').keypress(function () {
    $('#newPassword1').removeClass('valid').removeClass('invalid');
    $('#newPassword2').removeClass('valid').removeClass('invalid');
  });

  //go ahead and submit for the change. Await response.
  $('#submitButton').click(function () {

    var oldPassword = $('#oldPassword').val();

    var newPassword1 = $('#newPassword1').val();
    var newPassword2 = $('#newPassword2').val();

    //used for error checking
    var hasError = false;

    //do not do anything because the other functions should already handle this
    if (!passwordMatching()) {
      return;
    }

    if (oldPassword === '')
    {
      hasError = true;
      $('#OPLabel').attr('data-error', 'Please fill out this field');
      $('#oldPassword').removeClass('valid').addClass('invalid');
    }

    if (newPassword1 === '') {
      hasError = true;
      $('#NP1Label').attr('data-error', 'Please fill out this field');
      $('#newPassword1').removeClass('valid').addClass('invalid');
    }

    if (newPassword2 === '') {
      hasError = true;
      $('#NP2Label').attr('data-error', 'Please fill out this field');
      $('#newPassword2').removeClass('valid').addClass('invalid');
    }

    if (!hasError)
    {
      var request = $.ajax(
        {
          url: '/changePassword',
          type: 'post',
          data: {
                  oldPassword: oldPassword,
                  newPassword1: newPassword1,
                  newPassword2: newPassword2
                },
        });

      request.done(function (res, status, obj)
      {

        if (res.credError == true)
        {
          Materialize.toast('Old password is incorrect!', 4000);
        } else
        {
          window.location.href = location.origin + '/profile';
        }

      });

      request.fail(function (res, status, obj)
      {
        if (status == 500 || status == 400)
        {
          console.log('Server 500, contact ACM officer/webmaster');
          window.location.href = location.origin + '/';
        }
      });
    }

  });

});
