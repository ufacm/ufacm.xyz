$(function () {


  //savechanges button
  $('#submitButton').click(function ()
  {
    var fbTok = $('#facebookEventToken').val();

    var request = $.ajax(
      {
        url: '/pullEventsFromFb',
        type: 'post',
        data: {
          facebookToken: fbTok
        }
      });

    request.done(function ()
    {
      window.location.href = location.origin + '/profile';
    });

    request.fail(function ()
    {
      console.log('Bad FB token or server issue, contact ACM officer/webmaster');
      $('#serverMessege').text = 'Bad FB token or server issue, contact Nicolas Fry';
    });

  });

  $('#submitButtonForSEC').click(function ()
  {
    var fbTok = $('#facebookEventTokenforSEC').val();

    var request = $.ajax(
      {
        url: '/pullSECEventsFronFb',
        type: 'post',
        data: {
          facebookToken: fbTok
        }
      });

    request.done(function ()
    {
      window.location.href = location.origin + '/profile';
    });

    request.fail(function ()
    {
      console.log('Bad FB token or server issue, contact ACM officer/webmaster');
      $('#serverMessege').text = 'Bad FB token or server issue, contact Nicolas Fry';
    });

  });

});
