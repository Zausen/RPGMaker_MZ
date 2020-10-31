var Zausen = Zausen || {};
Zausen.FZ_SistemaRobo = Zausen.FZ_SistemaRobo || {};
/*:
 * @target MZ
 * @plugindesc añade un sistema de robo sencillo.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaRobo.js
 *
 * Este plugin crea un sistema de robo afectando a las habilidades, las clases,
 * los actores, los enemigos y los estados alterados. Por lo que puede ser un 
 * poco complicado de configurar al principio.
 * 
 * Para las clases, los actores, los estados alterados y los enemigos tenemos 
 * la opción de dar ventajas y desventajas tanto para robar como para ser 
 * robados:
 * 
 * Para ello usaremos la etiqueta EROBO en las notas de qué nos interese 
 * seguido de llave de apertura y llave de cierre: EROBO{ } Dentro de las
 * llaves tenemos a disposición distintas etiquetas que podemos colocar, 
 * por defecto todas las opciones se inicializan a 0 (ni mejoran, ni 
 * empeoran). Las etiquetas son:
 * OBJETOS:
 * ARMAS:
 * PROTEC:
 * MON:
 * Por si solas no tienen ningún efecto, hay que añadir al principio una
 * D(Para defensa) o una A(Para atacar), también debe seguir de un número
 * (positivo o negativo) que simula un porcentaje. 
 * Ejemplo:
 * EROBO{
        DOBJETOS:-100  Resultará un 100% más fácil robarle objetos
        DARMAS:50 Hace que sea un 50% más difícil robarle armas
        DMON:-25 hace que sea un 25% más fácil robarle dinero
        DPROTEC:15 hace que sea un 15% más difícil robarle protecciones.
        AOBJETOS:98 Tiene un 98% posibilidades adicionales de robar objetos.
        AARMAS:10 Tiene un 10% de posibilidades adicionales de robar armas
        APROTEC:20 Tiene un 20% de posibilidades adicionales de robar protecciones
        AMON:-36 Tiene un 35% menos de posibikidades de robar dinero.
    }
 * 
Además, para los enemigos está la opción de colocarles un inventario para 
que tenga cosas que robar. La etiqueta se cooca también en sus notas y es
INVENTARIO{ }
Dentro de las llaves podemos agregar las siguientes etiquetas
OBJETOS:
ARMAS:
PROTEC:
Seguido y separados por comas ponemos las id's correspondientes (id del 
objeto e objetos, id de armas en armas e id de armaduras en protec). 
Además si antes de la coma y después de la id ponemos una x, le podemos
agregar una cantidad de objetos. (ejemplo OBJETOS:7x3 para que tenga 3 
unidades del objeto 7).
Para terminar también se puede colocar la etiqueta RECOMPENSA: seguido 
de las letras N(NO) o S(SÍ) para definir si los objetos de recompensa 
se pueden robar o no. La opción de recompensa tiene un valor 
predeterminado decidido por una de las opciones de éste plugin.
Ejemplo:
INVENTARIO{
  OBJETOS:7x2,32x4
  ARMAS:1
  PROTEC:2
  RECOMPENSA:N
} 
El enemigo tendrá 2 unidades del objeto 7 y 4 del objeto 32, también 
tendrá una unidad del primer arma y otra unidad de la segunda armadura. 
También se ha especificado que NO se podrá robar los objetos de 
recompensa. 

Nota: Los objetos de recomepnsa robados (en caso de que se pueda) no
se podrán obtener tras la batalla (porque se supone que ya se tiene
la recompensa).

Para terminar están las capacidades de robo que otorgan las habilidades, 
se define también en sus notas.
LA etiqueta principal es ROBAR{ }
Y dentro de las llaves podemos definir las siguientes aptitudes:
MON:MIN-MAX,1/N
siendo MIN la cantidad mínima de robo, MAX la cantidad máxima de robo y 
N es un divisor para el 1 que definirá las posibilidades, cuánto más 
alto, menos posibilidades.
ARMAS:
PROTEC:
OBJETOS:
Seguido de esto hay dos vertientes a escoger, la primera es poner una T, 
después podemos poner las posibilidades, por ejemplo, si queremos que 
sea un 50% pondremos 1/2 y separado con un guión, la cantidad que puede 
robar de golpe( Ejemplo: OBJETOS:T1/2-4 con esto robaría cualquier 
objeto que posea el enemigo hasta una cantiad de 4 unidades con un 50% 
de posibilidades). La otra opción es especificar qué objetos se pueden 
robar y sus posibilidades, así como las cantidades. (Ejemplo:  
OBJETOS:1x2-1/1,2-1/999-3x99-1/2 lo que significa que robará cualquier 
objeto de id la cantidad de unidades a la izquierda de la x o 
1 si no hay nada especificado y las posibildiades marcadas en la división)
A continuación un ejemplo completo:

ROBAR{
  MON:0-230,1/7 Tiene un 14% de posibilidades de robar entre 0 y 230 monedas.
  OBJETOS:1x2-1/1,2-1/999-3x99-1/2 Puede robar hasta dos unidades del primer objeto con un 100% de posibildiades, 
                                    una unidad del objeto 2 con muy pocas oportunidades y/o hasta 99 unidades del objeto 3 co un 50% de posibildiades
  ARMAS:T1/8-2 Puede robar cualquier arma que posea el enemmigo en su inventario cono un 12´5% de probabilidades de éxito, hasta dos unidades.
  PROTEC:T1/1 Puede robar una unidad de cualquier armadura que posea el enemigo en su inventario con un 100% de posibildiades
}
Las opciones para OBJETOS, ARMAS y PROTEC son las mismas, la cosa está en 
combinar según interesa.

Para terminar, en las habiliades, de forma opcional se pueden colar 
mensajes para los efectos del robo. Para ello se usa la etiqueta MSJR{ }
Dentro tenemos tres opciones:
ACIERTO:''Mensaje''
FALLO:''Mensaje''
VACIO:''Mensaje''
(son dos ' seguidas para abrir y cerrar el mensaje).
En el formateo hay opciones para que se formatee al usarse: 
%1 define el nombre del usuario que roba.
%2 define el nombre del objetivo del robo.
%3 define qué se ha robado (En el caso del dinero aparecerá el nombre de 
la moneda)
%4 define la cantidad de lo que se ha robado.
En el caso de que se roben varios objetos distintos por poseer unas muy 
altas posibilidades el mensaje se repetirá.
Ejemplo:
MSJR{
    ACIERTO:''%1 ha robado %3x%4 a %2'' 1-Usuario, 2-Objetivo, 3-qué, 4-cantidad
    FALLO:''%1 no ha podido robar nada''
    VACIO:''%2 no tenía qué robar''
}

Nota: Sólo se robarán objetos clasificados como Tipo de objeto: Objeto normal.

 *@param Recompensas robables por defecto
  @desc Define si todos los enemigos o ninguno tendrán las recompensas por derrota como opción a robar.
  @type select
  @option Todos
  @value Todos
  @option Ninguno
  @value Ninguno
  @default Todos
 */

Zausen.FZ_SistemaRobo.Regex = {//gi
    Robar: '#1[{]([\\s\\S]*?)[}]',
    RMon: /(MON)[:](\d{1,6})[-](\d{1,6})[,][1][\/]([1-9]\d{0,3})/i,
    RoboGen: /([ABCDEJMNOPRST]{3,10})[:]([TNS0-9x\-\/,]*)/gi,
    RoboInt: /(\d{1,})(|[x]([1-9]\d{0,2}))[-][1][\/]([1-9]\d{0,3})/gi,
    InventX: /[xX]/,
    MsjRegex: /([ACEFILORTV]{3,10})[:][']{2}([\s\S]*?)[']{2}/gi
};

Zausen.FZ_SistemaRobo.Etiquetas = {
    MON: 'MON',
    AMON: 'AMON',
    DMON: 'DMON',
    OBJ: 'OBJETOS',
    AOBJ: 'AOBJETOS',
    DOBJ: 'DOBJETOS',
    ARMAS: 'ARMAS',
    DARMAS: 'DARMAS',
    AARMAS: 'AARMAS',
    PROTEC: 'PROTEC',
    APROTEC: 'APROTEC',
    DPROTEC: 'DPROTEC',
    T: 'T',
    N: 'N',
    S: 'S',
    ACIERTO: 'ACIERTO',
    FALLO: 'FALLO',
    VACIO: 'VACIO',
    ROBAR: 'ROBAR',
    INVENT: 'INVENTARIO',
    ROBO: 'EROBO',
    RECOMPENSA: 'RECOMPENSA',
    MSJ: 'MSJR'
};
Zausen.FZ_SistemaRobo.pluginName = 'SistemaRobo';
Zausen.FZ_SistemaRobo.PlugingManager = PluginManager.parameters(Zausen.FZ_SistemaRobo.pluginName);
Zausen.FZ_SistemaRobo.Parametros = Zausen.FZ_SistemaRobo.Parametros || {};
Zausen.FZ_SistemaRobo.Parametros.RecompensasRobablesPorDefecto = Boolean(Zausen.FZ_SistemaRobo.PlugingManager['Recompensas robables por defecto'] == 'Todos' || false);//1

/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/

Zausen.FZ_SistemaRobo.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaRobo.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaRobo.BBDDCargada) {
        Zausen.FZ_SistemaRobo.BBDDCargada = true;
       
        Zausen.FZ_SistemaRobo.InicializarHabilidades($dataSkills);
        Zausen.FZ_SistemaRobo.InicializarEnemigos($dataEnemies);
        Zausen.FZ_SistemaRobo.InicializarClases($dataClasses);
        Zausen.FZ_SistemaRobo.InicializarActores($dataActors);
        Zausen.FZ_SistemaRobo.InicializarEstados($dataStates);
    }
    return true;
};

Zausen.FZ_SistemaRobo.regexRobar = function(buscar){
    return new RegExp(Zausen.FZ_SistemaRobo.Regex.Robar.replace("#1", buscar),'i');
}

Zausen.FZ_SistemaRobo.InicializarHabilidad = function (habilidad) {
    habilidad.robo = null;
};
Zausen.FZ_SistemaRobo.InicializarEnemigo = function (enemigo) {
    enemigo.inventario = {
        recompensa: Zausen.FZ_SistemaRobo.Parametros.RecompensasRobablesPorDefecto,
        objetos: [],
        armas: [],
        protec: []
    };
    Zausen.FZ_SistemaRobo.InicializarEstadisticas(enemigo);
};
Zausen.FZ_SistemaRobo.InicializarEstadisticas = function (elemento) {
    elemento.estadisticasRobo = {};
    elemento.estadisticasRobo.defensa = {
        objetos: 0,
        armas: 0,
        protec: 0,
        mon: 0
    };
    elemento.estadisticasRobo.ataque = {
        objetos: 0,
        armas: 0,
        protec: 0,
        mon: 0
    };
};

Zausen.FZ_SistemaRobo.InicializarHabilidades = function (habilidades) { 
    let regex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.ROBAR); 
   
    for (var h = 0; h <= habilidades.length; h++) {
        if (!habilidades[h]) continue;
        var habilidad = habilidades[h];
        Zausen.FZ_SistemaRobo.InicializarHabilidad(habilidad); 
        let contenido = habilidad.note.match(regex);
        if(contenido){
            habilidad.robo = {
                mon : null,
                objetos : null,
                armas : null,
                protec : null,
                msj: {
                    acierto: "",
                    fallo: "",
                    vacio: ""
                }
            };
            Zausen.FZ_SistemaRobo.DarValorHabilidad(habilidad.robo, contenido[1]);
            Zausen.FZ_SistemaRobo.DarValorMSJHabilidad(habilidad.robo.msj, habilidad.note);
        }  
    }
};
Zausen.FZ_SistemaRobo.DarValorHabilidad = function(robo,conjunto){
    Zausen.FZ_SistemaRobo.DarValorHabilidadMon(robo,conjunto);
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaRobo.Regex.RoboGen.exec(conjunto)) {
        let etiqueta = subconjunto[1];
        let contenido = subconjunto[2];
        switch(etiqueta){
            case Zausen.FZ_SistemaRobo.Etiquetas.OBJ:
                if(!contenido || robo.objetos) break;
                robo.objetos = {};
                Zausen.FZ_SistemaRobo.DarValorHabilidadElem(robo.objetos,contenido);
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.ARMAS:
                if(!contenido || robo.armas) break;
                robo.armas = {};
                Zausen.FZ_SistemaRobo.DarValorHabilidadElem(robo.armas,contenido);
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.PROTEC:
                if(!contenido || robo.protec) break;
                robo.protec = {};
                Zausen.FZ_SistemaRobo.DarValorHabilidadElem(robo.protec,contenido);
            break;
        }
    }
};

Zausen.FZ_SistemaRobo.DarValorMSJHabilidad = function(msj, nota){
    let subregex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.MSJ); 
    let subContenido = nota. match(subregex);
    if(!subContenido) return;
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaRobo.Regex.MsjRegex.exec(subContenido)) {
        let etiqueta = subconjunto[1];
        let mensaje = subconjunto[2];
        switch(etiqueta){
            case Zausen.FZ_SistemaRobo.Etiquetas.ACIERTO:
                msj.acierto = mensaje;
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.FALLO:
                msj.fallo = mensaje;
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.VACIO:
                msj.vacio = mensaje;
            break;
        }
    }
};

Zausen.FZ_SistemaRobo.DarValorHabilidadElem = function(elemento,conjunto){
    elemento.tasa = null;
    elemento.cantidad = null;
    elemento.posibles = null;
    if(conjunto.startsWith(Zausen.FZ_SistemaRobo.Etiquetas.T)){
        let componentes = conjunto.split(/[\/\-]/);
        let divisor = isNaN(componentes[1]) ? 1 : componentes[1];
        let cantidad = isNaN(componentes[2]) ? 1 : componentes[2];
        elemento.tasa = 1/divisor;
        elemento.cantidad = Math.floor(cantidad);
        return;
    }
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaRobo.Regex.RoboInt.exec(conjunto)) {
        let ido = subconjunto[1];
        let cant =  !subconjunto[3] || isNaN(subconjunto[3]) ? 1 : parseInt(subconjunto[3]);
        let divisor = isNaN(subconjunto[4]) ? 1 : subconjunto[4];
        var obj = {
            id :  ido,
            cantidad : cant,
            tasa : 1/divisor
        };
        if(!elemento.posibles) elemento.posibles = [];
        elemento.posibles.push(obj);

    }
};
Zausen.FZ_SistemaRobo.DarValorHabilidadMon = function(robo, conjunto){
    let robaMon = conjunto.match(Zausen.FZ_SistemaRobo.Regex.RMon);
    if(robaMon){
        robo.mon = {};
        robo.mon.min = isNaN(robaMon[2]) ? 0 : parseInt(robaMon[2]);
        robo.mon.max = isNaN(robaMon[3]) ? 0 : parseInt(robaMon[3]);
        if(robo.mon.min > robo.mon.max){
            let intermed = robo.mon.min;
            robo.mon.min = robo.mon.max;
            robo.mon.max = intermed;
        }
        let divisor = isNaN(robaMon[4]) ? 1 : robaMon[4];
        robo.mon.tasa = 1/divisor;
    }
};
Zausen.FZ_SistemaRobo.InicializarEnemigos = function (enemigos) {
    let regex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.INVENT); 
    let regex2 = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.ROBO); 
    for (var e = 0; e <= enemigos.length; e++) {
        if (!enemigos[e]) continue;
        var enemigo = enemigos[e];
        Zausen.FZ_SistemaRobo.InicializarEnemigo(enemigo);

        let contenido2 = enemigo.note.match(regex2);
        if(contenido2)  Zausen.FZ_SistemaRobo.DarValorDefenEstadisticas(enemigo.estadisticasRobo, contenido2[1]);

        let contenido = enemigo.note.match(regex);
        if(contenido){
            Zausen.FZ_SistemaRobo.DarValorInventario(enemigo.inventario, contenido[1]);
        }
        
    }
};
Zausen.FZ_SistemaRobo.DarValorInventario = function(inventario, conjunto){
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaRobo.Regex.RoboGen.exec(conjunto)) {
        let etiqueta = subconjunto[1];
        let contenido = subconjunto[2];
        if(!contenido) continue;
        switch(etiqueta){
            case Zausen.FZ_SistemaRobo.Etiquetas.OBJ:
                Zausen.FZ_SistemaRobo.DarValorInventarioElementos(inventario.objetos,contenido);
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.ARMAS:
                Zausen.FZ_SistemaRobo.DarValorInventarioElementos(inventario.armas,contenido);
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.PROTEC:
                 Zausen.FZ_SistemaRobo.DarValorInventarioElementos(inventario.protec,contenido);
            break;
            case Zausen.FZ_SistemaRobo.Etiquetas.RECOMPENSA: 
                inventario.recompensa = contenido.trim() == Zausen.FZ_SistemaRobo.Etiquetas.S;
            break;
        }
    }
};
Zausen.FZ_SistemaRobo.DarValorInventarioElementos = function(elemento,conjunto){
    let total = conjunto.split(',');
    for(var x = 0; x < total.length; x++){
        let subt = total[x].split(Zausen.FZ_SistemaRobo.Regex.InventX);
        let ide = subt[0];
        let cant = !subt[1] || isNaN(subt[1]) ? 1 : parseInt(subt[1]);
        var ele  = Zausen.FZ_SistemaRobo.MoldeObjeto(ide,cant);
        let index = elemento.map(e => e.id).indexOf(ide);
        if(index >= 0){ 
            elemento[index].cantidad += cant;
        }else{
            elemento.push(ele);
        }
    }
};
Zausen.FZ_SistemaRobo.InicializarClases = function (clases) {
    let regex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.ROBO); 
    for (var c = 0; c <= clases.length; c++) {
        if (!clases[c]) continue;
        var clase = clases[c];
        Zausen.FZ_SistemaRobo.InicializarEstadisticas(clase);
        let contenido = clase.note.match(regex);
        if(contenido) { 
            Zausen.FZ_SistemaRobo.DarValorDefenEstadisticas(clase.estadisticasRobo, contenido[1]);
        }
    }
};
Zausen.FZ_SistemaRobo.InicializarActores = function (actores) {
    let regex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.ROBO); 
    for (var a = 0; a <= actores.length; a++) {
        if (!actores[a]) continue;
        var actor = actores[a];
        Zausen.FZ_SistemaRobo.InicializarEstadisticas(actor);
        let contenido = actor.note.match(regex);
        if(contenido) { 
            Zausen.FZ_SistemaRobo.DarValorDefenEstadisticas(actor.estadisticasRobo, contenido[1]);
        }
    }
};
Zausen.FZ_SistemaRobo.InicializarEstados = function (estados) {
    let regex = Zausen.FZ_SistemaRobo.regexRobar(Zausen.FZ_SistemaRobo.Etiquetas.ROBO);
    for (var e = 0; e <= estados.length; e++) {
        if (!estados[e]) continue;
        var estado = estados[e];
        Zausen.FZ_SistemaRobo.InicializarEstadisticas(estado);
        let contenido = estado.note.match(regex);
        if (contenido) {
            Zausen.FZ_SistemaRobo.DarValorDefenEstadisticas(estado.estadisticasRobo, contenido[1]);
        }
    }
};

Zausen.FZ_SistemaRobo.DarValorDefenEstadisticas = function (estadisticas, conjunto) {
    estadisticas.tiene = true;
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaRobo.Regex.RoboGen.exec(conjunto)) {
        let etiqueta = subconjunto[1];
        let contenido = subconjunto[2];
        if(!contenido || isNaN(contenido)) continue;
        contenido /=100;
        switch (etiqueta) {
            case Zausen.FZ_SistemaRobo.Etiquetas.AMON:
                estadisticas.ataque.mon += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.DMON:
                estadisticas.defensa.mon += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.AOBJ:
                estadisticas.ataque.objetos += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.DOBJ:
                estadisticas.defensa.objetos += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.AARMAS:
                estadisticas.ataque.armas += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.DARMAS:
                estadisticas.defensa.armas += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.APROTEC:
                estadisticas.ataque.protec += contenido;
                break;
            case Zausen.FZ_SistemaRobo.Etiquetas.DPROTEC:
                estadisticas.defensa.protec += contenido;
                break;
        }
    }
}; 

Zausen.FZ_SistemaRobo.MoldeObjeto = function(nid, cant){
    return {id: nid, cantidad : cant};
};
Zausen.FZ_SistemaRobo.MoldeObjetoE = function(nid, cant, tasa){
    let resp = Zausen.FZ_SistemaRobo.MoldeObjeto(nid, cant);
    resp.tasa = tasa;
    return resp;
};
/* ****************************************************************************************************************************************** 
***************************************************************** Herramientas **************************************************************
*********************************************************************************************************************************************/

Zausen.FZ_SistemaRobo.sumarEstadisticas = function(base, clase, estados){
    let resp = {
            objetos : base.objetos + clase.objetos,
            armas : base.armas + clase.armas,
            protec : base.protec + clase.protec,
            mon : base.mon + clase.mon
        };
    if(estados) {
        estados.forEach(function(est){
            resp.objetos += est.objetos,
            resp.armas += est.armas,
            resp.protec += est.protec,
            resp.mon += est.mon
        });
    }
    return resp;
};
Zausen.FZ_SistemaRobo.contenedorParamRobo = function(){
    return {
        objetos : 0,
        armas : 0,
        protec : 0,
        mon : 0
    };
};

Zausen.FZ_SistemaRobo.indiceDefensaRobo = function(target){
    if(!target || (!target.isEnemy() && !target.isActor())) return null;
    const estadosConRobo = target.states().filter(est => est.estadisticasRobo.tiene).map(est => est.estadisticasRobo.defensa);
    const defensaBase = target.isActor() ? target.actor().estadisticasRobo.defensa : target.enemy().estadisticasRobo.defensa;
    const defensaClase = target.isActor() ? target.currentClass().estadisticasRobo.defensa : Zausen.FZ_SistemaRobo.contenedorParamRobo(); 
    return Zausen.FZ_SistemaRobo.sumarEstadisticas(defensaBase, defensaClase,estadosConRobo);
};
Zausen.FZ_SistemaRobo.indiceAtaqueRobo = function(subject){
    if(!subject || (!subject.isEnemy() && !subject.isActor())) return null;
    const estadosConRobo = subject.states().filter(est => est.estadisticasRobo.tiene).map(est => est.estadisticasRobo.ataque);
    const ataqueBase = subject.isActor() ? subject.actor().estadisticasRobo.ataque : subject.enemy().estadisticasRobo.ataque;
    const ataqueClase = subject.isActor() ? subject.currentClass().estadisticasRobo.ataque : Zausen.FZ_SistemaRobo.contenedorParamRobo();
    return Zausen.FZ_SistemaRobo.sumarEstadisticas(ataqueBase, ataqueClase,estadosConRobo);
};

Zausen.FZ_SistemaRobo.indiceRobo = function(subject, target){
    if(!subject || !target || (!subject.isEnemy() && !subject.isActor()) || (!target.isEnemy() && !target.isActor())) return null;
    if((subject.isActor() && target.isActor()) || (subject.isEnemy() && target.isEnemy())) return null;
    let ataque = Zausen.FZ_SistemaRobo.indiceAtaqueRobo(subject);
    let defensa = Zausen.FZ_SistemaRobo.indiceDefensaRobo(target);
    let resultado ={
        objetos : 1 + ataque.objetos - defensa.objetos,
        armas : 1 + ataque.armas - defensa.armas,
        protec : 1 + ataque.protec - defensa.protec,
        mon : 1 + ataque.mon - defensa.mon
    };
    return resultado;
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Battler ****************************************************************
*********************************************************************************************************************************************/

Game_Battler.prototype.mon = function() {
    return 0;
};

Game_Battler.prototype.perderMon = function(mon){ 
    this._result.monRobada = true;
    this._result.monPerdido = mon;
};

Game_Battler.prototype.ganarMon = function(mon){  };

Game_Battler.prototype.objetos = function() {};
Game_Battler.prototype.armas = function() {};
Game_Battler.prototype.protecs = function() {};

Game_Battler.prototype.ganarObjetos = function(obj) {};
Game_Battler.prototype.ganarArmas = function(arm) {};
Game_Battler.prototype.ganarProtecs = function(prt) {};

Game_Battler.prototype.perderObjetos = function(obj) {
    this._result.objetosRobados = true;
    let index = this.result.objetosPerdidos.map(op => op.id).indexOf(obj.id);
    if(index >= 0){
        this._result.objetosPerdidos[index].cantidad +=1;
    }else{
        this._result.objetosPerdidos.push(obj);
    } 
};
Game_Battler.prototype.perderArmas = function(arm) {
    this._result.armasRobadas = true;
    let index = this.result.armasPerdidas.map(op => op.id).indexOf(arm.id);
    if(index >= 0){
        this._result.armasPerdidas[index].cantidad +=1;
    }else{
        this._result.armasPerdidas.push(arm);
    }
};
Game_Battler.prototype.perderProtecs = function(prt) {
    this._result.protecRobadas = true;
    let index = this._result.protecPerdidas.map(op => op.id).indexOf(prt.id);
    if(index >= 0){
        this._result.protecPerdidas[index].cantidad +=1;
    }else{
        this._result.protecPerdidas.push(prt);
    }
}; 
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Enemy ****************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaRobo.Game_Enemy = Zausen.FZ_SistemaRobo.Game_Enemy || {};
Zausen.FZ_SistemaRobo.Game_Enemy.initialize = Game_Enemy.prototype.initialize;
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Zausen.FZ_SistemaRobo.Game_Enemy.initialize.call(this,enemyId, x, y); 
    this._monExtra = 0; //Negativo restará a gold y positivo sumará a gold.
    this._recompensaRobada = []; //Sólo se guarda la id del objeto robado 
    const enemigo = $dataEnemies[this._enemyId];
    this._inventario = {
        objetos : [],
        armas : [],
        protec : [],
        recompensa : false,
        recompensas : null
    };
    enemigo.inventario.objetos.forEach(o=>  this._inventario.objetos.push(Zausen.FZ_SistemaRobo.MoldeObjetoE(o.id,o.cantidad,1)));
    enemigo.inventario.armas.forEach(o=>  this._inventario.armas.push(Zausen.FZ_SistemaRobo.MoldeObjetoE(o.id,o.cantidad,1)));
    enemigo.inventario.protec.forEach(o=>  this._inventario.protec.push(Zausen.FZ_SistemaRobo.MoldeObjetoE(o.id,o.cantidad,1)));
    this._inventario.recompensa = enemigo.inventario.recompensa;
    if(enemigo.inventario.recompensa){
        this._inventario.recompensas = [];
        enemigo.dropItems.filter(di => di.kind > 1 || (di.kind == 1 && $dataItems[di.dataId].itypeId == 1))
            .forEach(di => this._inventario.recompensas.push({kind : di.kind, id : di.dataId, cantidad : 1, tasa : 1/di.denominator, robado : false}));
    }
  
};
Zausen.FZ_SistemaRobo.Game_Enemy.gold = Game_Enemy.prototype.gold;
Game_Enemy.prototype.gold = function() {
    return Zausen.FZ_SistemaRobo.Game_Enemy.gold.call(this) + this._monExtra;
};

Zausen.FZ_SistemaRobo.Game_Enemy.makeDropItems = Game_Enemy.prototype.makeDropItems;
Game_Enemy.prototype.makeDropItems = function() {
    var resp = this.quitarRecompensasRobadas(Zausen.FZ_SistemaRobo.Game_Enemy.makeDropItems.call(this)); 
    const inventOriginal = this.enemy().inventario;
    let total = this.simplificarInventario(this._inventario.objetos, inventOriginal.objetos).map(di =>{return {kind: 1, dataId : di.id}})
    .concat(this.simplificarInventario(this._inventario.armas, inventOriginal.armas).map(di =>{return {kind: 2, dataId : di.id}}))
    .concat(this.simplificarInventario(this._inventario.protec, inventOriginal.protec).map(di =>{return {kind: 3, dataId : di.id}}));
    return resp.concat(total.map(di => this.itemObject(di.kind, di.dataId)));
    
   
};


Game_Enemy.prototype.simplificarInventario = function(parteInvent, comparador){
    const idsComparador = comparador.map(c=> c.id);
    let respuesta = [];
    parteInvent.forEach( o=> {
        let esta = idsComparador.indexOf(o.id);
        if(esta >= 0){
            let nCant = o.cantidad -= comparador[esta].cantidad;
            if(nCant > 0){
                for(let x = 0; x < nCant; x++) respuesta.push(Zausen.FZ_SistemaRobo.MoldeObjeto(o.id,1));
            }
        }
    });
    return respuesta;
};
Game_Enemy.prototype.mon = function(){
    return this.gold();
};

Game_Enemy.prototype.perderMon = function(mon){
    Game_Battler.prototype.perderMon.call(this, mon);
    this._monExtra -= mon;
};

Game_Enemy.prototype.ganarMon = function(mon){
    this._monExtra += mon;
};

Game_Enemy.prototype.objetos = function() {
    return this.concatenarRecompensar(this._inventario.objetos,1);
};
Game_Enemy.prototype.armas = function() {
    return this.concatenarRecompensar(this._inventario.armas,2);
};
Game_Enemy.prototype.protecs = function() {
    return this.concatenarRecompensar(this._inventario.protec,3);
};

Game_Enemy.prototype.concatenarRecompensar = function(elementos, tipo){
    let respuesta = [];
    if(this._inventario.recompensa){
        this._inventario.recompensas.filter(di => di.kind == tipo).forEach(di => respuesta.push(Zausen.FZ_SistemaRobo.MoldeObjetoE(di.id,di.cantidad,di.tasa)));
    }
    return respuesta.concat(elementos);
};

Game_Enemy.prototype.ganarObjetos = function(obj) {
    const nproz = this.procesarRecompensa(obj.id,1,obj.cantidad);
    let nCant = obj.cantidad - nproz;
    return this.ganarElemento(this._inventario.objetos, obj.id, nCant) || nproz != 0;
};
Game_Enemy.prototype.ganarArmas = function(arm) {
    const nproz = this.procesarRecompensa(arm.id,2,arm.cantidad);
    let nCant = arm.cantidad - nproz;
    return this.ganarElemento(this._inventario.armas, arm.id, nCant) || nproz != 0;
};
Game_Enemy.prototype.ganarProtecs = function(prt) {
    const nproz = this.procesarRecompensa(prt.id,3,prt.cantidad);
    let nCant = prt.cantidad - nproz;
    return this.ganarElemento(this._inventario.protec, prt.id, nCant) || nproz != 0;
};


Game_Enemy.prototype.perderObjetos = function(obj) {
    const nproz = this.procesarRecompensa(obj.id,1,-obj.cantidad);
    let nCant = obj.cantidad - nproz;
    if(!this.ganarElemento(this._inventario.objetos, obj.id, -nCant) && nproz == 0) return false; 
    Game_Battler.prototype.perderObjetos.call(this, obj); 
    return true;
};
Game_Enemy.prototype.perderArmas = function(arm) { 
    const nproz = this.procesarRecompensa(arm.id,2,-arm.cantidad);
    let nCant = arm.cantidad - nproz;
    if(!this.ganarElemento(this._inventario.armas, arm.id,-nCant) && nproz == 0) return false;
    Game_Battler.prototype.perderArmas.call(this, arm);
    return true;
};
Game_Enemy.prototype.perderProtecs = function(prt) { 
    const nproz =this.procesarRecompensa(prt.id,3,-prt.cantidad);
    let nCant = prt.cantidad - nproz;
    if(!this.ganarElemento(this._inventario.protec, prt.id,-nCant) && nproz == 0) return false;
    Game_Battler.prototype.perderProtecs.call(this, prt);
    return true;
}; 

Game_Enemy.prototype.ganarElemento = function(zona,id,cant){
    if(cant == 0) return false; //Ni suma ni resta. Paso.
    let index = zona.map(o => o.id).indexOf(id);
    if(index >= 0){ //Si está.
        zona[index].cantidad += cant;
        if(zona[index].cantidad <= 0) zona.splice(index, 1); //Si ya no hay, se retira.
    }else if (cant > 0){ //Si no está sólo puede ser añadido.
        zona.push(Zausen.FZ_SistemaRobo.MoldeObjeto(id,cant)); 
    }//No se puede perder algo que no se tiene ni añadir algo en negativo.
    else{
        return false;
    }
    return true;
};

Game_Enemy.prototype.procesarRecompensa = function(id, tipo, cantidad){
    let respuesta = 0;
    if(!this._inventario.recompensa || cantidad  == 0) return 0;
    if(cantidad > 0){
        this._inventario.recompensas.filter(di => di.kind == tipo && di.id == id && di.robado).forEach(di => {
            if(respuesta != cantidad){
                respuesta++;
                di.robado = false;
            }
        });
    }else{
        this._inventario.recompensas.filter(di => di.kind == tipo && di.id == id && !di.robado).forEach(di => {
            if((-respuesta) != cantidad){
                respuesta++;
                di.robado = true;
            }
        });
    }
    return respuesta;
};

Game_Enemy.prototype.quitarRecompensasRobadas = function(recompensas){
    if(!this._inventario.recompensa || this._inventario.recompensas.length <= 0 || recompensas.length <= 0) return recompensas;
    let resp = [];
    let invent = this._inventario.recompensas;
    for(let x = 0; x < recompensas.length;x++){
        let recom = recompensas[x];
        for(let y = 0; y < invent.length; y--){
            let comparat = invent[y];
            if(!comparat.robado && comparat.kind == recom.kind && comparat.dataId == recom.dataId){
                resp.push(recom);
                invent.splice(y, 1);
                break;
            }
        }
    }
    return resp;
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Actor ****************************************************************
*********************************************************************************************************************************************/
Game_Actor.prototype.mon = function(){
    return $gameParty.gold();
};

Game_Actor.prototype.perderMon = function(mon){
    Game_Battler.prototype.perderMon.call(this, mon);
    return $gameParty.loseGold(mon);
};

Game_Actor.prototype.ganarMon = function(mon){
    return $gameParty.gainGold(mon);
};


Game_Actor.prototype.objetos = function() {
    return Object.keys($gameParty._items).filter(id => $dataItems[id].itypeId == 1).map(id => Zausen.FZ_SistemaRobo.MoldeObjetoE(id,$gameParty._items[id],1));
};
Game_Actor.prototype.armas = function() {
    return Object.keys($gameParty._weapons).map(id => Zausen.FZ_SistemaRobo.MoldeObjetoE(id,$gameParty._weapons[id],1));
};
Game_Actor.prototype.protecs = function() {
    return Object.keys($gameParty._armors).map(id => Zausen.FZ_SistemaRobo.MoldeObjetoE(id,$gameParty._armors[id],1));
};

Game_Actor.prototype.ganarObjetos = function(obj) {
    $gameParty.gainItem($dataItems[obj.id],obj.cantidad,false);
};
Game_Actor.prototype.ganarArmas = function(arm) {
    $gameParty.gainItem($dataWeapons[arm.id],arm.cantidad,false);
};
Game_Actor.prototype.ganarProtecs = function(prt) {
    $gameParty.gainItem($dataArmors[prt.id],prt.cantidad,false);
};

Game_Actor.prototype.perderObjetos = function(obj) {
    Game_Battler.prototype.perderObjetos.call(this,obj); 
    $gameParty.loseItem($dataItems[obj.id],obj.cantidad,false);
};
Game_Actor.prototype.perderArmas = function(arm) {
    Game_Battler.prototype.perderArmas.call(this,arm); 
    $gameParty.loseItem($dataItems[arm.id],arm.cantidad,false);
};
Game_Actor.prototype.perderProtecs = function(prt) {
    Game_Battler.prototype.perderProtecs.call(this,prt); 
    $gameParty.loseItem($dataItems[prt.id],prt.cantidad,false);
}; 
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Action ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaRobo.Game_Action = Zausen.FZ_SistemaRobo.Game_Action || {};



Zausen.FZ_SistemaRobo.Game_Action.apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    Zausen.FZ_SistemaRobo.Game_Action.apply.call(this, target);
    const result = target.result();
    if (!result.isHit() || !DataManager.isSkill(this.item()) || !this.item().robo) return; 
    const habR = this.item().robo; 
    const subject = this.subject();
    var indiceRobo = Zausen.FZ_SistemaRobo.indiceRobo(subject, target);
    indiceRobo.mon = habR.mon ?indiceRobo.mon * habR.mon.tasa : null;
    
    //dinero...
    let robos = [-1];
    if(indiceRobo.mon != null) robos[0] = this.aplicarRoboMon(subject, target, indiceRobo,habR);
    //Objetos
    robos.push(this.aplicarRoboObjetos(indiceRobo,habR,target,subject));
    //Armas
    robos.push(this.aplicarRoboArmas(indiceRobo,habR,target,subject));
    //Protecciones
    robos.push(this.aplicarRoboProtecs(indiceRobo,habR,target,subject));
    for(let x = 0; x < robos.length; x++){
        let msj = null;
        switch(robos[x]){
            case 0:
                msj = habR.msj.acierto;
            break;
            case 1:
                msj = habR.msj.vacio;
            break; 
            case 2:
                msj = habR.msj.fallo;
            break;
        }
        switch(x){
            case 0:
                result.msjMon = msj;
            break;
            case 1:
                result.msjObjetos = msj;
            break; 
            case 2:
                result.msjArmas= msj;
            break;
            case 3:
                result.msjProtecs = msj;
            break;
        }
    }
    if (result.msjMon || result.msjObjetos || result.msjArmas || result.msjProtecs) result.success = true;
};



Game_Action.prototype.aplicarRoboObjetos= function(indiceRobo, habR, target, subject){
    let robaObjetos = this.aplicarRoboGen(indiceRobo.objetos,habR.objetos, target.objetos());
    if(robaObjetos != null){
        if(robaObjetos.length <= 0) { //Falla
            target._result.roboFallido = true;
            return 2;
        }else if(robaObjetos[0].id == 0) { //Vacío
            target._result.objetosRobados = true;
            return 1;
        }else{ //hay premios.
            robaObjetos.forEach(o => {
                target.perderObjetos(o);
                subject.ganarObjetos(o);
            });
            return 0;
        }
    }
    return -1;
};

Game_Action.prototype.aplicarRoboArmas= function(indiceRobo, habR, target, subject){
    let robaArmas = this.aplicarRoboGen(indiceRobo.armas,habR.armas, target.armas());
    if(robaArmas != null){
        if(robaArmas.length <= 0) { //Falla
            target._result.roboFallido = true;
            return 2;
        }else if(robaArmas[0].id == 0) { //Vacío
            target._result.armasRobadas = true;
            return 1;
        }else{ //hay premios.
            robaArmas.forEach(o => {
                target.perderArmas(o);
                subject.ganarArmas(o);
            });
            return 0;
        }
    }
    return  -1;
};

Game_Action.prototype.aplicarRoboProtecs= function(indiceRobo, habR, target, subject){
    let robaProtec = this.aplicarRoboGen(indiceRobo.protec,habR.protec, target.protecs());
    if(robaProtec != null){
        if(robaProtec.length <= 0) { //Falla
            target._result.roboFallido = true;
            return 2;
         }else if(robaProtec[0].id == 0) { //Vacío
            target._result.protecRobadas = true;
            return 1;
        }else{ //hay premios.
            robaProtec.forEach(o => {
                target.perderProtecs(o);
                subject.ganarProtecs(o);
            });
            return 0;
        }
    }
};

Game_Action.prototype.aplicarRoboGen = function(iRR, habR, elementosRobables){
    if(!habR) return null;
    let robos = [];
    if(habR.tasa){
        robos.push({id: 0, tasa: habR.tasa * iRR, cantidad : habR.cantidad});
    }else if(habR.posibles){
        habR.posibles.forEach(o=> robos.push({id: o.id, cantidad : o.cantidad, tasa : iRR * o.tasa}));
    }
    robos = robos.filter(o=> o.tasa > 0); 
    //Puede que tenga algún estado que haga que robar le sea imposible y siempre falla.
    if(robos.length <= 0) return []; // target._result.roboFallido = true;

    const mapaIdRobable = robos.map(r => r.id);
    const objPosibles = elementosRobables.filter(o => mapaIdRobable[0] == 0 || mapaIdRobable.indexOf(o.id) >= 0); 
   //No tiene nada qué robar. va vacío.
    if(objPosibles.length <= 0) return [Zausen.FZ_SistemaRobo.MoldeObjeto(0,0)]; //target._result.objetosRobados = true;



    //Ahora hay que reducir las opciones a lo que es posible robar.
    const mapaObjPosibles = objPosibles.map(op => op.id);
    if(robos[0].id == 0){
        //Hay que reparar las tasas.
        robos = objPosibles.map(o => Zausen.FZ_SistemaRobo.MoldeObjetoE(o.id,o.cantidad, o.tasa * robos[0].tasa));
    }else{
        robos = robos.filter(o => mapaObjPosibles.indexOf(o.id) >= 0);
        //Hay que reparar las tasas.
        robos.forEach(o =>{
            let index = mapaObjPosibles.indexOf(o.id);
            o.tasa *= objPosibles[index].tasa;
        });
    }

    //Y ahora hay bucle hasta que no se puede robar nada más. (o 100 robos)
    let resultados = [];
    let robosAprobados = null;
    let maxIteraciones = 100; //Para evitar bucles infinitos.
    do{
        //Se obtiene el ratio y se filtra para ver qué se puede robar.
        let ratio = Math.random();
        robosAprobados = robos.filter(o => o.tasa >= ratio);
        if(robosAprobados.length <= 0) return resultados;
        
        //A partir de aquí sólo se mira por los robosAprobados.
        let cualRoba = Math.ceil(Math.random() * (robosAprobados.length-1));
        let maximoRobable = objPosibles[mapaObjPosibles.indexOf(robosAprobados[cualRoba].id)].cantidad;
        let cantidad = Math.min(maximoRobable,Math.max(1,Math.ceil(Math.random() * robosAprobados[cualRoba].cantidad)));
        var result = Zausen.FZ_SistemaRobo.MoldeObjeto(robosAprobados[cualRoba].id,cantidad);
        
        //Se aplica el resultado y se reduce la tasa general de todo lo robable.
        resultados.push(result);
        robos.forEach(r => r.tasa -= ratio); //Se reduce las opciones de robo de todos los objetos.
 
    }while(robos.length > 0 && (maxIteraciones--) > 0);

    return resultados; //No debería llegar aquí...
};

Game_Action.prototype.aplicarRoboMon = function(subject,target, iR, hab){
    if(target.mon() <= 0){
        target._result.monRobada = true;
         return 1;
    }
    const ratio = Math.random();
    const dinMin = hab.mon.min;
    const dinMax = hab.mon.max;
    const diferencia = dinMax -dinMin;
    const ratioRobo = iR.mon - ratio;
    let cantRobada = Math.floor(Math.max(0, dinMin + Math.min(dinMax, diferencia * ratioRobo)));
    if(ratio > iR.mon || cantRobada == 0){
        target._result.roboFallido = true;
         return 2;
    }
    cantRobada = Math.min(target.mon(),cantRobada);
    target.perderMon(cantRobada);
    subject.ganarMon(cantRobada);
     iR.mon = null;
     return 0;
};

/* ****************************************************************************************************************************************** 
************************************************************* Game_ActionResult *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaRobo.Game_ActionResult = Zausen.FZ_SistemaRobo.Game_ActionResult || {};

Zausen.FZ_SistemaRobo.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
    Zausen.FZ_SistemaRobo.Game_ActionResult.clear.call(this);
    this.monRobada = false;
    this.roboFallido = false;
    this.objetosRobados = false;
    this.armasRobadas = false;
    this.protecRobadas = false;
    this.monPerdido = 0; 
    this.objetosPerdidos = [];
    this.armasPerdidas = [];
    this.protecPerdidas = [];
    this.msjMon = null;
    this.msjObjetos = null;
    this.msjArmas= null;
    this.msjProtecs = null;
};

/* ****************************************************************************************************************************************** 
************************************************************* Window_BattleLog *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaRobo.Window_BattleLog = Zausen.FZ_SistemaRobo.Window_BattleLog || {};

Zausen.FZ_SistemaRobo.Window_BattleLog.displayActionResults = Window_BattleLog.prototype.displayActionResults;
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    Zausen.FZ_SistemaRobo.Window_BattleLog.displayActionResults.call(this, subject, target);
    const result = target.result();
    if(!result.msjMon && !result.msjObjetos && !result.msjArmas && !result.msjProtecs) return;
    if (result.msjMon) this.mostrarTextoRoboDinero(result.msjMon, result.monPerdido, target.name(), subject.name());
    if (result.msjObjetos) this.mostrarElementosRobados(result.msjObjetos, result.objetosPerdidos, target.name(), subject.name(), result.roboFallido, $dataItems);
    if (result.msjArmas) this.mostrarElementosRobados(result.msjArmas, result.armasPerdidas, target.name(), subject.name(), result.roboFallido, $dataWeapons);
    if (result.msjProtecs) this.mostrarElementosRobados(result.msjProtecs, result.protecPerdidas, target.name(), subject.name(), result.roboFallido, $dataArmors);
    this.push('wait');
    this.push("waitForNewLine");
    this.push("popBaseLine");
    
};

Window_BattleLog.prototype.mostrarTextoRoboDinero = function(mensaje, cantidad, objetivo, usuario){
    const nombreMoneda = TextManager.currencyUnit;
    this.mostrarRobados(mensaje, nombreMoneda, cantidad,objetivo,usuario); 
};

Window_BattleLog.prototype.mostrarElementosRobados = function(mensaje, elementos, objetivo, usuario, fallo, data){
    var elm = null;
    if(elementos && elementos.length > 0) elm =  elementos.map(o=> { return { nombre: data[o.id].name, cantidad:  o.cantidad}});
    let repetir= !fallo && elm;
    if(repetir){
        elm.forEach( e=> this.mostrarRobados(mensaje,e.nombre,e.cantidad,objetivo,usuario));
    }else{
        this.mostrarRobados(mensaje,"","",objetivo,usuario);
    }
};  

Window_BattleLog.prototype.mostrarRobados = function(mensaje, que, cantidad, objetivo, usuario){
    this.push('addText', mensaje.format(usuario,objetivo,que,cantidad));
    this.push('wait');
    this.push("waitForNewLine");
};


