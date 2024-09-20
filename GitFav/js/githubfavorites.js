class GitHubUsers {
  static search(data) {
    const endopoint = `https://api.github.com/users/${data}`
  
    return fetch(endopoint)
    .then(data => data.json())
    .then(({login, name, public_repos, followers}) => ({
        login: login,
        name: name,
        public_repos: public_repos,
        followers: followers
      }))
  } 
}

class GitHubDates {
    constructor(app) {
       this.app = document.querySelector("#app")
       this.load()
      }
      
      load() {
        this.users = JSON.parse(localStorage.getItem("@github-favorites:")) || []
      }

      save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.users))
      }
      
      removeUser(removeToUser) {
        let filterEntry = this.users.filter((entry) => entry.login !== removeToUser.login)
        this.users = filterEntry
        this.update()
        this.addmodal()
        this.save()
      }
      
      async add(userName) {

        const existUser = this.users.find(entry => entry.login === userName)

        if(existUser) {
          alert("Usuário já cadastrado")
          return   
        }

        try {

          const result = await GitHubUsers.search(userName)

          if(result.login === undefined) {
            throw new Error("Usuário não encontrado")
          }

          this.users = [result, ...this.users]
          this.update()
          this.save()
        }catch(error) {
          alert(error.message)
        }

      }
    }
    
    export class GitHubFavotires extends GitHubDates {
    constructor(app) {
    super(app)
    this.tbody = this.app.querySelector("table tbody")
    this.update()
    this.onadd()
  }

  addmodal() {
    const modal = this.app.querySelector(".modal")
    modal.classList.add("show")
  }

  removemodal() {
    const modal = this.app.querySelector(".modal")
    modal.classList.remove("show")
  }

  onadd() {
    const addbutton = this.app.querySelector(".favorites button")

    addbutton.addEventListener("click", () => {
      const {value} = document.querySelector(".favorites input")
      this.add(value)
      this.removemodal()
    })
  }
  
  update() {
    this.removeAllTr()
    this.users.forEach(users =>{
      const row = this.creatRows()
      row.querySelector(".user img").src = `https://github.com/${users.login}.png`
      row.querySelector(".user p").textContent = users.name
      row.querySelector(".user span").textContent = users.login
      row.querySelector(".user img").alt = users.name
      row.querySelector(".user a").href = `https://github.com/${users.login}`
      row.querySelector(".repositories").textContent = users.public_repos
      row.querySelector(".followers").textContent = users.followers
      
      row.querySelector(".remove button").onclick = () => {
        const isOk = confirm("Tem certeza que deseja remover esse usuário ?")
        
        if(isOk) {
          this.removeUser(users)
        }
      }
      this.tbody.append(row)
    })  
  }
  
  creatRows() {
    const tr = document.createElement("tr")
  
    tr.innerHTML = 
        `  <td class="user">
          <img src="https://github.com/AlisonMaciel.png" alt="">
          <a href="">
            <p>Alison Maciel</p>
            <span>AlisonMaciel</span>
          </a>
        </td>
  
        <td class="repositories">
          123
        </td>
  
        <td class="followers">
          1234
        </td>
  
        <td class="remove">
          <button>
            Remover
          </button>
        </td>`
        return tr
  }

  removeAllTr() {
    const tbody = this.app.querySelectorAll("tbody tr")
    tbody.forEach((tr) => {
      tr.remove()
    })
  }
}


