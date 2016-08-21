var html;
var js;
var css;
var try1;
var i = 0;

window.onload = function () {

    js = CodeMirror.fromTextArea(document.getElementById('jsyo'), {
        mode: 'javascript',
        theme: 'lesser-dark',
        gutters: ['CodeMirror-lint-markers'],
        lintWith: CodeMirror.javascriptValidator,
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,

      });

    html = CodeMirror.fromTextArea(document.getElementById('htmlyo'), {
        mode: 'text/html',
        theme: 'lesser-dark',
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
      });

    css = CodeMirror.fromTextArea(document.getElementById('cssyo'), {
        mode: 'text/css',
        theme: 'lesser-dark',
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
      });

    css.setSize('103%', '75vh');
    html.setSize('103%', '75vh');
    js.setSize('103%', '75vh');

    $('#css').click(function (e) {
      $(this).tab('show');
      css.refresh();
    });

    $('#js').click(function (e) {
      $(this).tab('show');
      js.refresh();
    });

    var iframe = document.getElementsByTagName('iframe')[0].contentWindow.document;
    var iframe_head = (iframe).getElementsByTagName('head')[0];
    var iframe_body = (iframe).getElementsByTagName('body')[0];

    //append style tag to hold custom styles
    iframe_style = (iframe_head).appendChild((iframe).createElement('style'));

    //append jQuery
    var jquery_script = (iframe).createElement('script');
    jquery_script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';
    (iframe_head).appendChild(jquery_script);

    var iframe_script = (iframe_head).appendChild((iframe).createElement('script'));

    var	contents = $('iframe').contents(),
     body = contents.find('body'),
     styleTag = $('<style></style>').appendTo(contents.find('head'));

    body.html(html.getValue());
    styleTag.text(css.getValue());

    iframe_script.textContent = '//<![CDATA[' + '\n' + js.getValue() + '\n' + '//]]>';

    html.on('change', function (html, change) {
        body.html(html.getValue());

      });

    css.on('change', function (css, change) {
      styleTag.text(css.getValue());

    });

    /*-------------------------------*/

    js.on('change', function (js, change) {
        update(js.getValue());
        body.html(html.getValue());
      });

    function update(str) {
      iframe_head.removeChild(iframe_script);
      iframe_script = iframe_head.appendChild(iframe.createElement('script'));
      iframe_script.textContent = '//<![CDATA[' + '\n' + str + '\n' + '//]]>';
    }

  };

function lol() {
  i++;
  if (i == 1) {
    html.setValue('');
    html.clearHistory();
    css.setValue('');
    css.clearHistory();
    js.setValue('');
    js.clearHistory();
  }

  if (true) {
    $.get('/up', function (data) {
      $('.lesson').addClass('animated fadeOutLeft');
      $('.lesson').bind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', change(data));

    });

  }

}

function change(data) {
  //console.log(data);
  $('.lesson').removeClass('fadeOutLeft');
  //console.log(data[0]);
  $('.lesson').html(data);
  $('.lesson').addClass('fadeInRight');
}
