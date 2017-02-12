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
    this.employeesFileName = 'employees.json'
    this.patientsFileName = 'patients.json'
  }

  parseEmployeeFromFile(){
    this.employees = jsonfile.readFileSync(this.employeesFileName)
  }

  writeToFile(fileType){
    switch (fileType) {
      case 'employees':
        jsonfile.writeFileSync(this.employeesFileName, this.employees)
        break;
      case 'patients':
        jsonfile.writeFileSync(this.patientsFileName, this.patients)
        break;
      default:
    }
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
    console.log(`- logout`);
  }

  removeEmployee(id){
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id == id) {
        this.employees.splice(i, 1)
        return {status: true, msg: 'Removed'}
      }
    }
    return {status: false, msg: 'Failed while removing ): '}
  }

  viewEmployess(){
    console.log(`List of Employees`);
    for (let i = 0; i < this.employees.length; i++) {
      console.log(`${this.employees[i].id} -  ${this.employees[i].name} - ${this.employees[i].role}`);
    }
  }

  nextId(){
    return this.employees[this.employees.length - 1].id + 1
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

class Diagnosa {
  constructor() {
    this.diagnosa = ''
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
    let nextQuestion = ''
    let nextQuestionType = ''

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
            this.hospital.showWelcomeMessage(this.currentUser.name)
            // set is login to true
            isLogin = true
            // show command option
            this.hospital.showOptionCommand(this.currentUser.role)
          } else {
            // login fail
            console.log(loginResult.msg);
            this.rl.close()
          }
        }

        // after it logined

        // Nexer block
        switch (nextQuestionType.split(':')[0]) {
          case 'add_employee':
            switch (nextQuestionType.split(':')[1]) {
              case 'name':
                employeeProperties.id = this.hospital.nextId()
                employeeProperties.name = command
                nextQuestionType = 'add_employee:role'
                console.log('set the role : ');
                break;
              case 'role':
                employeeProperties.role = command
                nextQuestionType = 'add_employee:username'
                console.log('set the username >');
                break;
              case 'username':
                employeeProperties.username = command
                nextQuestionType = 'add_employee:password'
                console.log('set the password >');
                break;
              case 'password':
                employeeProperties.password = command
                console.log(employeeProperties.id );
                this.hospital.employees.push(employeeProperties)
                this.hospital.writeToFile('employees')
                console.log(`Employee saved! with name : ${employeeProperties.name}`);
                // console.log(this.hospital.employees);
                this.hospital.showOptionCommand(this.currentUser.role)
                nextQuestionType = ''
                break;
              default:
            }
            break;
            case 'remove_employee':
              if (nextQuestionType.split(':')[1] == 'id') {
                let removeResult = this.hospital.removeEmployee(command)
                if (removeResult.status) {
                  console.log(`${removeResult.msg}`);
                  this.hospital.showOptionCommand(this.currentUser.role)
                  nextQuestionType = ''
                }
              }
              break;
          default:

        }

        // this.executeCommand(command)
        // First steper
        switch (command) {
          case 'add_employee':
            nextQuestion = 'name >'
            nextQuestionType = 'add_employee:name'
            console.log(nextQuestion);
            this.rl.setPrompt(nextQuestion)
            break;
          case 'view_employees':
            this.hospital.viewEmployess()
            this.hospital.showOptionCommand(this.currentUser.role)
            break;
          case 'remove_employee':
            nextQuestionType = 'remove_employee:id'
            console.log('remove employee with id ? >');
            break;
          default:

        }
      }
    })
    // console.log(this.hospital.employees);
  }

  executeCommand(command){
    switch (command) {
      case 'view_employees':

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
