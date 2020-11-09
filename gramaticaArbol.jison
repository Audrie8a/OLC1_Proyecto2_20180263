/*--------------------------------------Importaciones--------------------------------------*/
%{

    const Nodo= require('./Arbol/nodo');
    let Traduccion="";
    let listError=[];
    
    %}

/*----------------------------------- Definición Léxica -----------------------------------*/
%lex

%options case-insensitive

%%
\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"int"			        return 'tint';
"double"			    return 'tdouble';
"char"				    return 'tchar';
"string"                return 'tstring';
"boolean"			    return 'tboolean';
"system"                return 'tsystem';
"out"                   return 'tout';
"print"                 return 'tprint';
"println"               return 'tprintln';
"."                     return 'punto'  
"system.out.println"    return 'TSOUTLN';
"if"				    return 'tif';
"else"				    return 'telse';
"true"				    return 'ttrue';
"false"				    return 'tfalse';
"while"                 return 'twhile';
"public"                return 'tpublic';
"class"                 return 'tclass';
"interface"             return 'tinterface';
"void"                  return 'tvoid';
"for"                   return 'tfor';
"then"                  return 'tthen';
"break"                 return 'tbreak';
"continue"              return 'tcontinue';
"return"                return 'treturn';
"static"                return 'tstatic';
"main"                  return 'tmain';
"do"                    return 'tdo';
"args"                  return 'targs';



";"					    return 'ptcoma';
"{"					    return 'llavea';
"}"					    return 'llavec';
"("					    return 'para';
")"					    return 'parc';
"["                     return 'cora';
"]"                     return 'corc';
","                     return 'coma';


"&&"				    return 'and';
"||"				    return 'or';
"<="				    return 'menor_igual';
">="				    return 'mayor_igual';
"=="				    return 'igualigual';
"!="				    return 'diferente';
"++"                    return 'incre';
"--"                    return 'decre';
"+"					    return 'mas';
"-"					    return 'menos';
"*"					    return 'por';
"/"					    return 'div';
"="                     return 'igual';

"^"                     return 'xor';
"!"					    return 'not';

"<"					    return 'menorque';
">"					    return 'mayroque';

\"[^\"]*\"	                                                    return 'cadena'; 
"'"[^']"'"				                                        return 'caracter';
[0-9]+("."[0-9]+)\b  											return 'decimal';
[0-9]+\b														return 'numero';
([a-zA-Z])[a-zA-Z0-9_]*	                                        return 'identificador';

<<EOF>>				return 'EOF';

.					{ 
                                        //No., TipoError, Fila, Columna, Descripcion
                        listError.push(['Lexico',yylloc.first_line, yylloc.first_column,'El carácter: '+yytext+' no pertenece al lenguaje.']);
                    }

/lex


/* Asociación de operadores y precedencia */
%left 'or'
%left 'and'
%left 'igualigual' 'diferente'
%left 'mayroque' 'menorque' 'menor_igual' 'mayor_igual'
%left 'mas' 'menos'
%left 'por' 'div'
%left 'xor'
%left 'incre' 'decre'
%right 'UMENOS' 'UNOT'

%start INI

%% /* Definición de la gramática */

INI
	: LISTCI EOF {
        $$= new Nodo ("INI","");
        $$.agregarHijo($1);
		// cuando se haya reconocido la entrada completa retornamos la entrada traducida
		return $$;
	}
;

LISTCI
	: LISTCI CI 	        { $$ = new Nodo ("LISTCI","");
                              $$.agregarHijo($1);
                              $$.agregarHijo($2) ;}
	| CI					{ $$ = new Nodo ("LISTCI","");
                              $$.agregarHijo($1) ;}
;

CI
    : tpublic CLASINTER identificador BLOQUE         { $$ = new Nodo ("CI","");
                                                       $$.agregarHijo(new Nodo("public","Modificador"));
                                                       $$.agregarHijo($2);
                                                       $$.agregarHijo(new Nodo($3,"Id"));
                                                       $$.agregarHijo($4);
                                                       }
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

CLASINTER
    : tclass                            {$$= new Nodo("CLASINTER","");
                                         $$.agregarHijo(new Nodo("class","Clase"));}            
    | tinterface                        {$$= new Nodo("CLASINTER","");
                                         $$.agregarHijo(new Nodo("interface","Interfaz"));}
;

BLOQUE
    : llavea CONTENIDOSC llavec         { $$ = new Nodo("Bloque","") 
                                          $$.agregarHijo(new Nodo("{","LlaveA"));
                                          $$.agregarHijo($2);
                                          $$.agregarHijo(new Nodo("}","LlaveC"));}
    | llavea llavec                     { $$ = new Nodo("Bloque","");
                                          $$.agregarHijo("{","LlaveA");
                                          $$.agregarHijo("}","LlaveC");}
;
CONTENIDOSC
    : CONTENIDOSC CONTENIDOC        { $$ = new Nodo("CONTENIDOSC","");
                                      $$.agregarHijo($1);
                                      $$.agregarHijo($2);}
    | CONTENIDOC                    { $$ = new Nodo("CONTENIDOSC","");
                                      $$.agregarHijo($1);}
;

CONTENIDOC
    : LLAMADAMF ptcoma              { $$ = new Nodo("CONTENIDOC","") ;
                                      $$.agregarHijo($1);
                                      $$.agregarHijo(new Nodo(";","Ptcoma"));}
    | LLAMADA ptcoma                { $$ = new Nodo("CONTENIDOC","");
                                      $$.agregarHijo($1);
                                      $$.agregarHijo(";","Ptcoma");}
    | tpublic MF                    { $$ = new Nodo("CONTENIDOC","");
                                      $$.agregarHijo("public","Modificador");
                                      $$.agregarHijo($2);}
    | VARIABLES                     { $$ = new Nodo ("CONTENIDOC","");
                                      $$.agregarHijo($1);}
    | error ptcoma{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: ;']);
    }
;

LLAMADAMF
    : identificador para DATOS parc        { $$ = new Nodo("LLAMADAMF","");
                                             $$.agregarHijo(new Nodo($1,"Id"));
                                             $$.agregarHijo(new Nodo("(","ParetesisA"));
                                             $$.agregarHijo($3);
                                             $$.agregarHijo(new Nodo(")","ParentesisC")); }
;

MF
    : TIPO identificador para PARAMETROS parc DAMF                             { $$ = new Nodo("MF","") ;
                                                                                 $$.agregarHijo($1);
                                                                                 $$.agregarHijo(new Nodo($2,"Id"));
                                                                                 $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                                 $$.agregarHijo($4);
                                                                                 $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                                 $$.agregarHijo($6);}
    | TIPO identificador para parc  DAMF                                       { $$ = new Nodo("MF","") ;
                                                                                 $$.agregarHijo($1);
                                                                                 $$.agregarHijo(new Nodo($2,"Id"));
                                                                                 $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                                 $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                                 $$.agregarHijo($5);}        
    | tvoid identificador para PARAMETROS parc DAMF                            { $$ = new Nodo("MF","") ;
                                                                                 $$.agregarHijo(new Nodo("void","Metodo"));
                                                                                 $$.agregarHijo(new Nodo($2,"Id"));
                                                                                 $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                                 $$.agregarHijo($4);
                                                                                 $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                                 $$.agregarHijo($6);}
    | tvoid identificador para parc DAMF                                       { $$ = new Nodo("MF","") ;
                                                                                 $$.agregarHijo(new Nodo("void","Metodo"));
                                                                                 $$.agregarHijo(new Nodo($2,"Id"));
                                                                                 $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                                 $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                                 $$.agregarHijo($5);}
    | tstatic tvoid tmain para tstring cora corc targs parc BLOQUEI            { $$ = new Nodo("MF","") ;
                                                                                 $$.agregarHijo(new Nodo("static","Static"));
                                                                                 $$.agregarHijo(new Nodo("void","Metodo"));
                                                                                 $$.agregarHijo(new Nodo("main","Main"));
                                                                                 $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                                 $$.agregarHijo(new Nodo("string","String"));
                                                                                 $$.agregarHijo(new Nodo("[","CorcheteA"));
                                                                                 $$.agregarHijo(new Nodo("]","CorcheteC"));
                                                                                 $$.agregarHijo(new Nodo("args","Args"));
                                                                                 $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                                 $$.agregarHijo($10);}
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

BLOQUEI 
    : llavea INSTRUCCIONES llavec           { $$ = new Nodo("BLOQUEI","");
                                              $$.agregarHijo(new Nodo("{","LlaveA"));
                                              $$.agregarHijo($2);
                                              $$.agregarHijo(new Nodo("}","LlaveC"));}
    | llavea llavec                         { $$ = new Nodo("BLOQUEI","");
                                              $$.agregarHijo(new Nodo("{","LlaveA"));
                                              $$.agregarHijo(new Nodo("}","LlaveC"));}  
;

VARIABLES
    : TIPO MASVARIABLES                     { $$ = new Nodo("VARIABLES","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo($2);}
;

MASVARIABLES
    : identificador igual EXP OPCION        { $$ = new Nodo("MASVARIABLES","");
                                              $$.agregarHijo(new Nodo($1,"Id"));
                                              $$.agregarHijo(new Nodo("=","Igual"));
                                              $$.agregarHijo($3);
                                              $$.agregarHijo($4) ;}
    | identificador OPCION                  { $$ = new Nodo("MASVARIABLES","");
                                              $$.agregarHijo(new Nodo($1,"Id"));
                                              $$.agregarHijo($2) ;}
;

OPCION
    : coma MASVARIABLES                     { $$ = new Nodo("OPCION","");
                                              $$.agregarHijo(new Nodo(",","Coma"));
                                              $$.agregarHijo($2) ;}
    | ptcoma                                { $$ = new Nodo("OPCION","");
                                              $$.agregarHijo(new Nodo(";","Ptcoma"));}
;

TIPO
    : tint                                  {$$=new Nodo("TIPO","");
                                             $$.agregarHijo("int","Tipo");}  
    | tdouble                               {$$=new Nodo("TIPO","");
                                             $$.agregarHijo("double","Tipo");}  
    | tstring                               {$$=new Nodo("TIPO","");
                                             $$.agregarHijo("string","Tipo");}  
    | tchar                                 {$$=new Nodo("TIPO","");
                                             $$.agregarHijo("char","Tipo");}  
    | tboolean                              {$$=new Nodo("TIPO","");
                                             $$.agregarHijo("boolean","Tipo");}  
;

DAMF
    : BLOQUEI                                   { $$ =new Nodo("DAMF","");
                                                  $$.agregarHijo($1);}  
    | ptcoma                                    { $$ =new Nodo("DAMF","");
                                                  $$.agregarHijo(new Nodo(";","Ptcoma"));}
;

PARAMETROS
    : PARAMETROS coma TIPO identificador        { $$ =new Nodo("PARAMETROS","");
                                                  $$.agregarHijo($1);
                                                  $$.agregarHijo(new Nodo(",","Coma"));
                                                  $$.agregarHijo($3);
                                                  $$.agregarHijo(new Nodo($4, "Id"));}
    | TIPO identificador                        { $$ =new Nodo("PARAMETROS","");
                                                  $$.agregarHijo($1);
                                                  $$.agregarHijo(new Nodo($2,"Id"));}
;

DATOS
    : EXP MASDATOS                              { $$ =new Nodo("DATOS","");
                                                  $$.agregarHijo($1);
                                                  $$.agregarHijo($2);}
    | EXP                                       { $$ =new Nodo("DATOS","");
                                                  $$.agregarHijo($1) ;}
;

MASDATOS
    : coma DATOS                                { $$ = new Nodo("MASDATOS","");
                                                  $$.agregarHijo(new Nodo(",","Coma"));
                                                  $$.agregarHijo($2);}
;
INSTRUCCIONES
    : INSTRUCCIONES INSTRUCCION                 { $$ =new Nodo("INSTRUCCIONES","");
                                                  $$.agregarHijo($1);
                                                  $$.agregarHijo($2) ;}
    | INSTRUCCION                               { $$ =new Nodo("INSTRUCCIONES","");
                                                  $$.agregarHijo($1) ;} 
;

INSTRUCCION
    : VARIABLES                                                   { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1);}  
    | LLAMADAMF ptcoma                                            { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | LLAMADA ptcoma                                              { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | PRINT ptcoma                                                { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | INCREDECRE ptcoma                                           { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | SBCR                                                        { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;} 
    | SENTENCIASC                                                 { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;}
    | SR_FOR                                                      { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;}  
    | SR_WHILE                                                    { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;}  
    | SR_DOWHILE                                                  { $$ =new Nodo("INSTRUCCION","");
                                                                    $$.agregarHijo($1) ;} 
    | error ptcoma{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: ;']);
    }
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

SR_FOR
    : tfor para DEC ptcoma EXP ptcoma EXP parc  BLOQUEI           { $$ =new Nodo("SR_FOR","");
                                                                    $$.agregarHijo(new Nodo("for","For"));
                                                                    $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                    $$.agregarHijo($3);
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma"));
                                                                    $$.agregarHijo($5);
                                                                    $$.agregarHijo(new Nodo(";","Ptcoma"));
                                                                    $$.agregarHijo($7);
                                                                    $$.agregarHijo(new Nodo("(","ParentesisC"));
                                                                    $$.agregarHijo($9) ;} 
;

SR_WHILE
    : twhile para EXP parc BLOQUEI                                { $$ = new Nodo("SR_WHILE","");
                                                                    $$.agregarHijo(new Nodo("while","While"));
                                                                    $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                    $$.agregarHijo($3);
                                                                    $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                    $$.agregarHijo($5);}
;

SR_DOWHILE
    : tdo BLOQUEI twhile para EXP parc ptcoma                     { $$ =new Nodo("SR_DOWHILE","");
                                                                    $$.agregarHijo(new Nodo("do", "Do"));
                                                                    $$.agregarHijo($2);
                                                                    $$.agregarHijo(new Nodo("while", "While"));
                                                                    $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                    $$.agregarHijo($5);
                                                                    $$.agregarHijo(new Nodo("(","ParentesisC")); 
                                                                    $$.agregarHijo(new Nodo(";","Ptocoma"));}
;

SENTENCIASC
    : tif para EXP parc BLOQUEI ELSE                              { $$ =new Nodo("SENTENCIASC","");
                                                                    $$.agregarHijo(new Nodo("if","If"));
                                                                    $$.agregarHijo(new Nodo("(", "ParentesisA"));
                                                                    $$.agregarHijo($3);
                                                                    $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                    $$.agregarHijo($5);
                                                                    $$.agregarHijo($6) ;}
    | tif para EXP parc BLOQUEI                                   { $$ =new Nodo("SENTENCIASC","");
                                                                    $$.agregarHijo(new Nodo("if","If"));
                                                                    $$.agregarHijo(new Nodo("(", "ParentesisA"));
                                                                    $$.agregarHijo($3);
                                                                    $$.agregarHijo(new Nodo(")","ParentesisC"));
                                                                    $$.agregarHijo($5) ;}
;

LLAMADA
    : identificador igual EXP                                     { $$ = new Nodo("LLAMADA","");
                                                                    $$.agregarHijo(new Nodo($1,"Id"));
                                                                    $$.agregarHijo(new Nodo("=","Igual"));
                                                                    $$.agregarHijo($3);}
;

INCREDECRE
    : identificador incre                                         { $$ = new Nodo ("INCREDECRE","");
                                                                    $$.agregarHijo(new Nodo ($1,"Id"));
                                                                    $$.agregarHijo(new Nodo("++","Incremento"));     }
    | identificador decre                                         { $$ = new Nodo ("INCREDECRE","");
                                                                    $$.agregarHijo(new Nodo($1,"Id"));
                                                                    $$.agregarHijo(new Nodo("--","Decremento"));     }    
;

PRINT 
    : tsystem punto tout punto OPCIONPRINT para EXP parc          { $$ = new Nodo("PRINT","");
                                                                    $$.agregarHijo(new Nodo("system","System"));
                                                                    $$.agregarHijo(new Nodo(".","Punto"));
                                                                    $$.agregarHijo(new Nodo("out","Out"));
                                                                    $$.agregarHijo(new Nodo(".","Punto"));
                                                                    $$.agregarHijo($5);
                                                                    $$.agregarHijo(new Nodo("(","ParentesisA"));
                                                                    $$.agregarHijo($7);
                                                                    $$.agregarHijo(new Nodo(")","ParentesisC"));}
;

OPCIONPRINT
    : tprint                                                      {$$= new Nodo("OPCIONPRINT","");
                                                                    $$.agregarHijo(new Nodo("print","Print"));}  
    | tprintln                                                    {$$= new Nodo("OPCIONPRINT","");
                                                                    $$.agregarHijo(new Nodo("println","Println"));}  
;

ELSE 
    : telse OPCIONELSE                         { $$ =new Nodo("ELSE","");
                                                 $$.agregarHijo(new Nodo("else","Else"));
                                                 $$.agregarHijo($2) ;}
;

OPCIONELSE
    : BLOQUEI                                  { $$ =new Nodo("OPCIONELSE","");
                                                 $$.agregarHijo($1) ;}
    | SENTENCIASC                              { $$ =new Nodo("OPCIONELSE","");
                                                 $$.agregarHijo($1) ;}
;   

DEC 
    : TIPO LLAMADA                             { $$ =new Nodo("DEC","");
                                                 $$.agregarHijo($1);
                                                 $$.agregarHijo($2) ;}
    | TIPO identificador                       { $$ =new Nodo("DEC","");
                                                 $$.agregarHijo($1);
                                                 $$.agregarHijo(new Nodo($2,"Id")) ;}
    | INCREDECRE                               { $$ =new Nodo("DEC","");
                                                 $$.agregarHijo($1) ;}
;

SBCR
    : tbreak ptcoma                            { $$ =new Nodo("SBCR","");
                                                 $$.agregarHijo(new Nodo("break","Break"));
                                                 $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | tcontinue ptcoma                         { $$ =new Nodo("SBCR","");
                                                 $$.agregarHijo(new Nodo("continue","Continue"));
                                                 $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
    | treturn EXP ptcoma                       { $$ =new Nodo("SBCR","");
                                                 $$.agregarHijo(new Nodo("return","Return"));
                                                 $$.agregarHijo($2);
                                                 $$.agregarHijo(new Nodo(";","Ptcoma")) ;}    
    | treturn ptcoma                           { $$ =new Nodo("SBCR","");
                                                 $$.agregarHijo(new Nodo("return","Return"));
                                                 $$.agregarHijo(new Nodo(";","Ptcoma")) ;}
;

EXP
	: EXP mas EXP                           { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("+","Suma"));
                                              $$.agregarHijo($3);                      }
    | EXP menos EXP                         { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("-","Resta"));
                                              $$.agregarHijo($3);                      }
    | EXP por EXP                           { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("/","Multiplicacion"));
                                              $$.agregarHijo($3);                      }
    | EXP div EXP                           { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("/","Division"));
                                              $$.agregarHijo($3);                      }
    | EXP xor EXP                           { $$ = new Nodo ("E","")
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("^","Xor"));
                                              $$.agregarHijo($3);                      }
    | menos EXP %prec UMENOS	            { $$ = new Nodo ("-","Negativo") 
                                              $$.agregarHijo(new Nodo("-","Negativo"))
                                              $$.agregarHijo($2)            ;} 
    | numero                                { $$ = new Nodo ($1, 'Entero');}
    | decimal                               { $$ = new Nodo ($1, 'Decimal');}
    | caracter                              { $$ = new Nodo ($1, 'Caracter') ;}
    | cadena                                { $$ = new Nodo ($1, 'Cadena');}
    | ttrue                                 { $$ = new Nodo ($1, 'Booleano');}
	| tfalse                                { $$ = new Nodo ($1, 'Booleano');}
    | identificador                         { $$ = new Nodo ($1, 'Idenitificador');}
    | INCREDECRE                            
    | EXP igualigual EXP                    { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("==","Igualdad"));
                                              $$.agregarHijo($3);                      }
    | EXP diferente EXP                     { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("!=","Diferencia"));
                                              $$.agregarHijo($3);                      }
    | EXP menorque EXP                      { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("<","Menor que"));
                                              $$.agregarHijo($3);                      }
    | EXP mayroque EXP                      { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo(">","Mayor que"));
                                              $$.agregarHijo($3);                      }
    | EXP menor_igual EXP                   { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("<=","Menor igual"));
                                              $$.agregarHijo($3);                      }
    | EXP mayor_igual EXP                   { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo(">","Mayor igual"));
                                              $$.agregarHijo($3);                      }
    | EXP and EXP                           { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("&&","And"));
                                              $$.agregarHijo($3);                      }
    | EXP or EXP                            { $$ = new Nodo ("E","");
                                              $$.agregarHijo($1);
                                              $$.agregarHijo(new Nodo("||","Or"));
                                              $$.agregarHijo($3);                      }
    | not EXP %prec UNOT                    { $$ = new Nodo ("!","Not") 
                                              $$.agregarHijo(new Nodo("!","Not"))
                                              $$.agregarHijo($2)            ;} 
    | para EXP parc                         { $$ = new Nodo ("E","");
                                              $$.agregarHijo($2); }
    | identificador para DATOS parc         { $$ = new Nodo ($1, 'Funcion');}
    | para error parc                       
;