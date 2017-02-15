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
  constructor(name, position, username, password) {
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
    this._loginPrivillege
  }
  
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
  
  createEmployee(name,position,username,password) {
    let oldEmployee     = this.fileHandler('read', 'employees.json')
    let prepareData     = this.fileHandler('write', 'employees.json') 
    oldEmployee.push(new Employee(name,position,username,password))
    prepareData(JSON.stringify(oldEmployee))
    
  }
  
  getEmployees() {
    return this.fileHandler('read', 'employees.json')
  }
  
  getEmployee(index) {
    return this.getEmployee()[index]
  }
  
  login(username, password) {
    let employees = this.getEmployees()
    return password => {
      let login = new Login(username, password)
      if(login.checkAccount(employees)) {
        this._loginStatus      = true
        this._loginPrivillege  = login.privileged.privilege
        this._loggedInEmployee = login.privileged.name
        // console.log(this._loginStatus)
        return this._loginStatus
      }
      return false
    }
    // let username = readline.question('Please enter your username: ')
    // let password = readline.question('Please enter your password: ')
      

    // for (let i in this.getEmployees()) {
    //   let uname = this.getEmployee(i).username
    //   let pass  = this.getEmployee(i).password
    //   if (username === uname && password === pass) {
    //     if (this.getEmployee(i).position !== 'office-boy') {
    //       this.loggedInEmployee = this.getEmployee(i)
    //       this.appMenu()
    //     }
    //     console.log('We are sorry, but you have no access..')
    //   }
    // }
  }
  
  appMenu() {
    console.log('_____________________________________________')
    console.log(`Welcome ${this._loggedInEmployee}, your access level is: ${this._loginPrivillege}`)
    console.log('What would you like to do?')
    console.log('Options:')
    console.log('list_patients')
    console.log('view_record <patient_id>')
    console.log('add_record <patient_id> <complaining>')
    console.log('remove_record <patient_id>')
  }
}

let hospitalapp = new HospitalApp('Lunatic', 'Subconsciousness', 200, 150)

// hospitalapp.login()
// hospitalapp.createEmployee('Danang', 'doctor', 'danang', 'admindanang')

let rl = readline.createInterface({
  input : process.stdin,
  output: process.stdout
})

let login
let loginData = new Object()
console.log('Welcome')
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
      rl.setPrompt(hospitalapp.appMenu())
      rl.prompt()
    } else {
      loginData = new Object()
      console.log('Lu salah account cuk')
      rl.setPrompt('Please enter your username: ')
      rl.prompt()
    }
  }
})