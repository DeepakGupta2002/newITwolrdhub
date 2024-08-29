window.addEventListener('scroll', function () {
    var cards = document.querySelectorAll('.service-card');

    cards.forEach(function (card, index) {
        var cardPosition = card.getBoundingClientRect().top;
        var screenPosition = window.innerHeight;

        if (cardPosition < screenPosition) {
            setTimeout(function () {
                card.classList.add('visible');
            }, index * 150); // Delay animation for each card
        }
    });
});