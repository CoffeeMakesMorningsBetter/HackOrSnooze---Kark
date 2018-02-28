$(function() {
  getStories();
  if (isLoggedIn() === true) {
    $('#login').hide();
    $('#profile').show();
    $('#logout').show();
  }

  $('.front-page').on('click', function() {
    $('#list ol')
      .children()
      .remove();
    getStories().then(function() {
      $('#list').show();
      $('#posts-page').hide();
      $('#favorites-page').hide();
      $('#profile-page').hide();
      $('#favorites').show();
      $('#show-all').hide();
    });
  });

  $('ol').on('click', 'i', function(event) {
    if ($(event.target).hasClass('far')) {
      addFavorite(
        $(event.target)
          .parent()
          .attr('id')
      ).then(function() {
        $(event.target).removeClass('far');
        $(event.target).addClass('fas');
      });
    } else {
      deleteFavorite(
        $(event.target)
          .parent()
          .attr('id')
      ).then(function() {
        $(event.target).removeClass('fas');
        $(event.target).addClass('far');
      });
    }
  });

  $('ol').on('click', '.url-span', function(event) {
    $('li:not(:contains("' + $(event.target).text() + '"))').hide();
    $('#favorites').hide();
    $('#show-all').show();
  });

  $('#submit-form').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      $('#story-form').toggle();
    }
  });

  $('#story-form').on('submit', function(event) {
    event.preventDefault();
    createStory($('#title').val(), $('#author').val(), $('#url').val());
    $('#story-form')
      .trigger('reset')
      .slideUp();
  });

  $('#posts').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      $('#posts-page').toggle();
    }
  });

  $('#favorites').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      getUser()
        .then(function(data) {
          $('#list').hide();
          $('#posts-page').hide();
          $('#favorites-page').show();
          $('#profile-page').hide();
          $('#favorites').hide();
          $('#show-all').show();

          data.data.favorites.forEach(function(obj, i) {
            $('#favorites-page ol').append(
              $('<li>').text(`name: ${data.data.favorites[i].title}`)
            );
            // assign id to delete
          });
        })
        .catch(function() {
          alert('hmmm something went wrong, please try again');
        });

      // $('#favorites-page ol').on('click', 'li', function(event) {
      //   deleteFavorite($(event.target).attr('id')); // will not work until id is assigned
      // });
    }
  });

  $('#posts').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      getUser()
        .then(function(data) {
          $('#list').hide();
          $('#profile-page').hide();
          $('#favorites-page').hide();
          $('#favorites').hide();
          $('#posts-page').show();
          $('#show-all').show();

          data.data.favorites.forEach(function(obj, i) {
            console.log(i);

            $('#posts-page ol').append(
              $('<li>').text(`name: ${data.data.stories[i].title}`)
            );
          });
        })
        .catch(function() {
          alert('hmmm something went wrong, please try again');
        });
    }
  });

  $('#profile').on('click', function() {
    getUser()
      .then(function(data) {
        $('#list').hide();
        $('#favorites-page').hide();
        $('#profile-page').show();
        $('#profile-page').append(
          $('<h1>').text(`name: ${data.data.name}`),
          $('<h2>').text(`username: ${data.data.username}`)
        );
      })
      .catch(function() {
        alert('hmmm something went wrong, please try again');
      });
  });

  $('#login').on('click', function() {
    $('#login-form').show();
    $('#signup-form').hide();
  });

  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    storeToken($('#login-user').val(), $('#login-pwd').val()).then(function() {
      if (isLoggedIn() === true) {
        $('#login-modal').modal('hide');
        $('#login-form').trigger('reset');
        $('#login').hide();
        $('#profile').show();
        $('#logout').show();
      }
    });
  });

  $('#create-acct').on('click', function() {
    $('#login-form').hide();
    $('#signup-form').show();
  });

  $('#signup-form').on('submit', function(event) {
    event.preventDefault();
    createUser(
      $('#create-name').val(),
      $('#create-user').val(),
      $('#create-pwd').val()
    )
      .then(function() {
        storeToken($('#create-user').val(), $('#create-pwd').val());
        $('#login-modal').modal('hide');
        $('#signup-form').trigger('reset');
        $('#login').hide();
        $('#profile').show();
        $('#logout').show();
      })
      .catch(function() {
        alert('hmmm something went wrong, please try again');
      });
  });

  $('#logout').on('click', function() {
    localStorage.clear();
    $('#login').show();
    $('#profile').hide();
    $('#logout').hide();
  });
});
