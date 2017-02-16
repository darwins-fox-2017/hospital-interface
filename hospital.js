let fs       = require('fs')
let readline = require('readline')

class Hospital {
  constructor(name, location, employees, patients) {
    this.name      = name
    this.employees = employees
    this.patients  = patients
    this.location  = location
  }
}

class Patient {
  constructor(id, name, diagnosis) {
    this.id        = id
    this.name      = name
    this.diagnosis = diagnosis
  }
}

class Employee {
  constructor(id, name, position, username, password) {
    this.id       = id
    this.name     = name
    this.position = position
    this.username = username
    this.password = password
  }
}

class Login {
  constructor(username, password) {
    this._username = username
    this._password = password
    this._name
    this._privilege
  }

  isValid() {
    return this._username != '' && this._password != ''
  }  

  checkAccount(accounts) {
    console.log(accounts)
    if (this.isValid()) {
      for (let i = 0; i < accounts.length; i++) {
        if (this._username === accounts[i].username && this._password === accounts[i].password) {
          this.privilege = accounts[i].position
          this.name      = accounts[i].name
          return true 
        }
      }
      return false
    }
    return false
  } 

  get privileged() {
    return {name:this.name, privilege:this.privilege}
  }

}

class HospitalApp {
  constructor(name, location, employees, patients) {
    this.hospital          = new Hospital(name, location, employees, patients)
    this._loginStatus
    this._loggedInEmployee
    this._loginPrivilege
  }

  get loginPrivilege() { return this._loginPrivilege }
  
  fileHandler(option = 'read', fileName) {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, '[]')
    }
    switch (option) {
      case 'read':
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'))
        break;
      case 'write':
        return (text) => {
          fs.writeFileSync(fileName, text, (err) => {
            if (err) {
              throw err
            }
          })
        }
        break;
    }
  }
  
  openingMessage() {
    return `Welcome to ${this.hospital.name}`+'\n_____________________________\n'
  }
  
  addNewRecord(file, record) {
    let oldRecord     = this.fileHandler('read', file)
    let prepareRecord = this.fileHandler('write', file) 
    oldRecord.push(record)
    prepareRecord(JSON.stringify(oldRecord))
  }

  getData(file) {
    return this.fileHandler('read', file)
  }

  getByKey(file, key, value) {
    let records = this.getData(file)
    for (let i = 0; i < records.length; i++) {
      if (records[i][key] == value) {
        return records[i] 
      }
    }
  }

  editRecord(file, key, keyword, targetKey, newVal) {
    let records = this.getData(file)
    let name 
    let newDiagnosis
    for (let i = 0; i < records.length; i++) {
      if (records[i][key] == keyword) {
        records[i][targetKey] = newVal
        name         = records[i].name
        newDiagnosis = records[i][targetKey]
        let prepareRecord = this.fileHandler('write', file) 
        prepareRecord(JSON.stringify(records))
      }
    }
    return `The ${name}'s diagnosis has been updated`
  }

  deleteRecord(file, key, keyword) {
    let records = this.getData(file)
    let name 
    for (let i = 0; i < records.length; i++) {
      if (records[i][key] == keyword) {
        name = records[i].name
        records.splice(i, 1)
        let prepareRecord = this.fileHandler('write', file) 
        prepareRecord(JSON.stringify(records))
      }
    }
    return `${name} has been deleted from patient records`
  }
  
  login(username, password) {
    let employees = this.getData('employees.json')
    return password => {
      let login = new Login(username, password)
      if(login.checkAccount(employees)) {
        this._loginStatus      = true
        this._loginPrivilege   = login.privileged.privilege
        this._loggedInEmployee = login.privileged.name
        // console.log(this._loginStatus)
        return this._loginStatus
      }
      return false
    }
  }

  getCommand(input, privilege, rl, callback) {
    let defineInput  = input.split(' ')
    let command      = defineInput[0]
    let commandParam = defineInput[1]

    if (privilege == 'admin') {
      switch (command) {
        case 'list_employees':
          callback(this.getData('employees.json'), 'Tell me what next to do: ')
          break;
        case 'add_employee':   
          let name        
          let position
          let username
          let password
          rl.question('name: ', nameInput=> {
            name = nameInput
            rl.question('position: ', positionInput=> {
              position = positionInput
              rl.question('username: ', usernameInput=> {
                username = usernameInput
                rl.question('password: ', passwordInput=> {
                  password = passwordInput
                  let employee = this.getData('employees.json')
                  let lastId = employee.length === 0  ? 0 : employee[employee.length-1].id
                  this.addNewRecord('employees.json', new Employee(lastId+1, name, position, password))
                  callback(`${name} has been added`, 'Tell me what next to do: ')
                })
              })
            })
          })
          break;   
        case 'delete_employee':
            callback(this.deleteRecord('employees.json', 'id', commandParam), 'Tell me what next to do: ')
          break; 
        default:
          
      }
    } else {
      switch (command) {
        case 'list_patients':
          callback(this.getData('patients.json'), 'Tell me what next to do: ')
          break;
        case 'add_patient':
          let name        
          let diagnosis
          rl.question('name: ', nameInput => {
            name = nameInput
            rl.question('diagnosis: ', diagnosisInput => {
              diagnosis = diagnosisInput
              let patiens = this.getData('patients.json')
              let lastId  = patiens.length === 0  ? 0 : patiens[patiens.length-1].id
              this.addNewRecord('patients.json', new Patient(lastId+1, name, diagnosis))
              callback(`${name} has been added`, 'Tell me what next to do: ')
            })
          })
          break;
        case 'view_record':
          callback(this.getByKey('patients.json', 'id', commandParam), 'Tell me what next to do: ')
          break;
        case 'add_record':
          rl.question('Diagnosis update: ', newDiagnosis =>{
            callback(this.editRecord('patients.json', 'id', commandParam, 'diagnosis', newDiagnosis), 'Tell me what next to do: ')
          })
          break;
        case 'remove_record':
            callback(this.deleteRecord('patients.json', 'id', commandParam), 'Tell me what next to do: ')
          break;
        default:
          
      }
      
    }

  }
  
  appMenu(privilege) {
    console.log('_____________________________________________')
    console.log(`Welcome ${this._loggedInEmployee}, your access level is: ${this._loginPrivilege}`)
    console.log('What would you like to do?')
    console.log('Options:')
    switch (privilege) {
      case 'admin':
        console.log('--list_employees')
        console.log('--add_employee')
        console.log('--delete_employee <patient_id>')
        break;
      case 'office boy':
        console.log('You dont have any permission to see medical records') 
        break;
      default:
        console.log('--list_patients')
        console.log('--add_patient')
        console.log('--view_record <patient_id>')
        console.log('--add_record <patient_id>')
        console.log('--remove_record <patient_id>')
    }
  }
}

let hospitalapp = new HospitalApp('Lunatic', 'Subconsciousness', 200, 150)

var rl = readline.createInterface({
  input : process.stdin,
  output: process.stdout,
})

let login
let loginData = new Object()
hospitalapp.openingMessage()
rl.setPrompt('Please enter your username: ')
rl.prompt()

rl.on('line', (input) => {
  if (!loginData.hasOwnProperty('username')) {
    loginData['username'] = input
    login = hospitalapp.login(loginData.username)
    rl.setPrompt('Please enter your password: ')
    rl.prompt()
  } else if (!loginData.hasOwnProperty('password')) {
    loginData['password'] = input
    if (login(loginData.password)) {
      hospitalapp.appMenu(hospitalapp.loginPrivilege)
      rl.setPrompt('Tell me what to do: ')
      rl.prompt()
    } else {
      loginData = new Object()
      console.log('Your account is invalid')
      rl.setPrompt('Please enter your username: ')
      rl.prompt()
    }
  } else {
    hospitalapp.getCommand(input, hospitalapp.loginPrivilege, rl, (data, message) => {
      console.log(data)
      rl.setPrompt(message)
      rl.prompt()
    })
  }
})