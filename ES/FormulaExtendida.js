var Zausen = Zausen || {};
Zausen.FZ_FormulaExtendida = Zausen.FZ_FormulaExtendida || {};
/*:
 * @target MZ
 * @plugindesc Amplia las opciones del apartado fórmula de la sección daño de habilidades y objetos.
 * @author Fer Zacrón, test: Efímero
 *
 * @help FormulaExtendida.js
 * 
 * Este plugin añade los siguientes comandos tanto para a como para b:
 * 
php: Es la cantidad de puntos de vida antes de pagar la habilidad. 
pmp: Es la cantidad de puntos de magia antes de pagar la habilidad. 
ptp: Es la cantidad de puntos de técnica antes de pagar la habilidad.
pgold: Es la cantidad de dinero que tiene el grupo antes de pagar la habilidad (para enemigos vale el valor de su recompensa). Es susceptible al plugin SistemaRobo
cgold: Es la cantidad de dinero que ha costado la habilidad (Si no se ha importado antes SistemaCostes o la usa un enemigo valdrá 0 siempre)
tgold: Es la cantidad total de dinero que posee el grupo después de pagar la habilidad (para los enemigos vale siempre el valor de su recompensa) Es susceptible al plugin SistemaRobo;
 *
 * todos los comandos valen tanto para el sujeto que ejecuta la habilidad como para el objetivo de ésta.
 */


Zausen.FZ_FormulaExtendida.aplicarValorNumerico = function (original, nuevo) {
    if (!original || isNaN(original)) return nuevo && !isNaN(nuevo) ? nuevo : 0;
    return original;
};

/* ****************************************************************************************************************************************** 
***************************************************************** Game_Action ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_FormulaExtendida.Game_Action = Zausen.FZ_FormulaExtendida.Game_Action || {};

Zausen.FZ_FormulaExtendida.Game_Action.evalDamageFormula = Game_Action.prototype.evalDamageFormula;

Game_Action.prototype.evalDamageFormula = function (target) {
    this.garantizarPrevios(this.subject(), target);
    return Zausen.FZ_FormulaExtendida.Game_Action.evalDamageFormula.call(this, target);
};

Game_Action.prototype.garantizarPrevios = function (subject, target) { 
    subject.darValorPreviosFEx();
    //Inicializo siempre los valores del target a no ser que sea el mismo que el subject, entonces no se toca.
    let inicializarTarget = !(target.isActor() && subject.isActor() && target._actorId == subject._actorId && target._battlerName == subject._battlerName) 
                            && !(target.isEnemy() && subject.isEnemy() && target._enemyId == subject._enemyId && target._letter == subject._letter);
    target.darValorPreviosFEx(inicializarTarget);
};

Game_Action.prototype.anularPrevios = function (subject, target) {
    subject.inicializarPrevios();
    target.inicializarPrevios();
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_BattlerBase **********************************************************
*********************************************************************************************************************************************/

Zausen.FZ_FormulaExtendida.Game_BattlerBase = Zausen.FZ_FormulaExtendida.Game_BattlerBase || {};

Zausen.FZ_FormulaExtendida.Game_BattlerBase.initMembers = Game_BattlerBase.prototype.initMembers;

Game_BattlerBase.prototype.initMembers = function () {
    this.inicializarPrevios();
    Zausen.FZ_FormulaExtendida.Game_BattlerBase.initMembers.call(this);
};

Game_BattlerBase.prototype.inicializarPrevios = function () {
    this._php = null;
    this._pmp = null;
    this._ptp = null;
    this._pgold = null;
    this._cgold = null; 
};

Game_BattlerBase.prototype.darValorPreviosFEx = function (limpiarPrimero) {
    if (limpiarPrimero) this.inicializarPrevios();
    this._php = Zausen.FZ_FormulaExtendida.aplicarValorNumerico(this._php, this.hp);
    this._pmp = Zausen.FZ_FormulaExtendida.aplicarValorNumerico(this._pmp, this.mp);
    this._ptp = Zausen.FZ_FormulaExtendida.aplicarValorNumerico(this._ptp, this.tp); 
    this._pgold = Zausen.FZ_FormulaExtendida.aplicarValorNumerico(this._pgold, this.gold());
    this._cgold = Zausen.FZ_FormulaExtendida.aplicarValorNumerico(this._cgold, 0);
 };

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    php: {
        get: function () {
            return this._php;
        },
        configurable: true
    },
    pmp: {
        get: function () {
            return this._pmp;
        },
        configurable: true
    },
    ptp: {
        get: function () {
            return this._ptp;
        },
        configurable: true
    },
    pgold: {
        get: function () {
            return this._pgold;
        },
        configurable: true
    },
    cgold: {
        get: function () {
            return this._cgold;
        },
        configurable: true
    },
    tgold: {
        get: function () {
            return this.gold();
        },
        configurable: false
    }
});

/* ****************************************************************************************************************************************** 
***************************************************************** Game_Battler **************************************************************
*********************************************************************************************************************************************/

Zausen.FZ_FormulaExtendida.Game_Battler = Zausen.FZ_FormulaExtendida.Game_Battler || {};

Zausen.FZ_FormulaExtendida.Game_Battler.useItem = Game_Battler.prototype.useItem;

Game_Battler.prototype.useItem = function (item) {
    this.darValorPreviosFEx(true);
    Zausen.FZ_FormulaExtendida.Game_Battler.useItem.call(this, item);
};

 

/* ****************************************************************************************************************************************** 
***************************************************************** Game_Actor ****************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_FormulaExtendida.Game_Actor = Zausen.FZ_FormulaExtendida.Game_Actor || {};

 
Game_Actor.prototype.gold = function(){
    return $gameParty.gold();
};
 
Zausen.FZ_FormulaExtendida.Game_Actor.paySkillGoldCost = Game_Actor.prototype.paySkillGoldCost;
Game_Actor.prototype.paySkillGoldCost = function (skill) {
    if(!Zausen.FZ_SistemaCostes) return;
    this._cgold = this.skillGoldCost(skill); 
    Zausen.FZ_FormulaExtendida.Game_Actor.paySkillGoldCost.call(this, skill); 
};
