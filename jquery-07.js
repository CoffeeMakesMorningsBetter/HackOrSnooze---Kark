$(function() {
  getStories();
  if (isLoggedIn() === true) {
    $('#login').addClass('hidden');
    $('#profile').addClass('hidden');
    $('#logout').removeClass('hidden');
  }

  // run hasPermission > checks local storage for token
  // if token > persmision = true, login link > logout link
  // $('#login').removeClass('hidden');
  // $('#logout').addClass('hidden');
  // else > require login on favorites/post

  $('#story-form').on('submit', function(event) {
    event.preventDefault();
    createStory($('#title').val(), $('#author').val(), $('#url').val());
    $('#story-form')
      .trigger('reset')
      .slideUp();

    // append to front page
    // var $i = $("<i>").addClass("far fa-bookmark");
    // var $title = $("<span>")
    //   .text($("#title").val())
    //   .addClass("title-span")
    //   .css("padding-left", "4px");
    // var $url = $("#url").val();
    // $url =
    //   $url[0] === "h" && ($url[9] === "." || $url[10] === ".")
    //     ? $url.split("/")[2].slice(4)
    //     : $url.split("/")[2];
    // var $urlSpan = $("<span>")
    //   .append($url)
    //   .addClass("url-span");

    // $("ol").append($("<li>").append($i, $title, " (", $urlSpan, ")"));
    // $("#story-form")
    //   .trigger("reset")
    //   .slideUp();
    // $("li").show();
    // $("#favorites").removeClass("hidden");
    // $("#show-all").addClass("hidden");
  });

  $('ol').on('click', 'i', function(event) {
    $(event.target).toggleClass('far fas');
    addFavorite(
      $(event.target)
        .parent()
        .attr('id')
    );
  });

  $('#submit-form').on('click', function() {
    // if (permission === true) {
    $('#story-form').toggle();
    // } else {
    // trigger modal
    // }
  });

  $('#posts').on('click', function() {
    // if (permission === true) {
    // > display user posts
    // } else {
    // trigger modal
    // }
  });

  $('#favorites').on('click', function() {
    // if (permission === true) {
    $('.far')
      .parent()
      .hide();
    $('#favorites').addClass('hidden');
    $('#show-all').removeClass('hidden');
    // } else {
    // trigger modal
    // }
  });

  $('ol').on('click', '.url-span', function(event) {
    $('li:not(:contains("' + $(event.target).text() + '"))').hide();
    $('#favorites').addClass('hidden');
    $('#show-all').removeClass('hidden');
  });

  $('.front-page').on('click', function() {
    $('li').show();
    $('#favorites').removeClass('hidden');
    $('#show-all').addClass('hidden');
  });

  $('#login').on('click', function() {
    $('#login-form').show();
    $('#signup-form').addClass('hidden');
  });

  $('#create-acct').on('click', function() {
    $('#login-form').hide();
    $('#signup-form').removeClass('hidden');
  });

  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    storeToken($('#login-user').val(), $('#login-pwd').val());
    $('#login-modal').modal('hide');
    $('#login-form').trigger('reset');
    $('#login').addClass('hidden');
    $('#profile').addClass('hidden');
    $('#logout').removeClass('hidden');
  });

  $('#logout').on('click', function() {
    localStorage.clear();
    $('#login').removeClass('hidden');
    $('#profile').removeClass('hidden');
    $('#logout').addClass('hidden');
  });

  $('#signup-form').on('submit', function(event) {
    event.preventDefault();
    createUser(
      $('#create-name').val(),
      $('#create-user').val(),
      $('#create-pwd').val()
    ).then(function() {
      storeToken($('#create-user').val(), $('#create-pwd').val());
      $('#login-modal').modal('hide');
      $('#signup-form').trigger('reset');
      $('#login').addClass('hidden');
      $('#profile').addClass('hidden');
      $('#logout').removeClass('hidden');
    });
  });
});
