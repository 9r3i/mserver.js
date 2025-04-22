const HTTP = require("http");
const FS   = require("fs");

/* */
function mserver(port=8000,host='localhost',root){
this.version='1.0.9';
this.port=port;
this.host=host;
this.fs=FS.promises;
this.fso=FS;
this.http=HTTP;
this.root=typeof root==='string'?root:[__dirname,'www'].join('/');
/* mime types */
this.mimeTypes={
  txt:'text/plain',
  log:'text/plain',
  ini:'text/plain',
  css:'text/css',
  html:'text/html',
  php:'application/x-httpd-php',
  js:'application/javascript',
  json:'application/json',
  xml:'application/xml',
  zip:'application/zip',
  pdf:'application/pdf',
  rar:'application/x-rar-compressed',
  jpg:'image/jpeg',
  jpeg:'image/jpeg',
  png:'image/png',
  gif:'image/gif',
  webp:'image/webp',
  mp4:'video/mp4',
  webm:'video/webm',
  mp3:'audio/mp3',
  wav:'audio/wav',
  ogg:'audio/ogg',
};
/* constant of this mserver object */
const _mserver=this;

/* start server */
this.start=function(){
  let server=this.http.createServer(this.requestListener);
  server.listen(this.port,this.host,()=>{
    console.log(`Server is running on http://${this.host}:${this.port}`);
  });
};
/* request listener */
this.requestListener=async function(req,res){
  let parsed=_mserver.parseURL(req.url),
  file=parsed.file!='/'?parsed.file:'/index.html',
  accessed=await _mserver.fs
    .access(_mserver.root+file,_mserver.fso.constants.F_OK)
    .then(e=>e?false:true)
    .catch(e=>false);
  console.log(accessed?200:404,req.method,req.url);
  
  /* check the access file */
  if(!accessed){
    let err='Error: 404 - Not Found -- '+req.url;
    res.setHeader("Content-Type",'text/plain');
    res.setHeader("Content-Length",err.length);
    res.writeHead(404);
    res.end(err);
    return;
  }
  /* read the file contents */
  let content=await _mserver.fs.readFile(_mserver.root+file)
    .then(r=>r)
    .catch(e=>'~'),
  stats=await _mserver.fs.stat(_mserver.root+file);
  
  /* send the response */
  res.setHeader("Content-Type",_mserver.mime(file));
  res.setHeader("Content-Length",stats.size);
  res.writeHead(200);
  res.end(content);
};
/* parse url */
this.parseURL=function(url){
  let res=url.split(/\?/);
  return {
    file:res[0],
    search:res[1],
  };
};
/* mime */
this.mime=function(file){
  let ext=file.split('.').reverse()[0],
  def='application/octet-stream';
  return this.mimeTypes.hasOwnProperty(ext)
    ?this.mimeTypes[ext]:def;
};
/* test */
this.test=function(){
  console.log('ok');
};
};

/* exports */
exports.mserver=mserver;
