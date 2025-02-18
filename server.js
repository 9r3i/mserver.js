/* load mserver library */
const mserver=require('@9r3i/mserver').mserver;

/* setup port, host and root directory */
const port   = 8000;
const host   = 'localhost';
const root   = __dirname+'/www';

/* call mserver */
const server = new mserver(port,host,root);

/* start the server */
server.start();
