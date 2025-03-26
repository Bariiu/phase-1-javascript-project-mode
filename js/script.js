fetch('db.json')
    .then(response => response.json())
    .then(data => {
        let servicesHTML = "<ul>";
        data.services.forEach(service => {
            servicesHTML += `<li>${service}</li>`;
        });
        servicesHTML += "</ul>";
        document.getElementById("services-list").innerHTML = servicesHTML;
        let doctorsHTML = "";
        data.doctors.forEach(doctor => {
            doctorsHTML += `
                <div class="doctor-card">
                    <h3>${doctor.name}</h3>
                    <p>Specialty: ${doctor.specialty}</p>
                    <p>Availability: ${doctor.availability}</p>
                </div>
            `;
        });
        document.getElementById("doctors-list").innerHTML = doctorsHTML;
    })
    .catch(error => console.error('Error loading data:', error));