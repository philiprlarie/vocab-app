var urls = [
  'https://raw.githubusercontent.com/philiprlarie/reading/master/al-franken-giant-of-the-senate.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/algorithms-to-live-by.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/an-illustrated-book-of-bad-arguments.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/benjamin-franklin.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/cant-we-talk-about-something-more-pleasant.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/emotional-intelligence-2.0.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/how-to-win-friends-and-influence-people.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/island-of-knowledge.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/random-words.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/the-alchemist.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/the-gifts-of-imperfection.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/the-march.json',
  'https://raw.githubusercontent.com/philiprlarie/reading/master/the-stranger.json'
];
var words = [];
var weightedArr = [];
var showingFront = true;

function getWords(urls) {
  // urls for JSON
  var requestsCompleted = 0;
  urls.forEach(function(url) {
    $.getJSON(url, function(json) {
      requestsCompleted++;
      if (json.vocabulary) {
        words = words.concat(json.vocabulary);
      }
      if (requestsCompleted === urls.length) {
        generateWeightedArray();
        populateDOMWithWordFields(getNextWord());
      }
    });
  });

}

function getNextWord() {
  return sampleWordsWeighted();
}

function generateWeightedArray() {
  var rangeStart = 0;
  var rangeEnd;
  words.forEach(function(word) {
    rangeEnd = rangeStart + (1.0 / word.rank);
    weightedArr.push({
      start: rangeStart,
      end: rangeEnd
    });
    rangeStart = rangeEnd;
  });
}

function sampleWordsWeighted() {
  var lastRangeEnd = weightedArr[weightedArr.length - 1].end;
  var randNum = Math.random() * lastRangeEnd;

  var wordIndex = binarySearch(weightedArr, randNum);
  return words[wordIndex];
}

function binarySearch(arr, target) {
  var low = 0;
  var high = arr.length - 1;
  while (low <= high) {
    var mid = Math.floor((low + high) / 2);
    if (target >= arr[mid].start && target <= arr[mid].end) {
      return mid;
    } else if (arr[mid].start > target) {
      high = mid - 1;
    } else if  (arr[mid].end < target) {
      low = mid + 1;
    }
  }
  return -1;
}

function onNextClick() {
  var nextWord = getNextWord();
  populateDOMWithWordFields(nextWord);
  // when hitting next, we always want to be showing the front of the card
  if (!showingFront) {
    flipCard();
  }
}

function formatUsage(usageStr) {
  var htmlStr = '';
  // match all occurrences of **any chars**
  var re = /(\*\*)(.*?)(\*\*)/g;
  htmlStr = usageStr.replace(re, '<strong>$2</strong>');
  return htmlStr;
}

function formatOrigin(originStr) {
  var htmlStr = '';
  // match all occurences of _any chars_
  var re = /(_)(.*?)(_)/g;
  htmlStr = originStr.replace(re, '<em>$2</em>');
  return htmlStr;
}

function populateDOMWithWordFields(word) {
  $('#word').html(word.word);
  if (word.hasOwnProperty('pronunciation')) {
    $('#pronunciation').html('<span>Pronunciation: </span>' + word.pronunciation);
    $('#pronunciation').css('display', 'block');
  } else {
    $('#pronunciation').css('display', 'none');
  }
  $('#definition').html(word.definition);
  $('#usage').html('<span>Usage: </span>'  + formatUsage(word.usage));
  $('#origin').html('<span>Origin: </span>'  + formatOrigin(word.origin));
  $('#rank').html('<span>Rank: </span>'  + word.rank);
}

function flipCard() {
  var $backOfCard = $('#card-back')[0];
  var $frontOfCard = $('#card-front')[0];
  showingFront = !showingFront;

  if (!showingFront) {
    $frontOfCard.style.display = 'none';
    $backOfCard.style.display = 'flex';
  } else {
    $frontOfCard.style.display = 'flex';
    $backOfCard.style.display = 'none';
  }
}

$(document).ready(function() {
  // register button click handler
  getWords(urls);
  $('#next').click(onNextClick);
  $('#flash-card').click(flipCard);
});
