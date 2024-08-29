// api base hai ye


document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("testimonial-slider");

    fetch("https://www.itworldhub.com/api/testimonials")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched testimonials:", data); // Debugging line
            data.forEach((testimonial, index) => {
                const slide = document.createElement("div");
                slide.classList.add("testimonial-slide");
                if (index === 0) {
                    slide.classList.add("active");
                }

                slide.innerHTML = `
    <span class="quote"><i class="fas fa-quote-left"></i></span>
    <img src="${testimonial.imageUrl}" alt="${testimonial.clientName}">
        <h3>${testimonial.clientName}</h3>
        <p class="rating">${getRatingStars(testimonial.rating)}</p>
        <p>"${testimonial.testimonialText}"</p>
        `;
                slider.appendChild(slide);
            });
            setupSliderNavigation();
        })
        .catch(error => console.error("Error fetching testimonials:", error));

    function getRatingStars(rating) {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    function setupSliderNavigation() {
        const slides = document.querySelectorAll(".testimonial-slide");
        let currentIndex = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) {
                    slide.classList.add("active");
                }
            });
        }

        document.querySelector(".prev").addEventListener("click", function () {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            showSlide(currentIndex);
        });

        document.querySelector(".next").addEventListener("click", function () {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            showSlide(currentIndex);
        });

        // Optionally, add automatic sliding
        setInterval(() => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            showSlide(currentIndex);
        }, 2000); // Change slide every 5 seconds
    }
});


