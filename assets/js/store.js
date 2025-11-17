// array to store all the employees
let employees = [];

// returns all employees from the array
export function getEmployees() {
    return employees;
}

// finds and returns one employee by their id
export function getEmployee(id) {
    return employees.find(emp => emp.id === id);
}

// adds a new employee to the array
export function addEmployee(employee) {
    employees.push(employee);
    return employee;
}

// updates an existing employee with new data
export function updateEmployee(employeeData) {
    const index = employees.findIndex(emp => emp.id === employeeData.id);
    if (index !== -1) {
        employees[index] = employeeData;
        return employees[index];
    }
    return null;
}

// removes an employee from the array by their id
export function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
}