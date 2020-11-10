<!--Header-->
# Manual Técnico
## Translator in Docker


### Gramática Utilizada
### Análisis Sintáctico desc (Java-Python)
```
<INI>::=public <Principal><Mas>
<Principal>::=class id { <ContenidoC>}
              |interface id {<ContenidoI>}
<ContenidoC>::=<LLamadaMF>; <ContenidoC>
              |public <MF><ContenidoC>
              |<variables><ContenidoC>
              |epsilon
<MF>::= <Tipo> id (<Parametros>)<DAMF>
        |void id (<Parametros>)<DAMF>
        |static void main (string [] args) {<Instrucciones>}
        
<DAMF>::={<Instrucciones>}
         |;
<variables>::=<Tipo> id <MasVariables>
              | id = <EXP>;
              
<MasVariables>::=, id<MasVariables>
                | =<EXP><Opcion2>
                |;
<Opcion2>::= , id<MasVariables>
            | ;
            
<Mas>::=<INI>
        |epsilon

<Parametros>::= <Tipo> id <MasParametros>
                |<EXP> <MasParametros>
                | espsilon

<MasParametros>::= ,<Parametros>
                  |epsilon

<Instrucciones>::=<sentencias><MasInstruc>
                  |<variables><MasInstruc>
                  |<LllamadaMF>;<MasInstruc>
                  |system.out.<Print>(<EXP>);<MasInstruc>
                  |<EXP>;<MasInstruc>
                  |<SBCR><MasInstruc>

<MasInstruc>::=<Instrucciones>
               |epsilon
               
<LlamadaMF>::=id (<Parameros>)

<Print>::= println
          | print

<Sentencias>::=<SentenciasR>
              |<SentenciasC>
              
<SentenciasR>::=for(<DEC><EXP>;<EXP>){<Instrucciones>}
                |while (<EXP>){<Instrucciones>}
                |do{<Instrucciones>}while(<EXP>);

<SentencasC>::= if (<EXP>){<Instrucciones>}<Elif><Else>

<Elif>::= else <SentenciasC>
          |epsilon

<Else>::=else{<Instrucciones>}
        |epsilon
        
<DEC>::=<Tipo>id<MasVAriables>

<SBCR>::= break;
          |continue;
          |return <EXP>;
          |epsilon
          
<ContenidoI>::=<DEC><MDEC>
              |<DECMF><MDECMF>

<MDEC>::= <DEC><MDEC>
          |epsilon
          
<MDECMF>::= <DECMF><MDECMF>
            |epsilon
            
<DECMF>::= public <Tipo> id (<Parametros>);

```
### Análisis Sintáctico Asc (Java-JavaScript)
``` 
INI::= LISTCI EOF

LISTCI::=   LISTCI CI
          | CI

CI::= public CLASINTER id BLOQUE
      | error

CONTENIDOSC::=  CONTENIDOSC CONTENIDOC
                |CONTENIDOC
                
BLOQUE::= {CONTENIDOC}
          |{ }

CONTENIDOC::= LLAMADAMF
              |public MF
              |VARIABLES
              |epsilon
              
LLAMADAMF::= id (DATOS)

MF::=TIPO id ( PARAMETROS) DAMF
     |void id (PARAMETROS) DAMF
     |static void main (string[]args) BLOQUEI

VARIABLES::= TIPO MASVARIABLES
            | id = EXP;


OPCION::= , MASVARIABLES
          |;

MASVARIABLES::= id =EXP OPCION
                |id OPCION
                
TIPO::= int
        |double
        |boolean
        |string
        |char

PARAMETROS::= PARAMETROS , TIPO id
              |EXP
              |TIPO id
              
INSTRUCCIONES::= INSTRUCCIONES INSTRUCCION
                |INSTRUCCION
                
INSTRUCCION::= FOR
              |VARIABLES
              |LLAMADAMF
              |PRINT
              |INCREDECRE;
              |SBCR
              |WHILE
              |DO
              |IF
              |SENTENCIASC
              |SENTENCIASR
``` 
## Herramientas utilizadas
- Jison     -> Fue utilizado para el análisis léxico, sintáctico y la traducción de java a Javascript.
## Lenguajes utilizados
- JavaScript -> Backend. Fue utilizado para el análisis léxico, sintáctico y la traducción de java a Python.
- Go        -> Frontend. Fue utilizado para la realización de peticiones y levantar la página.
## Entorno utilizado
- Nodejs
## Conocimeintos aplicados
-Gramatica LALR
-Gramatica LL1

         
         
         
         
         
         
         
# MANUAL DE USUARIO


Esta página fue creada con el propósito de generar la traducción de ciertas partes del código mediante el uso de documentos de extensión 
.java hacia código python o javascirpt

Esta aplicación cuenta con dos consolas las cuales muestran como resultado los errores léxicos y sintácticos de los diferentes analizadores. 
También cuenta con la opción de descargar el código ya traducido tanto para python como para javascript. Además de esto se muestra el recorrido
que se realiza durante el análisis por medio de un árbol sintáctico, el cual se puede visualizar con un archvio svg. También se muestran los errores léxicos 
y sintácticos mediante una documento html al igual que los tokens generados durante el análisis Léxico.
