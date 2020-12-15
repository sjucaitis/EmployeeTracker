
drop database if exists employeetrack_db;
create database employeetrack_db;
use employeetrack_db;

create table department(
    id integer unsigned auto_increment primary key,
    name varchar(30) unique not null
);

create table role(
    id integer unsigned auto_increment primary key,
    title varchar(30) unique not null,
    salary decimal unsigned not null,
    department_id int unsigned not null,
    index dep_ind (department_id),
    constraint foreign key (department_id) references department(id) on delete cascade
);

CREATE TABLE employee (
  id integer unsigned auto_increment primary key,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id integer unsigned not null,
  index role_ind (role_id),
  constraint fk_role foreign key (role_id) references role(id) on delete cascade,
  manager_id integer unsigned,
  index man_ind (manager_id),
  constraint fk_manager foreign key (manager_id) references employee(id) on delete set null
);

insert into department (name)
    values 
        ("Management"),
        ("Sales"), 
        ("Human Resources"), 
        ("Reception"), 
        ("Accounting"), 
        ("Customer Service");

insert into role (title, salary, department_id)
    values 
        ("Regional Manager", 56000, 1),
        ("Salesperson", 55000, 2), 
        ("Human Resources Team Leader", 57000, 3), 
        ("Receptionist", 28000, 4), 
        ("Head of Accounting", 46000, 5), 
        ("Account Representative", 36000, 6);
     
insert into employee (first_name, last_name, role_id, manager_id)
    values  
        ("Michael", "Scott", 1, null),
        ("Dwight", "Schrute", 2, 1), 
        ("Toby", "Flenderson", 3, 1), 
        ("Pam", "Beesley", 4, 1), 
        ("Angela", "Martin", 5, 1), 
        ("Kelly", "Kapoor", 6, 1), 
        ("Jim", "Halpert", 2, 1);