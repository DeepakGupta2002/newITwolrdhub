document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = "https://www.itworldhub.com/api/social-media-links";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const socialMediaLinks = data[0]; // Get the first item from the array

                // Debugging: Check the socialMediaLinks object
                console.log('Social Media Links:', socialMediaLinks);

                // Update Sticky Social Media Links
                if (document.querySelector(".facebookLink")) {
                    document.querySelector(".facebookLink").href = socialMediaLinks.facebook;
                }
                if (document.querySelector(".twitterLink")) {
                    document.querySelector(".twitterLink").href = socialMediaLinks.twitter;
                }
                if (document.querySelector(".linkedinLink")) {
                    document.querySelector(".linkedinLink").href = socialMediaLinks.linkedin;
                }
                if (document.querySelector(".instagramLink")) {
                    document.querySelector(".instagramLink").href = socialMediaLinks.instagram;
                }
                if (document.querySelector(".whatsappLink")) {
                    document.querySelector(".whatsappLink").href = `https://wa.me/${socialMediaLinks.whatsapp}`;
                }
                if (document.querySelector(".phone-icon")) {
                    document.querySelector(".phone-icon").href = `tel:${socialMediaLinks.call}`;
                }

                // Update Footer Social Media Links (if you have these IDs)
                if (document.getElementById("facebookLink1")) {
                    document.getElementById("facebookLink1").href = socialMediaLinks.facebook;
                }
                if (document.getElementById("twitterLink1")) {
                    document.getElementById("twitterLink1").href = socialMediaLinks.twitter;
                }
                if (document.getElementById("linkedinLink1")) {
                    document.getElementById("linkedinLink1").href = socialMediaLinks.linkedin;
                }
                if (document.getElementById("instagramLink1")) {
                    document.getElementById("instagramLink1").href = socialMediaLinks.instagram;
                }
                if (document.getElementById("whatsappLink1")) {
                    document.getElementById("whatsappLink1").href = `https://wa.me/${socialMediaLinks.whatsapp}`;
                }
                if (document.getElementById("phoneLink")) {
                    document.getElementById("phoneLink").href = `tel:${socialMediaLinks.phone}`;
                }

            } else {
                console.warn('No social media links found');
            }
        })
        .catch(error => {
            console.error('Error fetching social media links:', error);
            // Optional: Update the HTML with error messages
            document.querySelectorAll('.social-icons a, .social-links a').forEach(icon => {
                icon.href = '#';
                icon.title = 'Error loading data';
            });
        });
});
