// contact api for footer data query submit 


document.getElementById('customContactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Form data ko extract karte hain
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // API ke liye data object prepare karte hain
    const data = {
        name: name,
        email: email,
        phone: phone,
        query: message
    };

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
            document.getElementById('customContactForm').reset();

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
