//global variables and required dbs

const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { updateEmployeeRole, updateEmployeeManager } = require("./db");
const consoleTable = require("console.table");

init();

// Displays logo & loads porompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  initializeTracker();
}

// display prompts
async function initializeTracker() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        }, 
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        }, 
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLE"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // switch statement based on user choice (calls appropriate function)
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "VIEW_ROLE":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateManager();
    default:
      return quit();
  }
}
//View Employees (test complete) 
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  initializeTracker();
}

//View Departments (test complete)
async function viewDepartments() {
  const departments = await db.findAllDepartments();

  console.log("\n");
  console.table(departments);

  initializeTracker();
}

//Add Departments (test complete)
async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ]);

  await db.createDepartment(department);

  console.log(`Added ${department.name} to the database`);


  initializeTracker();
}

async function removeDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message:
      "Which department would you like to remove?",
    choices: departmentChoices
  });

  await db.removeDepartment(departmentId);

  console.log(`Removed department from the database`);

  initializeTracker();
}



//View employees by department (test complete)
async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "For which department would you like to view all employees?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  initializeTracker();
}

//View employees by manager (test complete)
async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "For which employee would you like to see all direct reports?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("This employee has no direct reports");
  } else {
    console.table(employees);
  }

  initializeTracker();
}

//Remove employee from db (test complete)
async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  initializeTracker();
}

//Add employee (test complete)
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));

    const { roleId } = await prompt({
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: roleChoices
    });

    employee.role_id = roleId;
  
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    managerChoices.unshift({ name: "None", value: null });

    const { managerId } = await prompt({
      type: "list",
      name: "managerId",
      message: "Who is this employee's manager?",
      choices: managerChoices
    });
  
  employee.manager_id = managerId;

  await db.createEmployee(employee);
  console.log("Added employee to the database");

  initializeTracker();
};

//Add role (tested)
async function addRole() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What role would you like to add?"
    },
    {
      name: "salary",
      message: "What is the salary for this role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "In which department does this role belong?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);
  console.log("Added role to the database");
  initializeTracker();
};

function quit() {
  console.log("You have left the employee tracker");
  process.exit();
}

// View all Roles
async function viewRoles() {
  const roles = await db.findAllRoles();
  
  console.log("\n");
  console.table(roles);

  initializeTracker();
}

// Update role // tested
async function updateRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Whose role would you like to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  initializeTracker();
}

// Update manager // tested

async function updateManager() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Whose manager would you like to update?",
      choices: employeeChoices
    }
  ]);

  const managers = await db.findAllPossibleManagers(employeeId);

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Who is this employee's manager?",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeId, managerId);

  console.log("Updated employee's manager");

  initializeTracker();
}