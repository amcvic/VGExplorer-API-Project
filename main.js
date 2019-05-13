//TODO: 
//  1. turn links on divs into buttons
//  2. nav, including back button
//  3. pagination (&limit=X&offset=X*Y) where x is the results
//    per page and y is the page you are on (maybe like 40/50 per page?)
//  4. center elements in div vertically maybe (compensate for when no blurb)
//  5. only display elements upon images loaded

//  6. animations are broken on full screen sometimes (???)

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
const gamesUrlBase = 'https://www.giantbomb.com/api/games/?api_key=';
const format = "&format=json";
const sort = "&sort=name:asc";

const ytKey = '&key=AIzaSyBPvXYIJfMbtdksOJMz-pb3uKe__J9XZ_I';
const ytBase = 'https://www.googleapis.com/youtube/v3/search';
const ytWatch = "https://www.youtube.com/watch?v=";

let url = proxy + base + key + format + sort;

const platformArea = document.querySelector('.platformContainer');
const gameArea = document.querySelector('.gameContainer');
let currentPlatform = '';
let gamesFetchArray = [];
let isPlatform;

document.getElementById('begin').addEventListener('click', function() {
  clearFront();
  fetchPlatforms();
});

function fetchPlatforms() {
  isPlatform = true;
  fetch(url, {headers: headers})
  .then(function(result) {
    return result.json();
  }).then(function(json) {
    showResults(json);
  }).catch(error => console.error(error));
}

function fetchGames(index) {
  isPlatform = false;
  fetch(gamesFetchArray[index], {headers: headers})
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
  
  let i = 0;
  while (i < data.results.length) {

    let box = document.createElement('div');
    box.setAttribute('data-aos', 'fade-up');
    let heading = document.createElement('h2');
    let img = document.createElement('img');
    let blurb = document.createElement('p');
    let link = document.createElement('a');
    let ytLink = document.createElement('a');

    if (isPlatform) {
      gamesFetchArray.push(proxy + gamesUrlBase + key + '&platforms=' + data.results[i].id + format + sort);
      link.href = 'javascript:clearPage();fetchGames(' + i + ');setPlatform(\"' + data.results[i].name + '\");';
      link.textContent = "List of games";
    } else {
      gamesFetchArray = [];
      link.target = '_blank';
      link.href = data.results[i].site_detail_url;
      link.textContent = "More info";
      ytLink.href = 'javascript:fetchYtVid(\"' + data.results[i].name + " " + currentPlatform + '\");';
      ytLink.textContent = "Gameplay";
    }

    heading.innerHTML = data.results[i].name;
    blurb.innerHTML = data.results[i].deck;
    img.src = data.results[i].image.original_url;

    box.appendChild(heading);
    box.appendChild(img);
    box.appendChild(blurb);
    box.appendChild(link);
    box.appendChild(document.createElement('br'));
    box.appendChild(ytLink);
    isPlatform ? platformArea.appendChild(box) : gameArea.appendChild(box);
    i++;
  }
}

function clearFront() {
  document.querySelector('.front').style.display = 'none';
}

function clearPage() {
  document.querySelector('.platformContainer').innerHTML = '';
  document.querySelector('.gameContainer').innerHTML = '';
}

function setPlatform(platform) {
  currentPlatform = platform;
}