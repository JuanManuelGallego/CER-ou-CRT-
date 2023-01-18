const tls = require('tls');
const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });
const { Resolver } = require('node:dns');

const hostname = 'www.hostpapa.app';
const resolver = new Resolver();
resolver.setServers(['127.0.0.1']);

let address;

resolver.resolve4(hostname, (err, addresses) => {
    console.log(`addresses: ${JSON.stringify(addresses)}`);
    address = addresses[0];
  });

const options = {
  ca: [fs.readFileSync('../../../autorite/autorite.cer')],
  key: fs.readFileSync('../../cert/client/clef_privee_client_decrypted.key'),
  cert: fs.readFileSync('../../../certificats/1000.pem')
};

const client = tls.connect(8000, address, options, () => {
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
