Modernizr.load({
  test: Modernizr.flexbox,
  nope : 'http://cdn.ink.sapo.pt/3.1.10/css/ink-legacy.min.css',
});
Ink.requireModules([
    'Ink.UI.Modal_1',
    'Ink.UI.FormValidator_2',
    'Ink.UI.Sticky_1',
    'Ink.Util.Validator_1'
  ], function( Modal, FormValidator, Sticky, InkValidator){
    //Highlight active nav
    addActiveNav()

    //Set up modals
    var loginModal = new Modal('#loginModal', {closeOnClick: true});
    var signupModal = new Modal('#signupModal', {closeOnClick: true});

    //Set up forms
    var loginForm = new FormValidator('#loginForm');
    var signupForm = new FormValidator('#signupForm');

    //Change message for requried fields to sound more natural
    FormValidator.setRule('required', 'You forgot to fill out this field!', function( value ){
      return ( (typeof value !== 'undefined') && ( !(/^\s*$/).test(value) ) );
    });

    //Change message for email fields to sound more natural
    FormValidator.setRule('email', 'Email address is invalid', function( value ){
      return ( ( typeof value === 'string' ) && InkValidator.mail( value ) );
    });

    //Change message from password confirmation field when passwords do not match
    FormValidator.setRule('matches', 'Passwords do not match', function( value, fieldToCompare ){
      // Find the other field in the FormValidator.
      var otherField = this.getFormElements()[fieldToCompare];

      if (!otherField) {
          // It's in the actual <form>, not in the FormValidator's fields
          var possibleFields = Ink.ss('input, select, textarea, .control-group', this._options.form._element);
          for (var i = 0; i < possibleFields.length; i++) {
              if ((possibleFields[i].name || possibleFields[i].id) === fieldToCompare) {
                  return getValue(possibleFields[i]) === value;
              }
          }
          return false;
      } else {
          otherField = otherField[0];
      }

      var otherFieldValue = otherField.getValue();
      if (otherField._rules.required) {
          if (otherFieldValue === '') {
              return false;
          }
      }
      return value === otherFieldValue;
    });

    //Set navbar to stick
    new Sticky('.ink-sticky');

    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('nav').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {

        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, change top value.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight /*&& $('.navbar-toggle').attr('aria-expanded') === "false"*/){
            // Scroll Down
            $('nav').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('nav').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }
    function addActiveNav(){
      //add the active class to the current navbar item
      var href = window.location.href;
      var curLocation = href.substr(href.lastIndexOf('/'));
      $('ul.menu * li').each(function(){
        if (curLocation === $(this).children('a').attr('href')){
          $(this).addClass('active');
          if($(this).parent().has('ul.dropdown-menu')){
            $(this).parents('li.dropdown').addClass('active');
          }
        }
      });
    }
});
