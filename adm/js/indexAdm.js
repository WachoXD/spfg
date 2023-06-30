function comprobarPermiso(){
    // Crea una instancia del objeto URLSearchParams con la cadena de consulta de la URL actual
    const params = new URLSearchParams(window.location.search);

    // Obtiene el valor de un parámetro específico
    const param1Value = params.get('param1');
    console.log(param1Value); // Resultado: "valor1"
}