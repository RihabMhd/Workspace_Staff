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

export const ROOM_CAPACITY = 5;


//localStorage
export function loadEmployees() {
    const data = localStorage.getItem("Employees");
    if (data) {
        employees = JSON.parse(data);
    } else {
        employees = [];
    }
    return employees;
}

export function SaveEmployees() {
    return localStorage.setItem('Employees', JSON.stringify(employees));
}


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
    SaveEmployees();
    return employee;
}

// updates an existing employee with new data
export function updateEmployee(employeeData) {
    const index = employees.findIndex(emp => emp.id === employeeData.id);
    if (index !== -1) {
        employees[index] = employeeData;
        SaveEmployees();
        return employees[index];
    }
    return null;
}

// removes an employee from the array by their id
export function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    SaveEmployees();
}

// assigns an employee to a room
export function assignEmployeeToRoom(employeeId, room) {
    const employee = getEmployee(employeeId);
    if (!employee) return false;

    if (!canAccess(employee.role, room)) return false;

    const roomCount = employees.filter(emp => emp.room === room).length;
    if (roomCount >= ROOM_CAPACITY) {
        alert("Room has reached maximum capacity (5 employees)");
        return false;
    }

    employee.room = room;
    SaveEmployees();
    return true;
}

// removes an employee from their assigned room
export function unassignEmployeeFromRoom(employeeId) {
    const employee = getEmployee(employeeId);
    if (employee) {
        employee.room = null;
        SaveEmployees();
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