'use strict'

let readline = require('readline')
let jsonfile = require('jsonfile')
let readlineSync = require('readline-sync')

class Hospital {
  constructor(hospitalProperties) {
    this.name = hospitalProperties.name
    this.employees = []
    this.patients = hospitalProperties.patients
    this.location = hospitalProperties.location
  }

  parseEmployeeFromFile(){
    this.employees = jsonfile.readFileSync('employees.json')
  }

  writeToFile(){

  }

  login(username, password){
    let usernameFound = false
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].username.toLowerCase() == username.toLowerCase()) {
        usernameFound = true
        if (this.employees[i].password == password) {
          return {status: true,
                  msg: 'Login success',
                  user: this.employees[i]}
          console.log('login berhasil');
        } else {
          return {status: false, msg: 'Wrong password'}
          console.log('password salah');
        }
      }
    }
    return usernameFound == false ? {status: false, msg: 'Username not Found'} : {}
  }

  showOptionCommand(role){
    console.log(`What would you like to do ?`);
    console.log(`Opsions : `);
    switch (role) {
      case 'admin':
        console.log(`- view_employees`);
        console.log(`- remove_employee`);
        console.log(`- add_employee`);
        break;
      case 'doctor':
        console.log(`- view_patients`);
        console.log(`- add_patient`);
        console.log(`- remove_patient <patient_id>`);
        break
      default:

    }
  }



  viewEmployess(){
    console.log(`List of Employees`);
    for (let i = 0; i < this.employees.length; i++) {
      console.log(`${this.employees[i].id} -  ${this.employees[i].name} - ${this.employees[i].role}`);
    }
  }

  addEmployee(){
    let employeeProperties = {}
    let properties = ['nama', 'username', 'password', 'role']
    let index = 0
    // this.rl.on('line', (input) => {
    //   if (properties.length > index) {
    //     index++
    //   } else {
    //     this.rl.close()
    //   }
    // })

    // console.log('jalan : ', employeeProperties);
  }

  showWelcomeMessage(user){
    console.log('-----------------------------------');
    console.log(`Welcome, ${user.username}. Your access level is ${user.role}`);
    console.log('-----------------------------------');
  }

  createEmploye(employeeProperties){
    this.employees.push(employeeProperties)
  }

  createPatient(patientProperties){
    this.patients.push(patientProperties)
    console.log(this.patients);
  }
}

class Patient {
  constructor(id, name, diagnosis) {
    this.id = id
    this.name = name
    this.diagnosis = diagnosis
  }
}

class Employee {
  constructor(name, position, username, password) {
    this.name = name
    this.position = position
    this.username = username
    this.password = password
  }
}

class Auth extends Hospital{
  constructor() {

  }

  login(username, password){

  }
}

class Main {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.patientFileName = 'patients.json'
    this.employeesFileName = 'employees.json'
    this.hospital
    this.currentUser
  }

  createHostpital(hospitalProperties){
    this.hospital = new Hospital(hospitalProperties)
  }

  start(){
    // get data from DB
    this.hospital.parseEmployeeFromFile()
    let isLogin = false
    console.log('Welcome to JS Hospital');
    console.log('----------------------');
    let username = ''
    let password = ''
    console.log('Please enter your username : ');
    this.rl.prompt()

    let employeeProperties = {}
    let properties = ['nama', 'username', 'password', 'role']
    this.rl.on('line', (command) => {
      if (username.length == 0) {
        username = command
        console.log('Please enter your password : ');
      } else if (password.length == 0) {
        password = command
      } else if (username.length > 0 && password.length > 0) {

        if (isLogin == false) {
          // login
          let loginResult = this.hospital.login(username, password)
          if (loginResult.status) {
            // if login is succes
            this.currentUser = loginResult.user
            // show welcome message
            this.hospital.showWelcomeMessage(loginResult.user)
            // set is login to true
            isLogin = true
            // show command option
            this.hospital.showOptionCommand(loginResult.user.role)
          } else {
            // login fail
            console.log(loginResult.msg);
            this.rl.close()
          }
        }

        // after it logined
        this.executeCommand(command)
        if (command == 'add_employee') {
          console.log('hakaala');

        }
      }
    })
    // console.log(this.hospital.employees);
  }

  executeCommand(command){
    switch (command) {
      case 'view_employees':
        this.hospital.viewEmployess()
        break;
      case 'add_employee':

        this.hospital.addEmployee()


        console.log(employeeProperties);

        // this.rl.on('line', (employee) => {
        //   employeeProperties.name = employee
        // })
        break
      default:

    }
  }
}

let program = new Main()
let hospitalProperties = {
  name: 'Open RS',
  location: 'Semarang',
  employees: [],
  patients: []
}
//
// let employeeProperties = {
//   id: 1,
//   name: 'Diky Arga',
//   role: 'doctor'
// }
//
// let patientProperties = {
//   id: 1,
//   name: 'Abc Def G.',
//   diagnosa: 'Pilek'
// }
program.createHostpital(hospitalProperties)
// program.hospital.createEmploye(employeeProperties)
// program.hospital.createPatient(patientProperties)
program.start()
