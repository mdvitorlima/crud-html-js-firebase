$(document).ready(function () {
 
    //carregarGrid();
    inicio();
    
});

async function inicio(){

    await inicializarConteudo();
    configurarManipuladoresEvento();

}

configurarManipuladoresEvento = () => {

    $('#btncadastrar').click(function (event) {
        abrirModalCadastro(event);
    });

    $('.edit').click(function (event) {
        abrirModalCadastro(event);
    });
   

    $('#btn_inserir').click(function (event) {
         if(document.querySelector("#modal-title-edit").innerText == "Editar Cliente"){
            updateCliente(document.getElementById("modal_cadastro_chave").value);
            $('#editEmployeeModal').modal('hide');
            alert("Cliente atualizado!");
         }else{
            inserirCliente(criarObjetoCliente());
            $('#editEmployeeModal').modal('hide');
            alert("Cliente inserido!");
         }
    });

    $('.delete').click(function (event) {
        abrirModalDelete(event);
    });

    $('#btn_delete').click(function (event) {
        deleteCliente(document.getElementById("modal_delete_chave").value);
    });
    
}

abrirModalCadastro = (e) => {

    document.getElementById("input_nome").value = '';
    document.getElementById("input_sobrenome").value = '';
    document.getElementById("input_email").value = '';

    $('#editEmployeeModal').modal('show');

    if(e.target.classList.contains("cadastro")){
      //Inserir novo cliente
      document.querySelector(".modal-title").innerText = "Cadastrar Cliente";
      document.getElementById("modal_cadastro_operacao").value = "cadastrar";
      
    }else{
      //Atualizar cliente
      document.querySelector(".modal-title").innerText = "Editar Cliente";
      retornaInformacaoClienteFromGrid(e);
      
    }
    
}

abrirModalDelete = (e) => {

    $('#deleteEmployeeModal').modal('show');
    document.getElementById("modal_delete_chave").value = e.target.dataset.key;
    
}

criarObjetoCliente = () => {

  let obj_cliente = {};

  obj_cliente.nome = document.getElementById("input_nome").value;
  obj_cliente.sobrenome =  document.getElementById("input_sobrenome").value;
  obj_cliente.email = document.getElementById("input_email").value;

  return obj_cliente;

}

retornaInformacaoClienteFromGrid = (e) => {

   const elements = document.querySelectorAll("tbody > tr");
   const elementTR = [...elements].filter(x => {return x.dataset.key == e.target.dataset.key});

   const elementsTD = elementTR[0].querySelectorAll("td");

   document.getElementById("input_nome").value = elementsTD[0].innerText;
   document.getElementById("input_sobrenome").value = elementsTD[1].innerText;
   document.getElementById("input_email").value = elementsTD[2].innerText;

   document.getElementById("modal_cadastro_chave").value = e.target.dataset.key;
   document.getElementById("modal_cadastro_operacao").value = "edit";
   
}


carregarGrid = (clientes) => {

    let strhtml = '';

    clientes.forEach(c => {

        strhtml = '';
  
        strhtml = '<tr data-key="' + c.chave + '">';
        strhtml += '<td>' + c.valor.nome + '</td>';
        strhtml += '<td>' + c.valor.sobrenome + '</td>';
        strhtml += '<td>' + c.valor.email + '</td>';
        strhtml += '<td>';
        strhtml += '<a href="#"  class="edit" data-toggle="modal"><i class="material-icons edit" data-key="' + c.chave + '" data-toggle="tooltip" title="Edit">&#xE254;</i></a>';
        strhtml += '<a href="#"  class="delete" data-toggle="modal"><i class="material-icons delete" data-key="' + c.chave + '" data-toggle="tooltip" title="Delete">&#xE872;</i></a>';
        strhtml += '</td>';
        strhtml += '</tr>';

        $("tbody").append(strhtml);

    });
    
}

async function inicializarConteudo(){

    let resultClientes = await retornaClientesFirebase();

    carregarGrid(resultClientes);

}

//MÉTODOS CRUD --------------------------------------------------------------------
inserirCliente = (c) => {

    let firebaseData = null;
    firebaseData = firebase.database().ref("Clientes")
    firebaseData.push(c);

}

retornaClientesFirebase = () => {

    return new Promise((resolve, reject) => {

        let firebaseData = null;
  
        let col = [];
  
        firebaseData = firebase.database().ref("Clientes")
  
        firebaseData.on('value', function (snapshot) {
  
          snapshot.forEach(function (childSnapshot) {
  
             let cliente = {};
  
             cliente.chave = childSnapshot.key;
             cliente.valor = childSnapshot.val();
             
             col.push(cliente);
  
          });
          
          resolve(col);
  
      });//fim  firebaseData.on
  
    });

}

updateCliente = (chave) => {

   let objCliente = {};

   objCliente.nome = document.getElementById("input_nome").value;
   objCliente.sobrenome = document.getElementById("input_sobrenome").value;
   objCliente.email = document.getElementById("input_email").value;
   
   firebase.database().ref('Clientes/' + chave).set(objCliente);
   
}

deleteCliente = (chave) => {

    let confirmado = confirm("Excluir cliente?");

    if (confirmado == true) {

        const dbRef = firebase.database().ref();
        const usersRef = dbRef.child('Clientes/' + chave);

        usersRef.remove();
        location.reload();
    }

}
