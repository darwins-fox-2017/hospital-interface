let jsonfile = require('fs')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'masukan user name : '
});

class Hospital {
    constructor(name, location, employeesfile, patientsfile) {
        this.name = name
        this.employefile = employeesfile;
        this.patianfilr = patientsfile;
        this.employees = JSON.parse(jsonfile.readFileSync(employeesfile).toString());
        this.patients = JSON.parse(jsonfile.readFileSync(patientsfile).toString());
        this.location = location
        this.question = ['masukan username : ', 'masukan pasword ', ' apa yang ingin anda lakukan '];
    }


    help() {
        console.log('list_patients');
        console.log('view_records <patient_id>');
        console.log('add_record <patient_id>');
        console.log('remove_record <patient_id> <record_id>');
    }

    checkPswd(data, index, pswd) {
        if (data[index].password == pswd) {
            return true;
        } else {
            return false;
        }
    }

    findUser(userName, data) {
        for (var i = 0; i < data.length; i++) {
            if (userName == data[i].username) {
                return i;
            }
        }
        return -1;
    }

    list_patients(pasien) {
        for (var i = 0; i < pasien.length; i++) {
            console.log(pasien[i]);
        }
    }

    viewRecord(pasein, id) {
        for (var i = 0; i < pasein.length; i++) {
            if (pasien[i].id == id) {
                console.log(pasein[i]);
            }
        }
    }

    addrecord(pasien) {


    }

    run() {

        // console.log(username);

    }

    login(){
      let user=[];
      let userIndex;
      rl.setPrompt('masukan user name :')
      console.log('masukan user name :');
      //rl.prompt();
      rl.on('line', (command) => {
        user.push(command)
        console.log('masukan password');
        //console.log(user);
        if (user.length==2) {
          let index = this.findUser(user[0],this.employees);
          if (index!=-1) {
            if (this.checkPswd(this.employees,index,user[1])) {
              userIndex=index;
              rl.close();
            } else {
              userIndex=index;
             console.log('password salah');
             rl.close();
            }
          } else {
            console.log('user tidak terdaftar');
            rl.close();
          }
        }
      })
      return userIndex
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


let hospital = new Hospital('suka jadi', 'bantul', 'employees.json', 'pasien.json');
console.log(hospital.login());
