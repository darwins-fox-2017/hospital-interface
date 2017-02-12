"use strict"
let readline = require('readline')
let employees = []
let patients = []
var user;

class Employee {
  constructor(name, role, username, password) {
    this.name = name
    this.role = role
    this.username = username
    this.password = password
    employees.push(this)
  }

}

class Doctor extends Employee{
  constructor(name, username, password) {
    super(name, "doctor", username, password);
  }

  menu(){
    console.log(`What would you like to do?`)
    console.log(`-----------------------------------`);
    console.log(`- add_patient`);
    console.log(`- list_patients`)
    console.log(`- view_records <patient_id>`)
    console.log(`- add_record <patient_id>`)
    console.log(`- remove_record <patient_id> <record_id>`)
    console.log(`- type exit to close`);
  }

}

class Admin extends Employee{
  constructor(name, role, username, password) {
    super(name, "doctor", username, password);
  }
}

class OB extends Employee{
  constructor(name, role, username, password) {
    super(name, "doctor", username, password);
  }
}

class Hospitals {
  constructor(name, employeesCount, patientsCount){
    this.name = name
    this.employeesCount = employeesCount || 0
    this.patientsCount = patientsCount || 0
    console.log(`Welcome to ${this.name} Hospital`)
    console.log(`-----------------------------------`);
  }
}

class Patient{
  constructor(name, disease, records) {
    this.id = patients.length
    this.name = name
    this.disease = disease
    this.records = records || []
  }
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let doctor = new Doctor("dr. Setiono", "ono", "ono");
patients.push(new Patient("bayu", "demam", ["suhu menurun", "sdah mulai membaik"]))
let loginUser = () => {
  rl.question('Please Enter Your Username : ', (usernameAnswer) => {
    loginPass(usernameAnswer)
  })
}
let loginPass = (usernameAnswer) => {
  rl.question('Please Enter Your Password : ', (passwordAnswer) => {
    for (var e = 0;e<employees.length;e++) {
      if((employees[e].username == usernameAnswer) && (employees[e].password == passwordAnswer)){
        console.log(`Welcome, ${employees[e].name}.\nYour Access Level is : ${employees[e].role}`)
        if(employees[e].role == "doctor"){
          user = employees[e]
          user.menu()
          usermenu()
        }
      }
    }
  })
}
let usermenu = () => {
  rl.question('\nType Your Option :', (option) => {
    let index = 0
    if(option === 'add_patient'){
      rl.question('name:', (patient_name) => {
        rl.question('penyakit:', (patient_disease) => {
          // console.log(pasien.getID()+1);
          patients.push(new Patient(patient_name, patient_disease))
          usermenu()
        })
      })
    }else if(option === 'list_patients'){
      for (var p=0; p < patients.length; p++) {
        console.log('patients id: '+patients[p].id);
        console.log('patients name: '+patients[p].name);
        console.log('patients disease: '+patients[p].disease);
        console.log('\n');
      }
      usermenu()
    }else if(/^view_records \d/.test(option)){
      var patient = patients[option.split(" ")[1]]
      if (patient == undefined){
          console.log('patients not found');
      }else{
        var records = patient.records
          console.log('patients '+patient.name+' records: ');
        for (var r = 0; r < records.length; r++) {
          console.log(r+1+'. '+records[r]);
        }
      }
      usermenu()
    }else if(/^add_record \d/.test(option)){
      var patient = patients[option.split(" ")[1]]
      if (patient == undefined){
          console.log('patients not found');
      }else{
        rl.question('progress:', (progress) => {
          patient.records.push(progress)
          usermenu()
        })
      }
      usermenu()
    }else if(/^remove_record \d \d/.test(option)){
      var patient = patients[option.split(" ")[1]]
      if (patient == undefined){
        console.log('patients not found');
      }else{
        patient.records.splice(option.split(" ")[2] - 1, 1)
      }
      usermenu()
    }else if(option === "exit"){
      rl.close()
    }else{
      console.log(`Input Based on Options!`);
      usermenu()
    }
  })
}

let hospital = new Hospitals("Sehat Selalu");
loginUser()

// un: ono & ps: ono (as a doctor)
