const axios = require("axios");

class App {
    constructor(){
        this.buttonCreate = document.getElementById("btn_create");
        this.buttonEdit = document.getElementById("btn_edit");
        this.buttonLogin = document.getElementById("btn_login");
        this.buttonCadastro = document.getElementById("btn_cadastro");
        this.buttonEfetuarLogin = document.getElementById("btn_Efetuarlogin");
        this.buttonEfetuarCadastro = document.getElementById("btn_EfetuarCadastro");
        this.buttonEditCadastro = document.getElementById("btn_EditCadastro");
        this.buttonLogoff = document.getElementById("btn_EfetuarLogoff");

        this.titleEdit = document.getElementById("edit-title");
        this.contentEdit = document.getElementById("edit-content");

        this.Login = document.getElementById("email-login");
        this.Password = document.getElementById("password-login");
        this.name = document.getElementById("name-cadastro");
        this.email = document.getElementById("email-cadastro");
        this.pass = document.getElementById("password-cadastro");
        this.editEmail = document.getElementById("email-EditCadastro");
        this.editPassword = document.getElementById("password-EditCadastro");
        this.editOldPassword = document.getElementById("oldpassword-EditCadastro");

        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");
        this.url = 'https://cards-with-login-and-auth.herokuapp.com';
        //this.url = 'http://localhost:3333';
        this.getScraps(this);
        //this.getLogin(this);
        this.registerEvents();
        this.token;
        this.idUser;
    }

    //REGISTRA O EVENTO DOS BUTTONS
    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
        this.buttonLogin.onclick = (event) => this.login(event);
        this.buttonCadastro.onclick = (event) => this.cadastro(event);
        this.buttonEfetuarLogin.onclick = (event) => this.efetuarLogin();
        this.buttonEfetuarCadastro.onclick = (event) => this.efetuarCadastro();
        this.buttonEditCadastro.onclick = (event) => this.editarCadastro(event,this);
        this.buttonLogoff.onclick = (event) => this.Logoff();
        this.buttonEdit.onclick = (event) => this.editCard(event, document.getElementById("label-id").value);
    }

    //ABRE O MODAL DE LOGUIN
    efetuarLogin(){
        $('#modalLogin').modal('show');
    }

    Logoff(){
        localStorage.clear();
        location.reload();
    }

    // ABRE O MODAL DE CADASTRO
    efetuarCadastro(){
        if (!JSON.parse(localStorage.getItem('token'))) {
            $('#modalCadastro').modal('show');
        } else {
            $('#modalEditCadastro').modal('show');
        }
    }

    editarCadastro(event,app){
        event.preventDefault();
        const url = this.url + `/users/${this.idUser}`
        console.log(app.idUser);
        let data ={
            email : this.editEmail.value,
            oldPassoword: this.editOldPassword.value,
            password: this.editPassword.value
        }
        this.updateCadastro(url,data,this);
    }

    updateCadastro(url,data,app){
        axios.put(url, data, JSON.parse(localStorage.getItem('token')))
        .then (function(response){
            alert("Cadastro Atualizado com Sucesso");
        })
        .catch(function(error){
            console.log(error);
        })
        .finally(function(){
        });
    }

    //CADASTRA NO BANCO DE DADOS
    cadastro(event){
        event.preventDefault();
        const url = this.url + `/users`    
        let data ={
            name: this.name.value,
            email: this.email.value,
            password: this.pass.value
        }
        this.getCadastro(url,data, this);
    }

    //LOGA NO BANCO DE DADOS
    login(event){
        event.preventDefault();
        const url = this.url + `/login`    
        let data ={
            email: this.Login.value,
            password: this.Password.value
        }
        this.getLogin(url,data, this);
    }

    //ENVIA AS INFO DE CADASTRO
    getCadastro(url,data,app){
        console.log('teste');
        axios.post(url,data)
        .then(function(response){
            alert('Cadastro efetuado com sucesso');
            $('#modalCadastro').modal('hide');
            this.efetuarLogin();
        })
        .catch(function(error){
            })
        .finally(function(){
        });
    }

    //ENVIA AS INFO DE LOGIN E RETORNA O TOKEN
    getLogin(url, data,app){
        axios.post(url, data)
        .then(function(response){
            app.token = {
                headers: {'Authorization': "bearer " + response.data.token}
            };
            localStorage.setItem('token', JSON.stringify(app.token));
            app.idUser = response.data.user.id;
            $('#modalLogin').modal('hide');
            alert("Login Efetuado Com sucesso");
            //app.getScraps()
        })
        .catch(function(error){
            alert("Login incorreto");
        })
        .finally(function(){
        });
    }
    //PEGA OS CARDS DO BANCO DE DADOS
    async getScraps( id = 0){
        let url = this.url + `/cards/${this.idUser}`;
        let idUser = {
            id_user : this.idUser
        }
        console.log(idUser);
        if (id == 0) {
            try {
                const response = await axios.get(url,JSON.parse(localStorage.getItem('token')));
                console.log(response);
                if (respose.data) {
                    console.log(response.data);
                    document.getElementById("row_cards").innerHTML = "";
                    this.recoveryScraps(response.data);
                }
            } catch (error) {
                console.log(error);
                alert("Get cards not found");
            }
        } else{
            let url = this.url + `/cardsId/ ${id}`;
            axios.get(url,JSON.parse(localStorage.getItem('token')))
            .then (function(response){
                //console.log(response);
                document.getElementById("label-id").value = id;
                console.log(typeof(response.data));
                document.getElementById("edit-title").value = response.data.title
                document.getElementById("edit-content").value = response.data.content;
            })
            .catch(function(error){
                console.log(error);
            })
            .finally(function(){
            });
        };
    }

    //EDITA O CARD
    editCard(event,id){
        let url = this.url + `/cardsId/${id}`;
        if(this.titleEdit.value && this.contentEdit.value) {
            let editedScrap ={
                title: this.titleEdit.value,
                content : this.contentEdit.value
            }
            console.log(editedScrap)
            console.log(url)
            this.updateCard(this,url,editedScrap);
        }else {
            alert("Preencha os campos!");
        };
    }

    //ATUALIZA O CARD NO BANCO DE DADOS
    updateCard(app,url, editedScrap){
        axios.put(url, editedScrap, JSON.parse(localStorage.getItem('token')))
        .then (function(response){
            app.getScraps(app);
        })
        .catch(function(error){
            console.log(error);
        })
        .finally(function(){
        });
    }

    //MONTA OS CARDS PEGOS DA TABELA NA TELA
    recoveryScraps(data){
        for(item of data){
          const html =  this.cardLayout(item.title, item.content, item.id);
          this.insertHtml(html);

          document.querySelectorAll('.delete-card').forEach(item => {
            item.onclick = event => this.deleteCard(event, item.id);
        });

        document.querySelectorAll('.edit-card').forEach(item => {
            item.onclick = event => this.getScraps(this,item.id);
        });

        }
    }

    //CRIA O CARD 
    createCard(event) {
        event.preventDefault();

        const url = this.url + `/cards`
        if(this.title.value && this.content.value) {
            console.log(this.idUser);
            let scraps = {
                idUser: this.idUser,
                title: this.title.value,
                content: this.content.value
            }
            if (JSON.parse(localStorage.getItem('token'))) {
                this.createScraps( url, scraps, this);
            } else {
                this.efetuarLogin();
            }
           //location.reload();
        } else {
            alert("Preencha os campos!");
        }
    }

    //ENVIA O NOVO CARD PARA A TABELA
    async createScraps(url,scraps,app){
        const response = await axios.post(url, scraps, JSON.parse(localStorage.getItem('token')))
        console.log(response);
        if (responde.data) {
            
            this.getScraps(app);
        }
    }

    //DELETA O CARD
    deleteScraps(id,app){
        let url = this.url + `/cardsId/${id}`;
        console.log(id);
        console.log(url);
        axios.delete(url,JSON.parse(localStorage.getItem('token')))
        .then (function(response){
            app.getScraps(app);
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    //MONTA O LAYOUT DOS CARDS NO HTML
    cardLayout(title, content, id) {
        const html = `
            <div class="col mt-5">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <button type="button" class="btn btn-alert edit-card" data-toggle="modal" data-target="#modalCard"  id="${id}" data-whatever>Editar</button>
                    <button type="button" class="btn btn-danger delete-card" id="${id}">Excluir</button>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    //INSERE OS CARDS NO HTML
    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }

    //LIMPA O TITLE E O CONTENT DO HTML
    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    //CHAMA A FUNC DE DELETAR CARD
    deleteCard = (event, id) => this.deleteScraps(id,this);

} 

new App();