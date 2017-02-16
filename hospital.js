"use strict"

const readline = require('readline')
const fs       = require('fs')
const rl       = readline.createInterface({
  input:process.stdin,
  output:process.stdout
})

class Hospital {
  constructor(name, location) {
    this.name = name
    this.employeesPosition = ["Doctor","Admin","Receptionist","OB"]
    this.employeesName = ["Eri","Budi","Raisa","Sayuti"]
    this.username = ["doctor","admin","recep","ob"]
    this.password = ["doctor","admin","recep","ob"]
    this.patients = ["dani","dono","danu","dini"]
    this.diagnose = ["demam","flu","sakit perut","migran"]
    this.id
  }

  welcome(){
    console.log(`=====================================`);
    console.log(`Welcome too ${this.name} Hospital ${this.location}`);
    console.log(`======================================`);
    this.login()
  }

  home(){
    console.log(`====================================================`);
    console.log(`Welcome ${this.employeesName}. Your access level is: ${this.employeesPosition}`);
    console.log(`====================================================`);
    console.log(`Option:`);
    console.log(`1. List Patients`);
    console.log(`2. View Record`);
    console.log(`3. Add Record`);
    console.log(`4. Remove Recod`)
    this.getProcess()
  }

  login(){
    rl.question(`Please enter your username\n`, (answer) => {
      if (this.username.indexOf(answer) !== -1) {
        this.id = this.username.indexOf(answer)
        this.getPassword()
      }else {
        this.login()
      }
    })
  }

  getPassword(){
    rl.question(`Please enter your password\n`, (answer)=>{
      if (answer === this.password[this.id]) {
        this.employeesName = this.employeesName[this.id]
        this.employeesPosition = this.employeesPosition[this.id]
        this.home()
      }else {
        this.getPassword()
      }
    })
  }

  list(){
    console.log(`Id | Name   | Diagnose`);
    console.log(`======================`);
    for (let i = 0; i < this.patients.length; i++) {
      console.log(`${i + 1}  | ${this.patients[i]}    | ${this.diagnose[i]}`);
    }
    this.home()
  }

  view(){
    rl.question(`Enter id patient : `, (answer) => {
      console.log(`Name : ${this.patients[answer - 1]}\nDiagnose : ${this.diagnose[answer - 1]}`);
      this.home()
    })
  }

  add(){
    rl.question(`Enter name & diagnose <ex: name, diagnose> : `, (answer)=>{
      let splitAnswer = answer.split(',')
      this.patients.push(splitAnswer[0])
      this.diagnose.push(splitAnswer[1])
      this.home()
    })
  }

  remove(){
    rl.question(`Enter id patients : `, (answer) => {
      this.patients.splice(answer-1, 1)
      this.diagnose.splice(answer-1, 1)
      this.home()
    })
  }

  getProcess(){
    rl.question(`What would you like to do ?`, (answer) => {
      switch (answer) {
        case "1":
          this.list()
          break;
        case "2":
          this.view()
          break;
        case "3":
          this.add()
          break;
        case "4":
          this.remove()
          break;
        default:
          console.log(`Please choose 1-4`);
          this.getProcess()
      }
    })
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

let hospital = new Hospital('Hacktiv8','Jakarta')
    hospital.login()
