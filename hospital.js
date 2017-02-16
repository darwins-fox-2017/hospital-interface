'use strict'

let readline = require('readline')
let jsonfile = require('jsonfile')
let readlineSync = require('readline-sync')

class Hospital {
  constructor(hospitalProperties) {
    this.name = hospitalProperties.name
    this.employees = []
    this.patients = []
    this.location = hospitalProperties.location
    this.employeesFileName = 'employees.json'
    this.patientsFileName = 'patients.json'
  }

  parseEmployeeFromFile(){
    this.employees = jsonfile.readFileSync(this.employeesFileName)
    this.patients = jsonfile.readFileSync(this.patientsFileName)
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
        console.log(`- add_employee`);;
        break;
      case 'doctor':
        console.log(`- view_patients`);
        console.log(`- add_patient`);
        console.log(`- add_record <patient_id>`);
        console.log(`- remove_record <patient_id> <record_id>`);
        console.log(`- remove_patient <patient_id>`);
        break
      default:

    }
    console.log(`- logout`);
  }

  sayGoodBay(name){
    console.log(`Sampai jumpat ${name}`);
    console.log(`-------- BYE ------------`);
  }

  removeEmployee(id){
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id == id) {
        this.employees.splice(i, 1)
        this.writeToFile('employees')
        return {status: true, msg: 'Removed'}
      }
    }
    return {status: false, msg: 'Failed while removing ): '}
  }

  removePatient(id){
    for (let i = 0; i < this.patients.length; i++) {
      if (this.patients[i].id == id) {
        this.patients.splice(i, 1)
        this.writeToFile('patients')
        return {status: true, msg: 'Removed'}
      }
    }
    return {status: false, msg: 'Failed while removing ): '}
  }

  removeRecord(idPatient, idRecord){
    let searchResult = this.searchById('patients', idPatient)
    if (searchResult.isFound) {
      let searchRecordResult = this.searchRecord(searchResult.index, idRecord)
      if(searchRecordResult.status){
        this.patients[searchResult.index].records.splice(searchRecordResult.recordIndex, 1)
        this.writeToFile('patients')
        return {status: true, msg:'Record deleted'}
      } else {
        return {status: false, msg:'Record not found'}
      }
    } else {
      return {status: false, msg:'Patiend with id : ' + idPatient + ' not found'}
    }
  }

  searchRecord(indexPatient, idRecord){
    for (let i = 0; i < this.patients[indexPatient].records.length; i++) {
      if (this.patients[indexPatient].records[i].id == idRecord) {
        // this.patients[indexPatient].records.splice(i, 1)
        return {status: true, msg: 'Record found', recordIndex: i}
      }
    }
    return {status: false, msg: 'Record not found', recordIndex: null}
  }

  searchById(type, id){
    if (type == 'patients') {
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].id == id) {
          return {isFound: true, index: i}
        }
      }
    }

    return {isFound: false}
  }

  viewData(dataType){
    if (dataType == 'employees') {
      console.log(`List of Employees`);
      for (let i = 0; i < this.employees.length; i++) {
        console.log(`${this.employees[i].id} -  ${this.employees[i].name} - ${this.employees[i].role}`);
      }
    } else if (dataType == 'patients') {
      console.log(`List of Patients`);
      for (let i = 0; i < this.patients.length; i++) {
        console.log(`${this.patients[i].id} -  ${this.patients[i].name} `);
        if (this.patients[i].records.length > 0) {
          console.log('Medical record :');
          for (let j= 0; j < this.patients[i].records.length; j++) {
            console.log(`Diagnosa : ${this.patients[i].records[j].diagnosa}`);
          }
        }
      }
    }
  }

  nextIdOfRecord(idPatient){
    if (this.patients[idPatient].records.length > 0) {
      return this.patients[idPatient].records[this.patients[idPatient].records.length -1].id + 1
    } else {
      return 1
    }
  }

  nextId(type){
    switch (type) {
      case 'employees':

        return this.employees.length > 0 ? this.employees[this.employees.length - 1].id + 1 : 1
        break;
      case 'patients':
        return this.patients.length > 0 ? this.patients[this.patients.length - 1].id + 1 : 1
        break;
      default:
    }
  }

  addRecord(id, diagnosa){
    for (let i = 0; i < this.patients.length; i++) {
      if (this.patients[i].id == id) {
        this.patients[i].records.push(new Record(diagnosa, this.nextIdOfRecord(i)))
        return {status: true, msg: 'Record added!'}
      }
    }
    return {status:false, msg: 'Failed when adding record ): '}
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
    let patientProperties = {}
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

        // Nexer block
        switch (nextQuestionType.split(':')[0]) {
          case 'add_employee':
            switch (nextQuestionType.split(':')[1]) {
              case 'name':
                employeeProperties.id = this.hospital.nextId('employees')
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
            case 'add_patient':
              switch (nextQuestionType.split(':')[1]) {
                case 'name':
                  patientProperties.id = this.hospital.nextId('patients')
                  patientProperties.records = []
                  patientProperties.name = command
                  nextQuestionType = 'add_patient:age'
                  console.log(`${command} ages ? >`);
                  break;
                case 'age':
                  patientProperties.age = command
                  this.hospital.patients.push(patientProperties)
                  this.hospital.writeToFile('patients')

                  console.log(`Patient saved! with name : ${patientProperties.name}`);
                  this.hospital.showOptionCommand(this.currentUser.role)
                  nextQuestionType = ''
                  break;
                default:

              }
              break;
            case 'remove_patient':
              if (nextQuestionType.split(':')[1] == 'id') {
                let resultRemovePatient = this.hospital.removePatient(command)
                if (resultRemovePatient.status) {
                  console.log(`$resultRemovePatient.msg`);
                  this.hospital.showOptionCommand(this.currentUser.role)
                  nextQuestionType = ''
                }
              }

              break;
            case 'add_record':
              if (nextQuestionType.split(':')[1] == 'diagnosa') {
                let resultAddRecord = this.hospital.addRecord(nextQuestionType.split(':')[2], command)
                if (resultAddRecord.status) {
                  console.log(`${resultAddRecord.msg}`);
                  this.hospital.showOptionCommand(this.currentUser.role)
                  this.hospital.writeToFile('patients')
                  nextQuestionType = ''
                } else {
                  console.log(`${resultAddRecord.msg}`);
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
            this.hospital.viewData('employees')
            this.hospital.showOptionCommand(this.currentUser.role)
            break;
          case 'remove_employee':
            nextQuestionType = 'remove_employee:id'
            console.log('remove employee with id ? >');
            break;
          case 'view_patients':
            this.hospital.viewData('patients')
            this.hospital.showOptionCommand(this.currentUser.role)
            break;
          case 'add_patient':
            nextQuestion = 'name >'
            nextQuestionType = 'add_patient:name'
            console.log(nextQuestion);
            this.rl.setPrompt(nextQuestion)
            break;
          case 'remove_patient':
            nextQuestionType = 'remove_patient:id'
            console.log(`Remove Patient with id ? >`);
            break;
          case 'logout':
            this.hospital.sayGoodBay(this.currentUser.name)
            isLogin = false
            this.rl.close()
            break;
          default:

        }

        // Special case for argument patamater alike
        let commandParsed = command.split(' ')
        switch (commandParsed[0]) {
          case 'add_record':
            // console.log('------------', commandParsed[1]);
            if (commandParsed[1] == undefined) {
              console.log('You want to add record to ? repeat it please.');

            } else {
              nextQuestionType = 'add_record:diagnosa:' + commandParsed[1]
              nextQuestion = 'Diagnosa > '
              console.log(nextQuestion);
              this.rl.setPrompt(nextQuestion)
            }
            break;
          case 'remove_record':
            let removeRecordResult = this.hospital.removeRecord(commandParsed[1], commandParsed[2])
            if (removeRecordResult.status) {
              console.log(removeRecordResult.msg);
            } else {
              console.log(removeRecordResult.msg);
            }
            this.hospital.showOptionCommand(this.currentUser.role)
            nextQuestionType = ''
            break;
          default:
        }
      }
    })
    // console.log(this.hospital.employees);
  }
}

class Record {
  constructor(diagnosa, idRecord) {
    this.id = idRecord
    this.diagnosa = diagnosa
  }
}

let program = new Main()
let hospitalProperties = {
  name: 'Open RS',
  location: 'Semarang',
  employees: [],
  patients: []
}

program.createHostpital(hospitalProperties)
program.start()
