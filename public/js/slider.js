

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const dotsContainer = document.getElementById("navigationDots");

showSlides(slideIndex);

function showSlides(index) {
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";

    updateDots(slideIndex);
}

function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

function prevSlide() {
    slideIndex--;
    showSlides(slideIndex);
}

function createDots() {
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.onclick = function () {
            slideIndex = i;
            showSlides(slideIndex);
        };
        dotsContainer.appendChild(dot);
    }
    updateDots(slideIndex);
}

function updateDots(index) {
    const dots = document.getElementsByClassName("dot");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    dots[index].classList.add("active");
}

createDots();

// Automatic slide change every 5 seconds
setInterval(() => {
    nextSlide();
}, 1000);
