async function getStories() {
  var stories = await $.getJSON(
    "https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10"
  );
  stories.data.forEach(function(obj) {
    var $i = $("<i>").addClass("far fa-bookmark");
    var $title = $("<span>")
      .text(obj.title)
      .addClass("title-span")
      .css("padding-left", "4px");
    var $url = obj.url;
    $url =
      $url[0] === "h" && ($url[9] === "." || $url[10] === ".")
        ? $url.split("/")[2].slice(4)
        : $url.split("/")[2];
    var $urlSpan = $("<span>")
      .append($url)
      .addClass("url-span");

    $("ol").append($("<li>").append($i, $title, " (", $urlSpan, ")"));
  });
}

function createUser(name, username, password) {
  $.ajax({
    method: "POST",
    url: "https://hack-or-snooze.herokuapp.com/users",
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

function storeToken(username, password) {
  return $.ajax({
    method: "POST",
    url: "https://hack-or-snooze.herokuapp.com/auth",
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

function getToken(username, password) {
  return $.ajax({
    method: "POST",
    url: "https://hack-or-snooze.herokuapp.com/auth",
    data: {
      data: {
        username,
        password
      }
    }
  }).then(function(val) {
    console.log(val.data.token);
  });
}

function getUser(username) {
  var token = localStorage.getItem(username);
  $.ajax({
    url: "https://hack-or-snooze.herokuapp.com/users/" + username,
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(function(val) {
    console.log(val);
  });
}
