/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  
    let url = 'http://127.0.0.1:5000/incidentes';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {      
        data.incidentes.forEach(item => insertList(item.id, item.titulo, item.descricao, item.data, item.ce, item.ib))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputTitulo, inputDescricao, inputDataIdentificacao, inputCE, inputIB) => {
    const formData = new FormData();
    formData.append('titulo', inputTitulo);
    formData.append('descricao', inputDescricao);
    formData.append('data', inputDataIdentificacao);
    formData.append('ce', inputCE);
    formData.append('ib', inputIB);
  
    let url = 'http://127.0.0.1:5000/incidente';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um comentário na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postComentario = async (inputId, texto) => {
    const formData = new FormData();
    formData.append('incidente_id', inputId);
    formData.append('texto', texto);
  
    let url = 'http://127.0.0.1:5000/comentario';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createElement("button");
    span.className = "close";
    txt.innerText = "Excluir"
    txt.className = "btn btn-secondary"
    span.appendChild(txt);
    parent.appendChild(span);
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão detalhes para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButtonDetalhes = (parent) => {
    let span = document.createElement("span");
    let txt = document.createElement("button");
    span.className = "detalhes";
    txt.innerText = "Visualizar"
    txt.className = "btn btn-info"
    span.appendChild(txt);
    parent.appendChild(span);
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nomeItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Deseja remover este incidente?")) {
          div.remove()
          deleteItem(nomeItem)
          alert("Removido!")
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para exibir o comentário e demais detalhes
    --------------------------------------------------------------------------------------
  */
  const showElement = () => {
    let detalhes = document.getElementsByClassName("detalhes");
    let i;
    for (i = 0; i < detalhes.length; i++) {
      detalhes[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nomeItem = div.getElementsByTagName('td')[0].innerHTML
        exibeItem(nomeItem)
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para exibir um item da lista do servidor via requisição GET
    --------------------------------------------------------------------------------------
  */
  const exibeItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/incidente?id=' + item;
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {      
        var comentario = "";
        var texto = "";
         
        for (var i = 0; i < data.comentarios.length; i++) {
          texto = texto  + "<b>Data: </b>" + formatarDataHora(data.comentarios[i].data_insercao) + "</br><b>Comentário: </b>" + data.comentarios[i].texto + "</br></br>";
        }
        if (texto != "")
          comentario = "<b><center>Titulo: </b>" + data.titulo + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Descrição: </b>" + data.descricao + "</center></br></br>" + texto ;
        else     
          comentario = "<b><center>Titulo: </b> " + data.titulo + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Descrição: </b>" + data.descricao + "</br></br> <b>Nenhum comentário cadastrado.</center></b>"
            
        showDetails(comentario, data.id)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/incidente?id=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com titulo, descricao, data de identificação, CE e IB
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let id = null;
    let inputTitulo = document.getElementById("newTitulo").value;
    let inputDescricao = document.getElementById("newDescricao").value;
    let inputDataIdentificacao = document.getElementById("newDataIdentificacao").value;
    let inputCE = document.getElementById("newCE").value;
    let inputIB = document.getElementById("newIB").value;
  
    if (inputTitulo === '') {
      alert("Escreva o titulo do incidente!");
    } else if (isNaN(inputIB)) {
      alert("Valor do IB precisa ser número!");
    } else {
      postItem(inputTitulo, inputDescricao, inputDataIdentificacao, inputCE, inputIB)
      limparGrid(id, inputTitulo, inputDescricao, inputDataIdentificacao, inputCE, inputIB)
      
      alert("Incidente adicionado!")
      getList()
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo comentário 
    --------------------------------------------------------------------------------------
  */
  const newComentario = () => {
    
    let inputId = document.getElementById("hidId").value;
    let inputTexto = document.getElementById("newTexto").value;
    if (inputTexto === '') {
      alert("Escreva um comentário ou observação!");  
    } else {
      postComentario(inputId, inputTexto)
      alert("Registro adicionado!")
      document.getElementById("hidId").value = "";
      document.getElementById("newTexto").value = "";
      modal.style.display = "none";
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir itens na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (id, titulo, descricao, data_identificacao,CE, ib) => {
    var item = [id, titulo, descricao, data_identificacao,CE, ib]
    var table = document.getElementById('myTable');
    var row = table.insertRow();  
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    insertButtonDetalhes(row.insertCell(-1))
    insertButton(row.insertCell(-1))
    document.getElementById("newTitulo").value = "";
    document.getElementById("newDescricao").value = "";
    document.getElementById("newDataIdentificacao").value = "";
    document.getElementById("newCE").value = "";
    document.getElementById("newIB").value = "";
  
    removeElement()
    showElement()
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir itens na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const limparGrid = (id, titulo, descricao, data_identificacao, CE, ib) => {
    var item = [id, titulo, descricao, data_identificacao, CE, ib]
    var table = document.getElementById('myTable');
    var row = table.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      var cel = row.remove(i);
      cel.textContent = item[i];
    }
     
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para converter a data do formato YYYY-MM-DDTHH:Mi para DD/MM/YYYY HH:Mi 
    Ex:  2023-03-29T11:21  --->   29/03/2023 11:21
    --------------------------------------------------------------------------------------
  */
  function formatarDataHora(dataHoraStr) {
    let dataHora = new Date(dataHoraStr);
    let dia = dataHora.getDate().toString().padStart(2, '0');
    let mes = (dataHora.getMonth() + 1).toString().padStart(2, '0');
    let ano = dataHora.getFullYear().toString();
    let hora = dataHora.getHours().toString().padStart(2, '0');
    let minutos = dataHora.getMinutes().toString().padStart(2, '0');
    let dataHoraFormatada = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minutos;
    return dataHoraFormatada;
  }
  
  
  
  /*
    --------------------------------------------------------------------------------------
    Funções para manipular o modal de comentários
    --------------------------------------------------------------------------------------
  */
  // Get the modal element
  var modal = document.getElementById("modal");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("fechar")[0];
  
  // When the user clicks the "Detalhes" button, open the modal 
  function showDetails(text,id) {
    document.getElementById("modalText").innerHTML = text;
    document.getElementById("hidId").value = id;
    modal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }