async function getStories() {
  var stories = await $.getJSON(
    'https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10'
  );
  $('#new').addClass('active');
  stories.data.forEach(function(obj, i) {
    var $i = $('<i>').addClass('far fa-bookmark');
    var $title = $('<span>')
      .text(obj.title)
      .addClass('title-span');
    var $author = $('<span>')
      .text('authored by ' + obj.author)
      .addClass('author-span');
    var $url = obj.url;
    $url =
      $url[0] === 'h' && ($url[9] === '.' || $url[10] === '.')
        ? $url.split('/')[2].slice(4)
        : $url.split('/')[2];
    var $urlSpan = $('<span>')
      .append($url)
      .addClass('url-span');

    $('#list ol').append(
      $('<li>', { id: obj.storyId }).append(
        $i,
        $title,
        ' (',
        $urlSpan,
        ') |',
        $author
      )
    );
  });

  if (localStorage.getItem('token') !== null) {
    getUser().then(function(data) {
      var $storyLisunr = Array.from($('#list ol').children());
      var $favoritesArr = data.data.favorites.reduce(function(acc, obj) {
        acc.push(obj.storyId);
        return acc;
      }, []);

      $storyLisunr.forEach(function(li, i) {
        var liId = li.getAttribute('id');
        if ($favoritesArr.includes(liId)) {
          var liIcon = document.querySelectorAll('#list i')[i];
          liIcon.classList.remove('far');
          liIcon.classList.add('fas');
        }
      });
    });
  }
}

function createUser(name, username, password) {
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/users',
    data: {
      data: {
        name,
        username,
        password
      }
    }
  });
}

function getUser() {
  var $localToken = localStorage.getItem('token');
  var $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
  return $.ajax({
    url: `https://hack-or-snooze.herokuapp.com/users/${$localUsername}`,
    headers: {
      Authorization: `Bearer ${$localToken}`
    }
  });
}

function storeToken(username, password) {
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/auth',
    data: {
      data: {
        username,
        password
      }
    }
  })
    .then(function(val) {
      localStorage.setItem('token', val.data.token);
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

function createStory(title, author, url) {
  var $localToken = localStorage.getItem('token');
  var $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    headers: {
      Authorization: `Bearer ${$localToken}`
    },
    data: {
      data: {
        username: $localUsername,
        title,
        author,
        url
      }
    }
  })
    .then(function() {
      $('#list ol')
        .children()
        .remove();
      $('#story-form')
        .trigger('reset')
        .slideUp();
      getStories().then(function() {
        $('#posts').removeClass('active');
        $('#profile').removeClass('active');
        $('#favorites').removeClass('active');
        $('#new').addClass('active');
        $('#list').show();
        $('#posts-page').hide();
        $('#favorites-page').hide();
        $('#profile-page').hide();
        $('#favorites').show();
      });
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function deletePost(storyId) {
  var $localToken = localStorage.getItem('token');
  var $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
  return $.ajax({
    method: 'DELETE',
    url: `https://hack-or-snooze.herokuapp.com/stories/${storyId}`,
    headers: {
      Authorization: `Bearer ${$localToken}`
    }
  });
}

function addFavorite(storyId) {
  var $localToken = localStorage.getItem('token');
  var $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
  return $.ajax({
    method: 'POST',
    url: `https://hack-or-snooze.herokuapp.com/users/${$localUsername}/favorites/${storyId}`,
    headers: {
      Authorization: `Bearer ${$localToken}`
    }
  })
    .then(function() {})
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function deleteFavorite(storyId) {
  var $localToken = localStorage.getItem('token');
  var $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
  return $.ajax({
    method: 'DELETE',
    url: `https://hack-or-snooze.herokuapp.com/users/${$localUsername}/favorites/${storyId}`,
    headers: {
      Authorization: `Bearer ${$localToken}`
    }
  })
    .then(function() {})
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function renderPosts() {
  $('#list').hide();
  $('#posts-page').show();
  $('#favorites-page').hide();
  $('#profile-page').hide();
  $('#new').removeClass('active');
  $('#favorites').removeClass('active');
  $('#profile').removeClass('active');
  $('#posts').addClass('active');
  $('#posts-page ol')
    .children()
    .remove();
  getUser()
    .then(function(data) {
      data.data.stories.forEach(function(obj, i) {
        var $i = $('<i>').addClass('far fa-bookmark');
        var $delete = $('<i>').addClass('fas fa-trash-alt');
        var $title = $('<span>')
          .text(obj.title)
          .addClass('title-span');
        var $author = $('<span>')
          .text('authored by ' + obj.author)
          .addClass('author-span');
        var $url = obj.url;
        $url =
          $url[0] === 'h' && ($url[9] === '.' || $url[10] === '.')
            ? $url.split('/')[2].slice(4)
            : $url.split('/')[2];
        var $urlSpan = $('<span>')
          .append($url)
          .addClass('url-span');
        $('#posts-page ol').append(
          $('<li>', {
            id: obj.storyId
          }).append($i, $title, ' (', $urlSpan, ') |', $author, $delete)
        );
      });

      if (localStorage.getItem('token') !== null) {
        getUser().then(function(data) {
          var $postsLisunr = Array.from($('#posts-page ol').children());
          var $favoritesArr = data.data.favorites.reduce(function(acc, obj) {
            acc.push(obj.storyId);
            return acc;
          }, []);

          $postsLisunr.forEach(function(li, i) {
            var liId = li.getAttribute('id');
            if ($favoritesArr.includes(liId)) {
              var liIcon = document.querySelectorAll('#posts-page i')[i];
              liIcon.classList.remove('far');
              liIcon.classList.add('fas');
            }
          });
        });
      }
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function renderFavorites() {
  $('#list').hide();
  $('#posts-page').hide();
  $('#favorites-page').show();
  $('#profile-page').hide();
  $('#new').removeClass('active');
  $('#posts').removeClass('active');
  $('#profile').removeClass('active');
  $('#favorites').addClass('active');
  $('#favorites-page ol')
    .children()
    .remove();
  getUser()
    .then(function(data) {
      data.data.favorites.forEach(function(obj, i) {
        var $i = $('<i>').addClass('fas fa-bookmark');
        var $title = $('<span>')
          .text(obj.title)
          .addClass('title-span');
        var $author = $('<span>')
          .text('authored by ' + obj.author)
          .addClass('author-span');
        var $url = obj.url;
        $url =
          $url[0] === 'h' && ($url[9] === '.' || $url[10] === '.')
            ? $url.split('/')[2].slice(4)
            : $url.split('/')[2];
        var $urlSpan = $('<span>')
          .append($url)
          .addClass('url-span');
        $('#favorites-page ol').append(
          $('<li>', {
            id: obj.storyId
          }).append($i, $title, ' (', $urlSpan, ') |', $author)
        );
      });
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}
