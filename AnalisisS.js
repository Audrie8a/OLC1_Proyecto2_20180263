const { response, text } = require("express");
const Main = require("./AnalisisL");


var ErrorSintactico = false;
var listError = [];
var actualT;
var siguienteT;
var contador = 0;
var Token;
var tokensArbol = [];


var Tipo = ['int', 'boolean', 'double', 'string', 'char'];
var Valor = ['Cadena', 'Caracter', 'Numero', 'Decimal', 'Booleano']
var Operador = ['OperadorL', 'OperadorR', 'OperadorA'];

function Main2(Lista) {
    console.log("PARTE SINTÁCTICA");
    Token = Lista;
    AnalisisSintactico(Lista);
    //console.log("PARTE SINTÁCTIC");
    //console.log(listToString(tokensArbol, 'Token'));
    //console.log(listToString(listError,'Error'));
    return tokensArbol;
}

//Listo
function AnalisisSintactico(Tokens) {
    LimpiarLista(listError);
    actualT = Tokens[contador];
    siguienteT = Token[contador + 1];
    contador = 0;
    INI();
    return tokensArbol;

}

//Listo
function INI() {
    Parea('public', 'no');
    Principal();
    Mas();
}

//Listo
function Principal() {
    if (actualT[3] == 'class') {
        Parea('class', 'no');
        Parea('id', actualT[2]);
        Parea('{', 'no');
        ContenidoC();
        Parea('}', 'no');
    }
    else if (actualT[3] == 'interface') {
        Parea('interface', 'no');
        Parea('id', actualT[2]);
        Parea('{', 'no');
        ContenidoI();
        Parea('}', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Principal();
        }
    }
    else {
        ErrorSintactico = true;
        Parea('', 'class o interface');
        if (contador < Token.length - 1) {
            Principal();
        }
    }
}

//Listo
function Mas() {
    if (actualT[3] == 'public') {
        INI();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Mas();
        }
    }
    else {
        return;
    }
}

//Listo
function ContenidoC() {
    if (actualT[3] == 'public') {
        Parea('public', 'no');
        MF();
        ContenidoC();
    }else if(actualT[2]=='identificador' && siguienteT[3]=='('){
        LlamadaMF();
        Parea(';','no');
        ContenidoC();
    } 
    else if (actualT[2] == 'identificador' || Tipo.find(Element => actualT[3] == Element) != null) {
        variables();
        ContenidoC();
    }
    else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            ContenidoC();
        }
    }
    else {
        return;
    }
}

//Listo
function MF() {
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        Parea(Tipo.find(Element => actualT[3] == Element), 'no');
        Parea('id', actualT[2]);
        Parea('(', 'no');
        Parametros();
        Parea(')', 'no');
        DAF();
    }
    else if (actualT[3] == 'void') {
        Parea('void', 'no');
        Parea('id', actualT[2]);
        Parea('(', 'no');
        Parametros();
        Parea(')', 'no');
        DAM();
    }
    else if (actualT[3] == 'static') {
        Parea('static', 'no');
        Parea('void', 'no');
        Parea('main', 'no');
        Parea('(', 'no');
        Parea('string', 'no');
        Parea('[', 'no');
        Parea(']', 'no');
        Parea('args', 'no');
        Parea(')', 'no');
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            MF();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'tipo dato, void o static']);
        Parea('', 'tipo dato, void o static');
        if (contador < Token.length - 1) {
            MF();
        }
    }
}

//Listo
function Instrucciones() {
    if (actualT[3] == 'for' || actualT[3] == 'while' || actualT[3] == 'do' || actualT[3] == 'if') {
        Sentencias();
        MasInstrucciones();
    } else if (actualT[2] == 'identificador' && siguienteT[3] == '(') {
        LlamadaMF();
        Parea(';', 'no');
        MasInstrucciones();
    } 
    else if (actualT[2] == 'identificador' || Tipo.find(Element => actualT[3] == Element) != null) {
        variables();
        MasInstrucciones();
    }
    else if (actualT[3] == 'system.out.print' || actualT[3] == 'system.out.println') {
        Print();
        MasInstrucciones();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Instrucciones();
        }
    } else if (actualT[3] == 'break' || actualT[3] == 'continue' || actualT[3] == 'return') {

        SBCR();
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'for, while, do, if, identificador, system.out.print, system.out.println,id o variable']);
        Parea('', 'for, while, do, if, identificador, system.out.print, system.out.println,id o variable');
        if (contador < Token.length - 1) {
            Instrucciones();
        }
    }
}

//Listo
function MasInstrucciones() {
    if (actualT[3] == 'for' || actualT[3] == 'while' || actualT[3] == 'do' || actualT[3] == 'if' || actualT[2] == 'identificador'
        || actualT[3] == 'system.out.print' || actualT[3] == 'system.out.println' || Tipo.find(Element => actualT[3] == Element) != null
        || actualT[3] == 'break' || actualT[3] == 'continue' || actualT[3] == 'return') {
        Instrucciones();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            MasInstrucciones();
        }
    } else {
        return;
    }
}

//Listo
function Sentencias() {
    if (actualT[3] == 'for' || actualT[3] == 'while' || actualT[3] == 'do') {
        SentenciasR();
    } else if (actualT[3] == 'if') {
        SentenicasC();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Sentencias();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'for, while, do o if']);
        Parea('', 'for, while, do o if');
        if (contador < Token.length - 1) {
            Sentencias();
        }
    }
}

//Listo
function SentenciasR() {
    if (actualT[3] == 'for') {
        Parea('for', 'no');
        Parea('(', 'no');
        DEC();
        EXP();
        Parea(';', 'no');
        EXP();
        Parea(')', 'no');
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');

    } else if (actualT[3] == 'while') {
        Parea('while', 'no');
        Parea('(', 'no');
        EXP();
        Parea(')', 'no');
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
    } else if (actualT[3] == 'do') {
        Parea('do', 'no');
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
        Parea('while', 'no');
        Parea('(', 'no');
        EXP();
        Parea(')', 'no');
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            SentenciasR();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'for, while o do']);
        Parea('', 'for, while o do');
        if (contador < Token.length - 1) {
            SentenciasR();
        }
    }
}

//Listo
function SentenicasC() {
    Parea('if', 'no');
    Parea('(', 'no');
    EXP();
    Parea(')', 'no');
    Parea('{', 'no');
    Instrucciones();
    Parea('}', 'no');
    Elif();
    Else();
}

//Listo
function Else() {
    if (actualT[3] == 'else') {
        Parea('else', 'no');
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Else();
        }
    } else {
        return;
    }
}

//Listo
function Elif() {
    if (actualT[3] == 'else' && siguienteT[3] == 'if') {
        Parea('else', 'no');
        SentenicasC();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Elif();
        }
    } else {
        return;
    }
}

//Listo
function DEC() {
    Parea(Tipo.find(Element => actualT[3] == Element), 'no');
    Parea('id', actualT[2]);
    MasVariables();
}

//Listo
function SBCR() {
    if (actualT[3] == 'break') {
        Parea('break', 'no');
        Parea(';', 'no');
    } else if (actualT[3] == 'continue') {
        Parea('continue', 'no')
        Parea(';', 'no');
    } else if (actualT[3] == 'return') {
        Parea('return', 'no');
        if (actualT[3] != ';') {
            opcion();
        }
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            SBCR();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'system.out.println o system.out.print']);
        Parea('', 'system.out.println o system.out.print');
        if(contador < Token.length - 1){
        SBCR();
        }
    }
}

//Listo
function Print() {
    if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            Print();
        }
    }
    else if (actualT[3] == 'system.out.print') {
        Parea('system.out.print', 'no');
    } else if (actualT[3] == 'system.out.println') {
        Parea('system.out.println', 'no');
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'system.out.println o system.out.print']);
        Parea('', 'system.out.println o system.out.print');
    }
    Parea('(', 'no');
    EXP();
    Parea(')', 'no');
    Parea(';', 'no');
}

//Listo
function DAF() {
    if (actualT[3] == '{') {
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
    }
    else if (actualT[3] == ';') {
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            DAF();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], '{ ó ;']);
        Parea('', '{ ó ;');
        if (contador < Token.length - 1) {
            DAF();
        }
    }
}

//Listo
function opcion() {
    if (actualT[2] == 'identificador' || actualT[3] == '!' || actualT[3] == '(' || actualT[3] == '-' || Valor.find(Element => actualT[2] == Element) != null) {
        EXP();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            opcion();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'id, valor o expresion ']);
        Parea('', 'id, valor, expresion o llamar a una función ');
        if (contador < Token.length - 1) {
            opcion();
        }
    }
}

//Listo
function EXP() {
    T();
    EP();
}

//Listo
function T() {
    F();
    TP();
}

//Listo
function EP() {
    if (actualT[3] == '+' || actualT[3] == '-' || actualT[3] == '||' || actualT[3] == '>' ||
        actualT[3] == '<' || actualT[3] == '>=' || actualT[3] == '<=') {
        Parea('op', actualT[2]);
        T();
        EP();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            EP();
        }
    } else {
        return;
    }
}

//Listo
function TP() {
    if (actualT[3] == '*' || actualT[3] == '/' || actualT[3] == '==' || actualT[3] == '!='
        || actualT[3] == '&&' || actualT[3] == '^') {
        Parea('op', actualT[2]);
        F();
        TP();
    }
    if (actualT[3] == '++' || actualT[3] == '--') {
        Parea('op', actualT[2]);
        TP();
    }
    else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            TP();
        }
    } else {
        return;
    }
}

//Listo
function F() {
    if (actualT[2] == 'identificador') {
        if (siguienteT[3] == '(') {
            LlamadaMF();
        } else {
            Parea('id', actualT[3]);
        }
    } else if (Valor.find(Element => actualT[2] == Element) != null) {
        Parea(Valor.find(Element => actualT[2] == Element) != null, 'Valor');
    }
    else if (actualT[3] == '(') {
        Parea('(', 'no');
        EXP();
        Parea(')', 'no');
    } else if (actualT[3] == '-' || actualT[3] == '!') {
        Parea('op', actualT[2]);
        EXP();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            opcion();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'id, valor o expresion ']);
        Parea('', 'id, valor, expresion o llamar a una función ');
        if(contador < Token.length - 1){
            F();
        }
    }
}

//Listo
function LlamadaMF() {
    Parea('id', actualT[2]);
    Parea('(', 'no');
    Parametros();
    Parea(')', 'no');
}

function SIMB() {
    if (actualT[3] == '-') {
        Parea('-', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            SIMB();
        }
    } else {
        return;
    }
}
//Listo
function DAM() {
    if (actualT[3] == '{') {
        Parea('{', 'no');
        Instrucciones();
        Parea('}', 'no');
    }
    else if (actualT[3] == ';') {
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            DAM();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], '{ ó ;']);
        Parea('', '{ ó ;');
        if (contador < Token.length - 1) {
            DAM();
        }
    }
}

//Listo
function Parametros() {
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        Parea(Tipo.find(Element => actualT[3] == Element), 'no');
        Parea('id', actualT[2]);
        MasParametros();
    } else if (actualT[3] == '!' || actualT[3] == '-' || actualT[3] == '(' || actualT[2] == 'identificador' || Valor.find(Element => actualT[2] == Element) != null) {
        EXP();
        MasParametros();
    }
    else {
        return;
    }

}

//Listo
function MasParametros() {
    if (actualT[3] == ',') {
        Parea(',', 'no');
        Parametros();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if (contador < Token.length - 1) {
            MasParametros();
        }
    }
    else {
        return;
    }
}

//Listo     Revisar Gramática 
function variables() {
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        Parea(Tipo.find(Element => actualT[3] == Element), 'no');
        Parea('id', actualT[2]);
        MasVariables();
    }
    else if (actualT[2] == 'identificador') {
        Parea('id', actualT[2]);
        if(actualT[3]=='++' || actualT[3]=='--'){
            Parea('op',actualT[2]);
            Parea(';','no');
            return;
        }
        Parea('=', 'no');
        opcion();
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            variables();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'Tipo o id']);
        Parea('', 'Tipo o id');
        if (contador < Token.length - 1) {
            variables();
        }
    }
}

//Listo
function MasVariables() {
    if (actualT[3] == ',') {
        Parea(',', 'no');
        Parea('id', actualT[2]);
        MasVariables();
    }
    else if (actualT[3] == '=') {
        Parea('=', 'no');
        opcion();
        opcion2();
    }
    else if (actualT[3] == ';') {
        Parea(';', 'no');
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            MasVariables();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'coma, = ó ;']);
        Parea('', 'coma, = ó ;');
        if (contador < Token.length - 1) {
            MasVariables();
        }
    }
}

//Listo
function opcion2() {
    if (actualT[3] == ',') {
        Parea(',', 'no');
        Parea('id', actualT[2]);
        MasVariables();
    }
    else if (actualT[3] == ';') {
        Parea(';', 'no');
    }
    else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            opcion2();
        }
    }
    else {
        ErrorSintactico = true;
        listError.push([actualT[3], ', ó ;']);
        Parea('', ', ó ;');
        if (contador < Token.length - 1) {
            opcion2();
        }
    }
}

//Listo
function ContenidoI() {
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        DEC();
        MDEC();
    }
    else if (actualT[3] == 'public') {
        DECMF();
        MDECMF();
    }

    else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            ContenidoI();
        }
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], 'coma, =, ; ó (']);
        Parea('', 'coma, =, ; ó (');
        if (contador < Token.length - 1) {
            ContenidoI();
        }
    }
}

//Listo
function MDEC() {
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        DEC();
        MDEC();
    }
    else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            MDEC();
        }
    }
    else {
        return;
    }
}

//Listo
function DECMF() {
    Parea('public', 'no');
    if (Tipo.find(Element => actualT[3] == Element) != null) {
        Parea(Tipo.find(Element => actualT[3] == Element), 'no');
    } else if (actualT[3] == 'void') {
        Parea('void', 'no');
    } else {
        ErrorSintactico = true;
        listError.push([actualT[3], "tipo o void"]);
        Parea('', "tipo o void");
    }
    Parea('id', actualT[2]);
    Parea('(', 'no');
    Parametros();
    Parea(')', 'no');
    Parea(';', 'no');
}

//Listo
function MDECMF() {
    if (actualT[3] == 'public') {
        DECMF();
        MDECMF();
    } else if (actualT[2] == 'Comentario') {
        Parea('', 'Comentario');
        if(contador < Token.length - 1){
            MDECMF();
        }
    } else {
        return;
    }
}

//Listo
function Parea(token, tipoToken) {
    if (contador < Token.length - 1) {
        if (ErrorSintactico == true) {
            contador++;
            actualT = Token[contador];
            siguienteT = Token[contador + 1];
            if (actualT[3] == ';' || actualT[3] == '}') {
                ErrorSintactico = false;
            }
        }
        else {
            if (tipoToken == 'no') {
                if (actualT[3] == token) {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT = Token[contador + 1];
                } else if (actualT[2] == 'Comentario') {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT=Token[contador+1];
                    Parea(token, tipoToken);
                }
                else {                                          //Lo que se verá al imprimir 
                    listError.push([actualT[3], token]);    //Error Sintáctico en: actualT, Se esperaba: token;
                    ErrorSintactico = true;
                    console.log("Error Sintáctico en:" + actualT[3] + ", Se esperaba:" + token);
                }
            } else if (token == 'id') {
                if (actualT[2] == "identificador") {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT = Token[contador + 1];
                    finalT = Token[contador + 2];
                } else if (actualT[2] == 'Comentario') {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    Parea(token, tipoToken);
                }
                else {                                          //Lo que se verá al imprimir 
                    listError.push([actualT[3], tipoToken]);    //Error Sintáctico en: actualT, Se esperaba: token;
                    ErrorSintactico = true;
                    console.log("Error Sintáctico en:" + actualT[3] + ", Se esperaba:" + tipoToken);
                }
            } else if (token == 'op') {
                if (Operador.find(Element => actualT[2] == Element) != null) {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT = Token[contador + 1];
                    finalT = Token[contador + 2];
                } else if (actualT[2] == 'Comentario') {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT=Token[contador+1];
                    Parea(token, tipoToken);
                }
                else {                                          //Lo que se verá al imprimir 
                    listError.push([actualT[3], tipoToken]);    //Error Sintáctico en: actualT, Se esperaba: token;
                    ErrorSintactico = true;
                    console.log("Error Sintáctico en:" + actualT[3] + ", Se esperaba:" + token);
                }
            } else if (tipoToken == 'Comentario') {
                tokensArbol.push(Token[contador]);
                console.log(actualT[3]);
                contador++;
                actualT = Token[contador];
            } else if (tipoToken == 'Valor') {
                if (Valor.find(Element => actualT[2] == Element) != null) {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT = Token[contador + 1];
                    finalT = Token[contador + 2];
                } else if (actualT[2] == 'Comentario') {
                    tokensArbol.push(Token[contador]);
                    console.log(actualT[3]);
                    contador++;
                    actualT = Token[contador];
                    siguienteT=Token[contador+1];
                    Parea(token, tipoToken);
                }
                else {                                          //Lo que se verá al imprimir 
                    listError.push([actualT[3], token]);    //Error Sintáctico en: actualT, Se esperaba: token;
                    ErrorSintactico = true;
                    console.log("Error Sintáctico en:" + actualT[3] + ", Se esperaba:" + tipoToken);
                }
            }
        }
    }
    else{return;}
}

function LimpiarLista(Lista) {
    let count = 0;
    while (count < Lista.length) {
        Lista.pop();
        count++;
    }
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
                if (tipo == "Token") {
                    stri += listtoken[count][counter] + ", ";
                } else if (tipo == "Error") {
                    stri += listtoken[count][counter] + "]\n";
                }
            }
            else if (counter == 2) {
                stri += listtoken[count][counter] + ",  ";
            }
            else if (counter == 3) {
                stri += listtoken[count][counter] + "]\n";
            }

        }
        count++;
    }

    return stri;
}


module.exports = Main2;