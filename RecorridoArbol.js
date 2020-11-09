var pos = 0;
var cclass = 0;
var Aux;

var id_n = 1;
class Recorrido_Arbol {

    constructor() {
    }




    recorrerArbol(nodo) {
        var concatena;
        if (nodo.id == 0) {
            nodo.id = id_n;
            id_n++;
        }
        if (nodo.valor != null) {

            Aux = nodo.valor.replace(/"/g, "'");
        }
        console.log(nodo.id + ' [label= "' + Aux + '" fillcolor="#d62728" shape="circle"];');
        if (nodo.hijos != null) {
            nodo.hijos.forEach(element => {
                console.log(nodo.id + '->' + id_n + ";");
                concatena += this.recorrerArbol(element);
            });
        }
        return concatena;
    }
}

//exportar la clase y poder importarla en otras clases 
module.exports = Recorrido_Arbol;