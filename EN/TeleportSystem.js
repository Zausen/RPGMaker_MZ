var Zausen = Zausen || {};
Zausen.FZ_SistemaTeletransporte = Zausen.FZ_SistemaTeletransporte || {};
/*:
 * @target MZ
 * @plugindesc Create a teleport system that is saved while you play.
 * @author Fer Zacrón, test: Efímero
 *
 * @help TeleportSystem.js
 * 
 * This plugin implements a dynamic teleport system. This plugin should be used with help
 * of the command plugin (From last options in events)
 * 
 * Once maked the teleport point not is necessary make again it, you can: hiden, show, enabled, 
 * disabled and edit it.
 * 
 * The support images of the teleport points must are in the "titles1" folder.
 * 
 * By default when you create a new teleport point it is visible and enabled,
 * use the other commands to change it if you don't want it. 
 * 
 * It is possible to call up a teleportation menu with the events (Surprise! With a plugin 
 * command) and / or show and enable in the main menu in any time.
 * 
 * Unfortunately I could not put a location selector, for this you will have to use numbers directly.
 * 
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
 * @param Confirm text
 * @desc Text for the button to confirm the "selected point"
 * @default Yes 
 * 
 * @param Cancel text
 * @desc  Text for the button to cancel the "selected point"
 * @default No
 * 
 * @param Head text of window Confirm Cancel
 * @desc Text for the title of mini confirm window of point teleport. (%1 == point name).
 * @default do you wish go to %1?  
 * 
 * @param Background image color
 * @desc The color of the back of the point image. If you want, you can select "Text" in place a option and write the code color (RRR,GGG,BBB,T).
 * @type select
 * @option Black
 * @value 5,6,38,1
 * @option White
 * @value 255,255,255,1
 * @option Blue
 * @value 60,66,218,1
 * @option Green
 * @value 60,218,92,1
 * @option Red
 * @value 218,60,60,1
 * @option Cyan
 * @value 69,226,226,1
 * @option Magenta
 * @value 226,69,226,1
 * @option Yellow
 * @value 226,221,69,1
 * @option Orange
 * @value 226,116,69,1
 * @option Purple
 * @value 113,51,161,1
 * @option Customized
 * @value 142,49,182,1
 * @default 5,6,38,1
 * 
 * 
 * @param Image mode
 * @desc The behavior of the image.
 * @type select
 * @option Deform
 * @value 1
 * @option Adjust  
 * @value 2
 * @option Normal  
 * @value 3
 * @default 2
 * 
 * 
 * @param Show in menu
 * @desc Defines whether the teleport menu is displayed from the beginning or not.
 * @type boolean
 * @on Sí
 * @of No
 * default No
 * 
 * @param Enable in menu
 * @desc Defines whether the teleport menu is enabled from the beginning or not.
 * @type boolean
 * @on Sí
 * @of No
 * default No
 * 
 * @param Teleport menu name
 * @desc Text for the name of the teleport menu.
 * @default Teleports
 * 
------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @command CrearPuntoTeletransporte
 * @text Create a new teleport point.
 * @desc Create a new teleport point.
 *
 * @arg nombre
 * @text Teleport point name
 * @desc The name of the teleport point.
 * @type string 
 *
 * @arg descripcion
 * @text Teleport point description
 * @desc Description of the teleport point.
 * @type multiline_string 
 *
 * @arg mapa
 * @text Map
 * @desc Identification of the destination map. In the map settings, top left, you can find this id, you don't need the leading zeros.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * @arg x
 * @text X position
 * @desc X position in the map.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * 
 * @arg y
 * @text Y position
 * @desc Y position in the map.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * @arg imagen
 * @text Image
 * @desc The location image
 * @type file
 * @dir img/titles1/
 * @default 
 * 
 * 
 * @arg direccion
 * @text Direction
 * @desc Direction to look
 * @type select
 * @option Current
 * @value 0
 * @option Up
 * @value 8
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @default 0
 * 
 * @arg transicion
 * @text Transition
 * @desc Teleport transition
 * @type select
 * @option Black
 * @value 0
 * @option White
 * @value 1
 * @option Nothing
 * @value 2
 * @default 0
 * 
 * 
 * -------------------------------------------------------
 * @command ModificarPuntoTeletransporte
 * @text Modify a teleport point.
 * @desc Modify a teleport point.
 *
 * @arg nombre
 * @text Teleport point name
 * @desc The name of the teleport point.
 * @type string 
 *
 * @arg descripcion
 * @text Teleport point description
 * @desc Description of the teleport point.
 * @type multiline_string 
 *
 * @arg mapa
 * @text Map
 * @desc Identification of the destination map. In the map settings, top left, you can find this id, you don't need the leading zeros.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * @arg x
 * @text X position
 * @desc X position in the map.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * 
 * @arg y
 * @text Y position
 * @desc Y position in the map.
 * @type number
 * @min 0
 * @max 9999999
 * 
 * @arg imagen
 * @text Image
 * @desc The location image
 * @type file
 * @dir img/titles1/
 * @default 
 * 
 * 
 * @arg direccion
 * @text Direction.
 * @desc Direction to look.
 * @type select
 * @option Current
 * @value 0
 * @option Up
 * @value 8
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @default 0
 * 
 * @arg transicion
 * @text Tranisition
 * @desc Teleport transition
 * @type select
 * @option Black
 * @value 0
 * @option White
 * @value 1
 * @option Nothing
 * @value 2
 * @default 0
 * 
 * -------------------------------------------------------
 * @command inhabilitarTp
 * @text Disable a teleport point.
 * @desc Disable a saved teleport point. 
 * 
 * 
 * @arg nombre
 * @text Teleport name
 * @desc The teleport name of an existing teleport point.
 * @type string 
 * 
 * -------------------------------------------------------
 * @command habilitarTp
 * @text Enable a teleport point.
 * @desc Enable a saved teleport point.
 * 
 * 
 * @arg nombre
 * @text Teleport name
 * @desc The teleport name of an existing teleport point.
 * @type string 
 * 
 * -------------------------------------------------------
 * @command ocultarTp
 * @text Hide a teleport point.
 * @desc Hide a saved teleportation point
 * 
 * 
 * @arg nombre
 * @text Teleport name
 * @desc The teleport name of an existing teleport point.
 * @type string 
 * 
 * -------------------------------------------------------
 * @command mostrarTp
 * @text Show a teleport point.
 * @desc Show a saved teleport point.
 * 
 * 
 * @arg nombre
 * @text Teleport name
 * @desc The teleport name of an existing teleport point.
 * @type string 
 * -------------------------------------------------------
 * @command teletransportar
 * @text Teleport
 * @desc Transport to saved teleport point. 
 * 
 * 
 * @arg nombre
 * @text Teleport name
 * @desc The teleport name of an existing teleport point.
 * @type string 
 * 
 * @arg transicion
 * @text Transition
 * @desc The transition of the teleport.
 * @type select
 * @option Black
 * @value 0
 * @option White
 * @value 1
 * @option Nothing
 * @value 2
 * @default 0
 * 
 * -------------------------------------------------------
 * @command abrirMenuTP
 * @text Open teleport menu.
 * @desc Open teleport menu.
 * 
 * -------------------------------------------------------
 * @command mostrarUOcultarMenuTp
 * @text Show or hide the teleport menu of main menu. 
 * @desc Show or hide the teleport menu of main menu. 
 * 
 * 
 * @arg mostrar
 * @text Show or hide?
 * @desc Show or hide?
 * @type boolean
 * @on Show
 * @off hide
 * @default false
 * 
 * -------------------------------------------------------
 * @command activarODesactivarMenuTp
 * @text Enable or Disable the teleport menu of main menu.
 * @desc Enable or Disable the teleport menu of main menu.
 * 
 * 
 * @arg activar
 * @text Enable or Disable?
 * @desc Enable or Disable?
 * @type boolean
 * @on Enable
 * @off Disable
 * @default false
 * 
 * ----------------------------------------------------------
 * @command mostrarUOcultarTodosLosPuntos
 * @text Show or Hide all teleport points.
 * @desc Show or Hide all teleport points.
 * 
 * 
 * @arg mostrar
 * @text Show or hide?
 * @desc Show or hide?
 * @type boolean
 * @on Show
 * @off hide
 * @default false
 * 
 * -------------------------------------------------------
 * @command activarODesactivarTodosLosPuntos
 * @text Activar o desactivar todos los puntos del menú de teletransportes.
 * @desc Activa o desactiva todos los puntos del menú de teletransportes.
 * 
 * 
 * @arg activar
 * @text Show or hide?
 * @desc Show or hide?
 * @type boolean
 * @on show
 * @off hide
 * @default false 
 */


Zausen.FZ_SistemaTeletransporte.pluginName = 'TeleportSystem';
Zausen.FZ_SistemaTeletransporte.PluggingManager = PluginManager.parameters(Zausen.FZ_SistemaTeletransporte.pluginName);
Zausen.FZ_SistemaTeletransporte.Parametros = Zausen.FZ_SistemaTeletransporte.Parametros || {};

Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarPositivo = String(Zausen.FZ_SistemaTeletransporte.PluggingManager['Confirm text'] || '');//1
Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarNegativo = String(Zausen.FZ_SistemaTeletransporte.PluggingManager['Cancel text'] || '');//2
Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarCabecera = String(Zausen.FZ_SistemaTeletransporte.PluggingManager['Head text of window Confirm Cancel'] || '');//3
Zausen.FZ_SistemaTeletransporte.Parametros.ColorFondoImagen = String(Zausen.FZ_SistemaTeletransporte.PluggingManager['Background image color'] || '');//4

Zausen.FZ_SistemaTeletransporte.Parametros.ModoImagen = Number(Zausen.FZ_SistemaTeletransporte.PluggingManager['Image mode'] || 2);//5 

Zausen.FZ_SistemaTeletransporte.Parametros.MostrarMenu = Boolean(Zausen.FZ_SistemaTeletransporte.PluggingManager['Show in menu'] == 'true' || false);//6
Zausen.FZ_SistemaTeletransporte.Parametros.ActivarMenu = Boolean(Zausen.FZ_SistemaTeletransporte.PluggingManager['Enable in menu'] == 'true' || false);//7

Zausen.FZ_SistemaTeletransporte.Parametros.TextoMenuTeletransporte = String(Zausen.FZ_SistemaTeletransporte.PluggingManager['Teleport menu name'] || '');//4

/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaTeletransporte.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaTeletransporte.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaTeletransporte.BBDDCargada) {
        Zausen.FZ_SistemaTeletransporte.BBDDCargada = true;
        Zausen.FZ_SistemaTeletransporte.corregirValores();
    }
    return true;
};

Zausen.FZ_SistemaTeletransporte.corregirValores = function () {
    let preColores = Zausen.FZ_SistemaTeletransporte.Parametros.ColorFondoImagen.split(",");
    if (preColores.length < 3) preColores = "255,255,255,1".split(',');
    if (preColores.length < 4) preColores[3] = 1;
    let respColor = "";
    for (let x = 0; x < 4; x++) {
        let num = preColores[x];
        if (num == null || isNaN(num)) num = 255;
        respColor += num;
    }
    Zausen.FZ_SistemaTeletransporte.Parametros.ColorFondoImagen = "rgba(#)".replace("#", respColor);

    let modoImagen = Zausen.FZ_SistemaTeletransporte.Parametros.ModoImagen;
    if (!modoImagen || isNaN(modoImagen)) modoImagen = 2;
    modoImagen = parseInt(modoImagen);
    Zausen.FZ_SistemaTeletransporte.Parametros.ModoImagen = modoImagen.clamp(1, 3);
};

/* ****************************************************************************************************************************************** 
**************************************************************** command_plugin *************************************************************
*********************************************************************************************************************************************/


PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'CrearPuntoTeletransporte', args => {
    const nombre = args.nombre;
    const idMapa = args.mapa;
    const x = args.x;
    const y = args.y;
    const direccion = args.direccion;
    const imagen = args.imagen;
    const descripcion = args.descripcion;
    const transicion = args.transicion;
    $gameTeletransportes.nuevo(nombre, idMapa, x, y, direccion, imagen, descripcion, transicion);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'ModificarPuntoTeletransporte', args => {
    const nombre = args.nombre;
    const idMapa = args.mapa;
    const x = args.x;
    const y = args.y;
    const direccion = args.direccion;
    const imagen = args.imagen;
    const descripcion = args.descripcion;
    const transicion = args.transicion;
    $gameTeletransportes.setValue(null, nombre, idMapa, x, y, direccion, imagen, descripcion, transicion);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'teletransportar', args => {
    const nombre = args.nombre;
    const transicion = args.transicion;
    $gameTeletransportes.teletransportar(null, nombre, transicion);
});


PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'abrirMenuTP', args => {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Teletransporte);
    }
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'inhabilitarTp', args => {
    const nombre = args.nombre;
    $gameTeletransportes.desactivarTp(null, nombre);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'habilitarTp', args => {
    const nombre = args.nombre;
    $gameTeletransportes.activarTp(null, nombre);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'ocultarTp', args => {
    const nombre = args.nombre;
    $gameTeletransportes.ocultarTp(null, nombre);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'mostrarTp', args => {
    const nombre = args.nombre;
    $gameTeletransportes.mostrarTp(null, nombre);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'mostrarUOcultarMenuTp', args => {
    const mostrar = args.mostrar == "true" || args.mostrar == true;
    $gameTeletransportes.mostrarUOcultarEnMenu(mostrar);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'activarODesactivarMenuTp', args => {
    const activar = args.activar == "true" || args.activar == true;
    $gameTeletransportes.activarODesactivarEnMenu(activar);
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'mostrarUOcultarTodosLosPuntos', args => {
    const mostrar = args.mostrar == "true" || args.mostrar == true;
    if (mostrar) {
        $gameTeletransportes.mostrarTpTodos();
    } else {
        $gameTeletransportes.ocultarTpTodos();
    }
});

PluginManager.registerCommand(Zausen.FZ_SistemaTeletransporte.pluginName, 'activarODesactivarTodosLosPuntos', args => {
    const activar = args.activar == "true" || args.activar == true;
    if (activar) {
        $gameTeletransportes.activarTpTodos();
    } else {
        $gameTeletransportes.desactivarTpTodos();
    }
});


/* ****************************************************************************************************************************************** 
************************************************************* Game_Teletransporte ***********************************************************
*********************************************************************************************************************************************/
$gameTeletransportes = null;

// Game_Teletransporte
//
// The game object class for the Game_Teletransporte.

function Game_Teletransporte() {
    this.initialize(...arguments);
}

Game_Teletransporte.prototype.initialize = function (id, nombre, idMapa, x, y, direccion, imagen, descripcion, transicion) {
    this._id = id;
    this._nombre = nombre;
    this._idMapa = idMapa;
    this._x = parseInt(x);
    this._y = parseInt(y);
    this._imagen = imagen;
    if(!this._imagen) this._imagen = "";
    this._descripcion = descripcion;
    this._activo = true;
    this._visible = true;
    this._direccion = !direccion || direccion && isNaN(direccion) ? 0 : parseInt(direccion).clamp(0, 8);
    if ([0, 2, 4, 6, 8].indexOf(this._direccion) < 0) this._direccion = 0;
    this._transicion = !transicion || transicion && isNaN(transicion) ? 0 : parseInt(transicion).clamp(0, 2);
};

Object.defineProperties(Game_Teletransporte.prototype, {
    // id
    id: {
        get: function () {
            return this._id;
        },
        configurable: true
    },
    // nombre
    nombre: {
        get: function () {
            return this._nombre;
        },
        set: function (value) {
            this._nombre = value;
        },
        configurable: true
    },
    //transicion
    transicion: {
        get: function () {
            return this._transicion;
        },
        set: function (value) {
            this._transicion = value;
        },
        configurable: true
    },
    //direccion
    direccion: {
        get: function () {
            return this._direccion;
        },
        set: function (value) {
            this._direccion = value;
            if ([0, 2, 4, 6, 8].indexOf(this._direccion) < 0) this._direccion = 0;
        },
        configurable: true
    },
    //visible
    visible: {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        configurable: true
    },
    //activo
    activo: {
        get: function () {
            return this._activo;
        },
        set: function (value) {
            this._activo = value;
        },
        configurable: true
    },
    //descripcion
    descripcion: {
        get: function () {
            return this._descripcion;
        },
        set: function (value) {
            this._descripcion = value;
        },
        configurable: true
    },
    //imagen
    imagen: {
        get: function () {
            return this._imagen;
        },
        set: function (value) {
            this._imagen = value;
        },
        configurable: true
    },
    //y
    y: {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        configurable: true
    },
    //x
    x: {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        configurable: true
    },
    //id mapa
    idMapa: {
        get: function () {
            return this._idMapa;
        },
        set: function (value) {
            this._idMapa = value;
        },
        configurable: true
    },

});

Game_Teletransporte.prototype.esVisible = function () {
    return this._visible;
};

Game_Teletransporte.prototype.estaActivo = function () {
    return this._activo;
};

Game_Teletransporte.prototype.activar = function () {
    this._activo = true;
};

Game_Teletransporte.prototype.desactivar = function () {
    this._activo = false;
};

Game_Teletransporte.prototype.ocultar = function () {
    this._visible = false;
};

Game_Teletransporte.prototype.mostrar = function () {
    this._visible = true;
};

Game_Teletransporte.prototype.teletransportar = function () {
    this.teletransportarEx(this.transicion);
};

Game_Teletransporte.prototype.teletransportarEx = function (transicion) {
    const trans = !transicion || transicion && isNaN(transicion) ? 0 : parseInt(transicion);
    $gamePlayer.reserveTransfer(this.idMapa, this.x, this.y, this.direccion, transicion);

};


// Game_Teletransportes
//
// The game object class for Game_Teletransportes.

function Game_Teletransportes() {
    this.initialize(...arguments);
}

Game_Teletransportes.prototype.initialize = function () {
    this.clear();
    if (this._mostrarEnMenu == undefined) this._mostrarEnMenu = Zausen.FZ_SistemaTeletransporte.Parametros.MostrarMenu;
    if (this._activarEnMenu == undefined) this._activarEnMenu = Zausen.FZ_SistemaTeletransporte.Parametros.ActivarMenu;
    this._menuAbierto = null;
};

Game_Teletransportes.prototype.clear = function () {
    this._data = [];
};
Game_Teletransportes.prototype.mostrarEnMenu = function () { return this._mostrarEnMenu; };
Game_Teletransportes.prototype.activarEnMenu = function () { return this._activarEnMenu; };

Game_Teletransportes.prototype.mostrarUOcultarEnMenu = function (opcion) { this._mostrarEnMenu = opcion; };
Game_Teletransportes.prototype.activarODesactivarEnMenu = function (opcion) { this._activarEnMenu = opcion; };

Game_Teletransportes.prototype.menuAbiertoDesde = function (menu) {
    this._menuAbierto = menu;
};

Game_Teletransportes.prototype.cerrarMenuPrevio = function () {
    if (!this._menuAbierto || !this._menuAbierto.popScene) return;
    this._menuAbierto.popScene();
    this._menuAbierto = null;
};

Game_Teletransportes.prototype.descartarMenuPrevio = function () {
    this._menuAbierto = null;
};


Game_Teletransportes.prototype.value = function (variableId) {
    return this.buscarPorIdONombre(variableId, null);
};
Game_Teletransportes.prototype.buscarPorNombre = function (nombre) {
    return this.buscarPorIdONombre(null, nombre);
};

Game_Teletransportes.prototype.buscarCoincidenciasPorNombre = function (nombre) {
    return this._data.filter(tp => tp && tp.nombre === nombre);
};

Game_Teletransportes.prototype.buscarPorIdONombre = function (id, nombre) {
    return this._data[this.buscarId(id, nombre)];
};

Game_Teletransportes.prototype.buscarId = function (idTp, nombreTp) {
    return this._data.findIndex(tp => tp != null && (tp.id === idTp || tp.nombre === nombreTp));
};

Game_Teletransportes.prototype.setValue = function (id, nombre, idMapa, x, y, direccion, imagen, descripcion, transicion) {
    const cual = this.buscarId(id, nombre);
    if (cual < 1) return;
    var modificado = new Game_Teletransporte(this._data[cual].id, this.validarNombre(nombre, true), idMapa, x, y, direccion, imagen, descripcion, transicion);
    this._data[cual] = modificado;

};
Game_Teletransportes.prototype.nuevo = function (nombre, idMapa, x, y, direccion, imagen, descripcion, transicion) {
    let nuevaId = this._data.length <= 0 ? 1 : this._data.length;
    var modificado = new Game_Teletransporte(nuevaId, this.validarNombre(nombre, false), idMapa, x, y, direccion, imagen, descripcion, transicion);
    this._data[this._data.length] = modificado;
};

Game_Teletransportes.prototype.eliminarTp = function (idTp, nombreTp) {
    let idAEliminar = this.buscarId(idTp, nombreTp);
    if (idAEliminar < 0) return;
    this._data.splice(idAEliminar);
};

Game_Teletransportes.prototype.activarTp = function (idTp, nombreTp) {
    this.buscarPorIdONombre(idTp, nombreTp).activar();
};
Game_Teletransportes.prototype.desactivarTp = function (idTp, nombreTp) {
    this.buscarPorIdONombre(idTp, nombreTp).desactivar();
};

Game_Teletransportes.prototype.mostrarTp = function (idTp, nombreTp) {
    this.buscarPorIdONombre(idTp, nombreTp).mostrar();
};
Game_Teletransportes.prototype.ocultarTp = function (idTp, nombreTp) {
    this.buscarPorIdONombre(idTp, nombreTp).ocultar();
};

Game_Teletransportes.prototype.activarTpTodos = function () {
    this._data.forEach(tp => { if (tp) tp.activar() });
};
Game_Teletransportes.prototype.desactivarTpTodos = function (idTp, nombreTp) {
    this._data.forEach(tp => { if (tp) tp.desactivar() });
};

Game_Teletransportes.prototype.mostrarTpTodos = function (idTp, nombreTp) {
    this._data.forEach(tp => { if (tp) tp.mostrar() });
};
Game_Teletransportes.prototype.ocultarTpTodos = function (idTp, nombreTp) {
    this._data.forEach(tp => { if (tp) tp.ocultar() });
};

Game_Teletransportes.prototype.teletransportar = function (id, nombre, transicion) {
    const punto = this.buscarPorIdONombre(id, nombre);
    if (!punto) return;
    if (transicion == null || isNaN(transicion)) {
        punto.teletransportar();
    } else {
        punto.teletransportarEx(transicion);
    }
};

Game_Teletransportes.prototype.validarNombre = function (nombre, masDe1) {
    let respuesta = nombre || "(0)";
    const coincidencias = masDe1 ? 1 : 0;
    let adicional = 1;
    let existe = this.buscarCoincidenciasPorNombre(nombre);

    while (existe.length > coincidencias) {
        let respuesta = nombre + "(" + (adicional++) + ")";
        existe = this.buscarCoincidenciasPorNombre(respuesta);
    }

    return respuesta;
};

Game_Teletransportes.prototype.puntosVisibles = function () {
    return this._data.filter(tp => tp.esVisible());
};

//------------------------------
/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaTeletransporte.DataManager = Zausen.FZ_SistemaTeletransporte.DataManager || {};

Zausen.FZ_SistemaTeletransporte.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    Zausen.FZ_SistemaTeletransporte.DataManager.createGameObjects.call(this); 
    $gameTeletransportes = new Game_Teletransportes();
};

Zausen.FZ_SistemaTeletransporte.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
    const contents = Zausen.FZ_SistemaTeletransporte.DataManager.makeSaveContents.call(this);
    contents.teletransportes = $gameTeletransportes;
    return contents;
};

Zausen.FZ_SistemaTeletransporte.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
    Zausen.FZ_SistemaTeletransporte.DataManager.extractSaveContents.call(this, contents);
    $gameTeletransportes = contents.teletransportes;
};

/* ****************************************************************************************************************************************** 
************************************************************ Scene_Teletransporte ***********************************************************
*********************************************************************************************************************************************/
//-----------------------------------------------------------------------------
// Scene_Teletransporte
//
// The scene class of the shop screen.

function Scene_Teletransporte() {
    this.initialize(...arguments);
}

Scene_Teletransporte.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Teletransporte.prototype.constructor = Scene_Teletransporte;

Scene_Teletransporte.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Teletransporte.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createListTeletransportes();
    this.createHelpWindow();
    this.createImageWindow();
    this.createConfirmarTpWindow();
    this.ActivarMenuSelector();
    this._ListWindow.refresh();
};

Scene_Teletransporte.prototype.popScene = function () {
    $gameTeletransportes.descartarMenuPrevio();
    Scene_MenuBase.prototype.popScene.call(this);
};

Scene_Teletransporte.prototype.createListTeletransportes = function () {
    const rect = this.listaTpWindowRect();
    this._ListWindow = new Window_TpList(rect);
    this._ListWindow.setHandler("ok", this.onItemOk.bind(this));
    this._ListWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._ListWindow);
};
Scene_Teletransporte.prototype.createImageWindow = function () {
    const rect = this.helpWindowRectImagen();
    this._imagenWindow = new Window_HelpImagen(rect);
    this.addWindow(this._imagenWindow);
    this._ListWindow.setHelpWindowImagen(this._imagenWindow);
};
Scene_Teletransporte.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_HelpDescripcion(rect);
    this.addWindow(this._helpWindow);
    this._ListWindow.setHelpWindow(this._helpWindow);
};

Scene_Teletransporte.prototype.createConfirmarTpWindow = function () {
    const rect = this.confirmarTpWindowRect();
    this._commandConfirmarTp = new Window_ConfirmarTp(rect);
    this._commandConfirmarTp.setHandler("si", this.onSi.bind(this));
    this._commandConfirmarTp.setHandler("no", this.onNo.bind(this));
    this.addWindow(this._commandConfirmarTp);
};

Scene_Teletransporte.prototype.onItemOk = function () {
    const punto = this._ListWindow.item();
    this.ActivarMenuConfirmacion(punto);
};

Scene_Teletransporte.prototype.onSi = function () {
    const destino = this._commandConfirmarTp.lugar();
    if (destino) {
        destino.teletransportar();
        Scene_MenuBase.prototype.popScene.call(this);
        $gameTeletransportes.cerrarMenuPrevio();
    } else {
        this.ActivarMenuSelector();
    }
};

Scene_Teletransporte.prototype.onNo = function () {
    this.ActivarMenuSelector();
};

Scene_Teletransporte.prototype.ActivarMenuSelector = function () {
    this._commandConfirmarTp.hide();
    this._commandConfirmarTp.deactivate();
    this._ListWindow.activate();
};
Scene_Teletransporte.prototype.ActivarMenuConfirmacion = function (punto) {
    this._ListWindow.deactivate();
    this._commandConfirmarTp.setLugar(punto);
    this._commandConfirmarTp.refresh();
    this._commandConfirmarTp.show();
    this._commandConfirmarTp.activate();

};
Scene_Teletransporte.prototype.listaTpWindowRect = function () {
    const w = this.mainCommandWidth();
    const y = this.mainAreaTop();
    const x = Graphics.boxWidth - w;
    const h = Graphics.boxHeight - this.buttonAreaHeight();
    return new Rectangle(x, y, w, h);
};
Scene_Teletransporte.prototype.mainCommandWidth = function () {
    return 300;
};

Scene_Teletransporte.prototype.confirmarTpWindowRect = function () {

    const w = 450;
    const h = 110;
    const x = Math.round(Graphics.boxWidth / 2 - w / 2);
    const y = Math.round(Graphics.boxHeight / 2 - h / 2);
    return new Rectangle(x, y, w, h);
};

Scene_Teletransporte.prototype.helpWindowRect = function () {
    const x = 0;
    const h = Graphics.boxHeight - (369 + this._cancelButton.height + 4);
    const w = Graphics.boxWidth - this._ListWindow.width;
    const y = Graphics.boxHeight - h;
    return new Rectangle(x, y, w, h);
};

Scene_Teletransporte.prototype.helpWindowRectImagen = function () {
    const x = 0;
    const h = 369;
    const w = this._helpWindow.width;
    const y = this._cancelButton.height + 4;
    return new Rectangle(x, y, w, h);
};


//-----------------------------------------------------------------------------
// Window_TpList
//
// The window for selecting a skill on the skill screen.

function Window_TpList() {
    this.initialize(...arguments);
}

Window_TpList.prototype = Object.create(Window_Selectable.prototype);
Window_TpList.prototype.constructor = Window_TpList;

Window_TpList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._data = [];
    this._dataIm = [];
    this._helpWindowImagen;
};

Window_TpList.prototype.maxCols = function () {
    return 1;
};

Window_TpList.prototype.colSpacing = function () {
    return 16;
};
Window_TpList.prototype.itemAt = function (index) {
    return this._data[index];
};

Window_TpList.prototype.isEnabled = function (tp) {
    return tp && tp.estaActivo();
};
Window_TpList.prototype.makeItemList = function () {
    this._dataIm = [];
    if ($gameTeletransportes) {
        this._data = $gameTeletransportes.puntosVisibles();
    } else {
        this._data = [];
    }
    this._data.push({ nombre: "Salir", salir: "salir", estaActivo: function () { return true }, descripcion: "", imagen: "" });
    this._data.forEach(tp => {
        var carga = tp.imagen ? ImageManager.loadTitle1(tp.imagen) : null;
        this._dataIm.push(carga);
    });
};

Window_TpList.prototype.drawItem = function (index) {
    const tp = this.itemAt(index);
    if (tp) {
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(tp));
        this.drawItemName(tp, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_TpList.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const textMargin = 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.drawText(item.nombre, x + textMargin, y, itemWidth);
    }
};
Window_TpList.prototype.refresh = function () {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);

};

Window_TpList.prototype.maxItems = function () {
    return this._data.length;
};

Window_TpList.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item());
};


Window_TpList.prototype.callUpdateHelp = function () {
    if (this.active && this._helpWindow && this._helpWindowImagen) {
        this.updateHelp();
    }
};
Window_TpList.prototype.setHelpWindowItem = function (item) {
    if (this._helpWindow && this._helpWindowImagen && item) {
        this._helpWindow.setItem(item);
        this._helpWindowImagen.setItem(item, this._dataIm[this.index()]);
    }
};

Window_TpList.prototype.item = function () {
    return this.itemAt(this.index());
};

Window_TpList.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this._data[this.index()]);
};
Window_TpList.prototype.setHelpWindowImagen = function (helpWindow) {
    this._helpWindowImagen = helpWindow;
    this.callUpdateHelp();
};

Window_TpList.prototype.processOk = function () {
    const seleccionado = this.item();
    if (!seleccionado) return;
    if (seleccionado.salir) {
        this.processCancel();
        return;
    }
    Window_Selectable.prototype.processOk.call(this);
};
//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

function Window_HelpImagen() {
    this.initialize(...arguments);
}

Window_HelpImagen.prototype = Object.create(Window_Base.prototype);
Window_HelpImagen.prototype.constructor = Window_HelpImagen;

Window_HelpImagen.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._imagen = null;
    this._item = null;
    this._backSprite = new Sprite();
    this._backSprite.bitmap = new Bitmap(this.width, this.height);
    this._backSprite2 = new Sprite();
    this._backSprite2.bitmap = new Bitmap(this.width, this.height);
    this.addChild(this._backSprite2);
    this.addChild(this._backSprite);
    this._backSprite2.bitmap.fillRect(0, 0, this.width, this.height, ColorManager.colorPersonalizado());
    this.refresh();
};

Window_HelpImagen.prototype.setImagen = function (imagen) {
    this._imagen = imagen;
    this.refresh();
};
Window_HelpImagen.prototype.itemPadding = function () {
    return 6;
};
Window_HelpImagen.prototype.clear = function () {
    this.contents.clear();
};

Window_HelpImagen.prototype.setItem = function (item, imagen) {
    if (this._item && this._item.imagen === item.imagen) return;
    this._item = item;
    this.setImagen(imagen ? imagen : null);
    this.refresh();
};

Window_HelpImagen.prototype.refresh = function () {
    this.contents.clear();
    this.drawImagen();
};

Window_HelpImagen.prototype.drawImagen = function () {
    const mi = this._imagen ? Zausen.FZ_SistemaTeletransporte.Parametros.ModoImagen : 0;
    if (mi == 3) this.drawNormal();
    if ([1, 2].indexOf(Zausen.FZ_SistemaTeletransporte.Parametros.ModoImagen) >= 0) {
        this.escalar(this._backSprite, mi);
        if (mi > 0) this._backSprite.bitmap = this._imagen;
    }
    this.escalar(this._backSprite2, this._imagen ? 1 : 0);
};
Window_HelpImagen.prototype.drawNormal = function () {
    const bitmap = this._imagen; 
    const pw = this.width - this.itemPadding() * 2;
    const ph = this.height - this.itemPadding() * 2;
    const sx = this.itemPadding();
    const sy = this.itemPadding();
    this._backSprite.bitmap.blt(bitmap, sx, sy, pw, ph, this.itemPadding(), this.itemPadding());
};

Window_HelpImagen.prototype.proporciones = function (sprite) {
    const tw = this.width - 12;
    const th = this.height - 12;
    const bw = sprite.bitmap.width;
    const bh = sprite.bitmap.height;
    if (bw == 0 || bh == 0) return { rx: 0, ry: 0 };
    return { rx: tw / bw, ry: th / bh };
};


Window_HelpImagen.prototype.escalar = function (sprite, forma) {
    switch (forma) {
        case 1: //Deformar
            this.scaleSpriteDeformar(sprite);
            break;
        case 2: //Ajustar
            this.scaleSpriteAjustar(sprite);
            break;
        case 3: //Normal
            return;
        case 0: //anular
            this.scaleSpriteAnular(sprite);
            return;
    };
    sprite.x = this.width / 2;
    sprite.y = this.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};
Window_HelpImagen.prototype.scaleSpriteDeformar = function (sprite) {
    const r = this.proporciones(sprite);
    sprite.scale.x = r.rx;
    sprite.scale.y = r.ry;
};

Window_HelpImagen.prototype.scaleSpriteAjustar = function (sprite) {
    const r = this.proporciones(sprite);
    const escala = Math.min(r.rx, r.ry);
    sprite.scale.x = escala;
    sprite.scale.y = escala;
};

Window_HelpImagen.prototype.scaleSpriteAnular = function (sprite) {
    sprite.scale.x = 0;
    sprite.scale.y = 0;
};

//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

function Window_HelpDescripcion() {
    this.initialize(...arguments);
}

Window_HelpDescripcion.prototype = Object.create(Window_Base.prototype);
Window_HelpDescripcion.prototype.constructor = Window_HelpDescripcion;

Window_HelpDescripcion.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
};

Window_HelpDescripcion.prototype.setText = function (text) {
    this._text = text;
    this.refresh();
};

Window_HelpDescripcion.prototype.clear = function () {
    this.setText("");
};

Window_HelpDescripcion.prototype.setItem = function (item) {
    this.setText(item ? item.descripcion : "");
};

Window_HelpDescripcion.prototype.refresh = function () {
    this.contents.clear();
    this.drawTextEx(this._text, 0, 0, this.width);
};



// Window_ConfirmarTp
//
// The window for Window_ConfirmarTp.

function Window_ConfirmarTp() {
    this.initialize(...arguments);
}

Window_ConfirmarTp.prototype = Object.create(Window_Command.prototype);
Window_ConfirmarTp.prototype.constructor = Window_ConfirmarTp;

Window_ConfirmarTp.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.open();
    this._lugar = null;
};

Window_ConfirmarTp.prototype.makeCommandList = function () {
    this.addCommand(Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarPositivo, "si");
    this.addCommand(Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarNegativo, "no");
};

Window_ConfirmarTp.prototype.lugar = function (lugar) {
    return this._lugar;
};

Window_ConfirmarTp.prototype.setLugar = function (lugar) {
    this._lugar = lugar;
};
Window_ConfirmarTp.prototype.maxCols = function () {
    return 2;
};

Window_ConfirmarTp.prototype.itemTextAlign = function () {
    return "center";
};

Window_ConfirmarTp.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    Window_Selectable.prototype.refresh.call(this);
    this.drawPregunta();

};

Window_ConfirmarTp.prototype.drawPregunta = function () {
    const nombre = this._lugar ? this._lugar.nombre : "";
    this.drawText(Zausen.FZ_SistemaTeletransporte.Parametros.TextoConfirmarCabecera.format(nombre), 0, 0, this.width - 24, this.itemTextAlign());

};

Window_ConfirmarTp.prototype.itemRect = function (index) {
    let resp = Window_Selectable.prototype.itemRect.call(this, index);
    const posicionReal = this.height - this.lineHeight() * 2;
    resp.y = posicionReal;
    return resp;
};


/* ****************************************************************************************************************************************** 
***************************************************************** Scene_Menu ****************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaTeletransporte.Scene_Menu = Zausen.FZ_SistemaTeletransporte.Scene_Menu || {};

Zausen.FZ_SistemaTeletransporte.Scene_Menu.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
    Zausen.FZ_SistemaTeletransporte.Scene_Menu.createCommandWindow.call(this);
    if ($gameTeletransportes.mostrarEnMenu() && $gameTeletransportes.activarEnMenu()) this._commandWindow.setHandler("teletransporte", this.commandTeletransporte.bind(this));
};

Scene_Menu.prototype.commandTeletransporte = function () {
    $gameTeletransportes.menuAbiertoDesde(this);
    SceneManager.push(Scene_Teletransporte);
};


/* ****************************************************************************************************************************************** 
************************************************************* Window_MenuCommand ************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaTeletransporte.Window_MenuCommand = Zausen.FZ_SistemaTeletransporte.Window_MenuCommand || {};

Zausen.FZ_SistemaTeletransporte.Window_MenuCommand.addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function () {
    Zausen.FZ_SistemaTeletransporte.Window_MenuCommand.addOriginalCommands.call(this);
    if ($gameTeletransportes.mostrarEnMenu()) {
        const enabled = $gameTeletransportes.activarEnMenu();
        this.addCommand(Zausen.FZ_SistemaTeletransporte.Parametros.TextoMenuTeletransporte, "teletransporte", enabled);
    }
};



ColorManager.colorPersonalizado = function () {
    return Zausen.FZ_SistemaTeletransporte.Parametros.ColorFondoImagen;
};