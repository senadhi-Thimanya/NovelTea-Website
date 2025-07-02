document.addEventListener('DOMContentLoaded', function () {
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    const totalOrdersSpan = document.getElementById('total-orders');

    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Update order count
        totalOrdersSpan.textContent = orders.length;

        // Show/hide no orders message
        noOrders.style.display = orders.length === 0 ? 'block' : 'none';

        // Clear existing orders
        ordersList.innerHTML = '';

        // Display orders in reverse chronological order
        orders.reverse().forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';

            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const orderTotal = order.items.reduce((sum, item) => {
                const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
                return sum + (price * item.quantity);
            }, 0);

            orderElement.innerHTML = `
                <div class="order-container">
                    <div class="order-box">
                        <div class="order-header">
                            <div class="order-info">
                                <h3>Order ${order.orderId}</h3>
                                <p>Placed on ${orderDate}</p>
                            </div>
                            <div class="order-total">
                                <p>Total: $${orderTotal.toFixed(2)}</p>
                                <p>${itemsCount} item${itemsCount !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div class="order-details">
                            <div class="shipping-info">
                                <h4>Shipping Details</h4>
                                <p>Email: ${order.email}</p>
                                <p>Phone: ${order.phone}</p>
                                <p>City: ${order.city}</p>
                                <p>Zip Code: ${order.zipCode}</p>
                            </div>
                            <div class="payment-info">
                                <h4>Payment Method</h4>
                                <p>${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            ordersList.appendChild(orderElement);
        });
    }

    displayOrders();
});