const { response, text } = require("express");

var PR = ['public', 'class', 'interface', 'void', 'int', 'double', 'char', 'string', 'for', 'while', 'boolean', 'else', 'if', 'then', 'break', 'continue', 'return', 'static', 'main', 'system.out.print', 'system.out.println'];
var Simbolos = ['\{', '\}', '\(', '\)', '\,', '\;', '\=', '\[', '\]'];
var OPL = ['&&', '||', '!', '^'];
var OPR = ['<', '>', '<=', '>=', '==', '!='];
var OPA = ['+', '-', '*', '/', '++', '--'];

var linea = 0;
var columna = 0;
var contador = 0;

var Errores = [];
var Recuperacion = "";
var lsttokens;

function Main(Texto) {
    try {
        Texto = Texto + "#";
        lsttokens = Analizador(Texto);
        lsttokens=PalabrasReservadas(lsttokens);        
        console.log(listToString(lsttokens, "Token"));
        lsttokens.push(['$','$','$','$']);
        console.log("ERRORES:");
        console.log(listToString(Errores, "Error"))

    } catch (error) {
        console.log(error);
    }

    return lsttokens;

}

function Analizador(Texto) {
    let Entrada = new String(Texto).toLowerCase();
    //let Prueba = new String ("Variable_888889263a Audrie").toLowerCase(); 
    //const ArryPrueba= Prueba.split(/(?=[\s\S])/u);
    const ArryE = Entrada.split(/(?=[\s\S])/u);
    let listaTokens = [];
    linea = 1;
    columna = 1;

    while (contador < (Entrada.length - 1)) {

        if (/[A-Za-z]/.test(ArryE[contador])) {
            listaTokens.push(stateIdentificador(linea, columna, Entrada, ArryE[contador]));

        }
        else if (/[\n]/.test(ArryE[contador])) {
            contador++;
            linea++;
            columna = 1;
        }
        else if (/[\t]/.test(ArryE[contador]) || /[\s]/.test(ArryE[contador])) {
            console.log(ArryE[contador]);
            contador++;
            columna++;
        }
        else if (/[0-9]/.test(ArryE[contador])) {
            listaTokens.push(stateNumero(linea, columna, Entrada, ArryE[contador]));
        }
        else if(ArryE[contador]=='"'){
            let aux ="";
            do{
                aux+=ArryE[contador];
                contador++;
                columna++;
            }while(ArryE[contador]!='"' && contador<(Entrada.length-1));
            listaTokens.push([linea, columna, 'Cadena', aux+ArryE[contador]]);
            contador++;
            columna++;
        }
        else if(ArryE[contador]=="'"){
            let aux="";
            do{
                aux+=ArryE[contador];
                contador++;
                columna++;
            }while(ArryE[contador]!="'" && contador <(Entrada.length-1));
            listaTokens.push([linea, columna, 'Caracter', aux+ArryE[contador]])
            contador++;
            columna++;
        }
        else if(ArryE[contador]=="/"){
            let contAux=contador+1;
            let comentario="";
            if(ArryE[contAux]=="/"){
                do{
                    comentario+=ArryE[contador];
                    contador++;
                    columna++;
                }while(ArryE[contador]!="\n" && contador<(Entrada.length-1));                
                listaTokens.push([linea, columna,'Comentario',comentario]);
                contador++;
                columna++;
            }
            else if(ArryE[contAux]=="*"){
                let contaaux= contador+1;
                let prueba="";
                do{
                    comentario+=ArryE[contador];
                    if(ArryE[contador]=="\n"){
                        linea++;
                    }

                    contador++;
                    columna++;
                    contaaux=contador+1;
                    prueba=ArryE[contador]+ArryE[contaaux];
                    console.log(ArryE[contador], ArryE[contaaux], contador);
                }while(prueba!='*/' && contador<(Entrada.length-1) && contaaux<(Entrada.length-1));
                listaTokens.push([linea, columna,'Comentario',comentario+ArryE[contador]+ArryE[contaaux]]);
                contador=contador+2;
                columna=columna+2;
            }
            else{
                stateSimbolo(linea, columna, Entrada, OPA, 'OperadorA', false, listaTokens);
            }

        }
        else {
            let isSing = false;
            let isOperL = false;
            let isOperR = false;
            let isOperA = false;

            isSing = stateSimbolo(linea, columna, Entrada, Simbolos, 'Simbolo', isSing, listaTokens);
            isOperL = stateSimbolo(linea, columna, Entrada, OPL, 'OperadorL', isOperL, listaTokens);
            isOperR = stateSimbolo(linea, columna, Entrada, OPR, 'OperadorR', isOperR, listaTokens);
            isOperA = stateSimbolo(linea, columna, Entrada, OPA, 'OperadorA', isOperA, listaTokens);

            if (isSing == false && isOperL == false && isOperR == false && isOperA == false) {
                Errores.push([linea, columna, ArryE[contador]]);
                contador++;
                columna++;
            }

        }
    }

    return listaTokens;
}

function stateIdentificador(linea, column, text, Caracter) {
    contador++;
    columna++;

    if (contador < text.length) {
        if (/[a-zA-Z_0-9]/.test(text[contador])) {
            return stateIdentificador(linea, column, text, Caracter + text[contador]);
        }
        else {
            if (Caracter.toLowerCase() == 'system'.toLowerCase() && text[contador].toLowerCase() == ".".toLowerCase()) {
                return stateIdentificador(linea, column, text, Caracter + text[contador]);
            }
            else if (Caracter.toLowerCase() == 'system.out'.toLowerCase() && text[contador].toLowerCase() == ".".toLowerCase()) {
                return stateIdentificador(linea, column, text, Caracter + text[contador]);
            }
            else {
                Recuperacion += Caracter;
                return [linea, column, 'identificador', Caracter];
            }
        }
    } else {
        Recuperacion += Caracter;
        return [linea, column, 'identificador', Caracter];
    }
}

function stateNumero(line, column, text, numero) {
    const ArrT = text.split(/(?=[\s\S])/u);
    contador++;
    columna++;

    if (contador < text.length) {
        if (/[0-9]/.test(ArrT[contador])) {
            return stateNumero(line, column, text, numero + ArrT[contador]);
        }
        else if (/\./.test(ArrT[contador])) {
            return stateDecimal(line, column, text, numero + ArrT[contador]);
        }
        else {
            Recuperacion += numero.toString();
            return [line, column, 'Numero', numero];
        }
    }

}

function stateDecimal(line, column, text, decimal) {
    contador++;
    columna++;
    if (contador < text.length) {
        if (/[0-9]/.test(ArrT[contador])) {
            return stateDecimal(line, column, text, decimal + ArrT[contador]);
        }
        else {
            Recuperacion += decimal.toString();
            return [line, column, 'Decimal', decimal];
        }
    }
    else {
        Recuperacion += decimal.toString();
        return [line, column, 'Decimal', decimal];
    }
}

function stateSimbolo(line, column, text, listaSimbolos, identificador, Bandera, listaTokens) {
    Condicion = Bandera;
    for (Sy in listaSimbolos) {
        let count = Sy;
        let palabra = "";
        if (listaSimbolos[count].toLowerCase() == text[contador].toLowerCase()) {
            palabra = ComprobarSimbolos(identificador, text);
            listaTokens.push([line, column, identificador, palabra]);
            Recuperacion += palabra;
            contador++;
            columna++;
            Condicion = true;
            break;
        }
        else if (text[contador] == '&' || text[contador] == '|') {
            let contAux = contador + 1;
            let palabra2=text[contador];
            switch (text[contador]) {
                case '&':
                    if (text[contAux].toLowerCase() == '&'.toLowerCase()) {
                        palabra2 += text[contAux];                        
                        listaTokens.push([line, column, identificador, palabra2]);
                        Recuperacion += palabra2;
                        contador=contador+2;
                        columna++;
                        Condicion = true;
                    }
                    break;
                case '|':
                    if (text[contAux].toLowerCase() == '|'.toLowerCase()) {
                        palabra2 += text[contAux];                        
                        listaTokens.push([line, column, identificador, palabra2]);
                        Recuperacion += palabra2;
                        contador=contador+2;
                        columna++;
                        Condicion = true;
                    }
                    break;
            }
        }
    }

    return Condicion;
}

function ComprobarSimbolos(identificador, text) {
    let contAux = contador + 1;
    let palabra = text[contador];
    if (identificador == "OperadorR" || identificador == "Simbolo" || identificador == "OperadorL") {
        switch (text[contador]) {
            case '>':
                if (text[contAux].toLowerCase() == '='.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
            case '<':
                if (text[contAux].toLowerCase() == '='.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
            case '=':
                if (text[contAux].toLowerCase() == '='.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
            case '!':
                if (text[contAux].toLowerCase() == '='.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
        }
    }
    else if (identificador == "OperadorA") {
        switch (text[contador]) {
            case '+':
                if (text[contAux].toLowerCase() == '+'.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
            case '-':
                if (text[contAux].toLowerCase() == '-'.toLowerCase()) {
                    palabra += text[contAux];
                    contador++;
                }
                break;
        }
    }
    return palabra;
}

function PalabrasReservadas(lista){
    let cont=0;
    let cont2=0
    for(tok in lista){
        cont=tok;
        if(lista[cont][2]=='identificador'){            
            for(etq in PR){
                cont2=etq;
                if(lista[cont][3]==PR[cont2]){
                    lista[cont][2]='PalabraReservada';
                    break;
                }
                else if(lista[cont][3]=='true' || lista[cont][3]=='false'){
                    lista[cont][2]='Booleano'
                    break;
                }

            }
        }
    }
    return lista;
}

function listToString(listtoken, tipo) {
    let stri = "";
    let counter = 0;
    let count = 0;
    while (count < listtoken.length) {
        for (token2 in listtoken[count]) {
            counter = token2;
            if (counter == 0) {
                stri += "[" + listtoken[count][counter] + ", ";
            }
            else if (counter == 1) {
                stri += listtoken[count][counter] + ", ";
            }
            else if (counter == 2) {
                if (tipo == "Token") {
                    stri += listtoken[count][counter] + ",  ";
                }
                else if (tipo == "Error") {
                    stri += listtoken[count][counter] + "]\n";
                }
            }
            else if (counter == 3) {
                stri += listtoken[count][counter] + "]\n";
            }

        }
        count++;
    }

    return stri;
}







module.exports = Main;