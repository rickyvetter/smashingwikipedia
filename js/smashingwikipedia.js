var firstP = true;
var apiBase = "http://en.wikipedia.org/w/api.php?";

$(document).ready(function(){
  findRandomArticle();
});

$(document).ready(function(){
  $.getJSON( apiBase + "action=query&list=random&format=json&rnnamespace=0&rnlimit=6&callback=?", function( data ) {
    var items = [];
    $.each( data.query.random, function( key, article ) {
    items.push( "<div class='article-button-container large-12 medium-12 small-12 columns'><a href='#/" + article.title + "' id='" + article.title + "' class='article-button button secondary expand'>" + article.title + "</a></div>" );
    });
    $( "<div/>", {
      "class": "article-list",
      html: items.join( "" )
    }).appendTo( "#article-list" );
  });
});

function findRandomArticle(display)
{
  // defaults display to true
  display = typeof display !== 'undefined' ? display : true;
  var title;
  $.getJSON( apiBase + "action=query&list=random&format=json&rnnamespace=0&rnlimit=1&callback=?", function( data ) {
    title = data.query.random[0]["title"];
    // determines if it should display or not
    if (display){
      window.location.href = "#/" + title;
    }
    return title;
  });
  // hides about page, shows article
  $('.about').css("display", "none");
  $('.main').css("display", "block");
}

function getFirstParagraph(title)
{
  $.getJSON( apiBase + "action=query&prop=extracts&format=json&exlimit=10&exintro=&titles=" + title + "&callback=?", function( data ) {
    var items = [];

    for (var key in data.query.pages) {
      articleID = data.query.pages[key];
      articleTitle = data.query.pages[key].title;
      articleExtract = data.query.pages[key].extract;
    }

    // determines whether to show full extract (sometimes more than one paragraph) or just first <p>
    if(firstP)
    {
      var articleExtract = $('<div/>').html(articleExtract);
      var content = articleExtract.find('p:first').prop('outerHTML');
    }
    else{
      var content = articleExtract;
    }

    items.push( "<div id='title'><h1><a id='link-to-wiki' href='http://en.wikipedia.org/wiki/" + articleTitle + "' target='_blank'>" + articleTitle + "</a></h1></div>" );
    items.push( "<div id='text'>" + content + "<p><a href='http://en.wikipedia.org/wiki/" + articleTitle + "' target='_blank'>Read more on Wikipedia...</a></p></div><hr>" );

    $("#wiki-article").contents().remove();
    $( "<div/>", {html: items.join( "" )}).appendTo( "#wiki-article" );

		//add one to smash count
		smashCount = $("#smash").html();
		smashCount++;
		$('#smash').html(smashCount);
 });
}

/***************
// URL LOGIC
***************/

function moveToArticle(title)
{
 newLocation = "#/" + title;
}

$(window).on('hashchange', function() {
  //allows for #/article or #article notation
  if(location.hash[1] == '/')
  {
    // #/article
    var hash = location.hash.substr(2);
  }
  else{
    // #article
    var hash = location.hash.substr(1);
  }
  getFirstParagraph(hash);
  moveToArticle(hash);

  //remove and replace button if it matches new URL
  $.each( $(".article-button"), function( key, value ) {
    if(value.hash.substr(2) == hash)
    {
      $.getJSON( apiBase + "action=query&list=random&format=json&rnnamespace=0&rnlimit=1&callback=?", function( data ) {
        var items = [];
        $.each( data.query.random, function( key, article ) {
          items.push( "<a href='#/" + article.title + "' id='" + article.title + "' class='article-button button secondary expand'>" + article.title + "</a>" );
        });

        $( "<div/>", {
          "class": "article-button-container large-12 medium-12 small-12 columns",
          html: items.join( "" )
        }).appendTo( ".article-list" );
      });
      $( ".article-button-container" ).remove( ":contains('" + hash + "')" );
    }
  });
});

/***************
// BUTTON EVENTS
***************/

$('.random-button').click(function(){
 findRandomArticle();   
});

$('.about-button').click(function(e){
  $('.about').toggle();
  $('.main').toggle();
  e.preventDefault();
});

/***************
// KEY EVENTS
***************/

var fired = false;
function keyPress(e)
{
  if(!fired) {
    fired = true;

    if (!e) e=window.event;
    var key=e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0; 
    if(key == 39 || key == 68) 
    { 
      findRandomArticle();
    } 
    else if(key == 37 || key == 65) {
     history.back();
    }
    else if(key == 13) {
      //alert($("link-to-wiki").attr('href'));
      window.open($("#link-to-wiki").attr('href'));
    }
    else if(key == 49 || key == 50 || key == 51 || key == 52 || key == 53 || key == 54) {
      // keys 1-6
      //alert(key-48);
      window.location.href = $( ".article-list .article-button-container:nth-child(" + (key-48) + ") a" ).attr('href'); //link from corresponding story
    }
    return true; 
  }
}

document.onkeydown = keyPress;

document.onkeyup = function() {
    fired = false;
};
//document.onkeyup = keyPress;

/**********************************************************************************
// TOUCH EVENTS
// Both hammer.js and quo.js hijacked default action on all gestures.
// Made scrolling difficult. May reimplememnt after more research on gesture libraries
**********************************************************************************/

// var element = document.getElementById('wiki-article');
// var sRight = Hammer(element).on("swiperight", function(event) {
//     history.back();
// });
// var sLeft = Hammer(element).on("swipeleft", function(event) {
//     findRandomArticle();
// });

// $$('.wiki-article').swipeRight(function() {
//   history.back();
// });
// $$('.wiki-article').swipeRight(function() {
//   findRandomArticle();
// });