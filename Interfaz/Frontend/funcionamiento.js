

function openPag(evt, pageName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";
  }

function abrir(event){
  let archivo= event.target.files[0];

  if(archivo){
    let reader = new FileReader();
    
    reader.onload= function(e){
      let contenido= e.target.result;

      document.getElementById("Pag1").innerText= contenido;
    };

    reader.readAsText(archivo);

  }else{
    window.alert("No se ha seleccionado un archivo")

  }
}
  window.addEventListener("load",()=>{
    document.getElementById("archivoTexto").addEventListener("change",abrir);
  });

  document.getElementById("Abierto").click();

  