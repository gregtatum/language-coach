const fs=require("fs"),path=require("path");function load(i){let e,o={},d=-1;function a(a){fs.readFile(path.join(__dirname,"index."+a),((n,t)=>{d++,e=e||n,o[a]=t,d&&(i(e,e?void 0:o),e=void 0,o=void 0)}))}a("aff"),a("dic")}module.exports=load;