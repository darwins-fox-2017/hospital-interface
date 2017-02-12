"use strict"

const readline = require('readline')
const fs       = require('fs')
const rl       = readline.createInterface({
  input:process.stdin,
  output:process.stdout
})

class Hospital {
  constructor(name, location, employees, patients) {
    this.name = name
    this.employees = employees
    this.patients = patients
    this.location = location
  }

  home(){
    console.log(`====================================================`);
    // console.log(`Welcome ${this.emName}. Your access level is: ${this.employees}`);
    console.log(`====================================================`);
    console.log(`Option:`);
    console.log(`1. List Patients`);
    console.log(`2. View Record`);
    console.log(`3. Add Record`);
    console.log(`4. Remove Recod`)
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

  writeToFile(){
    fs.writeFileSync(file, JSON.stringify(this.listData, null, "\t"), "utf-8")
  }

  inputToFile(){
    let idLast = 1
    if (typeof this.listData[this.listData -1] !== 'undefined') {
      idLast  = this.listData[this.listData.length -1].id + 1
    }

    this.listData.push({"id":idLast, "name":this.name, "position":this.position, "username":this.username, "password":this.password})
  }
}

const file     = 'employee.json'
const readFile = fs.readFileSync(file, 'utf-8')

let parseData  = []
if (readFile) {
  parseData = JSON.parse(readFile)
}
console.log(readFile);
let employees = new Employee(parseData)

let hospital = new Hospital()
    hospital.home()
