  $(function() {
    var availableTags = [
        "UFPT",
        "SEC",
        "FTP"
    ];


    $( "#tags" ).autocomplete({
      source: availableTags,
      messages: {
        noResults: '',
        results: function() {}
      },

      select: function( event, ui ) {
          $("#chips").append(' <div class="chip">'+ui.item.value+'</div>');
        }
    });
  })