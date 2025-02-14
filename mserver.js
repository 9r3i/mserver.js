const HTTP = require("node:http");
const FS   = require('node:fs/promises');

/* */
function mserver(port=8000,host='localhost',root){
this.version='1.0.6';
this.port=port;
this.host=host;
this.fs=FS;
this.http=HTTP;
this.root=typeof root==='string'?root:[__dirname,'www'].join('/');
/* mime types */
this.mimeTypes={
  html:'text/html',
  txt:'text/plain',
  js:'application/javascript',
  css:'text/css',
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
    .access(_mserver.root+file,_mserver.fs.constants.F_OK)
    .then(e=>e?false:true)
    .catch(e=>false);
  console.log(accessed?200:404,req.url);
  
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
