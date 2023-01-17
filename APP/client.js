const tls = require('tls');
const fs = require('fs');
const bcrypt = require('bcrypt');

const options = {
  ca: [fs.readFileSync('../autorite/autorite.cer')],
  key: fs.readFileSync('clef_privee_client_decrypted.key'),
  cert: fs.readFileSync('../certificats/1000.pem'),
  servername: 'localhost',
};

const client = tls.connect(8000, options, async () => {
  console.log('client connected', client.authorized ? 'authorized' : 'unauthorized');

  const pw = await bcrypt.hash("123456", 10);
  const user = { name: "jplemay", encryptedPw: pw};

  client.write(JSON.stringify(user));
});

client.setEncoding('utf8');
client.on('data', (data) => {
  console.log(data);
});

client.on('end', () => {
  console.log('client disconnected');
});
