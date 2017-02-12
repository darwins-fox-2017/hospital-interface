"use strict"

const fs = require('fs')
let parseEmployeesData = JSON.parse(fs.readFileSync('employees.json', 'utf-8'))
let parsePatientsData = JSON.parse(fs.readFileSync('patients.json', 'utf-8'))

class Hospital {
  constructor(dataHospital) {
    this.name = dataHospital.name
    this.employees = dataHospital.employees
    this.patients = dataHospital.patients
    this.location = dataHospital.location
  }

  startApp() {
    console.log(`==================================================`);
    console.log(`Selamat datang di ${this.name}, ${this.location}`);
    console.log(`==================================================`);
    this.execute()
  }

  login() {
    let username = ''
    let password = ''
  }

  execute() {
    let newArr = []
    const readline = require('readline')
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> '});
    rl.question('Please enter username : ', (username) => {
      if ( username.length < 5 ) {
        console.log("Invalid username")
      } else {
        let employee = new Employee()
        employee.loadDataEmployee(username)
      }
    });
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

  loadDataEmployee(username) {
    return parseEmployeesData
  }

  writeToDataEmployee(data) {
    let saveArr = parseEmployeesData
    saveArr.push(data)
    fs.writeFileSync('employees.json', JSON.stringify(saveArr))
  }
}

let hospital = new Hospital({name : "Pagi Sore Fulus Hospital", employees : "", patients : "", location : "Jakarta"})
//hospital.startApp()
let employee = new Employee()
//employee.writeToDataEmployee({id : 2, name : "Ratna Mauli Santri", username : "ratna", password: "ratna", level : "Dokter", createDate : Date(), lastModified : Date()})
console.log(employee.loadDataEmployee())
