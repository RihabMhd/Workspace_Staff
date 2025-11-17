import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployee } from './store.js';
import { displayEmployees, clearEmployeeForm, populateForm, addExperienceField, getExperiences, displayRoomEmployees } from './ui.js';
import { validateForm, validateField } from './validations.js';

const employeeModal = document.getElementById('employeeModal');
const ajoutBtn = document.getElementById('AjoutBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const employeeForm = document.getElementById('employeeForm');
const addExperienceBtn = document.getElementById('addExperienceBtn');
const modalTitle = document.getElementById('modalTitle');

// this function runs when the page loads and sets everything up
function init() {
    refreshUI();
    setupEventListeners();
    addExperienceField();
}

// this sets up all the click listeners for buttons and stuff
function setupEventListeners() {
    ajoutBtn.addEventListener('click', openAddEmployeeModal);
    closeModalBtn.addEventListener('click', closeEmployeeModal);
    cancelBtn.addEventListener('click', closeEmployeeModal);
    
    employeeModal.addEventListener('click', (e) => {
        if (e.target === employeeModal) {
            closeEmployeeModal();
        }
    });

    employeeForm.addEventListener('submit', handleFormSubmit);

    addExperienceBtn.addEventListener('click', () => {
        addExperienceField();
    });

    const validationFields = ['employee-name', 'employee-email', 'employee-phone'];
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
        photo: document.getElementById('employee-photo').value.trim(),
        experiences: getExperiences()
    };

    if (employeeId) {
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

// refreshes the page to show all employees and rooms
function refreshUI() {
    const unassignedEmployees = getEmployees();
    displayEmployees(unassignedEmployees);
    const rooms = ['Conference Room', 'Reception', 'Security Room', 'Server Room', 'Staff Room', 'Archives Room'];
    rooms.forEach(room => {
        displayRoomEmployees(room);
    });
}

// makes sure the init function runs when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}