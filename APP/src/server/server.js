const fs = require('fs');
const tls = require('tls');
const bcrypt = require('bcrypt');
var sanitizer = require('sanitize')();

let BD_Users = JSON.parse(fs.readFileSync("DB.json")); // database containing user data
let globalSocket;

const options = {
    requestCert: true, // ask for a client certificate
    ca: [fs.readFileSync('../../../autorite/autorite.cer')],
    key: fs.readFileSync('../../cert/server/clef_privee_server_decrypted.key'),
    cert: fs.readFileSync('../../../certificats/1001.pem'),
    ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
    // only accept 4 ciphers (2 for TLS 1.3 and 2 for TLS 1.2), to prevent downgrade attacks
  };

const server = tls.createServer(options, (socket) => {
  console.log('server connected', socket.authorized ? 'authorized' : 'unauthorized');
  if (!socket.authorized) {
    socket.end(); // end the connection if not authorized
    return;
  }
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.on('data', onConnData);
  globalSocket = socket;
});

server.listen(8000, () => {
  console.log('server bound');
});

async function onConnData(d) { // function called when received login data from client. Would eventually need more logic.
    
    let user = sanitizer.primitives(JSON.parse(d.toString())); // sanitize the json object to prevent data injection

    let foundUser = BD_Users.users.find(u => u.name == user.name) // find the user in the database

    if(!foundUser) {
      globalSocket.write("Mauvais usager")
    } else if(await bcrypt.compare(user.pw, foundUser?.pw)) { // check if password matches
      globalSocket.write("Connecté")
    } else {
      globalSocket.write("Mauvais mot de passe")
    }
} 