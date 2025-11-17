// array to store all the employees
let employees = [];

// define restricted rooms per role
export const roleRestrictions = {
    "Receptionist": ["Server Room", "Security Room"], 
    "IT Guy": ["Reception", "Security Room"],            
    "Security": ["Reception", "Server Room"],       
    "Manager": [],                                                  
    "Cleaning": ["Archives Room"],                               
    "Other": ["Reception", "Server Room", "Security Room", "Archives Room"] 
};

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

// assigns an employee to a room
export function assignEmployeeToRoom(employeeId, room) {
    const employee = getEmployee(employeeId);
    if (employee && canAccess(employee.role, room)) {
        employee.room = room;
        return true;
    }
    return false;
}

// removes an employee from their assigned room
export function unassignEmployeeFromRoom(employeeId) {
    const employee = getEmployee(employeeId);
    if (employee) {
        employee.room = null;
        return true;
    }
    return false;
}

// function to check access
export function canAccess(role, room) {
    if (!roleRestrictions.hasOwnProperty(role)) return false; 
    const restrictedRooms = roleRestrictions[role];
    return !restrictedRooms.includes(room);
}