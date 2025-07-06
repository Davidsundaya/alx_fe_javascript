// Initial quotes array with categories (load from local storage if available)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryList = document.getElementById("categoryList");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}"<br><em>(${quote.category})</em>`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Update category list UI
function updateCategoryList() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    categoryList.appendChild(li);
  });
  populateCategories();
}

// Populate dropdown filter
function populateCategories() {
  const selected = localStorage.getItem("selectedCategory") || "all";
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "<option value=\"all\">All Categories</option>";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// Get filtered quotes
function getFilteredQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  if (selected === "all") return quotes;
  return quotes.filter(q => q.category === selected);
}

// Filter quotes on change
function filterQuotes() {
  showRandomQuote();
}

// Add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and category fields.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  quoteDisplay.textContent = "Quote added successfully!";
  updateCategoryList();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryList();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (e) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Initial load
updateCategoryList();
showRandomQuote();
