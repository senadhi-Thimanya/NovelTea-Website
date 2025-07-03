// Logic Functionality Script

document.addEventListener('DOMContentLoaded', function () {
    // ----- NAVBAR AND LOGIN FUNCTIONALITY -----
    function updateNavbar() {
        const loginButton = document.querySelector("#login-btn-nav");

        const loggedInUser = localStorage.getItem("loggedInUser");

        if (loggedInUser && loginButton) {
            loginButton.innerHTML = `<a href="#"><img src="../images/profile.png" alt="Profile" style="width: 24px; height: 24px;"></a>`;
            loginButton.id = "profile-btn-nav";
            loginButton.style.transition = 'transform 0.2s';
            loginButton.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            });
            loginButton.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            });
        }
    }

    function setupProfileDropdown() {
        const isLoggedIn = localStorage.getItem('loggedInUser') !== null;
        const profileButton = document.querySelector("#profile-btn-nav");
        const loginButton = document.querySelector("#login-btn-nav");

        if (isLoggedIn && profileButton) {
            const dropdownPanel = document.createElement('div');
            dropdownPanel.id = 'profile-dropdown';
            dropdownPanel.className = 'profile-dropdown';

            const userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            const userEmail = userInfo ? userInfo.email : 'User';

            dropdownPanel.innerHTML = `<div class="profile-header">
                    <img src="../images/profile.png" alt="Profile" class="profile-avatar">
                    <div class="profile-info">
                        <h3>${userEmail}</h3>
                    </div>
                </div>
                <div class="dropdown-items">

                    <a href="checkout.html" class="dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Checkout
                    </a>
                    <a href="orders.html" class="dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                        My Orders
                    </a>
                    <div class="dropdown-divider"></div>
                    <button id="logout-btn" class="dropdown-item logout">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
                <div class="dropdown-footer">
                    <a href="privacy.html">Privacy policy</a>
                    <span class="dot">•</span>
                    <a href="terms.html">Terms of service</a>
                </div>
            `;

            document.body.appendChild(dropdownPanel);

            profileButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const dropdownPanel = document.getElementById('profile-dropdown');
                dropdownPanel.classList.toggle('active');

                const rect = profileButton.getBoundingClientRect();
                dropdownPanel.style.top = (rect.bottom + window.scrollY) + 'px';
                dropdownPanel.style.right = (window.innerWidth - rect.right) + 'px';
            });

            document.addEventListener('click', function (e) {
                const profileButton = document.querySelector("#profile-btn-nav");
                const dropdownPanel = document.getElementById('profile-dropdown');
                if (!profileButton.contains(e.target) && !dropdownPanel.contains(e.target)) {
                    dropdownPanel.classList.remove('active');
                }
            });

            const logoutButton = document.getElementById('logout-btn');
            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    localStorage.removeItem('loggedInUser');
                    alert('You have been logged out successfully.');
                    window.location.href = 'index.html';
                });
            }
        } else if (!isLoggedIn && loginButton) {
            loginButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'signin.html';
            });
        }
    }

    // Handle user sign-up
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            let existingUser = JSON.parse(localStorage.getItem(email));
            if (existingUser) {
                alert("This email is already registered. Please use a different email.");
                return;
            }

            let user = { email, password };
            localStorage.setItem(email, JSON.stringify(user));

            alert("Account created successfully! Redirecting to sign-in page...");
            window.location.href = "signin.html";
        });
    }

    // Handle user sign-in
    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
        signinForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            let storedUser = JSON.parse(localStorage.getItem(email));
            if (!storedUser || storedUser.password !== password) {
                alert("Invalid email or password.");
                return;
            }

            localStorage.setItem("loggedInUser", JSON.stringify(storedUser));

            alert(`Welcome back!`);
            window.location.href = "index.html";
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.footer-newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                console.log('Newsletter subscription:', email);
                showNotification('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Update navbar and dropdown on page load
    updateNavbar();
    setupProfileDropdown();
});

// Shared notification function (in case the cart script is not loaded)
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