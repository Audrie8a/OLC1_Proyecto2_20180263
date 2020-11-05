var fs= require('fs');
var AnalizadorLPython= require("./AnalizadorPY/AnalisisL");
var AnalizadorSPython= require("./AnalizadorPY/AnalisisS");
var AnalisisL="";

fs.readFile('contenido.txt', 'utf8', function(err,data){
    console.log(data);
    ejecutar(data);
    AnalisisL=AnalizadorLPython(data);
});

function ejecutar(texto){
    try {
        
    } catch (error) {
        console.log(error);
    }
}
var aVer=""+
"public class Identificador{\n"+
    " /*Solo quiero ver: \n lo de los comentarios */ \n"+
    "public int nombreFuncion (intx,double y,char z, string s){\n"+
        "for(int x=0; x<= a+4; x++){\n"+
            "if(a>5){\n"+
                "return;"+
            "}else if (a<5){\n"+
                "break;"+
            "}else{"+
                "return 4+5<3+2 && (4*6/7<5+2);\n "
            "}\n"+
        "}\n"+
    "}\n"+
    "public int nombreFuncion2(intx, inty);\n"+
"}\n"+
"public interface Identificador{\n"+
    "int id(int variable);"+
"}";


//AnalisisL=AnalizadorLPython(aVer);
//AnalizadorSPython(AnalisisL);

