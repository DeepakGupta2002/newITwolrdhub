
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Form data ko extract karte hain
    const name = document.getElementById('modalname').value;
    const email = document.getElementById('modalemail').value;
    const phone = document.getElementById('modalphone').value;
    const service = document.getElementById('service').value;

    // API ke liye data object prepare karte hain
    const data = {
        name: name,
        email: email,
        phone: phone,
        query: `I am interested in ${service}.`
    };

    // console.log(data);
    // fetch function ka use karke API ko POST request bhejte hain
    fetch('https://www.itworldhub.com/api/queries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);

            // Form fields ko reset karte hain
            document.getElementById('contactForm').reset();

            // Contact Modal ko close karte hain
            var contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            contactModal.hide();

            // Success Modal ko show karte hain
            var successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // 3 seconds ke baad success modal ko close karte hain
            setTimeout(function () {
                successModal.hide();
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            // Error handling yahan kar sakte hain
        });
});


