$(function () {


  //savechanges button
  $('#submitButton').click(function ()
  {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var email = $('#email').val();
    var phoneNumber = $('#phoneNumber').val();

    var listServe = $('#listServe').is(':checked');

    var request = $.ajax(
      {
        url: '/settings',
        type: 'post',
        data: { firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                listServe: listServe },
      });

    request.done(function ()
    {
      window.location.href = location.origin + '/profile';
    });

    request.fail(function ()
    {
      console.log('Server 500, contact ACM officer/webmaster');
      window.location.href = location.origin + '/';
    });

  });

});
