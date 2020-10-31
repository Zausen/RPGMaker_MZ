var Zausen = Zausen || {};
Zausen.FZ_FormulaExtendida = Zausen.FZ_FormulaExtendida || {};
/*:
 * @target MZ
 * @plugindesc Amplia las opciones del apartado fórmula de la sección daño de habilidades y objetos.
 * @author Fer Zacrón, test: Efímero
 *
 * @help ExtendedFormula.js
 * 
 * This plugin adds the next commands for "a" and "b" in formula input:
 * 
php: It is the amount of health points before paying the skill.
pmp: It is the amount of magic points before paying the skill. 
ptp: It is the amount of tactical points before paying the skill.
pgold: It is the amount of money the party has before paying the skill. (For enemies, this value is the same as the reward). 
cgold: It is the amount of money skill cost (if not imported "PaySistem.js" or other compatible plugin, this value is 0)
tgold: It is the total amount of money the party has after paying skill.(For enemies, this value is the same as the reward)
 *
 * These all commands can use for the target and the subject.
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
