"use strict"
let readline = require('readline')
let employees = []
let patients = []
var user;

class Employee {
  //class employee. parent class untuk semua jenis pekerjaan
  constructor(name, role, username, password) {
    this.name = name
    this.role = role
    this.username = username
    this.password = password
    employees.push(this) //ketika object pekerja dibuat, maka otomatis akan dimasukkan ke dalam array employees
  }

}

class Doctor extends Employee{
  constructor(name, username, password) { //class doctor
    super(name, "doctor", username, password);
  }

  menu(){ //menu yang dapat diakses oleh doctor
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

class Admin extends Employee{//class admin
  constructor(name, role, username, password) {
    super(name, "doctor", username, password);
  }
}

class OB extends Employee{//class ob
  constructor(name, role, username, password) {
    super(name, "doctor", username, password);
  }
}

class Hospitals {
//class rumah sakit. ketika di construct, maka akan otomatis menampilkan pesan selamat datang
  constructor(name, employeesCount, patientsCount){
    this.name = name
    this.employeesCount = employeesCount || 0
    this.patientsCount = patientsCount || 0
    console.log(`Welcome to ${this.name} Hospital`)
    console.log(`-----------------------------------`);
  }
}

class Patient{//class pasien. constructor akan menginisialisasi nama pasien, penyakit, dan rekam medik.
//default rekam medik adalah kosong
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

let doctorono = new Doctor("dr. Setiono", "ono", "ono"); //membuat object dokter baru
let doctorino = new Doctor("dr. Setino", "ino", "ino"); //membuat object dokter baru
patients.push(new Patient("bayu", "demam", ["suhu menurun", "sdah mulai membaik"])) // membuat objek pasien dan langsung memasukkan ke dalam array
let loginUser = () => {
  //meminta username user
  rl.question('Please Enter Your Username : ', (usernameAnswer) => {
    loginPass(usernameAnswer) //setelah user menginput username. maka akan diarahkan ke function untuk meminta password
  })
}
let loginPass = (usernameAnswer) => {
  rl.question('Please Enter Your Password : ', (passwordAnswer) => {
    //meminta password user
    for (var e = 0;e<employees.length;e++) {
      if((employees[e].username == usernameAnswer) && (employees[e].password == passwordAnswer)){
        //bila user ketemu (login berhasil)
        console.log(`Welcome, ${employees[e].name}.\nYour Access Level is : ${employees[e].role}`)
        if(employees[e].role == "doctor"){
          user = employees[e]
          user.menu()//menampilkan menu dari employee
          usermenu() //menunggu inputan opsi dari user
        }
      }else{
        loginUser()
      }
    }
  })
}
let usermenu = () => {
  rl.question('\nType Your Option :', (option) => {
    let index = 0
    if(option === 'add_patient'){
      //bila user menginput add patient
      rl.question('name:', (patient_name) => {
        //meminta inputan nama pasien
        rl.question('penyakit:', (patient_disease) => {
        //lalu meminta inputan penyakit
          // console.log(pasien.getID()+1);
          patients.push(new Patient(patient_name, patient_disease))
          //mmembuat object pasien baru, memasukkan ke dalam array
          usermenu()
          //lalu menampilkan kembali menu user
        })
      })
    }else if(option === 'list_patients'){
      //bila user menginput list patient
      for (var p=0; p < patients.length; p++) {
        //menampilkan semua detail pasien dari array pasien
        console.log('patients id: '+patients[p].id);
        console.log('patients name: '+patients[p].name);
        console.log('patients disease: '+patients[p].disease);
        console.log('\n');
      }
      usermenu()
    }else if(/^view_records \d/.test(option)){
      //bila pilihan adalah view records
      var patient = patients[option.split(" ")[1]] //ambil data patient dari array berdasarkan posisi yang diinput user
      if (patient == undefined){
        //apabila patient tidak ditemukan berdasarkan posisi yang diinput user
          console.log('patients not found');
      }else{
        var records = patient.records//pindahkan records ke dalam variabel penampung sementara
          console.log('patients '+patient.name+' records: ');
        for (var r = 0; r < records.length; r++) {//lalu tampilkan
          console.log(r+1+'. '+records[r]);
        }
      }
      usermenu()
    }else if(/^add_record \d/.test(option)){
      //bila pilihan adalah add record
      var patient = patients[option.split(" ")[1]]//ambil data patient dari array berdasarkan posisi yang diinput user
      if (patient == undefined){//apabila patient tidak ditemukan berdasarkan posisi yang diinput user
          console.log('patients not found');
      }else{
        rl.question('progress:', (progress) => {
          //minta inputan progress dari user, lalu masukkan ke dalam record pasien
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


// username : ono password : ono
// username : ino password : ino
