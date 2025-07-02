document.addEventListener('DOMContentLoaded', function() {
    // Form Validation
    const checkoutForm = document.querySelector('#checkout-form');
    const submitOrderBtn = document.querySelector('.submit-order');
    const cardPaymentDetails = document.getElementById('card-payment-details');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');

    // Debug localStorage cart items
    window.addEventListener('DOMContentLoaded', () => {
        const allInputs = checkoutForm.querySelectorAll('input, select, textarea');
        allInputs.forEach(field => {
            field.addEventListener('input', handleFieldInput);
        });
    });
    
    // Toggle card payment details based on payment method selection
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'card') {
                cardPaymentDetails.style.display = 'block';
                // Make card fields required
                toggleCardFieldsRequired(true);
            } else {
                cardPaymentDetails.style.display = 'none';
                // Remove required attribute from card fields
                toggleCardFieldsRequired(false);
            }
        });
    });

    // Toggle required attribute for card fields
    function toggleCardFieldsRequired(isRequired) {
        const cardFields = cardPaymentDetails.querySelectorAll('input, select');
        cardFields.forEach(field => {
            if (field.id !== 'gift-card') { // Skip optional gift card field
                field.required = isRequired;
            }
        });
    }

    // Validates the checkout form by ensuring all required fields are filled
    function validateForm() {
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;

        // Reset all fields
        const allInputs = checkoutForm.querySelectorAll('input, select, textarea');
        allInputs.forEach(field => {
            field.classList.remove('validation-error', 'validation-success');
            const errorElement = document.getElementById(`${field.id}-error`);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });

        // Check each required field
        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                isValid = false;
                field.classList.add('validation-error');
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement) {
                    errorElement.style.display = 'block';
                }
                field.addEventListener('input', handleFieldInput);
            } else {
                field.classList.add('validation-success');
            }
        });

        // Specific validations
        if (document.getElementById('payment-card').checked) {
            // Validate email
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.remove('validation-success');
                    emailField.classList.add('validation-error');
                    const errorElement = document.getElementById('email-error');
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                }
            }

            // Validate phone
            const phoneField = document.getElementById('phone');
            if (phoneField && phoneField.value) {
                const phonePattern = /^\+?[0-9\s\-\(\)]{10,15}$/;
                if (!phonePattern.test(phoneField.value)) {
                    isValid = false;
                    phoneField.classList.remove('validation-success');
                    phoneField.classList.add('validation-error');
                    const errorElement = document.getElementById('phone-error');
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Please enter a valid phone number';
                    }
                }
            }

            // Validate zip code
            const zipField = document.getElementById('zip-code');
            if (zipField && zipField.value) {
                const zipPattern = /^[0-9]{5,10}$/;
                if (!zipPattern.test(zipField.value)) {
                    isValid = false;
                    zipField.classList.remove('validation-success');
                    zipField.classList.add('validation-error');
                    const errorElement = document.getElementById('zip-code-error');
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Please enter a valid zip code';
                    }
                }
            }

            // Validate card number if payment method is card
            const cardNumberField = document.getElementById('card-number');
            if (cardNumberField && cardNumberField.value) {
                const cardValue = cardNumberField.value.replace(/\s/g, '');
                if (!/^\d{16}$/.test(cardValue)) {
                    isValid = false;
                    cardNumberField.classList.remove('validation-success');
                    cardNumberField.classList.add('validation-error');
                    const errorElement = document.getElementById('card-number-error');
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        errorElement.textContent = 'Card number must be 16 digits';
                    }
                }
            }
        }

        return isValid;
    }

    function handleFieldInput(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        field.classList.remove('validation-error', 'validation-success');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (field.checkValidity()) {
            field.classList.add('validation-success');
        } else {
            field.classList.add('validation-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        }
        
        // Special validations
        if (field.id === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value) && field.value) {
                field.classList.remove('validation-success');
                field.classList.add('validation-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Please enter a valid email address';
                }
            }
        } else if (field.id === 'phone') {
            const phonePattern = /^\+?[0-9\s\-\(\)]{10,15}$/;
            if (!phonePattern.test(field.value) && field.value) {
                field.classList.remove('validation-success');
                field.classList.add('validation-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Please enter a valid phone number';
                }
            }
        } else if (field.id === 'zip-code') {
            const zipPattern = /^[0-9]{5,10}$/;
            if (!zipPattern.test(field.value) && field.value) {
                field.classList.remove('validation-success');
                field.classList.add('validation-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Please enter a valid zip code';
                }
            }
        } else if (field.id === 'card-number') {
            const cardValue = field.value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cardValue) && cardValue) {
                field.classList.remove('validation-success');
                field.classList.add('validation-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Card number must be 16 digits';
                }
            }
        }
    }

    // Render Cart Items on Checkout
    function renderCheckoutCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsContainer = document.querySelector('.shipping-options-section');
        const summaryDetailsContainer = document.querySelector('.summary-details');

        if (cartItems.length === 0) {
            
            // Add a default item for testing or display a message
            if (cartItemsContainer) {
                let cartItemsWrapper = cartItemsContainer.querySelector('.checkout-cart-items');
                if (!cartItemsWrapper) {
                    cartItemsWrapper = document.createElement('div');
                    cartItemsWrapper.className = 'checkout-cart-items';
                    const heading = cartItemsContainer.querySelector('h2');
                    if (heading) {
                        heading.insertAdjacentElement('afterend', cartItemsWrapper);
                    } else {
                        cartItemsContainer.appendChild(cartItemsWrapper);
                    }
                }
                
                // Display a message that cart is empty
                cartItemsWrapper.innerHTML = '<p>Your cart is empty. Add items before checkout.</p>';
            }
            return;
        }
        

        // Find or create cart items wrapper
        let cartItemsWrapper = cartItemsContainer.querySelector('.checkout-cart-items');
        if (!cartItemsWrapper) {
            cartItemsWrapper = document.createElement('div');
            cartItemsWrapper.className = 'checkout-cart-items';
            // Insert after the heading
            const heading = cartItemsContainer.querySelector('h2');
            if (heading) {
                heading.insertAdjacentElement('afterend', cartItemsWrapper);
            } else {
                cartItemsContainer.appendChild(cartItemsWrapper);
            }
        } else {
            // Clear existing items
            cartItemsWrapper.innerHTML = '';
        }

        // Variables to calculate summary
        let subtotal = 0;
        let itemCount = 0;

        // Render cart items
        cartItems.forEach(item => {
            // Convert price string to number, removing any currency symbol
            const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, '') || 0);
            
            // Create cart item element
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'checkout-cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || '../images/logo2.svg'}" alt="${item.title || 'Product'}">
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <div class="cart-item-title-author">
                            <h3>${item.title || 'Product Title'}</h3>
                            <p>${item.author || 'Author'}</p>
                        </div>
                        <button type="button" class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                    <div class="cart-item-quantity">
                        <div class="quantity-control">
                            <button type="button" class="decrease-qty" data-id="${item.id}">-</button>
                            <input type="text" value="${item.quantity || 1}" min="1" data-id="${item.id}">
                            <button type="button" class="increase-qty" data-id="${item.id}">+</button>
                        </div>
                        <span class="cart-item-price">$${(itemPrice || 0).toFixed(2)}</span>
                    </div>
                </div>
            `;

            // Append to container
            cartItemsWrapper.appendChild(cartItemElement);

            // Update subtotal and item count
            subtotal += (itemPrice || 0) * (item.quantity || 1);
            itemCount += (item.quantity || 1);
        });

        // Get current shipping cost
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        const shippingCost = selectedShipping ? parseFloat(selectedShipping.value) : 18.98;
        
        // Update summary rows
        const summaryRows = summaryDetailsContainer.querySelectorAll('.summary-row');
        if (summaryRows.length >= 3) {
            // Update subtotal
            summaryRows[0].innerHTML = `<span>Subtotal (${itemCount} item${itemCount > 1 ? 's' : ''})</span><span>$${subtotal.toFixed(2)}</span>`;
            // Update shipping
            summaryRows[1].innerHTML = `<span>Shipping</span><span>$${shippingCost.toFixed(2)}</span>`;
            // Tax remains the same
            
            // Update total
            const summaryTotal = summaryDetailsContainer.querySelector('.summary-total');
            if (summaryTotal) {
                const orderTotal = subtotal + shippingCost;
                summaryTotal.innerHTML = `<span>Order Total</span><span>$${orderTotal.toFixed(2)}</span>`;
            }
        }

        // Add event listeners for quantity controls and remove buttons
        addCartItemEventListeners();
    }

    function addCartItemEventListeners() {
        // Quantity decrease
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const itemIndex = cartItems.findIndex(item => item.id.toString() === id.toString());
                
                if (itemIndex > -1 && cartItems[itemIndex].quantity > 1) {
                    cartItems[itemIndex].quantity--;
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCheckoutCartItems();
                }
            });
        });

        // Quantity increase
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const itemIndex = cartItems.findIndex(item => item.id.toString() === id.toString());
                
                if (itemIndex > -1) {
                    cartItems[itemIndex].quantity++;
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCheckoutCartItems();
                }
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const updatedItems = cartItems.filter(item => item.id.toString() !== id.toString());
                
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                
                
                renderCheckoutCartItems();
                
            });
        });
    }

    function updateOrderSummary() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const summaryContainer = document.querySelector('.summary-details');
        
        if (!summaryContainer) return;
    
        const subtotal = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        const shippingCost = selectedShipping ? parseFloat(selectedShipping.value) : 18.98;
        const total = subtotal + shippingCost;
        const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
        const summaryHTML = `
            <div class="summary-row">
                <span>Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>$${shippingCost.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Estimated Tax</span>
                <span>$0.00</span>
            </div>
            <div class="summary-total">
                <span>Order Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button type="submit" class="submit-order">Submit Order</button>
        `;
    
        summaryContainer.innerHTML = summaryHTML;
    }

    // Add a function to initialize cart items if none exist
    function initializeCartItems(){}

    // Populate expiry month and year dropdowns
    function populateExpiryDropdowns() {
        const monthSelect = document.getElementById('expiry-month');
        const yearSelect = document.getElementById('expiry-year');
        
        if (monthSelect && yearSelect) {
            // Populate months
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                const month = i < 10 ? `0${i}` : `${i}`;
                option.value = month;
                option.textContent = month;
                monthSelect.appendChild(option);
            }
            
            // Populate years (current year + 10 years)
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i <= currentYear + 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                yearSelect.appendChild(option);
            }
        }
    }

    // Update shipping cost when shipping option changes
    function setupShippingOptions() {
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        
        shippingOptions.forEach(option => {
            option.addEventListener('change', function() {
                console.log("Shipping option changed to:", this.value);
                renderCheckoutCartItems(); // This will update the order summary with the new shipping cost
            });
        });
    }

    // Form submission handler
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if cart is empty
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        if (validateForm()) {
            // Get form data
            const formData = {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zip-code').value,
                paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
                items: cartItems,
                orderDate: new Date().toISOString(),
                orderId: 'ORD-' + Date.now()
            };

            // Get existing orders or initialize empty array
            const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Add new order to array
            existingOrders.push(formData);
            
            // Save updated orders
            localStorage.setItem('orders', JSON.stringify(existingOrders));

            alert('Order submitted successfully!');
            
            // Clear cart after successful order
            localStorage.removeItem('cartItems');
            
            // Redirect to confirmation page
            window.location.href = "../HTML/orders.html";
        }
    });

    // Initialize
    initializeCartItems();
    populateExpiryDropdowns();
    setupShippingOptions();
    renderCheckoutCartItems();

    // Initialize cart items display
    renderCheckoutCartItems();

    // Add shipping option change listener
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
});