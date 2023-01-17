const fs = require('fs');
const tls = require('tls');

let BD_Users = JSON.parse(fs.readFileSync("DB.json"));
let globalSocket;
//console.log(BD_Users);

const options = {
    requestCert: true, // ask for a client cert
    ca: [fs.readFileSync('../autorite/autorite.cer')],
    key: fs.readFileSync('clef_privee_serveur_decrypted.key'),
    cert: fs.readFileSync('../certificats/1001.pem'),
};

const server = tls.createServer(options, (socket) => {
  console.log('server connected', socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.on('data', onConnData);
  globalSocket = socket;
});

server.listen(8000, () => {
  console.log('server bound');
});

function onConnData(d) {
    console.log(d.toString());

    let user = JSON.parse(d.toString());

    console.log(user);

    let foundUser = BD_Users.users.find(u => u.name == user.name)

    if(foundUser?.ps == user.password)
    {
      globalSocket.write("Connecté")
    }
    else
    {
      globalSocket.write("Mauvais mot de passe ou usager")
    }
} 