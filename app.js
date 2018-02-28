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
    $('li').attr('id', obj.storyId);
  });
}

function createStory(title, author, url) {
  var localToken = localStorage.getItem('token');
  var localUsername = JSON.parse(atob(localToken.split('.')[1])).username;
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    headers: {
      Authorization: 'Bearer ' + localToken
    },
    data: {
      data: {
        username: localUsername,
        title,
        author,
        url
      }
    }
  })
    .then(function(val) {
      console.log(val);
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
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

// function getToken(username, password) {
//   return $.ajax({
//     method: "POST",
//     url: "https://hack-or-snooze.herokuapp.com/auth",
//     data: {
//       data: {
//         username,
//         password
//       }
//     }
//   }).then(function(val) {
//     console.log(val.data.token);
//   });
// }

function getUser(username) {
  var token = localStorage.getItem(username);
  return $.ajax({
    url: 'https://hack-or-snooze.herokuapp.com/users/' + username,
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(function(val) {
      console.log(val);
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

function addFavorite(storyId) {
  var localToken = localStorage.getItem('token');
  var localUsername = JSON.parse(atob(localToken.split('.')[1])).username;
  return $.ajax({
    method: 'POST',
    url: `https://hack-or-snooze.herokuapp.com/users/${localUsername}/favorites/${storyId}`,
    headers: {
      Authorization: 'Bearer ' + localToken
    }
  })
    .then(function(val) {
      console.log(val);
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}

function deleteFavorite(storyId) {
  var localToken = localStorage.getItem('token');
  var localUsername = JSON.parse(atob(localToken.split('.')[1])).username;
  return $.ajax({
    method: 'DELETE',
    url: `https://hack-or-snooze.herokuapp.com/users/${localUsername}/favorites/${storyId}`,
    headers: {
      Authorization: 'Bearer ' + localToken
    }
  })
    .then(function(val) {
      console.log(val);
    })
    .catch(function() {
      alert('hmmm something went wrong, please try again');
    });
}
