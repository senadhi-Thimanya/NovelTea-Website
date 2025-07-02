// Cart Functonality Script

// Create global cart namespace
window.Cart = {
    items: [],
    updateCartCount: null,
    renderCartSidebar: null,
    addToCart: null
};

document.addEventListener('DOMContentLoaded', function () {
    const cartButton = document.getElementById('cart-button');
    const addToCartButtons = document.querySelectorAll('.category-add-to-cart');
    Cart.items = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Update cart count display
    function createCartCountElement() {
        const cartContainer = document.querySelector('.cart-container');
        const cartButton = document.getElementById('cart-button');
        
        if (!cartContainer || !cartButton) return null;

        const cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        
        Object.assign(cartCount.style, {
            position: 'absolute',
            top: '-5px',
            right: '13px',
            backgroundColor: '#CC1928',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: '10'
        });

        cartContainer.style.position = 'relative';
        cartContainer.appendChild(cartCount);

        return cartCount;
    }

    // Create cart count element if it doesn't exist and display it
    Cart.updateCartCount = function() {
        let cartCountDisplay = document.querySelector('.cart-count');
        if (!cartCountDisplay) {
            cartCountDisplay = createCartCountElement();
        }
        const totalQuantity = Cart.items.reduce((total, item) => total + item.quantity, 0);
        if (cartCountDisplay) {
            cartCountDisplay.textContent = totalQuantity;
            cartCountDisplay.style.display = totalQuantity > 0 ? 'flex' : 'none';
        }
    };

    // Render cart sidebar - adding items and then a summary
    Cart.renderCartSidebar = function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummaryContainer = document.querySelector('.cart-summary');

        if (!cartItemsContainer || !cartSummaryContainer) return;

        cartItemsContainer.innerHTML = '';

        let subtotal = 0;
        let cartCount = 0;

        Cart.items.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';

            const itemPrice = parseFloat(item.price.replace('$', ''));
            const itemTotal = itemPrice * item.quantity;

            cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>${item.author}</p>
                <div class="item-quantity">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" aria-label="quantity">
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="item-actions">
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                    <p class="item-price">${item.price}</p>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);

            subtotal += itemTotal;
            cartCount += item.quantity;
        });

        const shipping = 5.99;
        const total = subtotal + shipping;

        cartSummaryContainer.innerHTML = `
        <div class="summary-row">
            <span>Subtotal (${cartCount} item${cartCount !== 1 ? 's' : ''})</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Estimated Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>Order Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

        bindCartItemControls();
    };

    // Toggle cart sidebar - opens and closed the sidebar
    function toggleCartSidebar() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('cart-sidebar-open');

            if (cartSidebar.classList.contains('cart-sidebar-open')) {
                Cart.renderCartSidebar();
            }
        }
    }

    // Bind cart item control events - decrease increase and remove item functions
    function bindCartItemControls() {
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = e.target.dataset.id;
                const itemIndex = Cart.items.findIndex(item => item.id === parseInt(itemId));

                if (itemIndex > -1 && Cart.items[itemIndex].quantity > 1) {
                    Cart.items[itemIndex].quantity -= 1;
                    localStorage.setItem('cartItems', JSON.stringify(Cart.items));
                    Cart.renderCartSidebar();
                    Cart.updateCartCount();
                }
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = e.target.dataset.id;
                const itemIndex = Cart.items.findIndex(item => item.id === parseInt(itemId));

                if (itemIndex > -1) {
                    Cart.items[itemIndex].quantity += 1;
                    localStorage.setItem('cartItems', JSON.stringify(Cart.items));
                    Cart.renderCartSidebar();
                    Cart.updateCartCount();
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = e.target.dataset.id;
                Cart.items = Cart.items.filter(item => item.id !== parseInt(itemId));
                localStorage.setItem('cartItems', JSON.stringify(Cart.items));
                Cart.renderCartSidebar();
                Cart.updateCartCount();
            });
        });
    }

    // Add to cart functionality
    Cart.addToCart = function(book) {
        const existingBookIndex = Cart.items.findIndex(item => item.title === book.title);

        if (existingBookIndex > -1) {
            Cart.items[existingBookIndex].quantity += 1;
        } else {
            Cart.items.push(book);
        }

        localStorage.setItem('cartItems', JSON.stringify(Cart.items));
        Cart.updateCartCount();
        Cart.renderCartSidebar();
        showNotification(`${book.title} added to cart!`);
    };

    if (cartButton) {
        cartButton.addEventListener('click', toggleCartSidebar);
    }

    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartSidebar);
    }

    document.addEventListener('click', (event) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartButton = document.getElementById('cart-button');
        
        if (cartSidebar && cartSidebar.classList.contains('cart-sidebar-open') &&
            !cartSidebar.contains(event.target) &&
            !cartButton.contains(event.target)) {
            toggleCartSidebar();
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const bookCard = e.target.closest('.category-book-card');
            const bookTitle = bookCard.querySelector('.category-book-title').textContent;
            const bookAuthor = bookCard.querySelector('.category-book-author').textContent;
            const bookPrice = bookCard.querySelector('.category-book-price').textContent;
            const bookImage = bookCard.querySelector('img').src;

            const book = {
                id: Date.now(),
                title: bookTitle,
                author: bookAuthor,
                price: bookPrice,
                image: bookImage,
                quantity: 1
            };

            Cart.addToCart(book);
        });
    });

    Cart.updateCartCount();
});

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notifications and cart count
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #a8dadc;
            color: #2C3E50;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            font-family: cursive;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #CC1928;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }`;
    document.head.appendChild(style);
})();