var Zausen = Zausen || {};
Zausen.FZ_SistemaResurreccion = Zausen.FZ_SistemaResurreccion || {};
/*:
 * @target MZ
 * @plugindesc Cambia la forma en la que se comporta el juego al caer en combate.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaResurreccion.js
 * 
 * Cambia el modo en el que se comporta el fin del juego para que en vez de llevar a la pantalla de título puedan realizarse otras acciones.
 * 
 * Hay una configuración inicial pero a lo largo del juego, gracias a distintos comandos, se puede cambiar cómo funciona el sistema
 * e incluso activar y desactivar. (Realiza guardado así que se mantienen los cambios en el transcurso de la partida)
 * 
 * 
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
 * @param Id Mapa
 * @desc id del mapa inicial donde se resucitará. (Viene indicado en las propeidades del mapa, en la cabecera de su ventana a la izquierda, no son necesarios los ceros a la izqueirda)
 * @type number
 * @min 1
 * @max 99999999
 * @default 1
 * 
 * @param Pos x mapa
 * @desc posición x del mapa donde aparecerá.
 * @type number
 * @min 0
 * @max 99999999
 * @default 0
 * 
 * @param Pos y mapa
 * @desc posición y del mapa donde aparecerá.
 * @type number
 * @min 0
 * @max 99999999
 * @default 0
 * 
 * @param Interruptores
 * @desc lista de interruptores que se deben activar al morir.
 * @type switch[]
 * 
 * 
 * @param Variable
 * @desc variable a la que se le debe cambiar el valor.
 * @type variable
 * 
 * @param Cifra para variable
 * @desc cifra a aplicar a la variable
 * @type number
 * @min -99999999
 * @max 99999999
 * 
 * @param Operación para la variable
 * @desc cómo debe afectar la cifra de la variable a la variable.
 * @type select
 * @option Constante
 * @value 0
 * @option Sumar
 * @value 1
 * @option Restar
 * @value 2
 * @option Multiplicar
 * @value 3
 * @option Dividir
 * @value 4
 * @option Igual al resto
 * @value 5
 * @default 0
 * 
 * @param Estados alterados
 * @desc Estados alterados que deben ganar los perosnajes tras un gameover.
 * @type state[]
 * 
 * @param Dinero a perder (porcentaje)
 * @desc porcentaje de dinero que perderá el equipo al hacer gameover
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * @param Dinero a perder (fijo)
 * @desc Dinero que perderá el equipo al hacer gameover
 * @type number
 * @min -99999999
 * @max 99999999
 * @default 0
 * 
 * 
 * @param Objetos
 * @desc Lista de objetos que puede perder el equipo al morir
 * @type item[]
 * 
 * @param Cualquier objeto en posesión se puede perder
 * @desc al activar esto se ignorará la lista de objetos anterior y se agregarán todos los objetos a las posibilidades (Excepto los objetos clave).
 * @type boolean
 * @on Todos
 * @off Ninguno
 * @default false
 * 
 * @param Cantidad de objetos a perder
 * @desc Qué cantidad de objetos debe perder
 * @type number
 * @min -99999999
 * @max 99999999
 * @default 0
 * 
 * @param Perder objetos fijo
 * @desc cómo pierden objetos, fijo es que pierden la misma cantidad de todos los objetos seleccionados, Aleatorio en cambio perderá objetos hasta cumplir con la cantidad.
 * @type boolean
 * @on Fijo
 * @off Aleatorio
 * @default true
 * 
 * 
 * @param Iniciar transición
 * @desc ¿Debe iniciar una transición cuando el grupo caiga derrotado?
 * @type boolean
 * @on Sí
 * @off No
 * @default true
 * 
---------------------------------------------------------------------------------------------------------------------------------------------------------
 * 
 * @command cambiarLugarResurreccion
 * @text Cambiar lugar de resurrección
 * @desc cambia el lugar de resurrección donde aparecerá el grupo tras su derrota.
 * 
 * 
 * @arg idMapa
 * @text Id del mapa 
 * @desc (aparece a la izquierda de la cabecera de las propiedades de cada mapa, no son necesarios los ceros a la izquierda)
 * @type number
 * @min 1
 * @max 99999999
 * @default 1
 * 
 
 * @arg xMapa
 * @text Posición X del mapa
 * @desc posición x del mapa donde aparecerá.
 * @type number
 * @min 0
 * @max 99999999
 * @default 0
 * 
 * @arg yMapa
 * @text Posición Y del mapa
 * @desc posición y del mapa donde aparecerá.
 * @type number
 * @min 0
 * @max 99999999
 * @default 0
 * 
------------------------------------
 * 
 * @command cambiarInterruptoresResurreccion
 * @text Cambiar los interruptores.
 * @desc cambia los interruptores que deben activarse tras la derrota del grupo.
 * 
 * @arg interruptores
 * @text Lista de interruptores
 * @desc Lista de interruptores que deben activarse.
 * @type switch[]
 * 
 * @arg comentario
 * @text Texto
 * @desc Comentario de texto.
 * @type String
 * 
-------------------------------------
 * 
 * @command cambiarVariableResurreccion
 * @text Cambiar la variable de resurrección
 * @desc cambia la variable (Y de paso cómo debe cambiar) tras la derrota del grupo.
 * 
 * @arg variable
 * @text variable a cambiar
 * @desc La variable que debe cambiar de valor.
 * @type variable
 * 
 * @arg cifra
 * @text cifra a cambiar
 * @desc cifra a aplicar a la variable
 * @type number
 * @min -99999999
 * @max 99999999
 * @default 0
 * 
 * @arg modo
 * @text Tipo de operación
 * @desc cómo debe afectar la cifra de la variable a la variable.
 * @type select
 * @option Constante
 * @value 0
 * @option Sumar
 * @value 1
 * @option Restar
 * @value 2
 * @option Multiplicar
 * @value 3
 * @option Dividir
 * @value 4
 * @option Igual al resto
 * @value 5
 * @default 0
 * 
-----------------------------------
 * 
 * @command cambiarCastigoResurreccion
 * @text Cambiar el castigo de la resurrección
 * @desc Cambia el castigo recibido tras la muerte del grupo.
 * 
 * @arg estados
 * @text Estados alterados
 * @desc Lista de estados alterados que recibirán los miembros del grupo tras su derrota.
 * @type state[]
 * 
 * @arg pDinero
 * @text Dinero a perder (Porcentaje)
 * @desc porcentaje de dinero que perderá el equipo al hacer gameover
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * 
 * @arg dinero
 * @text Dinero a perder (fijo) 
 * @desc Dinero que perderá el equipo al hacer gameover
 * @type number
 * @min -99999999
 * @max 99999999
 * @default 0
 * 
 * 
 * @arg objetos
 * @text Objetos a perder 
 * @desc Lista de objetos que puede perder el equipo al morir
 * @type item[]
 * 
 * @arg cualquierObj
 * @text ¿Se puede perder cualquier objeto?
 * @desc al activar esto se ignorará la lista de objetos anterior y se agregarán todos los objetos a las posibilidades (Excepto los objetos clave).
 * @type boolean
 * @on Todos
 * @off Ninguno
 * @default false
 * 
 * @arg cantidadObj
 * @text Cantidad de objetos a perder
 * @desc Qué cantidad de objetos debe perder
 * @type number
 * @min -99999999
 * @max 99999999
 * @default 0
 * 
 * @arg perderFijo
 * @text ¿Perder objetos fijo?
 * @desc cómo pierden objetos, fijo es que pierden la misma cantidad de todos los objetos seleccionados, Aleatorio en cambio perderá objetos hasta cumplir con la cantidad.
 * @type boolean
 * @on Fijo
 * @off Aleatorio
 * @default true
 * 
 * 
-----------------------------------
 * @command activarResurreccion
 * @text Activar la resurrección
 * @desc Activa la resurrección del grupo.
 * 
-----------------------------------
 * @command desactivarResurreccion
 * @text Desactivar la resurrección
 * @desc Desactiva la resurrección del grupo.
 * 
-------------------------------------------
 */
Zausen.FZ_SistemaResurreccion.pluginName = 'SistemaResurreccion';
Zausen.FZ_SistemaResurreccion.PlugingManager = PluginManager.parameters(Zausen.FZ_SistemaResurreccion.pluginName);
Zausen.FZ_SistemaResurreccion.Parametros = Zausen.FZ_SistemaResurreccion.Parametros || {};

Zausen.FZ_SistemaResurreccion.Parametros.idMapa = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Id Mapa'] || 0);//1
Zausen.FZ_SistemaResurreccion.Parametros.xMapa = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Pos x mapa'] || 0);//2
Zausen.FZ_SistemaResurreccion.Parametros.yMapa = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Pos y mapa'] || 0);//3
Zausen.FZ_SistemaResurreccion.Parametros.interruptores = Zausen.FZ_SistemaResurreccion.PlugingManager['Interruptores'];//4

Zausen.FZ_SistemaResurreccion.Parametros.variable = Zausen.FZ_SistemaResurreccion.PlugingManager['Variable'];//5  
Zausen.FZ_SistemaResurreccion.Parametros.cifraVariable = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Cifra para variable'] || 0);//6
Zausen.FZ_SistemaResurreccion.Parametros.operaciónVariable = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Operación para la variable'] || 0);//7

Zausen.FZ_SistemaResurreccion.Parametros.estadosAlterados = Zausen.FZ_SistemaResurreccion.PlugingManager['Estados alterados'];//8
Zausen.FZ_SistemaResurreccion.Parametros.pDinero = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Dinero a perder (porcentaje)'] || 0);//9
Zausen.FZ_SistemaResurreccion.Parametros.dinero = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Dinero a perder (fijo)'] || 0);//10
Zausen.FZ_SistemaResurreccion.Parametros.objetos = Zausen.FZ_SistemaResurreccion.PlugingManager['Objetos'];//11
Zausen.FZ_SistemaResurreccion.Parametros.cualquierObjeto = Boolean(Zausen.FZ_SistemaResurreccion.PlugingManager['Cualquier objeto en posesión se puede perder'] == "true" || false);//12
Zausen.FZ_SistemaResurreccion.Parametros.cantidadObjetosPerder = Number(Zausen.FZ_SistemaResurreccion.PlugingManager['Cantidad de objetos a perder'] || 0);//13
Zausen.FZ_SistemaResurreccion.Parametros.perderObjetosFijo = Boolean(Zausen.FZ_SistemaResurreccion.PlugingManager['Perder objetos fijo'] == "true" || false);//14 
Zausen.FZ_SistemaResurreccion.Parametros.iniciarTransicion = Boolean(Zausen.FZ_SistemaResurreccion.PlugingManager['Iniciar transición'] == "true" || false);//15

/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaResurreccion.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaResurreccion.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaResurreccion.BBDDCargada) {
        Zausen.FZ_SistemaResurreccion.BBDDCargada = true;
        Zausen.FZ_SistemaResurreccion.corregirValores();
    }
    return true;
};

Zausen.FZ_SistemaResurreccion.corregirValores = function () {
    Zausen.FZ_SistemaResurreccion.Parametros.idMapa = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.idMapa, 1, 99999999);
    Zausen.FZ_SistemaResurreccion.Parametros.xMapa = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.xMapa, 0, 99999999);
    Zausen.FZ_SistemaResurreccion.Parametros.yMapa = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.yMapa, 0, 99999999);

    let interruptores = eval(Zausen.FZ_SistemaResurreccion.Parametros.interruptores);
    if(interruptores) interruptores = interruptores.filter(intr => intr && !isNaN(intr)).map(intr => parseInt(intr)); 
    Zausen.FZ_SistemaResurreccion.Parametros.interruptores = interruptores || [];

    let variable = Zausen.FZ_SistemaResurreccion.Parametros.variable;
    if (variable == null || isNaN(variable)) variable = -1;
    Zausen.FZ_SistemaResurreccion.Parametros.variable = variable;

    Zausen.FZ_SistemaResurreccion.Parametros.cifraVariable = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.cifraVariable, -99999999, 99999999);

    Zausen.FZ_SistemaResurreccion.Parametros.operaciónVariable = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.operaciónVariable, 0, 5);
    let estadosAlterados = eval(Zausen.FZ_SistemaResurreccion.Parametros.estadosAlterados);
    Zausen.FZ_SistemaResurreccion.Parametros.estadosAlterados = estadosAlterados || [];

    Zausen.FZ_SistemaResurreccion.Parametros.pDinero = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.pDinero, -100, 100)/100;
    let objetos = eval(Zausen.FZ_SistemaResurreccion.Parametros.objetos);
    Zausen.FZ_SistemaResurreccion.Parametros.objetos = objetos || [];
    if (Zausen.FZ_SistemaResurreccion.Parametros.cualquierObjeto) {
        Zausen.FZ_SistemaResurreccion.Parametros.objetos = [];
        $dataItems.filter(di => di && di.itypeId == 1).forEach(di => Zausen.FZ_SistemaResurreccion.Parametros.objetos.push(di.id));
    }

    Zausen.FZ_SistemaResurreccion.Parametros.cantidadObjetosPerder = Zausen.FZ_SistemaResurreccion.validarNumero(Zausen.FZ_SistemaResurreccion.Parametros.cantidadObjetosPerder, 0, 99999999);
};
Zausen.FZ_SistemaResurreccion.validarNumero = function (posibleNum, min, max) {
    let pos = posibleNum;
    if (pos == null || isNaN(pos)) pos = min;
    pos = parseInt(pos);
    return pos.clamp(min, max);
};

Zausen.FZ_SistemaResurreccion.crearMapa = function (idm, xm, ym) {
    return { id: idm, x: xm, y: ym };
};

Zausen.FZ_SistemaResurreccion.crearVariable = function (idv, modov, cifrav) {
    return {
        id: idv || null,
        modo: modov,
        cifra: cifrav
    };
};

Zausen.FZ_SistemaResurreccion.crearCastigo = function (estadosc, pDineroc, dineroc, objetosc, perderObjFijoc, cantObjPerderc) {
    return {
        estados: estadosc,
        pDinero: pDineroc,
        dinero: dineroc,
        objetos: objetosc,
        perderObjFijo: perderObjFijoc,
        cantObjPerder: cantObjPerderc
    };
};
/* ****************************************************************************************************************************************** 
******************************************************************* comandos ****************************************************************
*********************************************************************************************************************************************/

PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'cambiarLugarResurreccion', args => {
    let idMapa = Zausen.FZ_SistemaResurreccion.validarNumero(args.idMapa, 1, 99999999);  
    let xMapa = Zausen.FZ_SistemaResurreccion.validarNumero(args.xMapa, 0, 99999999); 
    let yMapa = Zausen.FZ_SistemaResurreccion.validarNumero(args.yMapa, 0, 99999999);  
    $gameGameResurreccion.setMapa(Zausen.FZ_SistemaResurreccion.crearMapa(idMapa, xMapa, yMapa));
});


PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'cambiarInterruptoresResurreccion', args => {
    let interruptores = eval(args.interruptores); 
    if(interruptores) interruptores = interruptores.filter(intr => intr && !isNaN(intr)).map(intr => parseInt(intr)); 
    $gameGameResurreccion.setInterruptores(interruptores);
});

PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'cambiarVariableResurreccion', args => {
    let variable = args.variable;
    if(variable == null || isNaN(variable) || variable < 1) variable = null;
    let cifra = Zausen.FZ_SistemaResurreccion.validarNumero(args.cifra, -99999999, 99999999); 
    let modo = Zausen.FZ_SistemaResurreccion.validarNumero(args.modo, -99999999, 99999999); 
    $gameGameResurreccion.setVariable(Zausen.FZ_SistemaResurreccion.crearVariable(variable, modo, cifra));
});

PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'cambiarCastigoResurreccion', args => {
    let estados =  eval(args.estados); 
    let pDinero =  Zausen.FZ_SistemaResurreccion.validarNumero(args.pDinero, -100, 100)/100;
    let dinero =  Zausen.FZ_SistemaResurreccion.validarNumero(args.dinero, -99999999, 99999999); 
    let objetos =  eval(args.objetos);  
    if(args.cualquierObj == "true"){
        objetos = [];
        $dataItems.filter(di => di && di.itypeId == 1).forEach(di => objetos.push(di.id));
    }
    let cantidadObj = Zausen.FZ_SistemaResurreccion.validarNumero(args.cantidadObj, -99999999, 99999999);
    let perderFijo =  args.perderFijo == "true"; 
    $gameGameResurreccion.setCastigo(Zausen.FZ_SistemaResurreccion.crearCastigo(estados || [], pDinero, dinero, objetos || [], perderFijo, cantidadObj));
});

PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'activarResurreccion', args => {
    $gameGameResurreccion.setResucitar(true);
});

PluginManager.registerCommand(Zausen.FZ_SistemaResurreccion.pluginName, 'desactivarResurreccion', args => {
    $gameGameResurreccion.setResucitar(false);
});

/* ****************************************************************************************************************************************** 
*************************************************************** Game_GameResurreccion ***************************************************************
*********************************************************************************************************************************************/

$gameGameResurreccion = null;

function Game_GameResurreccion() {
    this.initialize(...arguments);
}

Game_GameResurreccion.prototype.initialize = function () {
    const parametros = Zausen.FZ_SistemaResurreccion.Parametros;
    this._mapa = Zausen.FZ_SistemaResurreccion.crearMapa(parametros.idMapa, parametros.xMapa, parametros.yMapa);
    this._interruptores = Zausen.FZ_SistemaResurreccion.Parametros.interruptores || []; 
    this._variable = Zausen.FZ_SistemaResurreccion.crearVariable(parametros.variable, parametros.operaciónVariable, parametros.cifraVariable);
    this._castigo = Zausen.FZ_SistemaResurreccion.crearCastigo(parametros.estadosAlterados, parametros.pDinero, parametros.dinero, parametros.objetos, parametros.perderObjetosFijo, parametros.cantidadObjetosPerder);
    this._resucitar = true;
};
Game_GameResurreccion.prototype.getCastigo = function () {
    return this._castigo;
};
Game_GameResurreccion.prototype.getMapa = function () {
    return this._mapa;
};
Game_GameResurreccion.prototype.getVariable = function () {
    return this._variable;
};
Game_GameResurreccion.prototype.getInterruptores = function () {
    return this._interruptores ? this._interruptores : [];
};
Game_GameResurreccion.prototype.getResucitar = function () {
    return this._resucitar;
};


Game_GameResurreccion.prototype.setCastigo = function (castigo) {
    this._castigo = castigo;
};
Game_GameResurreccion.prototype.setMapa = function (mapa) {
    this._mapa = mapa || { id: 1, x: 0, y: 0 };
};
Game_GameResurreccion.prototype.setVariable = function (variable) {
    this._variable = variable;
};
Game_GameResurreccion.prototype.setInterruptores = function (interruptores) {
    this._interruptores = interruptores || [];
};
Game_GameResurreccion.prototype.setResucitar = function (resucitar) {
    this._resucitar = resucitar;
};


Game_GameResurreccion.prototype.estadosCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.estados : [];
};

Game_GameResurreccion.prototype.pDineroCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.pDinero : 0;
};
Game_GameResurreccion.prototype.dineroCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.dinero : 0;
};
Game_GameResurreccion.prototype.objetosCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.objetos : [];
};
Game_GameResurreccion.prototype.modoObjCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.perderObjFijo : false;
};
Game_GameResurreccion.prototype.cantidadObjPerderCastigo = function () {
    const cast = this._castigo;
    return cast ? cast.cantObjPerder : 0;
};

Game_GameResurreccion.prototype.idMapa = function () {
    const mp = this.getMapa();
    return mp ? mp.id : null;
};

Game_GameResurreccion.prototype.posicionMapa = function () {
    const mp = this.getMapa();
    return mp ? { x: mp.x, y: mp.y } : { x: 0, y: 0 };
};

Game_GameResurreccion.prototype.idVariable = function () {
    const vr = this._variable;
    return vr ? vr.id : -1;
};

Game_GameResurreccion.prototype.modoVariable = function () {
    const vr = this._variable;
    return vr ? vr.modo : 0; // 0 =, 1 +, 2-, 3*, 4/, 5 = mod
};

Game_GameResurreccion.prototype.cifraVariable = function () {
    const vr = this._variable;
    return vr ? vr.cifra : 0;
};


Game_GameResurreccion.prototype.aplicarResurreccion = function () {
    if (!$gameGameResurreccion.getResucitar() || !$gameParty.isAllDead()) return; //Revive?
    $gameParty.reviveBattleMembers();
    //¿A dónde va?
    const posMapa = this.posicionMapa();
    $gamePlayer.reserveTransfer(this.idMapa(), posMapa.x, posMapa.y, 0, 0);
    //¿Qué pasa con la variable?
    this.tratarVariable();
    //¿Qué pasa con los interruptores?
    this.tratarInterruptores();
    //¿Y el castigo?
    this.tratarCastigo();
};

Game_GameResurreccion.prototype.tratarCastigo = function () {
    //Dinero
    const dineroAPerder = $gameParty.gold() * this.pDineroCastigo() + this.dineroCastigo();
    $gameParty.loseGold(Math.round(dineroAPerder));
    //Objetos
    let objetosAPerder = this.objetosCastigo().filter(id => $gameParty.hasItem($dataItems[id]));
    const modoObjP = this.modoObjCastigo();
    let cantAPerder = this.cantidadObjPerderCastigo();
    let maxVueltas = 100000;
    while (cantAPerder > 0 && objetosAPerder.length > 0 && --maxVueltas > 0) {
        let siguiente = Math.round(Math.random() * objetosAPerder.length);
        let cantidadAPerder = modoObjP ? cantAPerder : Math.max(1, Math.round(Math.random() * cantAPerder));
        let max = $gameParty.numItems($dataItems[objetosAPerder[siguiente]]);
        cantidadAPerder = Math.min(max, cantidadAPerder);
        $gameParty.loseItem($dataItems[objetosAPerder[siguiente]], cantidadAPerder);
        objetosAPerder.splice(siguiente, 1);
        if(!modoObjP)cantAPerder -= cantidadAPerder;
        
    }
    //Estados alterados
    const estados = this.estadosCastigo();
    estados.forEach(est => $gameParty.aliveMembers().forEach(mb => mb.addState(est)));
};
Game_GameResurreccion.prototype.tratarInterruptores = function () {
    this.getInterruptores().forEach(intr => {
        $gameSwitches.setValue(intr,true);
    });
};
Game_GameResurreccion.prototype.tratarVariable = function () {
    const idV = this.idVariable();
    const modo = this.modoVariable();
    const cifra = this.cifraVariable();
    if (idV < 0) return;
    let variable = $gameVariables.value(idV);
    if (!variable) variable = 0;
    let signo = null;
    switch (modo) {
        case 1:
            signo = " + ";
            break;
        case 2:
            signo = " - ";
            break;
        case 2:
            signo = " * ";
            break;
        case 2:
            signo = " / ";
            break;
        case 2:
            signo = " % ";
            break;
    }

    if (!signo) {
        $gameVariables.setValue(idV,Math.round(cifra)); 
    } else {
        const calculo = variable + signo + cifra;
        $gameVariables.setValue(idV, Math.round(eval(calculo)));
    }

};


/* ****************************************************************************************************************************************** 
***************************************************************** BattleManager *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaResurreccion.BattleManager = Zausen.FZ_SistemaResurreccion.BattleManager || {};

Zausen.FZ_SistemaResurreccion.BattleManager.updateBattleEnd = BattleManager.updateBattleEnd;

BattleManager.updateBattleEnd = function () {
    if (!$gameGameResurreccion.getResucitar()) {
        Zausen.FZ_SistemaResurreccion.BattleManager.updateBattleEnd.call(this);
        return;
    }
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else { 
          if(Zausen.FZ_SistemaResurreccion.Parametros.iniciarTransicion)  $gameScreen.startFadeOut(10);
            $gameGameResurreccion.aplicarResurreccion();
            SceneManager.pop();
        }
    } else {
        SceneManager.pop();
    }
    this._phase = "";
};

/* ****************************************************************************************************************************************** 
******************************************************************* Scene_Base **************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaResurreccion.Scene_Base = Zausen.FZ_SistemaResurreccion.Scene_Base || {};

Zausen.FZ_SistemaResurreccion.Scene_Base.checkGameover = Scene_Base.prototype.checkGameover;
Scene_Base.prototype.checkGameover = function () {
    if (!$gameGameResurreccion.getResucitar()) {
        Zausen.FZ_SistemaResurreccion.Scene_Base.checkGameover.call(this);
        return;
    }
    if ($gameParty.isAllDead()) {
        if(Zausen.FZ_SistemaResurreccion.Parametros.iniciarTransicion)  $gameScreen.startFadeOut(10); 
        $gameGameResurreccion.aplicarResurreccion(); 
    }
};


/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaResurreccion.DataManager = Zausen.FZ_SistemaResurreccion.DataManager || {};

Zausen.FZ_SistemaResurreccion.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    Zausen.FZ_SistemaResurreccion.DataManager.createGameObjects.call(this);
    $gameGameResurreccion = new Game_GameResurreccion();
};

Zausen.FZ_SistemaResurreccion.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
    const contents = Zausen.FZ_SistemaResurreccion.DataManager.makeSaveContents.call(this);
    contents.gameOverData = $gameGameResurreccion;
    return contents;
};

Zausen.FZ_SistemaResurreccion.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
    Zausen.FZ_SistemaResurreccion.DataManager.extractSaveContents.call(this, contents);
    $gameGameResurreccion = contents.gameOverData;
};