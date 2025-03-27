const API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', init);
document.getElementById('appointmentForm').addEventListener('submit', createAppointment);
document.getElementById('doctorForm').addEventListener('submit', addDoctor);
document.getElementById('doctors-list').addEventListener('click', handleDoctorActions);

function init() {
    let servicesData = null;
    let doctorsData = null;
    let requestsCompleted = 0;
    let errorOccurred = false;
  
    function handleCompletion() {
      if (requestsCompleted === 2 && !errorOccurred) {
        document.getElementById('services-list').innerHTML = 
          `<ul>${servicesData.map(s => `<li>${s}</li>`).join('')}</ul>`;
        
        document.getElementById('doctors-list').innerHTML = doctorsData.map(d => `
          <div class="doctor-card" data-id="${d.id}">
            <h3>${d.name} <span class="availability ${d.availability.replace(' ', '-')}">${d.availability}</span></h3>
            <p>Specialty: ${d.specialty}</p>
            <button class="delete-btn" data-action="delete">Delete</button>
          </div>
        `).join('');
  
        document.getElementById('doctor').innerHTML = doctorsData
          .filter(d => d.availability === 'Available')
          .map(d => `<option value="${d.id}">${d.name}</option>`);
      }
    }
  
    function handleError() {
      if (!errorOccurred) {
        errorOccurred = true;
        alert('Error loading data');
      }
    }
  
    fetch(`${API}/services`)
      .then(response => {
        if (!response.ok) throw new Error('Service error');
        return response.json();
      })
      .then(data => {
        servicesData = data;
        requestsCompleted++;
        handleCompletion();
      })
      .catch(handleError);
  
    fetch(`${API}/doctors`)
      .then(response => {
        if (!response.ok) throw new Error('Doctors error');
        return response.json();
      })
      .then(data => {
        doctorsData = data;
        requestsCompleted++;
        handleCompletion();
      })
      .catch(handleError);
  }

  function handleDoctorActions(e) {
    const card = e.target.closest('.doctor-card');
    if(!card) return;
  
    const id = card.dataset.id;
    
    if(e.target.dataset.action === 'delete') {
      fetch(`${API}/doctors/${id}`, { method: 'DELETE' })
        .then(() => card.remove())
        .catch(error => console.error('Delete error:', error));
    } else if(e.type === 'dblclick') {
      const newStatus = card.querySelector('.availability').textContent === 'Available' ? 'Away' : 'Available';
      fetch(`${API}/doctors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newStatus })
      })
      .then(() => {
        card.querySelector('.availability').textContent = newStatus;
      })
      .catch(error => console.error('Update error:', error));
    }
  }