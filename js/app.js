// constructores
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){
    /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;
    console.log(this.marca)
    // se evalua con switch es mas facil que con if
    switch(this.marca){
        case '1':
            cantidad = base*1.15;
            break;
        case '2':
            cantidad = base*1.05;
            break;
        case '3':
            cantidad = base*1.35;
            break;

            default:
                break;
    }

    // Leer el año 
    const diferencia = new Date().getFullYear() - this.year; // te da la fecha y le resta el año que se elige
    //Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((diferencia*3) * cantidad) / 100;

    /*
        Si el seguro es basico se multiplica por un 30% mas.
        Si el seguro es completo se multiplica por un 50% mas.
    */

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad;
    
}

// interfase de usuario
function UI(){}


// Llena las opciones de los años.
UI.prototype.llenarOpciones = ()=>{
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');
    for(let i = max; i> min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
    
}

//Muestra alertas en pantalla. (prototype)
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error'); // esas clases ya estan en css solo se llaman se quito de ('mensaje', 'error')
    } else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10'); // para no repetir (mensaje) en error y correcto
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro'); // se puede declara la misma variable en dif funcion
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(()=>{
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) =>{

    const { marca, year, tipo } = seguro;

    let textoMarca;
    switch(marca){
        case '1':
            textoMarca = 'Americano';
        break;
            case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;

            default:
                break;

    }

    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header">Tu Resumen</p> 
    <p class="font-bold">Marca <span class="font-normal"> : ${textoMarca} </span></p>
    <p class="font-bold">Tipo <span class="font-normal capitalize"> : ${tipo} </span></p> 
    <p class="font-bold">Año <span class="font-normal"> : ${year} </span></p>
    <p class="font-bold">Total <span class="font-normal"> : $${total} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    // se agrega el div dentro del setTimeout del spinner para que aparesca en cuanto se quita el spinner

    // Mostrar resultado
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; // se borra el spinner. en lugar de remove() se usa esto ya que el remove provoca errores.
        resultadoDiv.appendChild(div); // se muestra el resultado
    }, 3000);

}

//INSTANCIAR UI
const ui = new UI; // se pasa fuera del eventListener porque se pasa a diferentes funciones.


document.addEventListener( 'DOMContentLoaded', ()=>{
    ui.llenarOpciones();
})

eventListener();
function eventListener(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    

    // Leer el año seleccionado
    const year = document.querySelector('#year').value;
    

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; // se usa el input debido a que los botones son diferentes. Checked porque es el que se elige.
    
    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son ovligatorios', 'error'); // el ui toma el mensaje y el tipo
        return;
    } 
    ui.mostrarMensaje('Cotizando...', 'exito'); // el ui toma el mensaje y el tipo
       
    //Ocultar las cotizaciones previas. Para que  no aparescan repetidas. Se usa la etiqueta de resultado div.
    const resultados = document.querySelector('#resultado div');
    if(resultados != null){ // condicion para que no se agreguen mas div si ya hay
        resultados.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);

}