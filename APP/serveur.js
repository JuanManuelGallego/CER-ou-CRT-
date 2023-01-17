const fs = require('fs');
const tls = require('tls');

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
  socket.pipe(socket);
});

server.listen(8000, () => {
  console.log('server bound');
});