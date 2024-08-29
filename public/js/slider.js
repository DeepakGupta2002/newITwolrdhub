// // nav ber ki niche wali slide
// const apiUrl = 'https://www.itworldhub.com/api/slides'; // Your API endpoint
// let currentSlide = 0;

// async function fetchSlides() {
//     try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();
//         populateSlides(data.slides);
//     } catch (error) {
//         console.error('Error fetching slides:', error);
//     }
// }

// function populateSlides(slides) {
//     const slider = document.getElementById('slider');
//     slider.innerHTML = slides.map(slide => `
//     <div class="slide">
//         <img src="${slide.imageUrl}" alt="${slide.alt}">
//             <div class="slide-content">
//                 <h2>${slide.title}</h2>
//                 <h1>${slide.alt}</h1>
//                 <p>${slide.description || ''}</p>
//                 <div class="buttons">
//                     <button><i class="fas fa-quote-right"></i> Get Started</button>
//                     <button><i class="fas fa-phone-alt"></i> Learn More</button>
//                 </div>
//             </div>
//     </div>
//     `).join('');

//     // Add active class to the first slide
//     slider.querySelector('.slide').classList.add('active');
// }

// function showSlide(index) {
//     const slides = document.querySelectorAll('.slide');
//     if (index >= slides.length) currentSlide = 0;
//     if (index < 0) currentSlide = slides.length - 1;

//     slides.forEach(slide => slide.classList.remove('active'));
//     slides[currentSlide].classList.add('active');

//     document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
// }

// document.querySelector('.next').addEventListener('click', () => {
//     currentSlide++;
//     showSlide(currentSlide);
// });

// document.querySelector('.prev').addEventListener('click', () => {
//     currentSlide--;
//     showSlide(currentSlide);
// });

// // Fetch and populate slides on page load
// fetchSlides();


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
