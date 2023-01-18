const tls = require('tls');
const fs = require('fs');
const bcrypt = require('bcrypt');
const prompt = require("prompt-sync")({ sigint: true });


const options = {
  ca: [fs.readFileSync('../autorite/autorite.cer')],
  key: fs.readFileSync('clef_privee_client_decrypted.key'),
  cert: fs.readFileSync('../certificats/1000.pem'),
  servername: 'localhost',
};

const client = tls.connect(8000, options, async () => {
  console.log('client connected', client.authorized ? 'authorized' : 'unauthorized');
  login();
});

client.setEncoding('utf8');

client.on('data', (data) => {
  console.log(data);
});

client.on('end', () => {
  console.log('client disconnected');
});

async function login() {
  console.log("***** Connexion *****");
  const username = prompt("Nom d'utilisateur : ");
  const pw = prompt.hide("Mot de passe : ");
  const user = { name: username, encryptedPw: await bcrypt.hash(pw, 10) };

  client.write(JSON.stringify(user));
};
