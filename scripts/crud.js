insertData = (collection, c) => {

    let firebaseData = null;
    firebaseData = firebase.database().ref(collection);
    firebaseData.push(c);

}

returnData = (collection) => {

    return new Promise((resolve, reject) => {

        let firebaseData = null;
  
        let col = [];
  
        firebaseData = firebase.database().ref(collection);
  
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

updateData = (collection, chave, objCliente) => {
   
   firebase.database().ref(collection + '/' + chave).set(objCliente);
   
}

deleteData = (collection, chave) => {

    const dbRef = firebase.database().ref();
    const usersRef = dbRef.child(collection + '/' + chave);

    usersRef.remove();
    location.reload();
    
}
