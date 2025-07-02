document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        alert('No book specified.');
        return;
    }

    const bookTitleEl = document.getElementById('book-title');
    const bookAuthorEl = document.getElementById('book-author');
    const bookDescEl = document.getElementById('book-description');
    const bookPriceEl = document.getElementById('book-price');
    const bookCoverEl = document.getElementById('book-cover');
    const reviewsContainer = document.getElementById('reviews-container');
    const avgRatingEl = document.getElementById('average-rating');
    const categorySpan = document.getElementById('category-crumb');
    const bookSpan = document.getElementById('book-crumb');

    Promise.all([
        fetch('../XML/bookdata.xml').then(res => res.text()),
        fetch('../XML/reviews.xml').then(res => res.text())
    ]).then(([bookData, reviewData]) => {
        const parser = new DOMParser();
        const booksXml = parser.parseFromString(bookData, 'application/xml');
        const reviewsXml = parser.parseFromString(reviewData, 'application/xml');

        const book = booksXml.querySelector(`book[id="${bookId}"]`);

        if (!book) {
            bookTitleEl.textContent = 'Book not found';
            return;
        }

        const title = book.querySelector('title').textContent;
        const author = book.querySelector('author').textContent;
        const description = book.querySelector('description').textContent;
        const price = parseFloat(book.querySelector('price').textContent).toFixed(2);
        const cover = book.querySelector('cover').textContent;
        const category = book.querySelector('category')?.textContent || 'Fiction';

        // Get stored category from localStorage
        const storedCategory = localStorage.getItem('activeCategory') || 'Fiction';
        
        // Update breadcrumb
        document.getElementById('category-crumb').textContent = storedCategory;
        document.getElementById('book-crumb').textContent = title;

        // Update book info
        bookTitleEl.textContent = title;
        bookAuthorEl.textContent = `by ${author}`;
        bookDescEl.textContent = description;
        bookPriceEl.textContent = `$${price}`;
        bookCoverEl.src = cover;

        // Find matching reviews
        const reviews = Array.from(reviewsXml.querySelectorAll('review')).filter(
            review => review.querySelector('title').textContent === title
        );

        if (reviews.length === 0) {
            avgRatingEl.innerHTML = '<p>No reviews yet.</p>';
            reviewsContainer.innerHTML = '';
            return;
        }

        // Calculate average rating
        const average = (
            reviews.reduce((sum, r) => sum + parseFloat(r.querySelector('rating').textContent), 0) /
            reviews.length
        ).toFixed(1);

        avgRatingEl.innerHTML = `<strong>Average Rating:</strong> ${average} / 5`;

        // Render reviews
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewer = review.querySelector('reviewer').textContent;
            const rating = review.querySelector('rating').textContent;
            const date = review.querySelector('date').textContent;
            const text = review.querySelector('text').textContent;

            const reviewHTML = `
                <div class="review">
                    <div class="review-header">
                        <div class="review-stars">⭐ ${rating}/5</div>
                        <div class="review-meta">by ${reviewer} on ${date}</div>
                    </div>
                    <div class="review-content">${text}</div>
                </div>
            `;

            reviewsContainer.insertAdjacentHTML('beforeend', reviewHTML);
        });

        // Set up add to cart button after data is loaded
        setupAddToCartButton(bookId, title, author, `$${price}`, cover);
    });

    // Function to update cart count (compatible with your cart.js)
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const countEl = document.getElementById('cart-count');
        if (countEl) {
            if (totalQty > 0) {
                countEl.textContent = totalQty;
                countEl.style.display = 'block';
            } else {
                countEl.style.display = 'none';
            }
        }
    }

    // Function to setup add to cart button
    function setupAddToCartButton(bookId, title, author, price, image) {
        const addToCartBtn = document.getElementById('add-to-cart');

        if (!addToCartBtn) return;

        addToCartBtn.addEventListener('click', () => {
            const book = {
                id: Date.now(),
                title: title,
                author: author,
                price: price,
                image: image,
                quantity: 1
            };

            // Use the addToCart function from cart.js
            Cart.addToCart(book);

            // The cartUpdated event is not needed since addToCart handles everything
            updateCartCount();
            renderCartSidebar();
        });
    }

    function showPopup(message) {
        // Check if there's an existing cart-popup element
        let popup = document.getElementById('cart-popup');

        // If not, create a new notification like in your cart.js
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'cart-popup';
            popup.className = 'notification';
            document.body.appendChild(popup);
        }

        popup.textContent = message;
        popup.classList.add('show');

        // Hide and remove the notification after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);
    }

    // Call updateCartCount on page load
    updateCartCount();
});