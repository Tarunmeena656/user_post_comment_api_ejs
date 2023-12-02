const {set , connect, connection} = require('mongoose');

function connectDatabase(){
    set('strictQuery',true);
    return connect("mongodb://127.0.0.1:27017/Blog_Website");
}


connection.on( 'connected' , () => {
 console.log("database connected");
})


module.exports = connectDatabase;