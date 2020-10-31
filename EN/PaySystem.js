var Zausen = Zausen || {};
Zausen.FZ_SistemaCostes = Zausen.FZ_SistemaCostes || {};
/*:
 * @target MZ
 * @plugindesc Increase the chances of skill payments.
 * @author Fer Zacrón, test: Efímero
 *
 * @help PaySystem.js
 *
 * This plugin make new kinds of payments. 
 *
 * In the skill's note you can use the label "PAYMENT{}"
 * 
 * Inside this, between keys, you can write the next sublabels:
 * MP: --> Magic points (Only percentages)
 * HP: --> Healt points.
 * TP: --> Tactical points. (Only percentages)
 * HPMIN: --> Minimum HP cost.
 * MPMIN: --> Minimum MP cost.
 * TPMIN: --> Minimum TP cost.
 * MON:--> Money (Only fixed values or percentages on current money)
 * MONMIN: --> Miimum momey cost.
 * After this labels, we should write a integer (the amount). And Also, if we
 * wish, we can put the symbol of % to say that we want it to be over the 
 * current value. Also, if we add an M later, it will be a percentage of the
 * maximum value. (not spaces) 
 * Example:
 * PAYMENT{
 *      MP:26%M     Will cost 26% of the maximum mp.
 *      TP:15%      Will cost 15% of the current tp.
 *      TPMIN:10    Never will cost less of 10 tp. 
 *      HP:200      Will cost 200 hp. 
 *      HP:5%       Will cost 5% of the current hp. (In addition to the fixed value)
 *      MON:150     Will cost 150 gold. (gold, rupia or as you name the currency)
 * }
 * Comments can be placed, alwais with a space separator (or tab), without problems. 
 * (if any groups is not correctly written, it will not be read, it would be like 
 * one more comment)
 * 
 * And also, there are some special sublabels for the skill's patments.
 * 
 * TURN: -->   Before use skill, the user will wait X turnos. (included the used turn)
 * Then, same that previous sublabels, you will should use an integer value.
 * Then we could write a waiting message: ''my message''. (With two ' for
 * open and two ' for close).
 * An Example:
 * PAYMENT{
 *      TURN:2''is getting ready''
 * }
 * After two turnos, the actor will use the skill (and the effect), while the actor
 * is waiting, will appear the message "is getting ready". (compatible with \n for
 * line breaks) 
 * 
 * 
 * Other case of use is the objects.
 * 
 * ITEMS: --> Use the items to pay for the skill...
 * Use an integer (id of the item) separated for a comma (,), one item for id...
 * If you wish, you can use a dash(-) for write other integer (amount of item).
 * Example:
 * PAYMENT{
 *      ITEMS:1,3-8,5    one item 1 and 5, but eight items with id = 3.
 * }
 * 
 * Finally we have the sublabel for states. 
 * STATES: --> Defies the altered states obtained after using the skill (with R after 
 * the integer and before the comma) or the states needed to pay for the skill.
 * 
 * Example:
 * PAYMENT{
 *      STATES:10R,32    To use this skill its necessary that the user is affected by the state with id = 32 (After using skill, the user will lose the state) And will gain the state with id = 10.
 *  }
 * 
 * Also, HP:M is so that the pay skill can kill the user. (default minimum HP cost is 1)
 */
Zausen.FZ_SistemaCostes.Regex = {//gi
    General: /PAYMENT[{]([\s\S]*?)[}]/i,
    IntGeneral: /([A-Z]{2,})[:](\d{1,}|[M])([%D]([M]|)|)/gi,
    IntEspecial: /(STATES|ITEMS)[:]([0-9-,R]{1,})[\s]/gi,
    IntTurno: /TURN[:](\d{1,})(([']{2}([\S ]*?)[']{2})|)/i,
    CorteEspecial: /(\d{1,})([-](\d{1,2})|[R]|)/gi,

};

Zausen.FZ_SistemaCostes.Etiquetas = {
    PM: 'MP',
    PT: 'TP',
    PV: 'HP',
    PVMIN: 'HPMIN',
    PMMIN: 'MPMIN',
    PTMIN: 'TPMIN',
    OBJ: 'ITEMS',
    EST: 'STATES',
    MON: 'MON',
    MONMIN: 'MONMIN',
    PJE: '%',
    MPJE: '%M',
    R: 'R',
    M: 'M'
};
/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaCostes.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaCostes.BBDDCargada) { 
        Zausen.FZ_SistemaCostes.BBDDCargada = true;
        Zausen.FZ_SistemaCostes.InicializarHabilidades($dataSkills);
    }
    return true;
};
Zausen.FZ_SistemaCostes.InicializarHabilidad = function (habilidad) {
    habilidad.costePv = 0;
    habilidad.costePPv = 0;
    habilidad.costePPvM = 0;
    habilidad.costePPm = 0;
    habilidad.costePPmM = 0;
    habilidad.costePPt = 0;
    habilidad.costePPtM = 0;
    habilidad.costeOro = 0;
    habilidad.costePOro = 0;
    habilidad.costeEstados = [];
    habilidad.recompensaEstados = [];
    habilidad.costeObjetos = [];
    habilidad.costeTurnosAntes = 0;
    habilidad.mensajeCargaTurnos = '';
    habilidad.minimoPv = 1;
    habilidad.minimoPm = 1;
    habilidad.minimoPt = 1;
    habilidad.minimoOro = 1;
    habilidad.permiteMorir = false;
};

Zausen.FZ_SistemaCostes.InicializarHabilidades = function (habilidades) {
    for (var h = 0; h <= habilidades.length; h++) {
        if (!habilidades[h]) continue;
        var habilidad = habilidades[h];
        Zausen.FZ_SistemaCostes.InicializarHabilidad(habilidad);
        var nota = habilidad.note;
        var conjunto = nota.split(Zausen.FZ_SistemaCostes.Regex.General);
        if (conjunto.length > 1) {
            Zausen.FZ_SistemaCostes.DarValorHabilidadesBase(habilidad, conjunto);
            Zausen.FZ_SistemaCostes.DarValorHabilidadesEspecial(habilidad, conjunto);
            Zausen.FZ_SistemaCostes.DarValorHabilidadesTurno(habilidad, conjunto);
            habilidad.costePv = Math.min(habilidad.costePv, 9999);
            habilidad.costeOro = Math.min(habilidad.costeOro, 999999);
            habilidad.costePPv /= 100;
            habilidad.costePPvM /= 100;
            habilidad.costePPm /= 100;
            habilidad.costePPmM /= 100;
            habilidad.costePPt /= 100;
            habilidad.costePPtM /= 100;
            habilidad.costePOro /= 100;
        }

    }

};
Zausen.FZ_SistemaCostes.DarValorHabilidadesEspecial = function (habilidad, conjunto) {
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaCostes.Regex.IntEspecial.exec(conjunto[1])) {
        var tipo = subconjunto[1];
        var contenido = subconjunto[2];
        switch (tipo) {
            case Zausen.FZ_SistemaCostes.Etiquetas.OBJ:
                var objeto;
                while (objeto = Zausen.FZ_SistemaCostes.Regex.CorteEspecial.exec(contenido)) {
                    var obj = {
                        id: parseInt(objeto[1]),
                        cantidad: objeto[3] ? parseInt(objeto[3]) : 1
                    };
                    habilidad.costeObjetos.push(obj);
                }

                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.EST:
                var estado;
                while (estado = Zausen.FZ_SistemaCostes.Regex.CorteEspecial.exec(contenido)) {
                    var idEstado = parseInt(estado[1])
                    if (estado[2] && Zausen.FZ_SistemaCostes.Etiquetas.R === estado[2]) {
                        habilidad.recompensaEstados.push(idEstado);
                    } else {
                        habilidad.costeEstados.push(idEstado);
                    }
                }
                break;
        }
    }
};
Zausen.FZ_SistemaCostes.DarValorHabilidadesTurno = function (habilidad, conjunto) {
    var subconjunto = conjunto[1].match(Zausen.FZ_SistemaCostes.Regex.IntTurno);
    if (subconjunto) {
        habilidad.costeTurnosAntes = parseInt(subconjunto[1]);
       if(habilidad.costeTurnosAntes > 0 && habilidad.occasion != 1 && habilidad.occasion != 3) habilidad.occasion = 1;
        habilidad.mensajeCargaTurnos = subconjunto[4] ? subconjunto[4] : '';
    }

};
Zausen.FZ_SistemaCostes.DarValorHabilidadesBase = function (habilidad, conjunto) {
    var subconjunto;
    while (subconjunto = Zausen.FZ_SistemaCostes.Regex.IntGeneral.exec(conjunto[1])) {
        var valor = subconjunto[2] ? parseInt(subconjunto[2]) : null;
        if (!valor && subconjunto[2] == Zausen.FZ_SistemaCostes.Etiquetas.M) valor = 'M';
        if (!valor) continue;
        var tipo = subconjunto[3];
        if (tipo) {
            if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.PJE) definicion = 1;
            else if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.MPJE) definicion = 2;
        }
        switch (subconjunto[1]) {
            case Zausen.FZ_SistemaCostes.Etiquetas.PM:
                if (tipo) {
                    if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.PJE) habilidad.costePPm = valor;
                    else if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.MPJE) habilidad.costePPmM = valor;
                }
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.PT:
                if (tipo) {
                    if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.PJE) habilidad.costePPt = valor;
                    else if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.MPJE) habilidad.costePPtM = valor;
                }
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.PV:
                if (valor == Zausen.FZ_SistemaCostes.Etiquetas.M) {
                    habilidad.permiteMorir = true;
                    break;
                }
                if (tipo) {
                    if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.PJE) habilidad.costePPv = valor;
                    else if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.MPJE) habilidad.costePPvM = valor;

                    break;
                }
                habilidad.costePv = valor;
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.PVMIN:
                habilidad.minimoPv = valor;
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.PMMIN:
                habilidad.minimoPm = valor;
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.PTMIN:
                habilidad.minimoPt = valor;
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.MON:
                if (tipo) {
                    if (tipo == Zausen.FZ_SistemaCostes.Etiquetas.PJE || tipo == Zausen.FZ_SistemaCostes.Etiquetas.MPJE) habilidad.costePOro = valor;
                    break;
                }
                habilidad.costeOro = valor;
                break;
            case Zausen.FZ_SistemaCostes.Etiquetas.MONMIN:
                habilidad.minimoOro = valor;
                break;
        }
    }
}
/* ****************************************************************************************************************************************** 
*************************************************************** Game_BattlerBase ************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.Game_BattlerBase = Zausen.FZ_SistemaCostes.Game_BattlerBase || {};

Zausen.FZ_SistemaCostes.Game_BattlerBase.initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function () {
    this._TurnosEsperaPrevia = 0;
    this._RecamaraDeAccion = null;
    this._TextoEsperaAntes = null;
    this._TurnosConsumidos = false;
    this._reacondicionadorDeTurnos = 0; 
    this._numTurnosPrevisto = 0;
    this._nuevaIndexPrevista = 0;

    this._recamaraDeEstados = null;
    Zausen.FZ_SistemaCostes.Game_BattlerBase.initMembers.call(this);

};

Game_BattlerBase.prototype.cancelarEspera = function () {
    this._TurnosEsperaPrevia = 0;
    this._RecamaraDeAccion = null;
    this._TextoEsperaAntes = null;
    this._TurnosConsumidos = false;
    this._reacondicionadorDeTurnos = 0;
    this._numTurnosPrevisto = 0;
    this._nuevaIndexPrevista = 0;
};
Game_BattlerBase.prototype.skillHpCost = function (skill) {
    var costeP = 0;
    if (skill.costePPv > 0 || skill.costePPvM > 0)
        costeP = Math.max(skill.minimoPv, Math.round(this._hp * skill.costePPv + this.mhp * skill.costePPvM));

    return skill.costePv + costeP;
};

Zausen.FZ_SistemaCostes.Game_BattlerBase.skillMpCost = Game_BattlerBase.prototype.skillMpCost;
Game_BattlerBase.prototype.skillMpCost = function (skill) {
    var costeP = 0;
    if (skill.costePPm > 0 || skill.costePPmM > 0)
        costeP = Math.max(skill.minimoPm, Math.round(this._mp * skill.costePPm + this.mmp * skill.costePPmM));
    return Zausen.FZ_SistemaCostes.Game_BattlerBase.skillMpCost.call(this, skill) + Math.floor(costeP * this.mcr);
};

Zausen.FZ_SistemaCostes.Game_BattlerBase.skillTpCost = Game_BattlerBase.prototype.skillTpCost;
Game_BattlerBase.prototype.skillTpCost = function (skill) {
    var costeP = 0;
    if (skill.costePPt > 0 || skill.costePPtM > 0)
        costeP = Math.max(skill.minimoPt, Math.round(this._tp * skill.costePPt + this.maxTp() * skill.costePPtM));
    return Zausen.FZ_SistemaCostes.Game_BattlerBase.skillTpCost.call(this, skill) + costeP;
};

Game_BattlerBase.prototype.skillGoldCost = function (skill) {
    return 0;
};


Game_BattlerBase.prototype.canPaySkillStateCost = function (skill) {
    var estados = skill.costeEstados;
    for (var x = 0; x < estados.length; x++) {
        if (!this.isStateAffected(estados[x])) return false;
    }
    return true;
};

Game_BattlerBase.prototype.canPaySkillGoldCost = function (skill) {
    return true;
};

Game_BattlerBase.prototype.canPaySkillItemsCost = function (skill) {
    return true;
};

Game_BattlerBase.prototype.canPaySkillHpCost = function (skill) {
    var costePV = this.skillHpCost(skill);
    return ((skill.permiteMorir || this.mhp === 0) && this._hp >= costePV) || this._hp > costePV;
};
Zausen.FZ_SistemaCostes.Game_BattlerBase.canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
    return Zausen.FZ_SistemaCostes.Game_BattlerBase.canPaySkillCost.call(this, skill)
        && this.canPaySkillHpCost(skill)
        && this.canPaySkillStateCost(skill)
        && this.canPaySkillGoldCost(skill)
        && this.canPaySkillItemsCost(skill);
};

Game_BattlerBase.prototype.paySkillStateCost = function (skill) { };

Game_BattlerBase.prototype.paySkillStateReward = function (skill) { };

Game_BattlerBase.prototype.paySkillGoldCost = function (skill) { };

Game_BattlerBase.prototype.paySkillItemsCost = function (skill) { };

Game_BattlerBase.prototype.paySkillTurnCost = function (skill) {
    if (!skill.costeTurnosAntes) return;
    this._TurnosEsperaPrevia = skill.costeTurnosAntes - Math.max(0, (this.numActions() - 1)) - this._reacondicionadorDeTurnos;
    this._reacondicionadorDeTurnos = 0;
    this._TextoEsperaAntes = skill.mensajeCargaTurnos;
    this._TurnosConsumidos = true;
};

Zausen.FZ_SistemaCostes.Game_BattlerBase.paySkillCost = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function (skill) {
    if (skill.costeTurnosAntes && skill.costeTurnosAntes > this._reacondicionadorDeTurnos && !this._TurnosConsumidos) {
        this.paySkillTurnCost(skill);
        return;
    }
    Zausen.FZ_SistemaCostes.Game_BattlerBase.paySkillCost.call(this, skill);
    this._hp -= this.skillHpCost(skill);
    this.paySkillGoldCost(skill);
    this.paySkillStateCost(skill);
    this.paySkillItemsCost(skill);
    this.paySkillStateReward(skill);
    this._TurnosConsumidos = false;
};
Zausen.FZ_SistemaCostes.Game_BattlerBase.canInput = Game_BattlerBase.prototype.canInput;
Game_BattlerBase.prototype.canInput = function () {
    return Zausen.FZ_SistemaCostes.Game_BattlerBase.canInput.call(this) && this.numActions() > this._nuevaIndexPrevista; 
};


Game_BattlerBase.prototype.EsperarTurnoAntes = function () {
    if (this._TurnosEsperaPrevia <= 0) return;
    
    this._numTurnosPrevisto = this.makeActionTimes();
    this._nuevaIndexPrevista = this._TurnosEsperaPrevia;  
    this._TurnosEsperaPrevia = Math.max(0, this._TurnosEsperaPrevia - this._reacondicionadorDeTurnos - this._numTurnosPrevisto);
    if ((this._TurnosEsperaPrevia + 1)<=this._numTurnosPrevisto){
          this._TextoEsperaAntes = null; 
    }
    this._reacondicionadorDeTurnos = 0;
};

Zausen.FZ_SistemaCostes.Game_BattlerBase.refresh = Game_BattlerBase.prototype.refresh;
Game_BattlerBase.prototype.refresh = function () {
    Zausen.FZ_SistemaCostes.Game_BattlerBase.refresh.call(this);
    if (this._RecamaraDeAccion) {
        var skill = this._RecamaraDeAccion.item();
        if (this.isDead() || this.restriction() > 0 ||
            !this.isSkillWtypeOk(skill) || !this.canPaySkillCost(skill) || this.isSkillSealed(skill.id) || this.isSkillTypeSealed(skill.stypeId)) {
            this.cancelarEspera();
        }
    }
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Battler **************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.Game_Battler = Zausen.FZ_SistemaCostes.Game_Battler || {};

Zausen.FZ_SistemaCostes.Game_Battler.isChanting = Game_Battler.prototype.isChanting;
Game_Battler.prototype.isChanting = function() {
    if(this._RecamaraDeAccion && !this.isInputting() && !this.isActing()) return true;
    return Zausen.FZ_SistemaCostes.Game_Battler.isChanting.call(this);
};

Zausen.FZ_SistemaCostes.Game_Battler.onTurnEnd = Game_Battler.prototype.onTurnEnd
Game_Battler.prototype.onTurnEnd = function () {
    Zausen.FZ_SistemaCostes.Game_Battler.onTurnEnd.call(this);
    this.EsperarTurnoAntes();
};
Zausen.FZ_SistemaCostes.Game_Battler.makeActionTimes = Game_Battler.prototype.makeActionTimes;
Game_Battler.prototype.makeActionTimes = function() {
    if(this._numTurnosPrevisto <= 0)  return Zausen.FZ_SistemaCostes.Game_Battler.makeActionTimes.call(this);
    var respuesta = this._numTurnosPrevisto;
    this._numTurnosPrevisto = 0; 
    return respuesta;
};

Game_Battler.prototype.paySkillStateCost = function (skill) {
    var estados = skill.costeEstados;
    for (var x = 0; x < estados.length; x++) {
        this.removeState(estados[x]);
    }
};

Game_Battler.prototype.paySkillStateReward = function (skill) {
    var estados = skill.recompensaEstados;
    this._recamaraDeEstados = [];
    for (var x = 0; x < estados.length; x++) {
        this._recamaraDeEstados.push(estados[x]);
    }
    if (this._recamaraDeEstados.length <= 0) this._recamaraDeEstados = null;
};


/* ****************************************************************************************************************************************** 
***************************************************************** Game_Actor ****************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.Game_Actor = Zausen.FZ_SistemaCostes.Game_Actor || {};

Game_Actor.prototype.puedeUsarRecamaraDeAccion = function() {
    if (this._TurnosEsperaPrevia <= 0) return true; 
    return (this._TurnosEsperaPrevia + 1) <= this.numActions();
};
Game_BattlerBase.prototype.EsperarTurnoAntes = function () {
    if (this._TurnosEsperaPrevia <= 0) return;
    
    this._numTurnosPrevisto = this.makeActionTimes();
    this._nuevaIndexPrevista = this._TurnosEsperaPrevia;  
    this._TurnosEsperaPrevia = Math.max(0, this._TurnosEsperaPrevia - this._reacondicionadorDeTurnos - this._numTurnosPrevisto); 
    if ((this._TurnosEsperaPrevia + 1)<=this._numTurnosPrevisto){
          this._TextoEsperaAntes = null; 
    }
    this._reacondicionadorDeTurnos = 0;
};
Zausen.FZ_SistemaCostes.Game_Actor.clearActions = Game_Actor.prototype.clearActions;
Game_Actor.prototype.clearActions = function() {
    Zausen.FZ_SistemaCostes.Game_Actor.clearActions.call(this);
    if(this._RecamaraDeAccion) this._actionInputIndex = this._nuevaIndexPrevista; 
};


Game_Actor.prototype.paySkillItemsCost = function (skill) {
    for (var x = 0; x < skill.costeObjetos.length; x++) {
        var obj = skill.costeObjetos[x];
        var id = obj.id;
        var cantidad = obj.cantidad;
        var objeto = $dataItems[id]
        $gameParty.loseItem(objeto, cantidad, false);
    }
};

Game_Actor.prototype.canPaySkillItemsCost = function (skill) {
    for (var x = 0; x < skill.costeObjetos.length; x++) {
        var obj = skill.costeObjetos[x];
        var id = obj.id;
        var cantidad = obj.cantidad;
        var objeto = $dataItems[id]
        if (!$gameParty.hasItem(objeto, false) || $gameParty.numItems(objeto) < cantidad) return false;
    }

    return true;
};

Game_Actor.prototype.skillGoldCost = function (skill) {
    var costeP = 0;
    if (skill.costePOro > 0)
        costeP = Math.max(skill.minimoOro, Math.round($gameParty._gold * skill.costePOro));

    return skill.costeOro + costeP;
};

Game_Actor.prototype.canPaySkillGoldCost = function (skill) {
    return $gameParty._gold >= this.skillGoldCost(skill);
};

Game_Actor.prototype.paySkillGoldCost = function (skill) {
    $gameParty.loseGold(this.skillGoldCost(skill));
};

Zausen.FZ_SistemaCostes.Game_Actor.selectNextCommand = Game_Actor.prototype.selectNextCommand;
Game_Actor.prototype.selectNextCommand = function () {
    const action = this.action(this._actionInputIndex);
    if (action) {
        const item = action.item();
        if (item && DataManager.isSkill(item)) {
            this._reacondicionadorDeTurnos = Math.max(0, Math.min(item.costeTurnosAntes, this.numActions() - this._actionInputIndex - 1));
            var actual = this._actionInputIndex;
            this._actionInputIndex += item.costeTurnosAntes;
            for (var x = this._actionInputIndex; x > actual; x--) {
                if (this._actions[x]) this._actions.splice(x, 1);
            }
        }
    }
    return Zausen.FZ_SistemaCostes.Game_Actor.selectNextCommand.call(this);
};
/* ****************************************************************************************************************************************** 
************************************************************** Window_BattleLog *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.Window_BattleLog = Zausen.FZ_SistemaCostes.Window_BattleLog || {};

Window_BattleLog.prototype.mostrarTextoEsperaTurnoAntes = function (subject) {
    if (!subject || !subject._TextoEsperaAntes) return;
    let texto = subject._TextoEsperaAntes;
    const nombre = subject.name();
    const hab = subject._RecamaraDeAccion.item().name;
    texto = texto.format(nombre, hab);
    if (texto.indexOf("\\n") > 0) {
        var subTexto = texto.split("\\n");
        for (var x = 0; x < subTexto.length; x++) {
            this.push('addText', subTexto[x]);
        }
    } else {
        this.push('addText', texto);
    }
    this.push('wait');
    this.push("waitForNewLine");
    this.push("popBaseLine");

};

Zausen.FZ_SistemaCostes.Window_BattleLog.displayAffectedStatus = Window_BattleLog.prototype.displayAffectedStatus;
Window_BattleLog.prototype.displayAffectedStatusExtra = function (target) {
    Zausen.FZ_SistemaCostes.Window_BattleLog.displayAffectedStatus.call(this, target);
    this.push("wait");
    this.push("waitForNewLine");
    this.push("popBaseLine");
};
/* ****************************************************************************************************************************************** 
*************************************************************** BattleManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostes.BattleManager = Zausen.FZ_SistemaCostes.BattleManager || {};

BattleManager.clonarAction = function (subject, action) {
    subject._RecamaraDeAccion = new Game_Action(subject);
    subject._RecamaraDeAccion.setSkill(action.item().id);
    subject._RecamaraDeAccion._subjectActorId = action._subjectActorId;
    subject._RecamaraDeAccion._subjectEnemyIndex = action._subjectEnemyIndex;
    subject._RecamaraDeAccion._forcing = action._forcing;
    subject._RecamaraDeAccion._targetIndex = action._targetIndex;
};

Zausen.FZ_SistemaCostes.BattleManager.processTurn = BattleManager.processTurn;
BattleManager.processTurn = function () {
    var action = null;
    if (this._subject._RecamaraDeAccion && this._subject.puedeUsarRecamaraDeAccion()) this._subject.setAction(0, this._subject._RecamaraDeAccion);
    action = this._subject.currentAction();
    var item = action ? action.item() : null;
    if (item && DataManager.isSkill(item) && item.costeTurnosAntes
        && item.costeTurnosAntes > Math.max(0, this._subject._reacondicionadorDeTurnos) && !this._subject._TurnosConsumidos) {
        this._subject.useItem(item);
        this.clonarAction(this._subject, action);
        this._subject.removeCurrentAction();
        this._phase = "action";
    } else {
        Zausen.FZ_SistemaCostes.BattleManager.processTurn.call(this);
    }
};
Zausen.FZ_SistemaCostes.BattleManager.startAction = BattleManager.startAction;
BattleManager.startAction = function () { 
    Zausen.FZ_SistemaCostes.BattleManager.startAction.call(this);
    this._subject.cancelarEspera();
};

Zausen.FZ_SistemaCostes.BattleManager.displayBattlerStatus = BattleManager.displayBattlerStatus;
BattleManager.displayBattlerStatus = function (battler, current) {
    Zausen.FZ_SistemaCostes.BattleManager.displayBattlerStatus.call(this, battler, current)
    if (current && battler._TurnosEsperaPrevia >= 1) this._logWindow.mostrarTextoEsperaTurnoAntes(battler);
};

BattleManager.invokeAddedStatesReward = function (target) {
    if (!target._recamaraDeEstados) return;
    const btl_W = this._logWindow;
    target._recamaraDeEstados.forEach((estado) => {
        var mostrar = target.isStateAddable(estado);
        target.addState(estado);
        if (mostrar) btl_W.displayAffectedStatusExtra(target);

    });
    target._recamaraDeEstados = null;
};

Zausen.FZ_SistemaCostes.BattleManager.invokeNormalAction = BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction = function (subject, target) {
    Zausen.FZ_SistemaCostes.BattleManager.invokeNormalAction.call(this, subject, target);
    this.invokeAddedStatesReward(subject);
};

