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
    return isValid;
}

export { validateForm, validateField, toggleError };