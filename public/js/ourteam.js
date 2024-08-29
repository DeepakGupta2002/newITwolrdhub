// ourteam dynamic data show
document.addEventListener('DOMContentLoaded', function () {
    fetch('https://www.itworldhub.com/api/team')
        .then(response => response.json())
        .then(data => {
            // Get the team container element
            const teamContainer = document.getElementById('teamContainer');

            // Clear any existing content
            teamContainer.innerHTML = '';

            // Check if data is an array and has elements
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(member => {
                    // Create a new team member element
                    const teamMember = document.createElement('div');
                    teamMember.classList.add('team-member');

                    // Create and add the image
                    const img = document.createElement('img');
                    img.src = member.image; // Set the image URL from the API
                    img.alt = `${member.name}`;
                    teamMember.appendChild(img);

                    // Create and add the name
                    const name = document.createElement('h4');
                    name.textContent = member.name;
                    teamMember.appendChild(name);

                    // Create and add the role
                    const role = document.createElement('p');
                    role.textContent = member.role;
                    teamMember.appendChild(role);

                    // Append the new team member to the container
                    teamContainer.appendChild(teamMember);
                });
            } else {
                console.warn('No team members found');
            }
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
        });
});


