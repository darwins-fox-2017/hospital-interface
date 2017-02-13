let fs       = require('fs')
let readline = require('readline-sync')

class Hospital {
  constructor(name, location, employees, patients) {
    this.name      = name
    this.employees = employees
    this.patients  = patients
    this.location  = location
  }
}

class Patient {
  constructor(id, name, diagnosis) {
    this.id        = id
    this.name      = name
    this.diagnosis = diagnosis
  }
}

class Employee {
  constructor(name, position, username, password) {
    this.name     = namename
    this.position = position
    this.username = username
    this.password = password
  }
}

class HospitalApp {
  constructor() {
    this.hospital          = new Hospital('Lunatic', 'Subconsciousness', 200, 100)
    this._loggedInEmployee = null
  }
  
  fileHandler(option = 'read', fileName) {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, '[]')
    }
    switch (option) {
      case 'read':
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'))
        break;
      case 'write':
        return (text) => {
          fs.writeFileSync(filename, text, (err) => {
            if (err) {
              throw err
            }
          })
        }
        
    }
  }
  
  openingMessage() {
    return `Welcome to ${this.hospital.name}`+'\n_____________________________\n'
  }
  
  createEmployee(name,position,username,password) {
    let newEmployee     = new Employee(name, position, username, password)
    let oldEmployee     = this.fileHandler('read', 'employees.json')
    let prepareData     = this.fileHandler('write', 'employees.json') 
    oldEmployee.push(newEmployee)
    prepareData(oldEmployee)
  }
  
  getEmployees() {
    return this.fileHandler('read', 'employees.json')
  }
  
  getEmployee(index) {
    return this.getEmployee()[index]
  }
  
  login() {
    let username = readline.question('Please enter your username: ')
    let password = readline.question('Please enter your password: ')
      
    for (let i in this.getEmployees()) {
      let uname = this.getEmployee(i).username
      let pass  = this.getEmployee(i).password
      if (username === uname && password === pass) {
        if (this.getEmployee(i).position !== 'office-boy') {
          this.loggedInEmployee = this.getEmployee(i)
          this.appMenu()
        }
        console.log('We are sorry, but you have no access..')
      }
    }
  }
  
  appMenu() {
    console.log('_____________________________________________')
    console.log(`Welcome ${this.loggedInEmployee.name}, your access level is: ${this.loggedInEmployee.position}`)
    console.log('What would you like to do?')
    console.log('Options:')
    console.log('list_patients')
    console.log('view_record <patient_id>')
    console.log('add_record <patient_id> <complaining>')
    console.log('remove_record <patient_id>')
  }
}

let hospitalapp = new HospitalApp()

// hospitalapp.login()
hospitalapp.createEmployee('Danang', 'doctor', 'danang', 'admindanang')
