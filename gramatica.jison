/*--------------------------------------Importaciones--------------------------------------*/
%{
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
"="                     return 'igual';
"["                     return 'cora';
"]"                     return 'corc';
","                     return 'coma';


"+"					    return 'mas';
"-"					    return 'menos';
"*"					    return 'por';
"/"					    return 'div';
"++"                    return 'incre';
"--"                    return 'decre';

"&&"				    return 'and';
"||"				    return 'or';
"^"                     return 'xor';
"!"					    return 'not';

"<="				    return 'menor_igual';
"<"					    return 'menorque';
">="				    return 'mayor_igual';
">"					    return 'mayroque';
"=="				    return 'igualigual';
"!="				    return 'diferente';

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
		// cuando se haya reconocido la entrada completa retornamos la entrada traducida
		return $1;
	}
;

LISTCI
	: LISTCI CI 	{ $$ = `${$1}${$2}`; }
	| CI					{ $$ = `${$1}`; }
;

CI
    : tpublic CLASINTER identificador BLOQUE          {$$=`class ${$3} ${$4};`;}
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

CLASINTER
    : tclass
    | tinterface
;

BLOQUE
    : llavea CONTENIDOSC llavec         {$$=`{\n ${$2} \n}\n`;} 
    | llavea llavec                     {$$=`{\n \n}\n`;} 
;
CONTENIDOSC
    : CONTENIDOSC CONTENIDOC        { $$ = `${$1} ${$2}`; }
    | CONTENIDOC                    { $$ = `${$1}`; }
;

CONTENIDOC
    : LLAMADAMF ptcoma              { $$ = `${$1};\n`; }
    | LLAMADA ptcoma                { $$ = `${$1};\n`; }
    | tpublic MF                    { $$ = `${$2}`; }
    | VARIABLES                     { $$ = `${$1}`; }
    | error ptcoma{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: ;']);
    }
;

LLAMADAMF
    : identificador para DATOS parc        { $$ = `${$1} ( ${$3} )`; }
;

MF
    : TIPO identificador para PARAMETROS parc DAMF                             {$$=`function ${$2}(${$4}) ${$6}`;}
    | TIPO identificador para parc  DAMF                                       {$$=`function ${$2}( ) ${$5}`;}         
    | tvoid identificador para PARAMETROS parc DAMF                            {$$=`function ${$2}(${$4}) ${$6}`;}
    | tvoid identificador para parc DAMF                                       {$$=`function ${$2}( ) ${$5}`;}
    | tstatic tvoid tmain para string cora corc targs parc BLOQUEI             {$$=`function ${$3}() ${$10}`;}
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

BLOQUEI 
    : llavea INSTRUCCIONES llavec           {$$=`{\n ${$2}\n}\n`;}
    | llavea llavec                         {$$=`{\n \n}\n`;}   
;

VARIABLES
    : TIPO MASVARIABLES                     {$$=`var ${$2}`;}
;

MASVARIABLES
    : identificador igual EXP OPCION        {$$=`${$1}= ${$3} ${$4}`;}
    | identificador OPCION                  {$$=`${$1} ${$2}`;} 
;

OPCION
    : coma MASVARIABLES                     {$$=`, ${$2}`;}
    | ptcoma                                {$$=`;\n`;} 
;

TIPO
    : tint
    | tdouble
    | tstring
    | tchar
    | tboolean
;

DAMF
    : BLOQUEI                                   {$$=`${$1}`;}   
    | ptcoma                                    {$$=`;\n`;} 
;

PARAMETROS
    : PARAMETROS coma TIPO identificador        {$$=`${$1}, ${$3} ${$4}`;}
    | TIPO identificador                        {$$=`${$1} ${$2}`;}
;

DATOS
    : EXP MASDATOS                              {$$=`${$1} ${$2}`;}
    | EXP                                       {$$=`${$1}`;}
;

MASDATOS
    : coma DATOS                                {$$=`, ${2}`;}
;
INSTRUCCIONES
    : INSTRUCCIONES INSTRUCCION                 { $$ = `${$1} ${$2}`; }
    | INSTRUCCION                               { $$ = `${$1}`; } 
;

INSTRUCCION
    : VARIABLES                                                   {$$=`${$1}`;}  
    | LLAMADAMF ptcoma                                            {$$=`${$1};\n`;}
    | LLAMADA ptcoma                                              {$$=`${$1};\n`;}
    | PRINT ptcoma                                                {$$=`${$1};\n`;}   
    | INCREDECRE ptcoma                                           {$$=`${$1};\n`;}  
    | SBCR                                                        {$$=`${$1}`;} 
    | SENTENCIASC                                                 {$$=`${$1}`;}
    | SR_FOR                                                      {$$=`${$1}`;}  
    | SR_WHILE                                                    {$$=`${$1}`;}  
    | SR_DOWHILE                                                  {$$=`${$1}`;}  
    | error ptcoma{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: ;']);
    }
    | error llavec{
        listError.push(['Sintáctico',this._$.first_line,this._$.first_column,'Se encontró: '+ yytext +', se esperaba: }']);
    }
;

SR_FOR
    : tfor para DEC ptcoma EXP ptcoma EXP parc  BLOQUEI           {$$=`for (${$3}; ${$5}; ${$7})  ${$9}`;} 
;

SR_WHILE
    : twhile para EXP parc BLOQUEI                                {$$=`while( ${$3}) ${$5}`;}
;

SR_DOWHILE
    : tdo BLOQUEI twhile para EXP parc ptcoma                     {$$=`do ${$2} while(${$5});\n`;}
;

SENTENCIASC
    : tif para EXP parc BLOQUEI ELSE                              {$$=`if(${$3}) ${$5}`;}
    | tif para EXP parc BLOQUEI                                   {$$=`if(${$3}) ${$5}`;}
;

LLAMADA
    : identificador igual EXP                                     {$$=`${$1}= ${$3}`;}
;

INCREDECRE
    : identificador incre                                         {$$=`${$1} ${$2}`;}
    | identificador decre                                         {$$=`${$1} ${$2}`;}    
;

PRINT 
    : tsystem punto tout punto OPCIONPRINT para EXP parc        {$$=`console.log(${$7})`;}
;

OPCIONPRINT
    : tprint
    | tprintln
;

ELSE 
    : telse OPCIONELSE                         {$$=`else  ${$2}`;}
;

OPCIONELSE
    : BLOQUEI                                  {$$=`${$1}`;}
    | SENTENCIASC                              {$$=`${$1}`;}
;   

DEC 
    : TIPO LLAMADA                             {$$=`${$1} ${$2}`;}
;

SBCR
    : tbreak ptcoma                            {$$=`break;\n`;}
    | tcontinue ptcoma                         {$$=`continue;\n`;}
    | treturn EXP ptcoma                       {$$=`return ${$2};\n`;}    
    | treturn ptcoma                           {$$=`return;\n`;}
;

EXP
	: EXP mas EXP                           { $$ = `${$1} + ${$3}`; }
    | EXP menos EXP                         { $$ = `${$1} - ${$3}`; }
    | EXP por EXP                           { $$ = `${$1} * ${$3}`; }
    | EXP div EXP                           { $$ = `${$1} / ${$3}`; }
    | EXP xor EXP                           { $$ = `${$1} ^ ${$3}`; }
    | menos EXP %prec UMENOS	            { $$ = `- ${$2}`; }
    | numero                                { $$ = `${$1}`; }
    | decimal                               { $$ = `${$1}`; }
    | caracter                              { $$ = `${$1}`; }
    | cadena                                { $$ = `${$1}`; }
    | ttrue                                 { $$ = `true` }
	| tfalse                                { $$ = `false` }
    | identificador                         { $$ = $1 }
    | EXP incre                             { $$ = `${$1}${$2}`; }
    | EXP decre                             { $$ = `${$1}${$2}`; }
    | EXP igualigual EXP                    { $$ = `${$1} == ${$3}`; }
    | EXP diferente EXP                     { $$ = `${$1} != ${$3}`; }
    | EXP menorque EXP                      { $$ = `${$1} < ${$3}`; }
    | EXP mayroque EXP                      { $$ = `${$1} > ${$3}`; }
    | EXP menor_igual EXP                   { $$ = `${$1} <= ${$3}`; }
    | EXP mayor_igual EXP                   { $$ = `${$1} >= ${$3}`; }
    | EXP and EXP                           { $$ = `${$1} && ${$3}`; }
    | EXP or EXP                            { $$ = `${$1} || ${$3}`; }
    | not EXP %prec UNOT                    { $$ = `! ${$2}`; }
    | para EXP para                         { $$ = `( ${$2} )`; }
    | identificador para DATOS parc         { $$ = `${$1}`; }
    | parizq error parder                   {$$="";} 
;