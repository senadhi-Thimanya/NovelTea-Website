document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".banner-carousel");
    const slides = document.querySelectorAll(".carousel-slide");
    // Check if carousel and slides exist before proceeding
    if (carousel && slides.length > 0) {
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        const indicatorsContainer = document.querySelector(".indicators");

        // Clone first and last slides for smooth infinite scrolling
        const firstSlideClone = slides[0].cloneNode(true);
        const lastSlideClone = slides[slides.length - 1].cloneNode(true);

        // Append clones to carousel
        carousel.appendChild(firstSlideClone);
        carousel.insertBefore(lastSlideClone, slides[0]);

        let index = 1; // Start at index 1 (which is the first real slide)
        const totalSlides = slides.length;

        // Set initial position to show first real slide (index 1)
        carousel.style.transform = `translateX(-${index * 100}%)`;

        // Clear any existing indicators
        indicatorsContainer.innerHTML = '';

        // Create indicators (only for real slides, not clones)
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("data-index", i);
            indicatorsContainer.appendChild(dot);

            dot.addEventListener("click", () => {
                index = i + 1; // +1 because of the cloned slide at the beginning
                moveCarousel();
            });
        }

        const dots = document.querySelectorAll(".dot");

        function moveCarousel() {
            carousel.style.transition = "transform 0.5s ease-in-out";
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateIndicators();
        }

        function updateIndicators() {
            // Map the current index (accounting for clones) to the indicator index
            const indicatorIndex = (index - 1 + totalSlides) % totalSlides;

            dots.forEach((dot, i) => {
                if (i === indicatorIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }

        // Handle the transition end
        carousel.addEventListener('transitionend', function () {
            // If we're at the clone of the first slide (at the end)
            if (index === totalSlides + 1) {
                carousel.style.transition = "none";
                index = 1;
                carousel.style.transform = `translateX(-${index * 100}%)`;
            }

            // If we're at the clone of the last slide (at the beginning)
            if (index === 0) {
                carousel.style.transition = "none";
                index = totalSlides;
                carousel.style.transform = `translateX(-${index * 100}%)`;
            }
        });

        // Move to next slide
        function nextSlide() {
            if (index >= totalSlides + 1) return;
            index++;
            moveCarousel();
        }

        // Move to previous slide
        function prevSlide() {
            if (index <= 0) return;
            index--;
            moveCarousel();
        }

        let autoSlide = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                clearInterval(autoSlide);
                nextSlide();
                autoSlide = setInterval(nextSlide, 5000);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                clearInterval(autoSlide);
                prevSlide();
                autoSlide = setInterval(nextSlide, 5000);
            });
        }

        // Initial indicator setup
        updateIndicators();
    }
});

function scrollCarousel(carouselId, scrollAmount) {
    const carousel = document.getElementById(carouselId);
    
    // Calculate the current scroll position and new scroll position
    const currentScroll = carousel.scrollLeft;
    const newScrollPosition = currentScroll + scrollAmount;
    
    // Smoothly scroll to the new position
    carousel.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
    });
}

// Optional: Add touch and drag scrolling
function enableCarouselDrag(carouselId) {
    const carousel = document.getElementById(carouselId);
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 to increase scroll speed
        carousel.scrollLeft = scrollLeft - walk;
    });
}

// Initialize drag scrolling when the page loads
document.addEventListener('DOMContentLoaded', () => {
    enableCarouselDrag('trending');
});

// ----- NEWSLETTER SUBSCRIPTION -----
const newsletterForm = document.querySelector('.footer-newsletter form');

newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (email) {
        // In a real implementation, you would send this to your server
        console.log('Newsletter subscription:', email);

        // Show success message
        showNotification('Thank you for subscribing to our newsletter!');

        // Clear the input
        emailInput.value = '';
    }
});