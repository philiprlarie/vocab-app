var alFranken = 'https://raw.githubusercontent.com/philiprlarie/reading/master/al-franken-giant-of-the-senate.json';
var bFrank = 'https://raw.githubusercontent.com/philiprlarie/reading/master/benjamin-franklin.json';
var marceloGleiser = 'https://raw.githubusercontent.com/philiprlarie/reading/master/island-of-knowledge.json';

var urls = [alFranken, bFrank, marceloGleiser];
var words = [];

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
        populateDOMWithWordFields(getNextWord());
      }
      console.log(words);
    });
  });

}


function getNextWord() {
  console.log('in next word');
  console.log(words);
  var randIndex = Math.floor(Math.random() * words.length);
  return words[randIndex];
}

function onNextClick() {
  console.log('in on nextclick');
  var nextWord = getNextWord();
  console.log(nextWord);
  populateDOMWithWordFields(nextWord);
}

function populateDOMWithWordFields(word) {
  $('#word').html('<span>Word:</span> ' + word.word);
  if (word.hasOwnProperty('pronunciation')) {
    $('#pronunciation').html('<span>Pronunciation: </span>' + word.pronunciation);
    $('#pronunciation').css('display', 'block');
  } else {
    $('#pronunciation').css('display', 'none');
  }
  $('#definition').html('<span>Definition: </span>' + word.definition);
  $('#usage').html('<span>Usage: </span>'  + word.usage);
  $('#origin').html('<span>Origin: </span>'  + word.origin);
  $('#rank').html('<span>Rank: </span>'  + word.rank);

}

$(document).ready(function() {
  // register button click handler
  getWords(urls);
  $('#next').click(onNextClick);
});
