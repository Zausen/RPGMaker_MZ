var Zausen = Zausen || {};
Zausen.FZ_SistemaCostes = Zausen.FZ_SistemaCostes || {};
/*:
 * @target MZ
 * @plugindesc Aumenta las posibilidades de pago de las habilidades.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaCostes.js
 *
 * Este plugin crea nuevas formas de costes.
 *
 * Para ello hay que ir a las notas de la habilidad y colocar COSTE {}
 * 
 * Entre las llaves podemos poner una serie de claves que nos permitirán 
 * realizar estos cambios:
 * PM: --> Puntos de magia. (Sólo porcentajes )
 * PV: --> Puntos de vida.
 * PT: --> Puntos de técnica. (Sólo porcentajes )
 * PVMIN: --> Coste mínimo de PV.
 * PMMIN: --> Coste mínimo de PM.
 * PTMIN: --> Coste mínimo de PT
 * MON:--> Dinero (Sólo valores fijos o porcentajes del montante actual)
 * MONMIN: --> Coste mínimo de dinero 
 * Después de estas clausulas, debemos colocar un número que será la cantidad.
 * Además, si después del número ponemos el símbolo de porcentaje (%) 
 * estaremos diciendo que va a costar un porcentaje del valor actual.
 * Y si tras el porcentaje colocamos una M, estaremos diciendo que en 
 * vez del actual, estamos hablando del valor máximo del usuario.
 * Es importante que cada grupo no tenga espacios de separación.
 * Ejemplo:
 * COSTE{
 *      PM:26%M costará un 26% del pm máximo.
 *      PT:15% costará un 15% de los pt acumulados.
 *      PTMIN:10 costará como mínimo 10 pt.
 *      PV:200 costará 200 pv.
 *      PV:5% costará el 5% de pv actual (se acumula junto con el valor fijo de arriba)
 *      MON:150  costará 150 monedas (oro o como llames a tu moneda)
 *  
 * }
 * Se pueden colocar comentarios con un espacio de separación sin 
 * ningún problema pero como se puede apreciar, cada nodo está protegido.
 *  (Si algún grupo no está bien, no se tendrá en cuenta.)
 * 
 * Además hay algunos aspectos especiales en los costes:
 * TURNO: --> Turnos de espera antes de lanzar. (El turno de lanzamiento
 *  se cuenta como 1).
 * Seguido, igual que en los anteriores, se espera un número con el valor 
 * de los turnos que habrá que esperar.
 * Después podemos colocar dos apostrofes (') para escribir un mensaje que 
 * saldrá mientras esté esperando. (queda así '') y el mensaje deberá cerrarse 
 * igual. 
 * Un ejemplo:
 * COSTE{
 * TURNO:2''Está cargando un ataque muy fuerte''
 * }
 * Tras dos turnos de espera (suyos) lanzará la habilidad. y cada vez que 
 * espere saldrá el mensaje de ''Está cargando un ataque muy fuerte'', 
 * también puedes agregar \n para incluir un salto de línea. (o varios) 
 * 
 * También podemos solicitar que se posea en el inventario una serie de 
 * objetos (Que serán consumidos) para realizar la habilidad:
 * OBJETOS: --> Objetos necesarios.
 * Tras esto se deben colocar la ID de cada objeto, separados por una 
 * coma(,). Esto significa que costará un objeto de cada uno que pongamos.
 * Si después de cada  (antes de la coma) ponemos un guión (-) y otro 
 * número, cambiaremos el montante necesario.
 * Ejemplo:
 * COSTE{
 * OBJETOS:1,3-8,5 costará una unidad del objeto 1, ocho del objeto 3 y una
 *  del objeto 5.
 * }
 * 
 * Y por último tenemos lo
 * ESTADOS: --> Estados alterados que el usuario debe sufrir o que recibirá 
 * por usar la habilidad...
 * Igual que con los objetos colocaremos las id de lso estados separados por 
 * una coma (Esta vez no hay cantidades, así que nada de guiones).
 * Para terminar, si después de cada estado (antes de la coma) ponemos una R, 
 * estaremos diciendo que recibirá el estado alterado en vez de gastarlo para 
 * usar la habilidiad (al final la acción).
 * 
 * Ejemplo:
 * COSTE{
 * ESTADOS:10R,32 Necesitará (Y perderá) el estado 32, pero cuando termine, le afectará el estado 10.
 * }
 * 
 */
Zausen.FZ_SistemaCostes.Regex = {//gi
    General: /COSTE[{]([\s\S]*?)[}]/i,
    IntGeneral: /([A-Z]{2,})[:](\d{1,}|[M])([%D]([M]|)|)/gi,
    IntEspecial: /(ESTADOS|OBJETOS)[:]([0-9-,R]{1,})[\s]/gi,
    IntTurno: /TURNO[:](\d{1,})(([']{2}([\S ]*?)[']{2})|)/i,
    CorteEspecial: /(\d{1,})([-](\d{1,2})|[R]|)/gi,

};

Zausen.FZ_SistemaCostes.Etiquetas = {
    PM: 'PM',
    PT: 'PT',
    PV: 'PV',
    PVMIN: 'PVMIN',
    PMMIN: 'PMMIN',
    PTMIN: 'PTMIN',
    OBJ: 'OBJETOS',
    EST: 'ESTADOS',
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

