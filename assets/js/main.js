import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployee, loadEmployees, canAccess, assignEmployeeToRoom } from './store.js';
import { displayEmployees, clearEmployeeForm, populateForm, addExperienceField, getExperiences, displayRoomEmployees } from './ui.js';
import { validateForm, validateField } from './validations.js';

const rooms = ['Conference Room', 'Reception', 'Security Room', 'Server Room', 'Staff Room', 'Archives Room'];
const employeeModal = document.getElementById('employeeModal');
const ajoutBtn = document.getElementById('AjoutBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const employeeForm = document.getElementById('employeeForm');
const addExperienceBtn = document.getElementById('addExperienceBtn');
const modalTitle = document.getElementById('modalTitle');
const roomModal = document.getElementById('roomModal');
const addBtns = document.querySelectorAll('.add-btn');
const closeRoom = document.getElementById('closeRoomModal');
const detail = document.getElementById("employeeDetailModal");
const closeDetail = document.getElementById('closeDetailModal');
const list = document.querySelector(".UnassignedEmployeeList");
const search = document.getElementById('search');
const automaticAssign = document.getElementById('automatic');
const toShowModalDetail = document.querySelectorAll('.toshowModal')

let selectedRoom = null;

// this function runs when the page loads and sets everything up
function init() {
    loadEmployees();
    refreshUI();
    setupEventListeners();
    addExperienceField();
}

// this sets up all the click listeners for buttons and stuff
function setupEventListeners() {
    ajoutBtn.addEventListener('click', openAddEmployeeModal);
    closeModalBtn.addEventListener('click', closeEmployeeModal);
    cancelBtn.addEventListener('click', closeEmployeeModal);
    closeRoom.addEventListener('click', closeRoomModal);
    closeDetail.addEventListener('click', closeDetailModal);

    automaticAssign.addEventListener('click', () => {
        const employees = getEmployees();
        assignAutomatically(employees);
    });

    list.addEventListener("click", e => {
        if (e.target.classList.contains("assign-btn")) {
            e.stopPropagation();
            const card = e.target.closest(".employee-card");
            if (!card) return;

            const empId = card.dataset.id;
            assignEmployeeToRoom(empId, selectedRoom);
            closeRoomModal();
            refreshUI();
            return;
        }
    });

    toShowModalDetail.forEach((m) => {
        m.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.classList.contains('edit-btn') ||
                e.target.classList.contains('delete-btn') ||
                e.target.classList.contains('assign-btn')) {
                return;
            }

            const card = e.target.closest(".employee-card");
            if (!card) return;

            const empId = card.dataset.id;
            const emp = getEmployee(empId);
            if (emp) {
                openEmployeeDetail(emp);
            }
        })
    })

    addBtns.forEach((addBtn) => {
        addBtn.addEventListener('click', () => {
            selectedRoom = addBtn.dataset.room;
            openRoomModal();
        });
    });

    search.addEventListener('input', () => {
        const searchInput = search.value.toLowerCase().trim();
        const unassignedEmployees = getEmployees().filter(emp => !emp.room);
        let filtered = unassignedEmployees.filter(emp =>
            emp.name.toLowerCase().includes(searchInput) ||
            emp.role.toLowerCase().includes(searchInput)
        );
        displayEmployees(filtered);
    })

    employeeForm.addEventListener('submit', handleFormSubmit);

    addExperienceBtn.addEventListener('click', () => {
        addExperienceField();
    });

    const validationFields = ['employee-name', 'employee-email', 'employee-phone', 'exp-company'];
    validationFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', (e) => {
                validateField(fieldId, e.target.value);
            });
        }
    });

    const photoInput = document.getElementById('employee-photo');
    if (photoInput) {
        photoInput.addEventListener('input', handlePhotoPreview);
    }

    const employeeList = document.getElementById('employeeList');
    employeeList.addEventListener('click', handleEmployeeListClick);
}

// opens the modal when you want to add a new employee
function openAddEmployeeModal() {
    modalTitle.textContent = 'Add Employee';
    clearEmployeeForm();
    addExperienceField();
    employeeModal.classList.add('active');
}

// shows the obligatory zones in red if they are empty
function zoneObligatoireRed() {
    const reception = document.getElementById('room-Reception');
    const receptionDiv = document.querySelector('[data-room="Reception"]');
    const security = document.getElementById('room-Security Room');
    const securityDiv = document.querySelector('[data-room="Security Room"]');
    const server = document.getElementById('room-Server Room');
    const serverDiv = document.querySelector('[data-room="Server Room"]');
    const archives = document.getElementById('room-Archives Room');
    const archivesDiv = document.querySelector('[data-room="Archives Room"]');

    if (reception.innerHTML.trim() !== '') {
        receptionDiv.classList.remove("zone-obligatoire");
    } else {
        receptionDiv.classList.add("zone-obligatoire");
    }

    if (security.innerHTML.trim() !== '') {
        securityDiv.classList.remove("zone-obligatoire");
    } else {
        securityDiv.classList.add("zone-obligatoire");
    }

    if (server.innerHTML.trim() !== '') {
        serverDiv.classList.remove("zone-obligatoire");
    } else {
        serverDiv.classList.add("zone-obligatoire");
    }

    if (archives.innerHTML.trim() !== '') {
        archivesDiv.classList.remove("zone-obligatoire");
    } else {
        archivesDiv.classList.add("zone-obligatoire");
    }
}
// opens the modal to edit an existing employee
function openEditEmployeeModal(employeeId) {
    const employee = getEmployee(employeeId);
    if (!employee) return;

    modalTitle.textContent = 'Edit Employee';
    clearEmployeeForm();
    populateForm(employee);
    employeeModal.classList.add('active');
}

// closes the modal window
function closeEmployeeModal() {
    employeeModal.classList.remove('active');
    clearEmployeeForm();
    search.value = '';
}

// opens the modal to choose an employee to put in a room
function openRoomModal() {
    const employees = getEmployees();
    modalTitle.textContent = `Choose an Employee for ${selectedRoom}`;

    list.innerHTML = "";

    const eligibleEmployees = employees.filter(emp =>
        !emp.room && canAccess(emp.role, selectedRoom)
    );

    if (eligibleEmployees.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 20px;">No eligible employees available for this room.</p>';
    } else {
        eligibleEmployees.forEach((emp) => {
            list.innerHTML += `
                <div class="employee-card" style="margin:10px" data-id="${emp.id}">
                    <div class="employee-header">
                        <img src="${emp.photo}" alt="${emp.name}" class="employee-photo" />
                        <div>
                            <h3 class="employee-name">${emp.name}</h3>
                            <p><strong>Rôle :</strong> ${emp.role}</p>
                        </div>
                    </div>
                    <button class="buttonAssigning assign-btn">Assign to this room</button>
                </div>
            `;
        });
    }

    roomModal.classList.add('active');
}

// closes the modal window
function closeRoomModal() {
    roomModal.classList.remove('active');
}

// opens the modal to show the details
function openEmployeeDetail(emp) {
    const content = document.getElementById("employeeDetailContent");

    const experiencesHTML = emp.experiences.map(exp => `
        <div class="experience-item">
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="exp-company" value="${exp.company}" disabled>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="exp-title" value="${exp.title}" disabled>
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" class="exp-start-date" value="${exp.startDate || ''}" disabled>
            </div>

            <div class="form-group">
                <label>End Date</label>
                <input type="date" class="exp-end-date" value="${exp.endDate || ''}" disabled>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="exp-description" disabled>${exp.description}</textarea>
            </div>
        </div>
    `).join('');

    content.innerHTML = `
        <form id="employeeForm">
            <div class="modal-body">
                <input type="hidden" id="employee-id">
                
                 ${emp.room ? `
                    <div class="form-group">
                        <label for="employee-name">Location</label>
                        <input type="text" id="employee-name" required value="${emp.room}" disabled>
                    </div>
                ` : ''}

                <div class="form-group">
                    <div id="photo-preview" class="photo-preview">
                        <img id="photo-preview-img" src="${emp.photo}" alt="Preview">
                    </div>
                </div>

                <div class="form-group">
                    <label for="employee-name">Full Name </label>
                    <input type="text" id="employee-name" required value="${emp.name}" disabled>
                </div>

                <div class="form-group">
                    <label for="employee-role">Role/Position </label>
                    <input type="text" id="employee-role" required value="${emp.role}" disabled>
                </div>

                <div class="form-group">
                    <label for="employee-email">Email </label>
                    <input type="email" id="employee-email" required value="${emp.email}" disabled>
                </div>

                <div class="form-group">
                    <label for="employee-phone">Phone </label>
                    <input type="tel" id="employee-phone" required value="${emp.telephone}" disabled>
                </div>

                <div class="experiences-section">
                    ${experiencesHTML}
                </div>
            </div>
        </form>
    `;

    detail.classList.add("active");
}

// closes the modal window
function closeDetailModal() {
    detail.classList.remove('active');
}

// shows a preview of the photo when you put in a URL
function handlePhotoPreview(e) {
    const url = e.target.value.trim();
    const preview = document.getElementById('photo-preview');
    const previewImg = document.getElementById('photo-preview-img');

    if (url) {
        previewImg.src = url;
        preview.classList.remove('hidden');

        previewImg.onerror = () => {
            preview.classList.add('hidden');
        };
    } else {
        preview.classList.add('hidden');
    }
}

// handles what happens when you submit the form
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        alert('Please fix the validation errors before submitting.');
        return;
    }
 

    const employeeId = document.getElementById('employee-id').value;
    const employeeData = {
        id: employeeId || Date.now().toString(),
        name: document.getElementById('employee-name').value.trim(),
        role: document.getElementById('employee-role').value.trim(),
        email: document.getElementById('employee-email').value.trim(),
        telephone: document.getElementById('employee-phone').value.trim(),
        photo: document.getElementById('employee-photo').value.trim() || 'https://tse3.mm.bing.net/th/id/OIF.HTOXx5VbZKaS0rjZtUiXvw?rs=1&pid=ImgDetMain&o=7&rm=3',
        experiences: getExperiences(),
        room: null
    };

    if (employeeId) {
        const existingEmployee = getEmployee(employeeId);
        if (existingEmployee && existingEmployee.room) {
            employeeData.room = existingEmployee.room;
        }
        updateEmployee(employeeData);
    } else {
        addEmployee(employeeData);
    }

    closeEmployeeModal();
    refreshUI();
}

// handles clicks on employee cards like edit and delete buttons
function handleEmployeeListClick(e) {
    const card = e.target.closest('.employee-card');
    if (!card) return;

    const employeeId = card.getAttribute('data-id');

    if (e.target.classList.contains('edit-btn')) {
        openEditEmployeeModal(employeeId);
    } else if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(employeeId);
            refreshUI();
        }
    }
}

// function to assign each employee to his room automatically
export function assignAutomatically(employees) {
    employees.forEach(emp => {
        const allowedRoom = rooms.filter(room => canAccess(emp.role, room));
        const room = allowedRoom[Math.floor(Math.random() * allowedRoom.length)];
        if (room) {
            assignEmployeeToRoom(emp.id, room);
        }
        displayRoomEmployees(room);
        zoneObligatoireRed();
        displayEmployees(getEmployees().filter(emp => !emp.room));
    });
}

// refreshes the page to show all employees and rooms
function refreshUI() {
    const unassignedEmployees = getEmployees().filter(emp => !emp.room);
    displayEmployees(unassignedEmployees);

    rooms.forEach(room => {
        displayRoomEmployees(room);
    });
    zoneObligatoireRed();
}

// makes sure the init function runs when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}