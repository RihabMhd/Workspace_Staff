# WorkSphere – Interactive Staff Management System

## Project Overview

WorkSphere is an interactive web application designed to visually manage personnel within a workspace. It enables administrators to organize employees on a dynamic floor plan while enforcing role-based access constraints.

## Main Objectives

- Add, move, and remove employees directly through an interactive interface.
- Enforce business rules: employees can only be placed in zones allowed for their role.
- Provide a smooth, responsive experience across desktop, tablet, and mobile devices.
- Centralize staff data and spatial visualization in one platform.

## Building Zones

The application contains six distinct zones:

1. **Conference Room** – Accessible to all roles  
2. **Reception** – Restricted to Receptionists  
3. **Server Room** – Restricted to IT Technicians  
4. **Security Room** – Restricted to Security Agents  
5. **Staff Room** – Accessible to all roles  
6. **Archives Room** – Restricted access (Cleaning staff excluded)

## Role-Based Access Rules

- **Receptionist**: Reception only  
- **IT Technician**: Server Room only  
- **Security Agent**: Security Room only  
- **Manager**: Access to all zones  
- **Cleaning Staff**: Access to all except Archives Room  
- **Other Roles**: Access to all non-restricted zones  

## Core Features

### Staff Management
- Add employees using a modal form.
- Employee profile includes:
  - Name  
  - Role  
  - Photo URL (with real-time preview)  
  - Email  
  - Phone  
  - Professional experience  
- Remove employees from zones (sent back to “Unassigned Staff”).
- Click an employee to view detailed profile.

### Zone Management
- “Add” button in each zone to assign eligible employees.
- “Remove” button on employee cards to unassign.
- Edit employee information from the unassigned list.
- Search and filter employees by name or role.
- Zones requiring mandatory staff show a warning color when empty.
- Capacity limits for each zone.
- Smooth animations and responsive layout.

### Additional Features
- Sidebar displaying unassigned employees.
- Real-time validation of zone restrictions.
- HTML and CSS validated via W3C tools.
- Deployment on GitHub Pages.

## Optional Bonus Features

- Drag & Drop movement between zones.
- Auto-save system using localStorage.
- Automatic reorganization respecting all rules.
- Default avatar when photo URL is missing.

## Technologies Used

- HTML5  
- CSS3 (Flexbox, Grid, animations)  
- JavaScript  
- Bootstrap  
- Git / GitHub  

## Responsive Breakpoints

**Portrait:**

- Desktop Large: > 1280px  
- Desktop Small: 1024px – 1279px  
- Tablet: 768px – 1023px  
- Mobile: ≤ 767px  

**Landscape:**

- Mobile: 768px – 1023px  
- Tablet: 1024px – 1279px  

