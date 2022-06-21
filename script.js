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

function updateDOM() {
  resultsArray.forEach((result) => {
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
    cardText.textContent = "Add to Favorites";
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
    cardBody.append(cardTitle, cardDescription, cardText, footer);
    link.appendChild(cardImage);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// Get 10 images from the API
async function getNasaImages() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM();
  } catch (error) {
    // Catch Error here
    console.log(error);
  }
}

// On Load
getNasaImages();
