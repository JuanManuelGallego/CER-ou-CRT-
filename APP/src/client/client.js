const tls = require('tls');
const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

const options = {
  ca: [fs.readFileSync('../../../autorite/autorite.cer')],
  key: fs.readFileSync('../../cert/client/clef_privee_client_decrypted.key'),
  cert: fs.readFileSync('../../../certificats/1000.pem'),
  ciphers: "HIGH",
};

const client = tls.connect(8000, 'www.hostpapa.app', options, () => {
  console.log('connected', client.authorized ? 'authorized' : 'unauthorized');
});

client.setEncoding('utf8');

client.on('data', (data) => {
  console.log(data);
  if(data.includes('welcome')) {
    login();
  }
});

client.on('end', () => {
  console.log('client disconnected');
});

function login() {
  console.log("***** Connexion *****");
  const username = prompt("Nom d'utilisateur : ");
  const pw = prompt.hide("Mot de passe : ");
  const user = { name: username, pw: pw };

  client.write(JSON.stringify(user));
};
