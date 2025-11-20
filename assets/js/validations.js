// rules for validating different form fields
const validationRules = {
    'employee-email': {
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address."
    },
    'employee-phone': {
        regex: /^[\d\s\-\+\(\)]{10,20}$/,
        message: "Phone number must be 10-20 characters."
    },
    'employee-position': {
        regex: /^[a-zA-Z0-9\s,.'-]{2,50}$/,
        message: "Position must be 2-50 characters long."
    },
    'exp-company': {
        regex: /^[a-zA-Z0-9\s,.'-]{2,20}$/,
        message: "Company must be 2-50 characters long."
    }
};

// shows or hides error messages for a field
function toggleError(field, show, message = '') {
    const errorDisplay = document.getElementById(`${field}-error`);
    const inputField = document.getElementById(field);

    if (!errorDisplay || !inputField) return;

    if (show) {
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
        inputField.style.borderColor = '#ef4444';
        inputField.style.backgroundColor = '#fee2e2';
    } else {
        errorDisplay.classList.add('hidden');
        inputField.style.borderColor = '#10b981';
        inputField.style.backgroundColor = '#d1fae5';
    }
}

// checks if a single field is valid or not
function validateField(field, value) {
    const rule = validationRules[field];

    if (rule && !rule.regex.test(value)) {
        toggleError(field, true, rule.message);
        return false;
    } else if (rule) {
        toggleError(field, false);
        return true;
    }
    return true;
}

// checks if the whole form is valid
function validateForm() {
    let isValid = true;
    
    for (const field in validationRules) {
        const inputField = document.getElementById(field);
        if (inputField && !validateField(field, inputField.value)) {
            isValid = false;
        }
    }
    
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const startDateInput = item.querySelector('.exp-start-date');
        const endDateInput = item.querySelector('.exp-end-date');
        
        if (startDateInput && endDateInput) {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            
            if (!validateDatePair(startDate, endDate, item)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}
// function toggle for the two span errors of the date
function toggleErrorForDateField(field, show, message = '') {
    if (!field) return;
    
    const experienceItem = field.closest('.experience-item');
    if (!experienceItem) return;
    
    const fieldClass = field.classList.contains('exp-start-date') ? 'exp-start-date' : 'exp-end-date';
    const errorId = fieldClass + '-error';
    const errorDisplay = experienceItem.querySelector(`#${errorId}`);
    
    if (!errorDisplay) return;
    
    if (show) {
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
        field.style.borderColor = '#ef4444';
        field.style.backgroundColor = '#fee2e2';
    } else {
        errorDisplay.classList.add('hidden');
        field.style.borderColor = '#10b981';
        field.style.backgroundColor = '#d1fae5';
    }
}
// function to validate start date < end date
function validateDatePair(startDate, endDate, experienceItem) {
    const startDateField = experienceItem.querySelector('.exp-start-date');
    const endDateField = experienceItem.querySelector('.exp-end-date');
    
    let isValid = true;
    
    toggleErrorForDateField(startDateField, false);
    toggleErrorForDateField(endDateField, false);
    
    if (!startDate || !endDate) {
        if (!startDate) {
            toggleErrorForDateField(startDateField, true, "Start date is required");
            isValid = false;
        }
        if (!endDate) {
            toggleErrorForDateField(endDateField, true, "End date is required");
            isValid = false;
        }
        return isValid;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
        toggleErrorForDateField(endDateField, true, "End date must be after start date");
        toggleErrorForDateField(startDateField, true, "Start date must be before end date");
        isValid = false;
    }
    
    return isValid;
}
// function to validate date
function validateDate() {
    const experienceItems = document.querySelectorAll('.experience-item');
    let allValid = true;
    
    experienceItems.forEach(item => {
        const startDateInput = item.querySelector('.exp-start-date');
        const endDateInput = item.querySelector('.exp-end-date');
        
        if (startDateInput && endDateInput) {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            
            if (!validateDatePair(startDate, endDate, item)) {
                allValid = false;
            }
        }
    });
    
    return allValid;
}

export { validateForm, validateField, toggleError, validateDate };