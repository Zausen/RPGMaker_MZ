var Zausen = Zausen || {};
Zausen.FZ_BarrasEnemigos = Zausen.FZ_BarrasEnemigos || {};
/*:
 * @target MZ
 * @plugindesc añade barras a los enemigos para PV, PM, PT y/o Tiempo.
 * @author Fer Zacrón, test: Efímero
 *
 * @help BarrasEnemigos.js
 * 
 * Este plugin pone barras sencillas de vida, magia, técnica y tiempo a los enemigos, hay una 
 * configuración por defecto que se aplicará a todos los enemigos y luego por cada enemigo
 * se puede cambiar.
 * 
 * Para eso se usará la etiqueta BARRAENEMIGO{}
 * Y dentro tendremos las siguientes sub etiquetas:
 * PV:S/N                   Muestra u oculta la barra de PV. (S para mostrar y N para ocultar)
 * PM:S/N                   Muestra u oculta la barra de PM. (S para mostrar y N para ocultar)   
 * PT:S/N                   Muestra u oculta la barra de PT. (S para mostrar y N para ocultar)
 * TI:S/N                   Muestra u oculta la barra de Tiempo. (S para mostrar y N para ocultar, sólo en caso de que sea útil)
 * POSICION:ARRIBA/ABAJO    Define si las barras se pondrán sobre el enemigo(ARRIBA) o debajo de éste(ABAJO).
 * LARGO:N                  Define un largo fijo para la barra (menos de 10 hará que se adapte al tamaño de la imágen del enemigo). (N == número)
 * ANCHO:N                  Define un ancho fijo para la barra (N == número)
 * ANIMACION:N              Ahora mismo hay cuatro animaciones distintas que constituyen la velocidad de relleno o vaciado de las barras. (N == número).   
 * AJUSTEX:                 Mueve adicionalmente la barra en horizontal (- izqueirda y + derecha)
 * AJUSTEY:                 Mueve adicionalmente la barra en vertical (- abajo y + arriba)
 * 
 * Ejemplos:
 * 
BARRAENEMIGO{
    POSICION:ABAJO
    ANCHO:20
    PT:N
} Pondrá la barra debajo del enemigo, además tendrá un ancho de 20 píxeles en vez del habitual y no se mostrará la barra de puntos de técnica.

BARRAENEMIGO{
    PM:N
    PT:N
}No se mostrarán ni los PM ni los PT

BARRAENEMIGO{
    POSICION:ABAJO
    ANCHO:25
    LARGO:700
    PV:N
} La barra estará debajo del enemigo, no se mostrarán los puntos de vida y tendrá un largo fijo de 700 px.
 * 
  @param Mostrar PV
  @desc ¿Se debe mostrar la barra de vida?
  @type boolean
  @on Sí
  @off No
  @default true

  @param Mostrar PM
  @desc ¿Se debe mostrar la barra de magia?
  @type boolean
  @on Sí
  @off No
  @default true

  @param Mostrar PT
  @desc ¿Se debe mostrar la barra de técnica?
  @type boolean
  @on Sí
  @off No
  @default true

  @param Mostrar Tiempo
  @desc ¿Se debe mostrar la barra de tiempo? (Sólo en los modos que lo implementen)
  @type boolean
  @on Sí
  @off No
  @default true


  @param Posición Barras
  @desc Posición por defecto de las barras. 
  @type select
  @option Encima
  @value 1 
  @option Debajo
  @value 2 
  @default Encima

  @param Animación
  @type number
  @desc Un número del 1 al 4 para el efecto del rellenado y vacíado de la barra. 
  @min 1
  @max 4
  @default 4

  @param Grosor
  @type number
  @desc Es lo alto que será la barra
  @min 4
  @max 62
  @default 6

  @param Largo
  @type number
  @desc es lo largo que será la barra, poner un número inferior a 10 hará que se adapte al ancho de la imágen del enemigo. 
  @min 0
  @max 602
  @default 0

  @param Ajuste X
  @type number
  @desc se sumará a la posición predefinida para poder desplazarlo en horizontal (En unidades). izqueirda (-) y derecha (+ o sin signo)
  @min -1000
  @max 1000
  @default 0


  @param Ajuste Y
  @type number
  @desc se sumará a la posición predefinida para poder desplazarlo en vertical (En unidades). abajo (-) y arriba (+ o sin signo) 
  @min -1000
  @max 1000
  @default 0
 */
Zausen.FZ_BarrasEnemigos.pluginName = 'BarrasEnemigos';
Zausen.FZ_BarrasEnemigos.PluginManager = PluginManager.parameters(Zausen.FZ_BarrasEnemigos.pluginName);
Zausen.FZ_BarrasEnemigos.Parametros = Zausen.FZ_BarrasEnemigos.Parametros || {};

Zausen.FZ_BarrasEnemigos.Parametros.MostrarPV = Boolean(Zausen.FZ_BarrasEnemigos.PluginManager['Mostrar PV'] == "true" || false);//1
Zausen.FZ_BarrasEnemigos.Parametros.MostrarPM = Boolean(Zausen.FZ_BarrasEnemigos.PluginManager['Mostrar PM'] == "true" || false);//2
Zausen.FZ_BarrasEnemigos.Parametros.MostrarPT = Boolean(Zausen.FZ_BarrasEnemigos.PluginManager['Mostrar PT'] == "true" || false);//3
Zausen.FZ_BarrasEnemigos.Parametros.MostrarTiempo = Boolean(Zausen.FZ_BarrasEnemigos.PluginManager['Mostrar Tiempo'] == "true" || false);//4

Zausen.FZ_BarrasEnemigos.Parametros.PosiciónBarras = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Posición Barras'] || 1);//5
Zausen.FZ_BarrasEnemigos.Parametros.Animacion = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Animación'] || 4);//6

Zausen.FZ_BarrasEnemigos.Parametros.Grosor = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Grosor'] || 6);//6
Zausen.FZ_BarrasEnemigos.Parametros.Largo = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Largo'] || 0);//6

Zausen.FZ_BarrasEnemigos.Parametros.AjusteX = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Ajuste X'] || 0);//6
Zausen.FZ_BarrasEnemigos.Parametros.AjusteY = Number(Zausen.FZ_BarrasEnemigos.PluginManager['Ajuste Y'] || 0);//6


Zausen.FZ_BarrasEnemigos.Regex = {
    General: /BARRAENEMiGO[{]([\s\S]*?)[}]/i,
    Barras: /(P[VMT]|TI|POSICION)[:]([SN]|ARRIBA|ABAJO)/gi,
    Numericos: /(LARGO|ANCHO|ANIMACION)[:](\d{1,3})/gi,
    Ajustes: /(AJUSTE[XY])[:]([\-+]\d{1,4}|\d{1,4})/gi
};


Zausen.FZ_BarrasEnemigos.Etiquetas = {
    SI: "S",
    NO: "N",
    ARRIBA: "ARRIBA",
    ABAJO: "ABAJO",
    PV: "PV",
    PM: "PM",
    PT: "PT",
    TI: "TI",
    POS: "POSICION",
    LAR: "LARGO",
    ANC: "ANCHO",
    ANI: "ANIMACION",
    AJX: "AJUSTEX",
    AJY: "AJUSTEY"
};

/* ****************************************************************************************************************************************** 
***************************************************************** Spriteset_Battle **********************************************************
*********************************************************************************************************************************************/
Zausen.FZ_BarrasEnemigos.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_BarrasEnemigos.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_BarrasEnemigos.BBDDCargada) {
        Zausen.FZ_BarrasEnemigos.BBDDCargada = true;
        Zausen.FZ_BarrasEnemigos.CorregirValoresPorDefecto(); 
        Zausen.FZ_BarrasEnemigos.InicializarEnemigos($dataEnemies);
    }
    return true;
};

Zausen.FZ_BarrasEnemigos.CorregirValoresPorDefecto = function () {
    if (!Zausen.FZ_BarrasEnemigos.Parametros.PosiciónBarras || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.PosiciónBarras)) Zausen.FZ_BarrasEnemigos.Parametros.PosiciónBarras = 1;
    if (!Zausen.FZ_BarrasEnemigos.Parametros.Animacion || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.Animacion)) Zausen.FZ_BarrasEnemigos.Parametros.Animacion = 4;
    if (!Zausen.FZ_BarrasEnemigos.Parametros.Grosor || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.Grosor)) Zausen.FZ_BarrasEnemigos.Parametros.Grosor = 6;
    Zausen.FZ_BarrasEnemigos.Parametros.Grosor = Zausen.FZ_BarrasEnemigos.Parametros.Grosor.clamp(4, 62);
    if (!Zausen.FZ_BarrasEnemigos.Parametros.Largo || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.Largo)) Zausen.FZ_BarrasEnemigos.Parametros.Largo = 0;
    Zausen.FZ_BarrasEnemigos.Parametros.Largo = Zausen.FZ_BarrasEnemigos.Parametros.Largo.clamp(0, 602);
    if (!Zausen.FZ_BarrasEnemigos.Parametros.AjusteX || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.AjusteX)) Zausen.FZ_BarrasEnemigos.Parametros.AjusteX = 0;
    if (!Zausen.FZ_BarrasEnemigos.Parametros.AjusteY || isNaN(Zausen.FZ_BarrasEnemigos.Parametros.AjusteY)) Zausen.FZ_BarrasEnemigos.Parametros.AjusteY = 0;
    Zausen.FZ_BarrasEnemigos.Parametros.AjusteX = Zausen.FZ_BarrasEnemigos.Parametros.AjusteX.clamp(-1000,1000); 
    Zausen.FZ_BarrasEnemigos.Parametros.AjusteY = Zausen.FZ_BarrasEnemigos.Parametros.AjusteY.clamp(-1000,1000);
};

Zausen.FZ_BarrasEnemigos.InicializarEnemigo = function (enemigo) {
    enemigo.animacionBarras = {
        mostrarPv: Zausen.FZ_BarrasEnemigos.Parametros.MostrarPV,
        mostrarPm: Zausen.FZ_BarrasEnemigos.Parametros.MostrarPM,
        mostrarPt: Zausen.FZ_BarrasEnemigos.Parametros.MostrarPT,
        mostrartiempo: Zausen.FZ_BarrasEnemigos.Parametros.MostrarTiempo,
        ponerEncima: Zausen.FZ_BarrasEnemigos.Parametros.PosiciónBarras == 1 ? 1 : 0,
        animacion: Zausen.FZ_BarrasEnemigos.Parametros.Animacion,
        grosor: Zausen.FZ_BarrasEnemigos.Parametros.Grosor,
        largo: Zausen.FZ_BarrasEnemigos.Parametros.Largo < 10 ? null : Zausen.FZ_BarrasEnemigos.Parametros.Largo,
        ajusteX : Zausen.FZ_BarrasEnemigos.Parametros.AjusteX,
        ajusteY : Zausen.FZ_BarrasEnemigos.Parametros.AjusteY
    }
};

Zausen.FZ_BarrasEnemigos.InicializarEnemigos = function (enemigos) {
    for (let x = 0; x <= enemigos.length; x++) {
        var enemi = enemigos[x];
        if (!enemi) continue;
        Zausen.FZ_BarrasEnemigos.InicializarEnemigo(enemi);
        let contenido = enemi.note.match(Zausen.FZ_BarrasEnemigos.Regex.General);
        if (contenido) {
             Zausen.FZ_BarrasEnemigos.ConfigurarVisualizacionBarras(contenido[1], enemi.animacionBarras);
            Zausen.FZ_BarrasEnemigos.ConfigurarNumeracionBarras(contenido[1], enemi.animacionBarras);
            Zausen.FZ_BarrasEnemigos.ConfiguraAjustes(contenido[1], enemi.animacionBarras);
         }
    }
};

Zausen.FZ_BarrasEnemigos.ConfigurarVisualizacionBarras = function (contenido, animacion) {
    var subconjunto;
    while (subconjunto = Zausen.FZ_BarrasEnemigos.Regex.Barras.exec(contenido)) {
        let etiqueta = subconjunto[1].toUpperCase();
        let contenido = subconjunto[2].toUpperCase();
        switch (etiqueta) {
            
            case Zausen.FZ_BarrasEnemigos.Etiquetas.PV:
                animacion.mostrarPv = contenido == Zausen.FZ_BarrasEnemigos.Etiquetas.SI;
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.PM:
                animacion.mostrarPm = contenido == Zausen.FZ_BarrasEnemigos.Etiquetas.SI;
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.PT:
                animacion.mostrarPt = contenido == Zausen.FZ_BarrasEnemigos.Etiquetas.SI;
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.TI:
                animacion.mostrartiempo = contenido == Zausen.FZ_BarrasEnemigos.Etiquetas.SI;
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.POS:
                animacion.ponerEncima = contenido == Zausen.FZ_BarrasEnemigos.Etiquetas.ARRIBA ? 1 : 0;
                break;
        }
    }
};
Zausen.FZ_BarrasEnemigos.ConfigurarNumeracionBarras = function (contenido, animacion) {
    var subconjunto;
    while (subconjunto = Zausen.FZ_BarrasEnemigos.Regex.Numericos.exec(contenido)) {
        let etiqueta = subconjunto[1].toUpperCase();
        let contenido = parseInt(subconjunto[2]);
        switch (etiqueta) {
            case Zausen.FZ_BarrasEnemigos.Etiquetas.LAR:
                animacion.largo = contenido < 10 ? null : contenido.clamp(10, 602);
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.ANC:
                animacion.grosor = contenido.clamp(4, 62);
                break;
            case Zausen.FZ_BarrasEnemigos.Etiquetas.ANI:
                animacion.animacion = contenido.clamp(1, 4);
                break;

        }
    }
};
Zausen.FZ_BarrasEnemigos.ConfiguraAjustes = function (contenido, animacion) {
    var subconjunto;
    while (subconjunto = Zausen.FZ_BarrasEnemigos.Regex.Ajustes.exec(contenido)) {
        let etiqueta = subconjunto[1].toUpperCase();
        let contenido = parseInt(subconjunto[2]).clamp(-1000,1000);
        switch (etiqueta) {
            case  Zausen.FZ_BarrasEnemigos.Etiquetas.AJX:
                animacion.ajusteX = contenido;
                break;
            case  Zausen.FZ_BarrasEnemigos.Etiquetas.AJY:
                animacion.ajusteY = contenido;
                break; 

        }
    }
};

/* ****************************************************************************************************************************************** 
***************************************************************** Spriteset_Battle **********************************************************
*********************************************************************************************************************************************/
Zausen.FZ_BarrasEnemigos.Spriteset_Battle = Zausen.FZ_BarrasEnemigos.Spriteset_Battle || {};

Zausen.FZ_BarrasEnemigos.Spriteset_Battle.update = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function () {
    Zausen.FZ_BarrasEnemigos.Spriteset_Battle.update.call(this);
    this.updateEnemyBars();
};
Spriteset_Battle.prototype.updateEnemyBars = function () {
    this._EnemyBars.forEach(eb => {
        eb.refresh();
    });
};
Spriteset_Battle.prototype.createEnemyBars = function () {
    this._EnemyBars = [];
    for (let i = 0; i < this._enemySprites.length; i++) {
        const sprite = new Window_EnemyBarr(this._enemySprites[i]);
        this._EnemyBars.push(sprite);
        this._battleField.addChild(sprite);
    }
};
Zausen.FZ_BarrasEnemigos.Spriteset_Battle.createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function () {
    Zausen.FZ_BarrasEnemigos.Spriteset_Battle.createLowerLayer.call(this);
    this.createEnemyBars();
};

/* ****************************************************************************************************************************************** 
***************************************************************** Window_EnemyBarr **********************************************************
*********************************************************************************************************************************************/
function Window_EnemyBarr() {
    this.initialize(...arguments);
}

Window_EnemyBarr.prototype = Object.create(Window_Base.prototype);
Window_EnemyBarr.prototype.constructor = Window_EnemyBarr;

Window_EnemyBarr.prototype.isMoving = function () {
    return false;
};

Window_EnemyBarr.prototype.initialize = function (battler) {
    this._sprite = battler;
    let rect = new Rectangle(battler.x - 4, battler.y - 51, 9999, 500);
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._opacidad = 1;
    this.initializarComponentesAnimacion();
    this.hide();


};
Window_EnemyBarr.prototype.initializarComponentesAnimacion = function () {
    this._hpSiguienteFrame = 0;
    this._mpSiguienteFrame = 0;
    this._tpSiguienteFrame = 0;
    this._animacionPV = [];
    this._animacionPM = [];
    this._animacionPT = [];
    this._reminiscenciaX = 0;
};


Window_EnemyBarr.prototype.actualizarBarras = function () {
    if (this.configAnim().mostrarPv) this.actualizarAnimacionBarraHp();
    if (this.configAnim().mostrarPt) this.actualizarAnimacionBarraTp();
    if (this.configAnim().mostrarPm) this.actualizarAnimacionBarraMp();

};

Window_EnemyBarr.prototype.actualizarAnimacionBarraHp = function () {
    if (Math.floor(this._hpSiguienteFrame) != Math.floor(this.battler().hp)) {
        if (this._animacionPV.length > 0) {
            const sumHp = this._animacionPV[0];
            this._hpSiguienteFrame -= sumHp;

            if ((sumHp > 0 && this._hpSiguienteFrame < this.battler().hp) || (sumHp < 0 && this._hpSiguienteFrame > this.battler().hp) || this._animacionPV.length == 1
                || Math.floor(this._hpSiguienteFrame) == Math.floor(this.battler().hp)) {

                this._hpSiguienteFrame = this.battler().hp;
                this._animacionPV = [];
            } else {
                this._animacionPV.shift();
            }
        } else {
            let da = this._hpSiguienteFrame - this.battler().hp;
            this._animacionPV = this._animacionPV.concat(this.animacionArray(da));
        }
    }
};
Window_EnemyBarr.prototype.actualizarAnimacionBarraMp = function () {
    if (Math.floor(this._mpSiguienteFrame) != Math.floor(this.battler().mp)) {
        if (this._animacionPM.length > 0) {
            const sumMp = this._animacionPM[0];
            this._mpSiguienteFrame -= sumMp;

            if ((sumMp > 0 && this._mpSiguienteFrame < this.battler().mp) || (sumMp < 0 && this._mpSiguienteFrame > this.battler().mp) || this._animacionPM.length == 1
                || Math.floor(this._mpSiguienteFrame) == Math.floor(this.battler().mp)) {

                this._mpSiguienteFrame = this.battler().mp;
                this._animacionPM = [];
            } else {
                this._animacionPM.shift();
            }
        } else { 
            let da = this._mpSiguienteFrame - this.battler().mp;
            this._animacionPM = this._animacionPM.concat(this.animacionArray(da));
        }
    }
};
Window_EnemyBarr.prototype.actualizarAnimacionBarraTp = function () {
    if (Math.floor(this._tpSiguienteFrame) != Math.floor(this.battler().tp)) {
        if (this._animacionPT.length > 0) {
            const sumTp = this._animacionPT[0];
            this._tpSiguienteFrame -= sumTp;

            if ((sumTp > 0 && this._tpSiguienteFrame < this.battler().tp) || (sumTp < 0 && this._tpSiguienteFrame > this.battler().tp) || this._animacionPT.length == 1
                || Math.floor(this._tpSiguienteFrame) == Math.floor(this.battler().tp)) {

                this._tpSiguienteFrame = this.battler().tp;
                this._animacionPT = [];
            } else {
                this._animacionPT.shift();
            }
        } else {
            let da = this._tpSiguienteFrame - this.battler().tp;
            this._animacionPT = this._animacionPT.concat(this.animacionArray(da));
        }
    }
};
Window_EnemyBarr.prototype.animacionArray = function (da) {
    const idA = this.configAnim().animacion;
    switch (idA) {
        case 1:
            return this.animacionLinear(da); 
        case 2:
            return this.animacionAcecExponencialCos(da);
        case 3:
            return 
            break; this.animacionAcecRapidaSuavCos(da);
        case 4:
            return this.animacionAcecExponencialSen(da); 
        default:
            return this.animacionLinear(da); 
    }
};

Window_EnemyBarr.prototype.movimientosAnimacion = function (da) {
    const dabs = Math.abs(da);
    if (dabs <= 1) return 1;
    if (dabs < 120) return Math.round(dabs);
    if (dabs > 6000) return 240;
    return 120;
};
Window_EnemyBarr.prototype.animacionLinear = function (da) {
    const pasos = this.movimientosAnimacion(da);
    const paso = da / pasos;
    var respuesta = [];
    for (let x = 0; x < pasos; x++) {
        respuesta.push(paso);
    }
    return respuesta;
};
Window_EnemyBarr.prototype.animacionAcecExponencialSen = function (da) {
    const pasos = this.movimientosAnimacion(da);
    if (pasos == 1) return [1];
    var compacto = [];
    for (let x = 1; x <= pasos; x++) {
        let t = x / pasos;
        let ts = Math.sin((t * Math.PI * 0.5));
        let paso = ts * ts * da;
        compacto.push(paso);
    }
    return this.animacionCalcPasos(compacto);
};
Window_EnemyBarr.prototype.animacionAcecExponencialCos = function (da) {
    const pasos = this.movimientosAnimacion(da);
    if (pasos == 1) return [1];
    var compacto = [];
    for (let x = 1; x <= pasos; x++) {
        let t = x / pasos;
        let tc = 1 - Math.cos(t * Math.PI * 0.5);
        let paso = tc * tc * da;
        compacto.push(paso);
    }
    return this.animacionCalcPasos(compacto);
};


Window_EnemyBarr.prototype.animacionAcecRapidaSuavCos = function (da) {
    const pasos = this.movimientosAnimacion(da);
    if (pasos == 1) return [1];
    var compacto = [];
    for (let x = 1; x <= pasos; x++) {
        let t = x / pasos;
        let tc = 1 - Math.cos(t * Math.PI * 0.5);
        let paso = (tc * tc * (3 - 2 * tc)) * da;
        compacto.push(paso);
    }
    return this.animacionCalcPasos(compacto);
};

Window_EnemyBarr.prototype.animacionCalcPasos = function (compacto) {
    var respuesta = [];
    for (let y = 0; y < compacto.length; y++) {
        if (y == 0) {
            respuesta.push(compacto[y]);
        } else {
            let actual = compacto[y];
            let anterior = compacto[y - 1];
            respuesta.push(actual - anterior);
        }
    }
    return respuesta;
};


Window_EnemyBarr.prototype.battler = function () {
    return this._sprite._battler;
};
Window_EnemyBarr.prototype.configAnim = function () {
    return this.battler().enemy().animacionBarras;
};

Window_EnemyBarr.prototype.updatePadding = function () {
    this.padding = 0;
};
Window_EnemyBarr.prototype.refresh = function () {
    this.actualizarVisibilidad();
    if (this._sprite.opacity <= 0) return;
    let sumy = this.dibujarBarras();
    this.posicionarBarra(sumy);

};
Window_EnemyBarr.prototype.actualizarVisibilidad = function () {
    if (this._sprite.opacity < 255) { 
        this._opacidad = this._sprite.opacity / 255;
        this._reminiscenciaX = this.largo() * (1 - this._opacidad);
        if (this._sprite.opacity <= 0) this.hide();
    } else {
        this._reminiscenciaX = 0;
        this._opacidad = 1;
        this.show();
    }
};
Window_EnemyBarr.prototype.dibujarBarras = function () {
    this.contentsBack.clear();
    let sumy = 0; //
    if (this.configAnim().mostrarPv) {
        this.dibujarBarra(sumy, 1);
        sumy += this.ancho() + 1;
    }
    if (this.configAnim().mostrarPm) {
        this.dibujarBarra(sumy, 2);
        sumy += this.ancho() + 1;
    }
    if (this.configAnim().mostrarPt) {
        this.dibujarBarra(sumy, 3);
        sumy += this.ancho() + 1;
    }
    if (BattleManager.isTpb() && this.configAnim().mostrartiempo) {
        this.dibujarBarra(sumy, 4);
    }
    return sumy;
};

Window_EnemyBarr.prototype.obtenerDesplazamientoXBase = function () {
    return (this.largo() + 8) / 2 + this.configAnim().ajusteX;
};

Window_EnemyBarr.prototype.obtenerSubidaYBase = function () {
    const extra = this.configAnim().ponerEncima == 0 ? -4 : 0;
    return (this._sprite.height + 51) * this.configAnim().ponerEncima + extra + this.configAnim().ajusteY;
};

Window_EnemyBarr.prototype.reminiscenteX = function () {
    return -this._reminiscenciaX;
};

Window_EnemyBarr.prototype.ancho = function () {
    return this.configAnim().grosor;
};
Window_EnemyBarr.prototype.largo = function () {
    const largoXDefecto = this._sprite && this._sprite.width ? this._sprite.width : 128;
    const largo = this.configAnim().largo;
    return largo && !isNaN(largo) ? largo : largoXDefecto;
};
Window_EnemyBarr.prototype.rellenoSup = function () {
    return this.largo() - (this.margenExterno() * 2);
};
Window_EnemyBarr.prototype.rellenoSupA = function () {
    return this.ancho() - (this.margenExterno() * 2);
};
Window_EnemyBarr.prototype.margenExterno = function () {
    return 1;
};

Window_EnemyBarr.prototype.xDibujado = function () {
    return this.reminiscenteX();
};
Window_EnemyBarr.prototype.dibujarBarra = function (sumy, tipo) {
    this.width = this.largo();
    this.dibujarFondo(sumy);
    this.dibujarRelleno(sumy, tipo);
    this.dibujarDesgaste(sumy, tipo);
    this.dibujarDestello(sumy);

};
Window_EnemyBarr.prototype.posicionarBarra = function (sumy) {
    this.x = this._sprite.x - this.obtenerDesplazamientoXBase();
    this.y = this._sprite.y - this.obtenerSubidaYBase() - sumy * this.configAnim().ponerEncima;
    this.width = this.largo();
    this.height = sumy + this.ancho();
};

Window_EnemyBarr.prototype.dibujarFondo = function (sumy) {
    const y = sumy;
    const x = this.xDibujado();
    const w = this.largo();
    const h = this.ancho(); 
    const c = ColorManager.gaugeBackColorDark();
    this.contentsBack.fillRect(x, y, w, h, c);
};
Window_EnemyBarr.prototype.dibujarRelleno = function (sumy, tipo) {
    const y = this.margenExterno() + sumy;
    const x = this.margenExterno() + this.xDibujado();
    const w = this.rellenoSup();
    const h = this.rellenoSupA();
    const c1 = this.color1(tipo);
    const c2 = this.color2(tipo);
    this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, false); //false para horizontal y true para vertical.

};

Window_EnemyBarr.prototype.calcularAnchoDanno = function (tipo) {

    let resp = this.rellenoSup();
    switch (tipo) {
        case 1:
            resp = this.calcularAnchoDannoExacto(Math.round(this._hpSiguienteFrame), this.battler().mhp);
            this._anchoDannoPv = resp;
            break;
        case 2:
            resp = this.calcularAnchoDannoExacto(Math.round(this._mpSiguienteFrame), this.battler().mmp);
            this._anchoDannoPm = resp;
            break;
        case 3:
            resp = this.calcularAnchoDannoExacto(Math.round(this._tpSiguienteFrame), this.battler().maxTp());
            this._anchoDannoPt = resp;
            break;
        case 4:
            resp = (1 - this.battler().tpbChargeTime()) * this.rellenoSup();
            break;
    }
    return resp;
};
Window_EnemyBarr.prototype.calcularAnchoDannoExacto = function (act, max) {
    const rSup = this.rellenoSup();
    let porcent = 1 - (act > 0 ? act / max : 0);
    if (act > 0 && act < max) porcent = porcent.clamp(0.01, 0.99);
    return Math.ceil(porcent * rSup).clamp(0, rSup);
};
Window_EnemyBarr.prototype.dibujarDesgaste = function (sumy, tipo) {
    let largo = this.calcularAnchoDanno(tipo);
    let xb = this.rellenoSup() - largo;
    const y = this.margenExterno() + sumy;
    const x = xb + this.xDibujado() + this.margenExterno();
    const w = largo;
    const h = this.rellenoSupA();
    const c = ColorManager.gaugeBackColor();
    this.contentsBack.fillRect(x, y, w, h, c);
    this.actualizarBarras();
};

Window_EnemyBarr.prototype.dibujarDestello = function (sumy) {
    if (!this.battler().isSelected() || this._sprite._selectionEffectCount % 30 >= 15) return;
    const y = sumy;
    const x = this.xDibujado();
    const w = this.largo();
    const h = this.ancho();
    const c = ColorManager.gaugeWhiteTransparent();
    this.contentsBack.fillRect(x, y, w, h, c);
};

Window_EnemyBarr.prototype.color1 = function (id) {
    switch (id) {
        case 1:
            return ColorManager.hpGaugeColor1();
        case 2:
            return ColorManager.mpGaugeColor1();
        case 3:
            return ColorManager.tpGaugeColor1();
        case 4:
            return ColorManager.ctGaugeColor1();
        default:
            return ColorManager.normalColor();
    }
};
Window_EnemyBarr.prototype.color2 = function (id) {
    switch (id) {
        case 1:
            return ColorManager.hpGaugeColor2();
        case 2:
            return ColorManager.mpGaugeColor2();
        case 3:
            return ColorManager.tpGaugeColor2();
        case 4:
            return ColorManager.ctGaugeColor2();
        default:
            return ColorManager.normalColor();
    }
};

ColorManager.gaugeBackColorDark = function(){
    return "rgba(26,26,47,1)"
};

ColorManager.gaugeWhiteTransparent = function(){
    return "rgba(255,255,255,0.25)"
};