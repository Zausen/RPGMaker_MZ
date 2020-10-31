var Zausen = Zausen || {};
Zausen.FZ_SistemaCambioVitalidad = Zausen.FZ_SistemaCambioVitalidad || {};
/*:
 * @target MZ
 * @plugindesc cambia la barra de vitalidad si quieres.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaCambioVitalidad.js
 *
 * Este plugin permite cambiar qué barra pertenece a la vitalidad. (osea, podemos tener pj con 0pv vivos).
 * 
 * Para que este plugin funcione usamos la etiqueta CAMBIOVIT{} (Con sus llaves).
 * 
 * Las opciones son: 
 * :PMVIT: :hará que el pm funcione como vitalidad en lugar del pv.
 * :PTVIT: :hará que el pt funcione como vitalidad en lugar del pv.
 * pvMax:número :Hace que se limite el PV. Esto permite ponrlos a 0 máximos (independientemente del nivel, esto pone un tope que aunque se sobrepase, no se mostrará)
 * ptMin: pone un pt mínimo (perfecto para cuando el PT es la vit)
 * 
 * No son compatibles PMVIT y PTVIT.
 * 
 * Ejemplo:
 * 
 * CAMBIOVIT{ 
	:PTVIT: 
	PTMIN:21
} Hace que sean los PT los que tengan que llegar a cero para morir.
Además pone 21 pt mínimos cuando empieza el combate.

CAMBIOVIT{
	:PMVIT: 
	PVMAX:0 
}
Hace que los pm sean la vitalidad, cuando lleguen a cero el personaje morirá, además tendrá 0 puntos de vida sin importar el nivel.

Sólo para actores y enemigos
 * 
 */

Zausen.FZ_SistemaCambioVitalidad.Regex = {//gi
    general: /CAMBIOVIT[{]([\s\S]*?)[}]/i,
    pvMax: /PVMAX[:](\d{1,4})/i,
    ptMin: /PTMIN[:]([1][0][0]|[1-9][0-9]|[0-9])/i
};

Zausen.FZ_SistemaCambioVitalidad.Etiquetas = {
    PMVIT: ':PMVIT:',
    PTVIT: ':PTVIT:',
    PV: 'PV',
    PM: 'PM',
    PT: 'PT'
};

/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/

Zausen.FZ_SistemaCambioVitalidad.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaCambioVitalidad.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaCambioVitalidad.BBDDCargada) {
        Zausen.FZ_SistemaCambioVitalidad.BBDDCargada = true; 
        Zausen.FZ_SistemaCambioVitalidad.Inicializar($dataActors);
        Zausen.FZ_SistemaCambioVitalidad.Inicializar($dataEnemies);
    }
    return true;
};

Zausen.FZ_SistemaCambioVitalidad.DarTipoVit = function (elemento, conjunto) {
    if (conjunto.indexOf(Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PMVIT) >=0) {
        elemento.cambioVitalidad.vitalidad = Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PM;
    } else if (conjunto.indexOf(Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PTVIT) >=0) {
        elemento.cambioVitalidad.vitalidad = Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PT;
    }
};

Zausen.FZ_SistemaCambioVitalidad.DarMaxPV = function (elemento, conjunto) {
    let subconjunto = conjunto.match(Zausen.FZ_SistemaCambioVitalidad.Regex.pvMax); 
    if (subconjunto != null && !isNaN(subconjunto[1])) elemento.cambioVitalidad.pvMax = parseInt(subconjunto[1]);
};

Zausen.FZ_SistemaCambioVitalidad.DarMinPt = function (elemento, conjunto) {
    let subconjunto = conjunto.match(Zausen.FZ_SistemaCambioVitalidad.Regex.ptMin);
    if (subconjunto && !isNaN(subconjunto[1])) elemento.cambioVitalidad.ptMin = parseInt(subconjunto[1]);
};

Zausen.FZ_SistemaCambioVitalidad.Inicializar = function (elementos) {
    for (var e = 0; e <= elementos.length; e++) {
        if (!elementos[e]) continue;
        var elemento = elementos[e];
        elemento.cambioVitalidad = {
            vitalidad: Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PV,
            pvMax: null,
            ptMin: 0
        };
        Zausen.FZ_SistemaCambioVitalidad.Inicializar(elemento);
        let nota = elemento.note; 
        let conjunto = nota.match(Zausen.FZ_SistemaCambioVitalidad.Regex.general);
        if (conjunto) {
             conjunto = conjunto.toUpperCase();
            Zausen.FZ_SistemaCambioVitalidad.DarTipoVit(elemento, conjunto[1]);
            Zausen.FZ_SistemaCambioVitalidad.DarMaxPV(elemento, conjunto[1]);
            Zausen.FZ_SistemaCambioVitalidad.DarMinPt(elemento, conjunto[1]); 
        }
    }
};


/* ****************************************************************************************************************************************** 
*************************************************************** Game_BattlerBase ************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase = Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase || {};

Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.die = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() { 
    let es = this.isActor() ? this.actor() : this.enemy();
    switch(es.cambioVitalidad.vitalidad){ 
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PV:
            Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.die.call(this);
        break;
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PM:
            this._mp = 0;
        break;
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PT:
            this._tp = 0;
        break;
    }
 };

Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.revive = Game_BattlerBase.prototype.revive;
Game_BattlerBase.prototype.revive = function() {
    let es = this.isActor() ? this.actor() : this.enemy();
    switch(es.cambioVitalidad.vitalidad){ 
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PV:
            Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.revive.call(this);
        break;
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PM:
            if (this._mp === 0) this._mp = 1;
        break;
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PT:
            if (this._tp === 0) this._tp = 1;
        break;
    }
};
Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.paramMin = Game_BattlerBase.prototype.paramMin;
Game_BattlerBase.prototype.paramMin = function(paramId) {
    let es = this.isActor() ? this.actor() : this.enemy();
    switch(es.cambioVitalidad.vitalidad){ 
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PV:
           return Zausen.FZ_SistemaCambioVitalidad.Game_BattlerBase.paramMin.call(this, paramId);
        break;
        case Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PM:
            if (paramId === 1) return 1;
        break;
    }
    return 0;
};


/* ****************************************************************************************************************************************** 
***************************************************************** Game_Battler **************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCambioVitalidad.Game_Battler = Zausen.FZ_SistemaCambioVitalidad.Game_Battler || {};

Zausen.FZ_SistemaCambioVitalidad.Game_Battler.refresh = Game_Battler.prototype.refresh;
Game_Battler.prototype.refresh = function () {  
    let es = this.isActor() ? this.actor() : this.enemy(); 
    if (es.cambioVitalidad.vitalidad == Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PV) {
         Zausen.FZ_SistemaCambioVitalidad.Game_Battler.refresh.call(this);
         return;
    }
    Game_BattlerBase.prototype.refresh.call(this);
    let agregarMuerte = (es.cambioVitalidad.vitalidad == Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PM && this.mp === 0)
                        || (es.cambioVitalidad.vitalidad == Zausen.FZ_SistemaCambioVitalidad.Etiquetas.PT && this.tp === 0);

    if (agregarMuerte) {
         this.addState(this.deathStateId());
    } else {
         this.removeState(this.deathStateId());
    }  
};

Zausen.FZ_SistemaCambioVitalidad.Game_Battler.initTp = Game_Battler.prototype.initTp;
Game_Battler.prototype.initTp = function() {
    Zausen.FZ_SistemaCambioVitalidad.Game_Battler.initTp.call(this);
    let es = this.isActor() ? this.actor() : this.enemy(); 
    if(this._tp < es.cambioVitalidad.ptMin) this.setTp(es.cambioVitalidad.ptMin);
};
 
/* ****************************************************************************************************************************************** 
****************************************************************** Game_Actor ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCambioVitalidad.Game_Actor = Zausen.FZ_SistemaCambioVitalidad.Game_Actor || {};

Zausen.FZ_SistemaCambioVitalidad.Game_Actor.paramBase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function(paramId) {
    let maxPv = this.actor().cambioVitalidad.pvMax;
     if(paramId !== 0 || maxPv == null || isNaN(maxPv)) return Zausen.FZ_SistemaCambioVitalidad.Game_Actor.paramBase.call(this,paramId);
    return maxPv;
};

/* ****************************************************************************************************************************************** 
****************************************************************** Game_Enemy ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCambioVitalidad.Game_Enemy = Zausen.FZ_SistemaCambioVitalidad.Game_Enemy || {};

Zausen.FZ_SistemaCambioVitalidad.Game_Enemy.paramBase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function(paramId) {
    let maxPv = this.enemy().cambioVitalidad.pvMax;
    if(paramId !== 0 || maxPv == null || isNaN(maxPv)) return Zausen.FZ_SistemaCambioVitalidad.Game_Enemy.paramBase.call(this,paramId);
    return maxPv;
};


