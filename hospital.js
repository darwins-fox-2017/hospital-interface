var readlineSync = require('readline-sync');

class Hospital {
    constructor(name, location, employees, patients) {
        this.name = name
        this.employees = employees
        this.patients = patients
        this.location = location
        this.question = ['masukan username : ', 'masukan pasword ', ' apa yang ingin anda lakukan '];
    }

    run() {
        console.log(`wellcom to ${this.name}`);
        let username = readlineSync.question(this.question[0]);
        let index = this.findUser(username, this.employees)
        if (index != -1) {
            let pswd = readlineSync.question(this.question[1], {
                hideEchoBack: true
            });
            if (this.checkPswd(this.employees, index, pswd)) {
                    if (this.employees[index].position == 'dokter') {
                        console.log(`selamat datang ${this.employees[index].name} akses anda adalah ${this.employees[index].position} `);
                        console.log(this.question[2]);
                        this.help();
                    } else {
                        console.log(`maaf ${this.employees[index].name} akses anda adalah ${this.employees[index].position} akses anda sangat terbatas`);
                    }
                } else {
                    console.log('wrong password');
                }

            }
            else {
                console.log('username not avalibel');
            }

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

    class GetData {

        static getDataEmploye(dataEmploye) {
            let dataOutput = [];
            for (var i = 0; i < dataEmploye.length; i++) {
                let employeData = new Employee(dataEmploye[i].name, dataEmploye[i].position, dataEmploye[i].username, dataEmploye[i].password);
                dataOutput.push(employeData)
            }
            return dataOutput;
        }

        static getDataPasient(dataPasien) {
            let dataOutput = [];
            for (var i = 0; i < dataPasien.length; i++) {
                let pasienData = new Patient(dataPasien[i].id, dataPasien[i].name, dataPasien[i].diagnosis);
                dataOutput.push(pasienData);
            }
            return dataOutput;
        }

    }

    let employe = [{
            'name': 'sumarno',
            'username': 'sumarno',
            'position': 'ob',
            'password': 'mantap'
        },
        {
            'name': 'mustopo',
            'username': 'mustopo',
            'position': 'dokter',
            'password': 'jaya'
        },
        {
            'name': 'brian',
            'username': 'brian',
            'position': 'dokter',
            'password': 'jaya'
        },
    ];
    let pasien = [{
            'id': '1',
            'name': 'paijo',
            'diagnosis': 'flue'
        },
        {
            'id': '2',
            'name': 'sukijan',
            'diagnosis': 'kutil'
        },
        {
            'id': '3',
            'name': 'marni',
            'diagnosis': 'diare'
        },
        {
            'id': '4',
            'name': 'juminten',
            'diagnosis': 'kurap'
        }
    ];

    let hospital = new Hospital('suka jadi', 'bantul', GetData.getDataEmploye(employe), GetData.getDataPasient(pasien));
    hospital.run();
