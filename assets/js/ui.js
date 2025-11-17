import { getEmployees, unassignEmployeeFromRoom } from './store.js';

// displays all the employees on the page
function displayEmployees(employees) {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';

    if (employees.length === 0) {
        employeeList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No unassigned employees</p>';
        return;
    }

    employees.forEach(emp => {
        const empElement = document.createElement('div');
        empElement.classList.add('employee-card');
        empElement.setAttribute('data-id', emp.id);

        const photoUrl = emp.photo;

        empElement.innerHTML = `
            <div class="employee-header">
                <img src="${photoUrl}" alt="${emp.name}" class="employee-photo" />
                <div>
                    <h3>${emp.name}</h3>
                    <p><strong>Rôle :</strong> ${emp.role}</p>
                </div>
            </div>
            ${emp.experiences && emp.experiences.length > 0 ? `
                <div class="experiences">
                    <strong>Expériences Professionnelles :</strong>
                    <ul>
                        ${emp.experiences.map(exp => `
                            <li>
                                <strong>${exp.title}</strong> — ${exp.company} (${exp.duration})
                                <br>${exp.description}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        employeeList.appendChild(empElement);
    });
}

// display all the employees in one room
function displayRoomEmployees(room) {
    const roomContainer = document.getElementById(`room-${room}`);
    if (!roomContainer) return;

    const employeesInRoom = getEmployees().filter(emp => emp.room === room);

    roomContainer.innerHTML = '';

    employeesInRoom.forEach(emp => {
        const empElement = document.createElement('div');
        empElement.classList.add('employee-card');
        empElement.setAttribute('data-id', emp.id);

        empElement.innerHTML = `
            <div class="employee-header">
                <img src="${emp.photo}" alt="${emp.name}" class="employee-photo" />
                <div>
                    <h3>${emp.name}</h3>
                    <p><strong>Rôle :</strong> ${emp.role}</p>
                </div>
                <button class="buttonAssigning unassign-btn" data-employee-id="${emp.id}">x</button>
            </div>
        `;

        const unassignBtn = empElement.querySelector('.unassign-btn');
        unassignBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            unassignEmployeeFromRoom(emp.id);
            displayRoomEmployees(room);
            
            const unassignedEmployees = getEmployees().filter(e => !e.room);
            displayEmployees(unassignedEmployees);
        });

        roomContainer.appendChild(empElement);
    });
}

// fills the form with employee data when editing
function populateForm(employee) {
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('employee-name').value = employee.name;
    document.getElementById('employee-role').value = employee.role;
    document.getElementById('employee-email').value = employee.email;
    document.getElementById('employee-phone').value = employee.telephone;
    document.getElementById('employee-photo').value = employee.photo || '';

    if (employee.photo) {
        const preview = document.getElementById('photo-preview');
        const previewImg = document.getElementById('photo-preview-img');
        previewImg.src = employee.photo;
        preview.classList.remove('hidden');
    }

    clearExperiences();

    if (employee.experiences && employee.experiences.length > 0) {
        employee.experiences.forEach(exp => {
            addExperienceField(exp);
        });
    } else {
        addExperienceField();
    }
}

// clears all the fields in the employee form
function clearEmployeeForm() {
    const form = document.getElementById('employeeForm');
    form.reset();
    document.getElementById('employee-id').value = '';
    clearExperiences();

    const preview = document.getElementById('photo-preview');
    if (preview) {
        preview.classList.add('hidden');
    }

    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.add('hidden');
    });

    document.querySelectorAll('input, textarea').forEach(input => {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    });
}

// adds a new experience field to the form
function addExperienceField(experienceData = null) {
    if (!window.experienceCounter) {
        window.experienceCounter = 0;
    }
    window.experienceCounter++;
    const container = document.getElementById('experiencesContainer');

    const experienceItem = document.createElement('div');
    experienceItem.classList.add('experience-item');
    experienceItem.setAttribute('data-exp-id', window.experienceCounter);

    experienceItem.innerHTML = `
        <div class="experience-item-header">
            <h4>Experience #${window.experienceCounter}</h4>
            <button type="button" class="remove-experience-btn" onclick="removeExperience(${window.experienceCounter})">Remove</button>
        </div>
        
        <div class="form-group">
            <label>Company</label>
            <input type="text" class="exp-company" value="${experienceData?.company || ''}" required>
        </div>
        
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" class="exp-title" value="${experienceData?.title || ''}" required>
        </div>
        
        <div class="form-group">
            <label>Duration</label>
            <input type="text" class="exp-duration" value="${experienceData?.duration || ''}" placeholder="e.g., 2020-2023 or 3 years">
        </div>
        
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-description" rows="3">${experienceData?.description || ''}</textarea>
        </div>
    `;

    container.appendChild(experienceItem);
}

// removes an experience field from the form
function removeExperience(expId) {
    const experienceItem = document.querySelector(`[data-exp-id="${expId}"]`);
    if (experienceItem) {
        experienceItem.remove();
    }
}

// clears all experience fields from the form
function clearExperiences() {
    const container = document.getElementById('experiencesContainer');
    container.innerHTML = '';
    window.experienceCounter = 0;
}

// gets all the experience data from the form
function getExperiences() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');

    experienceItems.forEach(item => {
        const company = item.querySelector('.exp-company').value.trim();
        const title = item.querySelector('.exp-title').value.trim();
        const duration = item.querySelector('.exp-duration').value.trim();
        const description = item.querySelector('.exp-description').value.trim();

        if (company || title) {
            experiences.push({
                company,
                title,
                duration,
                description
            });
        }
    });

    return experiences;
}

window.removeExperience = removeExperience;

export { displayEmployees, clearEmployeeForm, populateForm, addExperienceField, getExperiences, displayRoomEmployees };