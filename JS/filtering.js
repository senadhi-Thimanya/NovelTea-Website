// Find the specific authors filter section by its ID
const authorsFilterSection = document.getElementById('filter-section-author');

if (authorsFilterSection) {
    // Get all book cards
    const bookCards = document.querySelectorAll('.category-book-card');

    // Create a Set to store unique author names
    const uniqueAuthors = new Set();

    // Extract author names from book cards
    bookCards.forEach(card => {
        const authorElement = card.querySelector('.category-book-author');
        if (authorElement) {
            uniqueAuthors.add(authorElement.textContent.trim());
        }
    });

    // Clear existing author filter options (except the section header)
    const existingOptions = authorsFilterSection.querySelectorAll('.filter-option');
    existingOptions.forEach(option => option.remove());

    // Create and append new filter options for each unique author
    uniqueAuthors.forEach(author => {
        // Create the filter option div
        const filterOptionDiv = document.createElement('div');
        filterOptionDiv.classList.add('filter-option');

        // Create the label
        const label = document.createElement('label');

        // Create the checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        // Add author name to the label
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${author}`));

        // Append label to filter option div
        filterOptionDiv.appendChild(label);

        // Append to the authors filter section
        authorsFilterSection.appendChild(filterOptionDiv);
    });
}

// ----- FILTER FUNCTIONALITY -----
const categoryCheckboxes = document.querySelectorAll('.filter-section:first-of-type .filter-option input');
const priceSlider = document.querySelector('.price-slider');
const authorCheckboxes = document.querySelectorAll('.filter-section:nth-of-type(3) .filter-option input');
const ratingCheckboxes = document.querySelectorAll('.filter-section:nth-of-type(4) .filter-option input');
const bookCards = document.querySelectorAll('.category-book-card');

// Apply all filters
function applyFilters() {
    // Get selected categories
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.parentElement.textContent.trim());

    // Get selected authors
    const selectedAuthors = Array.from(authorCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.parentElement.textContent.trim());

    // Get selected ratings
    const selectedRatings = Array.from(ratingCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const ratingText = checkbox.parentElement.textContent.trim();
            return ratingText.split('&')[0].trim();
        });

    // Get price range
    const maxPrice = parseInt(priceSlider.value);

    // Apply filters to each book card
    bookCards.forEach(card => {
        const bookAuthor = card.querySelector('.category-book-author').textContent;
        const bookPrice = parseFloat(card.querySelector('.category-book-price').textContent.replace('$', ''));
        const bookRating = card.querySelector('.category-book-rating').textContent;

        // Default to visible
        let isVisible = true;

        // Apply category filter if any category is selected
        if (selectedCategories.length > 0) {
            // Get the book's categories from the data attribute
            const bookCategories = card.dataset.categories.split(',');

            // Check if any of the book's categories match the selected categories
            const categoryMatch = selectedCategories.some(category =>
                bookCategories.includes(category)
            );

            isVisible = isVisible && categoryMatch;
        }

        // Apply author filter if any author is selected
        if (selectedAuthors.length > 0) {
            isVisible = isVisible && selectedAuthors.includes(bookAuthor);
        }

        // Apply rating filter if any rating is selected
        if (selectedRatings.length > 0) {
            // Check if the book's rating matches any of the selected ratings
            const matches = selectedRatings.some(rating => {
                if (rating.includes("& up")) {
                    const minStars = rating.match(/★/g).length;
                    const bookStars = bookRating.match(/★/g).length;
                    return bookStars >= minStars;
                } else {
                    return bookRating === rating;
                }
            });
            isVisible = isVisible && matches;
        }

        // Apply price filter
        isVisible = isVisible && bookPrice <= maxPrice;

        // Show or hide the book card
        card.style.display = isVisible ? 'flex' : 'none';
    });

    // Update the displayed count
    updateBookCount();
}

// Update the displayed count of visible books
function updateBookCount() {
    const visibleBooks = Array.from(bookCards).filter(card => card.style.display !== 'none').length;
    const totalBooks = bookCards.length;
    document.querySelector('.sorting span').textContent = `Showing ${visibleBooks} of ${totalBooks} books`;
}

// Add event listeners for filters
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

authorCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

ratingCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

priceSlider.addEventListener('input', function () {
    const maxPrice = this.value;
    this.parentElement.querySelector('div span:last-child').textContent = `$${maxPrice}`;
    applyFilters();
});

// ----- SORTING FUNCTIONALITY -----
const sortSelect = document.querySelector('.sorting select');

sortSelect.addEventListener('change', function () {
    const sortOption = this.value;
    const bookCardsArray = Array.from(bookCards);

    // Sort book cards based on selected option
    bookCardsArray.sort((a, b) => {
        const titleA = a.querySelector('.category-book-title').textContent;
        const titleB = b.querySelector('.category-book-title').textContent;
        const priceA = parseFloat(a.querySelector('.category-book-price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.category-book-price').textContent.replace('$', ''));
        const ratingA = a.querySelector('.category-book-rating').textContent.match(/★/g).length;
        const ratingB = b.querySelector('.category-book-rating').textContent.match(/★/g).length;

        switch (sortOption) {
            case 'Price: Low to High':
                return priceA - priceB;
            case 'Price: High to Low':
                return priceB - priceA;
            case 'Customer Rating':
                return ratingB - ratingA;
            case 'Newest Arrivals':
                // This would require actual date data, using alphabetical as placeholder
                return titleA.localeCompare(titleB);
            default: // Popularity or any other option
                return 0; // No specific sort, keep original order
        }
    });

    // Reorder the book cards in the DOM
    const container = document.querySelector('.category-book-grid');
    bookCardsArray.forEach(card => {
        container.appendChild(card);
    });
});

// ----- SEARCH FUNCTIONALITY -----
const searchInput = document.querySelector('.search-container input');
const searchButton = document.querySelector('.search-container button');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        // If search is empty, show all books
        bookCards.forEach(card => {
            card.style.display = 'flex';
        });
    } else {
        // Filter books based on search term
        bookCards.forEach(card => {
            const title = card.querySelector('.category-book-title').textContent.toLowerCase();
            const author = card.querySelector('.category-book-author').textContent.toLowerCase();

            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Update book count
    updateBookCount();
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// ----- BREADCRUMB FUNCTIONALITY -----
// This assumes the breadcrumb is dynamic based on the selected category
const breadcrumbCategory = document.querySelector('.breadcrumb .active');
const categoryHeader = document.querySelector('.category-header h1');

// If a category is clicked in the sidebar, update the breadcrumb and header
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            const categoryName = this.parentElement.textContent.trim();
            breadcrumbCategory.textContent = categoryName;
            categoryHeader.textContent = `${categoryName} Books`;

            // Uncheck other category checkboxes
            categoryCheckboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });

            applyFilters();
        }
    });
});


// CSS to make the authors section scrollable
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .filter-section:nth-of-type(3) {
            max-height: 200px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        /* Styling for the scrollbar */
        .filter-section:nth-of-type(3)::-webkit-scrollbar {
            width: 6px;
        }
        
        .filter-section:nth-of-type(3)::-webkit-scrollbar-track {
            background: #c5d1c5;
            border-radius: 10px;
        }
        
        .filter-section:nth-of-type(3)::-webkit-scrollbar-thumb {
            background: #a8dadc;
            border-radius: 10px;
        }
        
        .filter-section:nth-of-type(3)::-webkit-scrollbar-thumb:hover {
            background: #82c4c9;
        }
    `;
    document.head.appendChild(style);
})();
