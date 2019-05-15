//TODO: 

//  1. turn links on divs into buttons
//  2. more info link on platforms divs

//  4. center elements in div vertically maybe (compensate for when no blurb)
//  5. only display elements upon images loaded

//  7. ( STRETCH GOAL ) add drop down for list of genres per console
//  and allow to filter by genre! (would be nice)

// imagesLoaded('.platformContainer', function() {
  //originally set all divs containing games/platforms = display none
//  document.querySelectorAll('div'); upon images load, loop thru and set them visible
// });

let headers = new Headers({
  "Accept"       : "application/json",
  "Content-Type" : "application/json",
  "User-Agent"   : "VGExplorer"
});

const proxy = 'https://cors-anywhere.herokuapp.com/'
const base = 'https://www.giantbomb.com/api/platforms/?api_key=';
const key = '527b81b9df55a365763c0726e45b306ce5aa5631';
const gamesBase = 'https://www.giantbomb.com/api/games/?api_key=';
const format = "&format=json";
const sort = "&sort=name:asc";
const limit = "&limit=40";
const offset = "&offset=";
const platforms = "&platforms=";

const ytKey = '&key=AIzaSyBPvXYIJfMbtdksOJMz-pb3uKe__J9XZ_I';
const ytBase = 'https://www.googleapis.com/youtube/v3/search';
const ytWatch = "https://www.youtube.com/watch?v=";

let currentPlatformIndex = 0;
let currentPlatform = '';
let isPlatform;
let currentPage = 0;
let currentMaxPage = 99999;

const platformUrl = proxy + base + key + format + sort + limit;
const gameUrl = proxy + gamesBase + key + format + sort + limit;

const platformArea = document.querySelector('.platformContainer');
const gameArea = document.querySelector('.gameContainer');
const pageNode = document.getElementById('pageDropdown');

function dropFunc() {
  document.getElementById("pageDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropButton')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById('begin').addEventListener('click', function() {
  clearFront();
  document.querySelector('.staticHeader').style.display = 'visible';
  fetchPlatforms();
});

document.getElementById('prevPage').addEventListener('click', function() {
  if (currentPage > 0) {
    currentPage -= 1;
    changePage(currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', function() {
  if (currentPage < currentMaxPage) {
    currentPage += 1;
    changePage(currentPage);
  }
});

document.getElementById('back').addEventListener('click', function() {
  resetPageNum();
  clearPage();
  document.querySelector('.staticHeader').querySelector('h2').innerText = "VGExplorer";
  fetchPlatforms();
  // document.getElementById('back').style.display = 'none';
});

function fetchPlatforms() {
  let currentUrl = platformUrl + offset + (40*currentPage);
  isPlatform = true;
  fetch(currentUrl, {headers: headers})
  .then(function(result) {
    return result.json();
  }).then(function(json) {
    showResults(json);
  }).catch(error => console.error(error));
}

function fetchGames(index) {
  let currentUrl = gameUrl + offset + (40*currentPage) + platforms + currentPlatformIndex;
  isPlatform = false;
  document.querySelector('.staticHeader').querySelector('h2').innerText = "Games for " + currentPlatform;
  fetch(currentUrl, {headers: headers})
    .then(function(result) {
      return result.json();
    }).then(function(json) {
      showResults(json);
    }).catch(error => console.error(error));
}

function fetchYtVid(query) {
  var fullQuery = "&q=" + query;
  var ytUrl = ytBase + "?part=snippet&type=video" + ytKey + fullQuery;
  fetch(ytUrl)
    .then(function(result) {
      return result.json();
    }).then(function(json) {
      var win = window.open(ytWatch + json.items[0].id.videoId, '_blank');
      win.focus();
    }).catch(error => {console.error(error); console.log('No youtube videos found :-(');});
}

function showResults(data) {
  
  if (!isPlatform) {
    document.getElementById('back').style.display = 'inline';
  }
  let i = 0;
  while (i < data.results.length) {

    let box = document.createElement('div');
    box.setAttribute('data-aos', 'fade-up');
    let heading = document.createElement('h2');
    let img = document.createElement('img');
    let blurb = document.createElement('p');
    let link = document.createElement('button');
    let ytLink = document.createElement('button');

    if (isPlatform) {
      link.setAttribute('onclick','resetPageNum();clearPage();setPlatform(\"' + data.results[i].name + '\", ' + data.results[i].id + ');fetchGames(' + i + ');');
      link.textContent = "List of games";
    } else {
      link.setAttribute('onclick', 'window.open(\"' + data.results[i].site_detail_url + '\", \"_blank\");');
      link.textContent = "More info";
      ytLink.setAttribute('onclick','fetchYtVid(\"' + data.results[i].name + " " + currentPlatform + '\");');
      ytLink.textContent = "Gameplay Vid";
    }

    heading.innerHTML = data.results[i].name;
    blurb.innerHTML = data.results[i].deck;
    img.src = data.results[i].image.original_url;

    box.appendChild(heading);
    box.appendChild(img);
    box.appendChild(blurb);
    box.appendChild(link);
    box.appendChild(document.createElement('br'));
    
    if (isPlatform) {
      platformArea.appendChild(box);
    } else {
      box.appendChild(ytLink);
      gameArea.appendChild(box);
    }
    i++;
  }
  let j = 1;
  for (let i = 0; i < data.number_of_total_results; i+=40) {
    let pageLink = document.createElement('a');
    pageLink.href = 'javascript:changePage(' + (j-1) + ');';
    pageLink.innerHTML = j;
    pageNode.appendChild(pageLink);
    j++; 
  }
  currentMaxPage = j - 2;
}

function clearFront() {
  document.querySelector('.front').style.display = 'none';
}

function clearPage() {
  while (pageNode.firstChild) {
    pageNode.removeChild(pageNode.firstChild);
  }
  while (platformArea.firstChild) {
    platformArea.removeChild(platformArea.firstChild);
  }
  while (gameArea.firstChild) {
    gameArea.removeChild(gameArea.firstChild);
  }
}

function setPlatform(platform, index) {
  currentPlatform = platform;
  currentPlatformIndex = index;
}

function changePage(num) {
  currentPage = num;
  clearPage();
  (isPlatform) ? fetchPlatforms() : fetchGames(currentPlatformIndex);
}

function resetPageNum() {
  currentPage = 0;
}