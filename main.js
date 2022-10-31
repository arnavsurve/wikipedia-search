window.onload = function () {
  const form = document.querySelector(".js-search-form");
  form.addEventListener("submit", handleSubmit);
};

async function handleSubmit(event) {
  // Prevent page from reloading on form submission
  event.preventDefault();
  // Get value of input field
  const inputValue = document.querySelector(".js-search-input").value;
  // Remove whitespace from input
  const searchQuery = inputValue.trim();

  const searchResults = document.querySelector(".js-search-results");
  // Clear previous results
  searchResults.innerHTML = "";

  const spinner = document.querySelector(".js-spinner");
  spinner.classList.remove("hidden");

  try {
    const results = await searchWikipedia(searchQuery);
    if (results.query.searchinfo.totalhits === 0) {
      alert("No results found! Try different keywords.");
      return;
    }

    displayResults(results);
    console.log(results);
  } catch (err) {
    console.log(err);
    alert("Failed wikipedia search");
  } finally {
    spinner.classList.add("hidden");
  }
}

async function searchWikipedia(searchQuery) {
  const endpoint = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}

function displayResults(results) {
  // Reference to '.js-search-results' element
  const searchResults = document.querySelector(".js-search-results");

  // Iterate over 'search' array
  results.query.search.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    // Append search result to DOM
    searchResults.insertAdjacentHTML(
      "beforeend",
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target"_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span></br>
      </div>`
    );
  });
}
