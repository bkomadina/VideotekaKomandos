$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var moviesUrl = "movies.json";
var moviesTitleHtml = "snippets/movies-title.html";
var movieHtml = "snippets/movie.html";

var awardsHtml = "snippets/awards.html";



// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};


// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// Remove the class 'active' from home and switch to Categories button
var switchCategoriesToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;
  
  // Remove 'active from Awards button
  var classes = document.querySelector("#navAwardsButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navAwardsButton").className = classes;

  // Add 'active' to Categories button if not already there
  classes = document.querySelector("#navCategoriesButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navCategoriesButton").className = classes;
  }
};

// Remove the class 'active' from home and switch to Awards button
var switchAwardsToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Remove 'active from Categories button
  var classes = document.querySelector("#navCategoriesButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navCategoriesButton").className = classes;

  // Add 'active' to Awards button if not already there
  classes = document.querySelector("#navAwardsButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navAwardsButton").className = classes;
  }
};


// Remove the class 'active' from home and switch to About button
var switchAboutToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navAboutButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navAboutButton").className = classes;
  }
};


// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

// Load the categories view
dc.loadCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


// Load the movies view
// 'categoryShort' is a short_name for a category
dc.loadMovies = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    moviesUrl + categoryShort,
    buildAndShowMoviesHTML);
};


// Load About view
dc.loadAbout = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    moviesUrl + categoryShort,
    buildAndShowMoviesHTML);
};

// Load Awards view
dc.loadAwards = function () {
   // Retrieve award snippet:
   $ajaxUtils.sendGetRequest(
    awardsHtml,
    function (awardHtml) {
      // console.log("html snippet as result od get request:", awardHtml)
      // Switch CSS class active to menu button
      switchAwardsToActive();
      var awardsViewHtml =
        buildAwardsViewHtml(awardHtml);
      insertHtml("#main-content", awardsViewHtml);
    },
    false);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
        	// Switch CSS class active to category button
          switchCategoriesToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

function buildAwardsViewHtml(awardHtml) {
  var finalHtml = awardHtml;
  finalHtml += "<section class='row'>";
  finalHtml += "</section>";
  return finalHtml;
}

// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMoviesHTML (categoryMovies) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    moviesTitleHtml,
    function (moviesTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        movieHtml,
        function (movieHtml) {
        	// Switch CSS class active to menu button
          switchCategoriesToActive();

          var moviesViewHtml =
            buildMoviesViewHtml(categoryMovies,
                                   moviesTitleHtml,
                                   movieHtml);
          insertHtml("#main-content", moviesViewHtml);
        },
        false);
    },
    false);
}

// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMoviesViewHtml(categoryMovies,
                                moviesTitleHtml,
                                movieHtml) {

  moviesTitleHtml =
    insertProperty(moviesTitleHtml,
                   "name",
                   categoryMovies.category.name);
  moviesTitleHtml =
    insertProperty(moviesTitleHtml,
                   "special_instructions",
                   categoryMovies.category.special_instructions);

  var finalHtml = moviesTitleHtml;
  finalHtml += "<section class='row'>";

  
  // Loop over menu items
  var movies = categoryMovies.movies;
  var catShortName = categoryMovies.category.short_name;
  for (var i = 0; i < movies.length; i++) {
    // Insert menu item values
    var html = movieHtml;
    html =
      insertProperty(html, "short_name", movies[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertMoviePrice(html,
                      "price_small",
                      movies[i].price_small);
    html =
      insertMoviePortionName(html,
                            "small_portion_name",
                            movies[i].small_portion_name);
    html =
      insertMoviePrice(html,
                      "price_large",
                      movies[i].price_large);
    html =
      insertMoviePortionName(html,
                            "large_portion_name",
                            movies[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     movies[i].name);
    html =
      insertProperty(html,
                     "description",
                     movies[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertMoviePrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertMoviePortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}

global.$dc = dc;

})(window);
