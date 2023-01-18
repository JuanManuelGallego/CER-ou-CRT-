const fs = require('fs');
const tls = require('tls');
const bcrypt = require('bcrypt');

let BD_Users = JSON.parse(fs.readFileSync("DB.json"));
let globalSocket;

const options = {
    requestCert: true, // ask for a client cert
    ca: [fs.readFileSync('../autorite/autorite.cer')],
    key: fs.readFileSync('clef_privee_serveur_decrypted.key'),
    cert: fs.readFileSync('../certificats/1001.pem')
};

const server = tls.createServer(options, (socket) => {
  console.log('server connected', socket.authorized ? 'authorized' : 'unauthorized');
  if (!socket.authorized) {
    socket.end();
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

async function onConnData(d) {
    let user = JSON.parse(d.toString());
    console.log(user);

    let foundUser = BD_Users.users.find(u => u.name == user.name)

    if(!foundUser) {
      globalSocket.write("Mauvais usager")
    } else if(await bcrypt.compare(user.pw, foundUser?.ps)) {
      globalSocket.write("Connecté")
    } else {
      globalSocket.write("Mauvais mot de passe")
    }
} 