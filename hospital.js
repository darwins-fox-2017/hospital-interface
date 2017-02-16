"use strict"  
let fs       = require('fs')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Hospital {
    constructor(name, location) {
        this.name = name
        this.location = location
        this.employees = ['Agus', 'Budi', 'Susi', 'Yoki', 'Samy']
        this.username = ['agus', 'budi', 'susi', 'yoki', 'samy']
        this.pass = ['agus', 'budi', 'susi', 'yoki', 'samy']
        this.position = ['Doctor', 'Admin', 'Receptionist', 'OB', 'Patient']
        this.patients = [{
            id: 1,
            name: "Danang",
            diagnose: "Diare"
        }, {
            id: 2,
            name: "Bambang",
            diagnose: "Demam"
        }]
        this.id = 0
        this.employees = JSON.parse(fs.readFileSync('employees.json', 'utf-8'))
    }



    loginUser() {
        rl.question('Silahkan Masukkan Username Anda : ', (answer) => {
            if (this.username.indexOf(answer) !== -1) {
                this.id = this.username.indexOf(answer)
                this.password();
            } else {
                console.log('Username salah!');
                this.loginUser();
            }
        });
    }

    password() {
        rl.question('Silahkan masukkan password Anda : ', (answer) => {
            if (answer == this.pass[this.id]) {
                console.log(`Selamat datang ${this.employees[this.id]}. Akses kamu adalah: ${this.position[this.id]}`)
                this.menuOption()
            } else {
                console.log('\n\nPassword salah!\n');
                this.password();
            }
        });
    }


    menuOption() {
        console.log("================================================");
        console.log('Silahkan Pilih Opsi di Bawah ini.');
        console.log('What do you want ? ');
        console.log('-- view_patient');
        console.log('-- details_patient');
        console.log('-- add_patient');
        console.log('-- delete_patient');
        console.log("================================================");
        this.option()
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
            //console.log('Gagal masuk!')
            
            //this.CekUsername()
          }
        }
      })
    }

    list_patients() {
        if (this.patients.length == 0) {
            console.log("Tidak ada pasien");
            this.menuOption()
        } else if (this.id == 4) {
            console.log("Anda hanya bisa melihat riwayat milik anda");
            this.menuOption()
        } else if (this.id == 3) {
            console.log("Anda hanya dapat mengakses id dan nama Pasien");
            console.log('\n=======================\nDaftar Pasien : \n======================\n\nID     Name');
            for (var i = 0; i < this.patients.length; i++) {
                console.log(`${this.patients[i].id}      ${this.patients[i].name}`);
            }
            this.menuOption()
        } else {
            console.log('\n\n=======================\nDaftar Pasien : \n=======================\n\nID     Name     Diagnose');
            for (var i = 0; i < this.patients.length; i++) {
                console.log(`${this.patients[i].id}      ${this.patients[i].name}   ${this.patients[i].diagnose}`);
            }
            this.menuOption()
        }
        console.log('\n\n');
    }

    showRecord() {
        rl.question('\nMasukan ID Pasien: (atau masukan exit untuk keluar)\n', (answer) => {
            if (answer > 0 && answer <= this.patients.length) {
                if (this.id == 3) {
                    console.log(`ID : ${this.patients[answer-1].id}\nName : ${this.patients[answer-1].name}\n`);
                    this.showRecord()
                } else {
                    console.log(`ID : ${this.patients[answer-1].id}\nName : ${this.patients[answer-1].name}\nDiagnose : ${this.patients[answer-1].diagnose}`);
                    this.showRecord()
                }
            } else if (answer == 'exit') {
                this.menuOption()
            } else {
                console.log('Data tidak ditemukan');
                this.showRecord()
            }
        });
    }

    add_data() {
        if (this.id == 3 || this.id == 4) {
            console.log('Akses ditolak! Hanya Admin, Dokter dan Resepsionis yang bisa menambahkan pasien');
            this.menuOption()
        } else {
            rl.question('Input nama pasien dan diagnosa (Ex: Danang, Diare) : ', (answer) => {
                let input = answer.split(',');
                this.patients.push({
                    id: this.patients.length + 1,
                    name: input[0],
                    diagnose: input[1]
                })
                console.log('Pasien berhasil ditambahkan')
                this.menuOption()
            });
        }
    }

    remove_records() {
        if (this.id == 3 || this.id == 4) {
            console.log('\nAkses ditolak! Hanya Admin, Dokter dan Resepsionis yang bisa menghapus pasien');
            this.menuOption()
        } else {
            rl.question('\nMasukan ID Pasien untuk menghapus : ', (answer) => {
                this.patients.splice(answer - 1, 1)
                console.log(`\nPasien dengan ID : ${answer} telah dihapus`)
                this.menuOption()
            });
        }
    }

    option() {
        rl.question('What do you want ? ', (answer) => {
            switch (answer) {
                case 'view_patient':
                    this.list_patients()
                    break;

                case 'details_patient':
                    this.showRecord()
                    break;

                case 'add_patient':
                    this.add_data()
                    break;

                case 'delete_patient':
                    this.remove_records()
                    break;

                default:
                    console.log("pilihan salah");
                    this.option()
            }
        });
    }
}

  class Doctor {
    constructor(name, username, password) {
    
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
                return this.doctorMenu
              })
             
            })
          })
          break
        case 'list_patients' :
          for (var i=0; i < patients.length; i++) {
            //menampilkan semua detail pasien dari array pasien
            console.log('patients id: ' + patients[i].id);
            console.log('patients name: ' + patients[i].name);
            console.log('patients disease: ' + patients[i].disease);
            console.log('\n');
          }
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

  }

let start = new Hospital('RS HARAPAN', 'JAKARTA')
start.loginUser()