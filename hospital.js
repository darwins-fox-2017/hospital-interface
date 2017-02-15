let fs       = require('fs')
//let readline = require('readline')
const readline = require('readline')
  const rl = readline.createInterface({ 
  input: process.stdin,
  output: process.stdout
})

let patients = [] 

class Hospital {
  constructor(name, location, employees, patients) {
    this.name = name
    this.employees = employees
    this.patients = []
    this.location = location
  }
}

class Patient {
  constructor(name, desease, diagnosis) {
    this.id = id
    this.name = name
    this.desease = desease
    this.diagnosis = diagnosis

  }
}

class Employee {
  constructor(name, position, username, password) {
    this.name = name
    this.position = position
    this.username = username
    this.password = password
    this.employees = JSON.parse(fs.readFileSync('employees.json', 'utf-8'))
  }

  CekUsername() {
    rl.question('Silahkan masukkan Username Anda : ', (username) => {
      this.CekPassword(username)
    })
  }

  CekPassword(username) {
    rl.question('Silahkan masukkan Password Anda : ', (password) => {
      for(let i = 0; i < this.employees.length; i++) {
        if(this.employees[i].username == username && this.employees[i].password == password) {
          console.log(`Welcome ${this.employees[i].name}. Your Access Level is : ${this.employees[i].role}`)
          
          this.optionEmployees(this.employees[i].role)
        } else {
          //console.log(`Username : ${username} dan Password : ${password} tidak sesuai`)
          console.log('Gagal masuk!')
          
          this.CekUsername()
        }
      }
    })
  }

  optionEmployees(role) {
    console.log(`What would you like to do?`)
    console.log(`-----------------------------------`)
    if(role == 'doctor') {
      // Doctor.menu()
      return Doctor.doctorMenu()
    } else if(role == 'admin') {
      return Admin.menu()
    } 
  }
}

class Doctor extends Employee {
  constructor(name, username, password) {
    super(name, "doctor", username, password);
  }

  static doctorMenu() {
    console.log(`- add_patient`);
    console.log(`- list_patients`)
    console.log(`- view_records <patient_id>`)
    console.log(`- add_record <patient_id>`)
    console.log(`- remove_record <patient_id> <record_id>`)
    console.log(`- type exit to close`);

    rl.question('What do you want ? ', (command) => {

      switch(command) {
        case 'add_patient' : 
          rl.question('Nama : ', (patient_name) => {
          rl.question('Nama Penyakit : ', (disease_name) => {
            // console.log(patient_name + " menderita " + disease_name)
              rl.question('Diaknosa Dokter : ', (diagnosis) => {
                patients.push(new Patient(patient_name, disease_name, diagnosis))
                console.log(patients)
              })
              //this.doctorMenu
            })
          })
          break
        case 'list_patients' :
          this.list_patients()
          break
        case 'view_records' : 
          this.view_records()
          break
        case 'add_record' :
          this.add_record()
          break
        case 'remove_record' : 
          this.remove_record()
          break
        case 'exit' : 
          this.exit()
      }
    })
  }

  // add_patient() {
  //   rl.question('Nama : ', (patient_name) => {
  //     rl.question('Nama Penyakit : ', (disease_name) => {
  //       console.log(patient_name + " menderita " + disease_name)
  //     })
  //   })
  // }

}

let start = new Employee()
start.CekUsername()