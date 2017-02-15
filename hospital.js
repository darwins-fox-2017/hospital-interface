"use strict"

const fs = require('fs')
const readline = require('readline')
let parseEmployeesData = JSON.parse(fs.readFileSync('employees.json', 'utf-8'))
let parsePatientsData = JSON.parse(fs.readFileSync('patients.json', 'utf-8'))
const rl = readline.createInterface({input:process.stdin, output:process.stdout})
rl.prompt()

class Hospital {
  constructor(dataHospital) {
    this.name = dataHospital.name
    this.employees = dataHospital.employees
    this.patients = dataHospital.patients
    this.location = dataHospital.location
  }

  mainPage(username, level) {
    console.log()
    console.log(`====================================================`);
    console.log(`Selamat datang, ${username}`);
    console.log(`Access level : ${level.toUpperCase()}`);
    console.log(`====================================================`);
    console.log('Menu patients : ')
    console.log(`1. List Patients`)
    console.log(`2. View Patient Record`)
    console.log(`3. Add New Patient`)
    console.log(`4. Add New Patient Record`)
    console.log(`5. Remove Patient Record`)
    console.log(`====================================================`);
    console.log(`Menu Employees : `)
    console.log(`6. List Employees`)
    console.log(`7. Add Employee Record`)
    console.log(`8. Remove Employee Record`)
    rl.question('Choose menu (1-8) : ', (answer) => {
      switch (answer) {
        case "1":
          this.listPatients(username,level)
          break
        case "2":
          this.viewRecord(username, level)
          break
        case "3":
          this.addNewPatient(username, level)
          break
        case "4":
          this.addRecord(username, level)
          break
        case "5":
          this.removeRecord(username, level)
          break
        case "6":
          this.listEmployees(username, level)
          break
        case "7":
          this.addEmployee(username, level)
          break
        case "8":
          this.removeEmployee(username, level)
          break
        default:
          this.mainPage
          break
      }
    })
  }

  listPatients(username,level) {
    this.patients = Patient.loadDataPatient()
    console.log(`====================== LIST PATIENTS ======================`)
    console.log(`No.     | Patient Name | Last Medical Record | Last visited`);
    for (let i = 0; i < this.patients.length; i++) {
      console.log(`${i+1}.      | ${this.patients[i].patient_name} | ${this.patients[i].medical_record[this.patients[i].medical_record.length-1].diagnosis}      | ${this.patients[i].createDate}`)
    }
    rl.question(`Back to main menu (yes/y) : `, (answer) => {
      if (answer === "yes" || answer === 'y') {
        return this.mainPage(username, level)
      } else {
        console.log("Invalid command")
      }
    })
  }

  viewRecord(username,level) {
    this.patients = Patient.loadDataPatient()
    console.log(`====================== VIEW PATIENT RECORD BY ID ======================`)
    rl.question(`Search by ID patient : `, (answer) => {
      this.patients = Patient.loadDataPatient()
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].id === Number(answer)) {
          console.log(`${this.patients[i].id}. ${this.patients[i].patient_name}`)
          let medicalRecord = this.patients[i].medical_record
          console.log(`No.     | Diagnosis | Last Record`);
          for (let j = 0; j < medicalRecord.length; j++) {
            console.log(`${medicalRecord[j].record_id}.      | ${medicalRecord[j].diagnosis}     | ${medicalRecord[j].signDate}`)
          }
        }
      }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  addNewPatient(username, level) {
    this.patients = Patient.loadDataPatient()
    console.log(`====================== ADD PATIENT RECORD ======================`)
    rl.question(`Add new patient <name> <diagnosis> : `, (answer) => {
      let dataRow = answer.split(' ')
      let temp = {}
      temp.id = this.patients.length+1
      temp.patient_name = dataRow[0];
      temp.medical_record = []
      temp.medical_record.push({record_id : this.temp.medical_record.length+1, diagnosis : dataRow.slice(1).join(' '), signDate : Date(), recoveryDate : Date()})
      temp.createDate = Date()
      temp.lastModified = Date()
      this.patients.push(temp)
      if (Patient.writeToDataPatient(this.patients)) { console.log(`Adding new patient success!`) }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  addRecord(username, level) {
    this.patients = Patient.loadDataPatient()

    rl.question(`Add new patient record by ID <id patient> <new diagnosis> : `, (answer) => {
      for (let i = 0; i < this.patients.length; i++) {
        let dataRow = answer.split(' ')
        if (this.patients[i].id === Number(dataRow[0])) {
          console.log(this.patients[i].patient_name)
          console.log(dataRow.slice(1).join(' '));
          console.log(this.patients[i].medical_record)
          this.patients[i].medical_record.push({record_id : this.patients[i].medical_record.length+1, diagnosis : dataRow.slice(1).join(' '), signDate : Date(), recoveryDate : Date()})
        }
      }

      if (Patient.writeToDataPatient(this.patients)) { console.log(`Removing patient record success!`) }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  removeRecord(username, level) {
    this.patients = Patient.loadDataPatient()

    rl.question(`Remove Patient By ID <id patient> <id record> : `, (answer) => {
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].id === Number(answer)) {
          for (let j = 0; j < this.patients[i].medical_record.length; j++) {
            let index = this.patients[i].medical_record.indexOf(this.patients[i].medical_record)
            this.patients.medical_record.splice(index, 1)
          }
        }
      }

      if (Patient.writeToDataPatient(this.patients)) { console.log(`Removing patient record success!`) }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  listEmployees(username, level) {
    this.employees = Employee.loadDataEmployee()
    console.log(`====================== LIST EMPLOYEES ======================`)
    console.log(`No.     | Employee Name | Level | Username | Password | Last Created`);
    for (let i = 0; i < this.employees.length; i++) {
      console.log(`${i+1}.      | ${this.employees[i].name} | ${this.employees[i].level}   |   ${this.employees[i].username}  |  ${this.employees[i].password}  | ${this.employees[i].createDate}`)
    }
    rl.question(`Back to main menu (yes/y) : `, (answer) => {
      if (answer === "yes" || answer === 'y') {
        return this.mainPage(username, level)
      } else {
        console.log("Invalid command")
      }
    })
  }

  addEmployee(username, level) {
    this.employees = Employee.loadDataEmployee()
    console.log(`==================== ADD EMPLOYEE RECORD ======================`)
    rl.question(`Add new employee <firstname> <lastname> <level> <username> <password> : `, (answer) => {
      let dataRow = answer.split(' ')
      let temp = {}
      temp.id = this.employees.length+1
      temp.name = dataRow.slice(0,2).join(' ')
      temp.level = dataRow.slice(2,3).join('')
      temp.username = dataRow.slice(3,4).join('')
      temp.password = dataRow.slice(4).join('')
      temp.createDate = Date()
      temp.lastModified = Date()
      this.employees.push(temp)
      if (Employee.writeToDataEmployee(this.employees)) { console.log(`Adding new employee success!`) }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  removeEmployee(username, level) {
    this.employees = Employee.loadDataEmployee()

    rl.question(`Remove Employee By ID : `, (answer) => {
      for (let i = 0; i < this.employees.length; i++) {
        if (this.employees[i].id === Number(answer)) {
          let index = this.employees.indexOf(this.employees[i])
          this.employees.splice(index, 1)
        }
      }

      if (Employee.writeToDataEmployee(this.employees)) { console.log(`Removing new employee success!`) }
      rl.question(`Back to main menu (yes/y) : `, (answer) => {
        if (answer === "yes" || answer === 'y') {
          return this.mainPage(username, level)
        } else {
          console.log("Invalid command")
        }
      })
    })
  }

  startApp() {
    console.log()
    console.log(`====================================================`);
    console.log(`Selamat datang di ${this.name}, ${this.location}`);
    console.log(`====================================================`);
    console.log(`Hospital Information System v.1.0 : `)

    let dataEmployee = Employee.loadDataEmployee()
    rl.question('username : ', (loginuser) => {
      if (loginuser.length > 4) {
        rl.question('password : ', (loginpass) => {
          for (let i = 0; i < dataEmployee.length; i++) {
            console.log('login user ', loginuser == dataEmployee[i].username && loginpass == dataEmployee[i].password);
            if (loginuser == dataEmployee[i].username && loginpass == dataEmployee[i].password) {
              console.log('Login success!')
              return this.mainPage(dataEmployee[i].name, dataEmployee[i].level)
            }
          }
        })
      } else {
        console.log('Invalid username')
        return this.startApp()
      }
    })
  }

}

class Patient {
  constructor(component) {
    this.id = component.id
    this.name = component.name
    this.diagnosis = component.diagnosis
    this.createDate = component.createDate
    this.lastModified = component.lastModified
  }

  static loadDataPatient() {
    return parsePatientsData
  }

  static writeToDataPatient(data) {
    return fs.writeFileSync('patients.json', JSON.stringify(data))
  }

}

class Employee {
  constructor(id, name, level, username, password) {
    this.name = name
    this.level = level
    this.username = username
    this.password = password
  }

  static loadDataEmployee() {
    return parseEmployeesData
  }

  static writeToDataEmployee(data) {
    return fs.writeFileSync('employees.json', JSON.stringify(data))
  }
}

let hospital = new Hospital({name : "Pagi Sore Fulus Hospital", employees : "", patients : "", location : "Jakarta"})
hospital.startApp()
//hospital.mainPage('mrhandoko','admin')
