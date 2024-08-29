

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://www.itworldhub.com/api/contacts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const contact = data.contacts[0]; // Adjusted to match the backend response format

            // Debugging: Check the contact object
            console.log('Contact object:', contact);
            console.log('Email:', contact.email);
            console.log('Address:', contact.address);
            console.log('Phone:', contact.phone);

            // Update the HTML content with fetched data
            if (document.querySelector(".addrshvalue")) {
                document.querySelector(".addrshvalue").innerHTML = contact.address;
            }
            if (document.querySelector(".addrshvalue1")) {
                document.querySelector(".addrshvalue1").innerHTML = contact.address;
            }
            if (document.querySelector(".emialvalue")) {
                document.querySelector(".emialvalue").innerHTML = contact.email;
            }
            if (document.querySelector(".emialvalue1")) {
                document.querySelector(".emialvalue1").innerHTML = contact.email;
            }
            if (document.querySelector(".phonevalue")) {
                document.querySelector(".phonevalue").innerHTML = contact.phone;
            }
            if (document.querySelector(".phonevalue1")) {
                document.querySelector(".phonevalue1").innerHTML = contact.phone;
            }
        })
        .catch(error => {
            console.error('Error fetching contact data:', error);
            document.querySelector(".addrshvalue").textContent = 'Error loading data';
            document.querySelector(".emialvalue").textContent = 'Error loading data';
            document.querySelector(".phonevalue").textContent = 'Error loading data';
        });
});
