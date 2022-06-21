const resultsNav = document.getElementById("results-nav");
const favoritesNav = document.getElementById("favorites-nav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// Nasa API key
const count = 10;
const apiKey = "MrX6iiZHLhrDTWf2eFRSuZgFApobdOcLlABOLtmW";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = [];

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Card Image
    const cardImage = document.createElement("img");
    cardImage.src = result.url;
    cardImage.alt = "NASA Picture of the Day";
    cardImage.loading = "lazy";
    cardImage.classList.add("card-img-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Card Text
    const cardText = document.createElement("p");
    cardText.classList.add("clickable");
    if (page === "results") {
      cardText.textContent = "Add to Favorites";
      cardText.setAttribute("onclick", `saveFavorite("${result.url}")`);
    } else {
      cardText.textContent = "Remove Favorites";
      cardText.setAttribute("onclick", `removeFavorite("${result.url}")`);
    }
    // Card Description
    const cardDescription = document.createElement("p");
    cardDescription.textContent = result.explanation;
    // Card Footer
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, cardText, cardDescription, footer);
    link.appendChild(cardImage);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  // Reset DOM, Create DOM Nodes, Show Content
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Get 10 images from the API
async function getNasaImages() {
  // Show Loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    // Catch Error here
    console.log(error);
  }
}

// Add result to favorites
function saveFavorite(itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //   Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Save favorites to local Storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove Item from Favorites
function removeFavorites(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Save favorites to local Storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On Load
getNasaImages();
