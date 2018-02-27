$(function() {
  getStories();

  $('#form').on('submit', function(event) {
    event.preventDefault();

    var $i = $('<i>').addClass('far fa-bookmark');
    var $title = $('<span>')
      .text($('#title').val())
      .addClass('title-span')
      .css('padding-left', '4px');
    var $url = $('#url').val();
    $url =
      $url[0] === 'h' && ($url[9] === '.' || $url[10] === '.')
        ? $url.split('/')[2].slice(4)
        : $url.split('/')[2];
    var $urlSpan = $('<span>')
      .append($url)
      .addClass('url-span');

    $('ol').append($('<li>').append($i, $title, ' (', $urlSpan, ')'));
    $('#form')
      .trigger('reset')
      .slideUp();
    $('li').show();
    $('#favorites').removeClass('hidden');
    $('#show-all').addClass('hidden');
  });

  $('ol').on('click', 'i', function(event) {
    $(event.target).toggleClass('far fas');
  });

  $('#favorites').on('click', function() {
    $('.far')
      .parent()
      .hide();
    $('#favorites').addClass('hidden');
    $('#show-all').removeClass('hidden');
  });

  $('ol').on('click', '.url-span', function(event) {
    $('li:not(:contains("' + $(event.target).text() + '"))').hide();
    $('#favorites').addClass('hidden');
    $('#show-all').removeClass('hidden');
  });

  $('#show-all').on('click', function() {
    $('li').show();
    $('#favorites').removeClass('hidden');
    $('#show-all').addClass('hidden');
  });

  $('#new').on('click', function() {
    $('li').show();
    $('#favorites').removeClass('hidden');
    $('#show-all').addClass('hidden');
  });

  $('.show-form').on('click', function() {
    $('#form').slideToggle();
  });

  $('#login').on('click', function() {
    $('#login-form').show();
    $('#signup-form').addClass('hidden');
  });

  $('#create-acct').on('click', function() {
    $('#login-form').hide();
    $('#signup-form').removeClass('hidden');
  });

  $('#login-form').on('submit', function() {
    // loginUser()
    // getToken($('#create-name').val(), $('#create-user').val());
  });

  $('#signup-form').on('submit', function() {
    createUser(
      $('#create-name').val(),
      $('#create-user').val(),
      $('#create-pwd').val()
    );
    getToken($('#create-user').val(), $('#create-pwd').val());
  });
});

async function getStories() {
  var stories = await $.getJSON(
    'https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10'
  );
  stories.data.forEach(function(obj) {
    var $i = $('<i>').addClass('far fa-bookmark');
    var $title = $('<span>')
      .text(obj.title)
      .addClass('title-span')
      .css('padding-left', '4px');
    var $url = obj.url;
    $url =
      $url[0] === 'h' && ($url[9] === '.' || $url[10] === '.')
        ? $url.split('/')[2].slice(4)
        : $url.split('/')[2];
    var $urlSpan = $('<span>')
      .append($url)
      .addClass('url-span');

    $('ol').append($('<li>').append($i, $title, ' (', $urlSpan, ')'));
  });
}

function createUser(name, username, password) {
  $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/users',
    data: {
      data: {
        name,
        username,
        password
      }
    }
  }).then(function(val) {
    console.log(val);
  });
}

function getToken(username, password) {
  $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/auth',
    data: {
      data: {
        username,
        password
      }
    }
  }).then(function(val) {
    localStorage.setItem(username, val.data.token);
  });
}
