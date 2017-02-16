"use-strict"

let jsonfile = require ('jsonfile')
let Table = require('cli-table');
let readline = require('readline')
const rl = readline.createInterface({
  input : process.stdin,
  output : process.stdout
});

class Hospital {
  constructor(detail) {
    this.name = detail['name']
    this.employees = detail['employees']
    this.patients = detail['patients']
    this.location = detail['location']
    this.question = "username"
    this.usernameID = null
    this.validPass = false
    this.flag = false
    this.addName = null
    this.addDiagnosis = null
  }

  startApp(){
    rl.setPrompt(`Welcome to ${this.name} Hospital \nPlease insert your username : `)
    rl.prompt()

    rl.on('line', (answer) => {
      // console.log(answer);
      if(this.question == "username"){
        for (var i = 0; i < this.employees.length; i++) {
          if(this.employees[i].username === answer){
            this.usernameID = i
            this.flag = true
            break;
          }
        }
        if(!this.flag){
          rl.setPrompt(`No username found!!\nPlease insert your username : `)
          rl.prompt()
        }else{
          this.question = "password"
          rl.setPrompt(`Insert your password : `)
        }
      }

      if (this.question == "password") {

        if(this.employees[this.usernameID].password == answer && !this.validPass){
          if (this.employees[this.usernameID].position === "office boy") {
            this.question = "menu"
            console.log("can't acces anything, sorry!");
            rl.close()
          }else{
            this.validPass = true
            this.question = "menu"
            rl.setPrompt(`>> `)
            this.listMenu()
            rl.prompt()
          }

        }else{
          rl.prompt()
        }
      }


      if (this.question == "menu" && /view_records.*/g.test(answer)) {
        let id = answer.trim().match(/\d+/)

        if(!id){
          console.log("insert ID of patient!");
        }else{
          this.patientListById(id)
          rl.setPrompt(`>> press enter to go back to home or find another record\n>> `)
          rl.prompt()
        }

      }

      if (this.question == "menu" && /remove.*/g.test(answer)) {
        let id = answer.trim().match(/\d+/)

        if(!id){
          console.log("insert ID of patient!");
        }else{
          this.deletePatient(id)
          rl.setPrompt(`>> press enter to go back to home or remove another record\n>> `)
          rl.prompt()
        }

      }

      if (this.question == "menu" && answer == "add_patient") {
        this.question = "add_patient_name"
      }

      if(this.question == "add_patient_name"){
        let temp = answer
        if (!this.addName && answer == "add_patient") {
          rl.setPrompt(`>> Insert new patient name : `)
          rl.prompt()
        }

        this.question = "add_diagnosis"
        if (answer == this.addName) {
          rl.setPrompt(`>> Diagnosis : `)
          rl.prompt()
          this.question = "add_diagnosis"
        }
        this.addNewName(temp)
      }

      if(this.question == "add_diagnosis"){
        rl.prompt()
        this.addDiagnosis = answer

        if (answer == this.addDiagnosis) {
          this.patients.push(new Patient({
            "id" : this.patients[this.patients.length-1].id+1,
            "name" : this.addName,
            "diagnosis" : this.addDiagnosis
          }))
          rl.setPrompt(`>> press enter to go back to home or remove another record\n>> `)
          rl.prompt()
        }

        // console.log(this.addName , this.addDiagnosis, this.patients);
      }

      if (this.question == "menu" && answer == "list_patient") {
        this.patientList()
        rl.setPrompt(`>> press enter to go back to home`)
        rl.prompt()
      }

      if (this.question == "menu" && answer == "") {
        rl.setPrompt(`>> `)
        this.listMenu()
        rl.prompt()
      }
    })
  }


  listMenu(){

    console.log(`Welcome ${this.employees[this.usernameID].name}, Your acces level is : ${this.employees[this.usernameID].position}`);
    console.log(`=============================================`);
    console.log(`What would you like to do?`);
    console.log(`=============================================`);
    console.log(`Options :`);
    console.log(`> list_patient`);
    console.log(`> view_records <patient_id>`);
    console.log(`> add_patient`);
    console.log(`> remove_record <patient_id>`);
    console.log(`=============================================`);


  }

  addNewName(name){
    this.addName = name
  }

  addNewDiagnosis(diagnosis){
    this.addDiagnosis = diagnosis
  }

  addPatient(data){

    for (let i = 0; i < data.length; i++) {
      this.patients.push(new Patient({
        "id" : this.patients[this.patients.length-1].id+1,
        "name" : data[i]["name"],
        "diagnosis" : data[i]["diagnosis"]
      }))
    }

    this.saveDataPatient()
  }

  deletePatient(id){
    let found = false
    let i = 0

    while (!false && i < this.patients.length) {
      if(this.patients[i].id == id){
        this.patients.splice(i,1)
        found = true
      }else {
        i++
      }
    }

    if(!found) {
      console.log("ID is not found!");
    }else{
      console.log("ID has been removed..");
      this.saveDataPatient()
    }

  }

  saveDataPatient(){
    jsonfile.writeFileSync("patients.json",this.patients,{spaces: 2})
  }

  patientListById(id){
    var table = new Table({
    head: ['ID', 'Nama', 'Diagnosis'],
    colWidths: [5,20,20]
    });
    let i = 0
    let found = false

    while (!found &&  i < this.patients.length) {
      if(this.patients[i].id == id){
        table.push(
        [`${this.patients[i].id}`,`${this.patients[i].name}`, `${this.patients[i].diagnosis}`]
        )
        found = true
      }else{
        i++
      }
    }

    console.log('\n'+table.toString());

    if(!found){
      console.log("ID is not found");
    }
  }

  patientList(){
    var table = new Table({
    head: ['ID', 'Nama', 'Diagnosis'],
    colWidths: [5,20,20]
    });

    for (let i = 0; i < this.patients.length; i++) {
      table.push(
      [`${this.patients[i].id}`,`${this.patients[i].name}`, `${this.patients[i].diagnosis}`]
      )
    }
    console.log('\n'+table.toString());
  }
}

class Patient {
  constructor(data) {
    this.id = data["id"]
    this.name = data["name"]
    this.diagnosis = data["diagnosis"]
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

let newHospital = {
  "name" : "Harapan Jaya",
  "location" : "Pondok Indah",
  "employees" : jsonfile.readFileSync('employees.json'),
  "patients" : jsonfile.readFileSync('patients.json')
}

let newPatient =[ {
  "name": "Halim Kamal",
  "diagnosis": "flu"
},
{
  "name": "Gina Ariana",
  "diagnosis": "usus buntu"
},
{
  "name": "Dona ardiningrum",
  "diagnosis": "Maag"
},
{
  "name": "Muhammad Amir",
  "diagnosis": "Sakit Gigi"
}]

let coba = new Hospital(newHospital)

// coba.addPatient(newPatient);
coba.startApp()
