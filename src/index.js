const axios = require("axios");

class App {
    constructor(){
        this.buttonCreate = document.getElementById("btn_create");
        this.buttonEdit = document.getElementById("btn_edit");
        this.titleEdit = document.getElementById("edit-title");
        this.contentEdit = document.getElementById("edit-content");
        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");
        this.url = 'https://api-scrapbook-js.herokuapp.com/cards';
        //this.url = 'http://localhost:3333/cards';
        this.getScraps(this);
        this.registerEvents();
    }

    //REGISTRA O EVENTO DOS BUTTONS
    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
        this.buttonEdit.onclick = (event) => this.editCard(event, document.getElementById("label-id").value);
    }

    //PEGA OS CARDS DO BANCO DE DADOS
    getScraps(app, id = 0){
        if (id == 0) {
            axios.get(this.url)
            .then (function(response){
                app.recoveryScraps(response.data);
            })
            .catch(function(error){
                console.log(error);
            })
            .finally(function(){
            });
        } else{
            let url = this.url + `/ ${id}`;

            axios.get(url)
            .then (function(response){
                document.getElementById("label-id").value = id;
                document.getElementById("edit-title").value = response.data.map(title => title.title);
                document.getElementById("edit-content").value = response.data.map(content => content.content);
            })
            .catch(function(error){
                console.log(error);
            })
            .finally(function(){
            });
        };
    }

    editCard(event,id){
        console.log(id);
        let url = this.url + `/ ${id}`;
        if(this.titleEdit.value && this.contentEdit.value) {
            let editedScrap ={
                title: this.titleEdit.value,
                content : this.contentEdit.value
            }
            this.updateCard(url,editedScrap);
            location.reload();
        }else {
            alert("Preencha os campos!");
        };
    }

    updateCard(url, editedScrap){
        axios.put(url, editedScrap)
        .then (function(response){
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

    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            let scraps = {
                title: this.title.value,
                content: this.content.value
            }
            this.createScraps(scraps);
           //location.reload();
        } else {
            alert("Preencha os campos!");
        }
    }

    createScraps(scraps){
        axios.post(this.url, scraps)
        .then (function(response){
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    deleteScraps(id){
        let url = this.url + `/ ${id}`;
        console.log(id);
        console.log(url);
        axios.delete(url)
        .then (function(response){
            location.reload();
        })
        .catch(function (error) {
            console.log(error);
          });
          //location.reload();
    }

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

    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }

    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    deleteCard = (event, id) => this.deleteScraps(id);

}

new App();