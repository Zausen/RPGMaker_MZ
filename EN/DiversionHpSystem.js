var Zausen = Zausen || {};
Zausen.FZ_SistemaDesvioPV = Zausen.FZ_SistemaDesvioPV || {};
/*:
 * @target MZ
 * @plugindesc Desvía el daño de PV recibido.
 * @author Fer Zacrón, test: Efímero
 *
 * @help DiversionHpSystem.js
 *
 * With this plugin you can distribute the hp damage between mp, tp and hp 
 * (again).
 * 
 * This possibility is applicable in the notes of: Actors, Classes, 
 * Weapons, Armors, Enemies and States.
 * 
 * The main label is: FORMULADIVERSION{}. You can repeat this label as many
 * times as you wish but only one will result (The first to meet conditions
 * for each different thing)
 * 
 * Within FORMULADIVERSION we have the next options:
 * 
 * AMP:N To divert damage to magic points.
 * ATP:N To divert damage to tactical points.
 * AHP:N To divert damage to healt points(Yes, to itself).
 * 
 * Where N must be an integer number (unsigned or negative). Also this 
 * number can be a porcentage  (with the "%" symbol after the number) and
 * can also be applied normally or incrementlly with the letter "A" at the
 * end.
 * 
 * If the number is negative, it will make the diversion obtained negative. For
 * example if it is hp damage and it diverted the MP negatively, instead of 
 * taking damage, it will recover MP.
 * 
 * The diversion priority of (damage/recovery) is as next (in order): mp, tp and
 * finally hp.
 * 
 * Example1:
 * 
 * FORMULADIVERSION{
 *      AMP:100 
 * } For each time the user recieves damage or recovery, after the effect is 
 * diverted to magic points, when  it reaches zero or maximum, the debt will end 
 * normally. If I recieve 120 damage points and I have 300 mp... I will have 
 * 20 less hp and 100 less mp. But in the same case, if I only have 50 mp...
 * I will have 70 less hp and 0 mp.
 * 
 * Example2:
 * FORMULADIVERSION{
 *      ATP:25%
 *      ATP:30A
 * } Same as example 1 but with tp. Until 25% damage plus 30 fixed points (in 
 * all cases and always). 
 * 
 * Example 3:
 * FORMULADIVERSION{
 *      AMP:-5%A
 * } For each time that I recieve damage, the 5% (not diversion, its extra)
 * will increase to my current mp. (but when I would recover I will lose
 * the mp)
 * 
 * For adjust this effect we can use the conditions with the next sublabels:
 *  CONDITION:!? and CONDITIONE:!?
 * 
 * You can use multiple conditions, to use the effect it is only necessary 
 * to meet one of the conditions. (Between ! and ?)
 * 
 * Small example:
 * FORMULADIVERSION{
 *      ATP:25%
 *      ATP:30A
 *      CONDITION:!ST = 1 AND HT = 2?
 *      CONDITIONE:!4 AND 5 AND t.hp > 50?
 * } This will only happen when the skill tpe is magic and the hit type is
 * magic (for this, with items it will not happen) Also will happen (At the 
 * time of solving state effects.) if the actor is affected by states 4 and 
 * 5 and his health is higher than 50 points.
 * 
 * Conditions work to similary to formula input except that this returns a 
 * boolean value and formula input returns a numeric value. If you can 
 * answer your question "Yes, No, True or False" you are doing well.
 *
 * We have the math operators (+, -, *, /) and the next logical operators:
 * 
 * =        :The basic comparator, left equals right.
 * !=       :Opposite to =, left not equals right.
 * >        :Left less than right.
 * <        :Left greater than right.
 * >=       :Left greater than or equal to right.
 * <=       :Left less than or equal to right.
 * 
 * For fix comparations we have the next options:
 * AND      : The before expresion and the after expresion will be true or all is false.
 * OR       : The befores expresion or the after expresion will be true, all is true.
 * Example "ST = 1 OR DT = 2" or "ST = 1 AND DT = 2" or "(ST = 1 OR DT = 2) OR (ST = 1 AND DT = 2)" The complexity of your questions depends to you.
 * 
 * Only for CONDITION whe have the next labels: 
 * 
 * ST       :Represents the value of skill tipe. (0 is nothing and the others can be consulted in your configurations. -1 is equals Item)
 * HT       :Represents the value of hit type  (0 = certain hit, 1 = physical hit and 2 = magical hit)
 * DT       :Represents the damage type (0 = Nothing and 6 is mp drain).
 * EL       :Represents the element type (0 = nothing and the others can be consulted in your configurations)
 * isEffect :Not need comparator, selfanswer if is an effect or attribute.
 * nEffect  :Not need comparator, selfanswer opposite to isEffect. 
 * 
 * 
 * For the both labels conditions we have the next options: 
 * ES:(idState, idState, idState)   : Represent if this have some state between brackets. (Example: es:(1,2)) (search if actor is affected by state 1 or state 2).
 * val                              : Represents the initial damage. Positive for damage and negative for recovery.
 * t                                : Represent the target of damage/recovery.
 * Some options of target:
                t.hp        : (Hit Points)
                t.mp        : (Magic Points)
                t.tp        : (Tactical Points) 
                t.mhp       : (Maximum Hit Points) 
                t.mmp       : (Maximum Magic Points) 
                t.maxTp()   : (Maximum Tactical Points)
                t.atk       : (ATtacK power) 
                t.def       : (DEFense power)
                t.mat       : (Magic ATtack power) 
                t.mdf       : (Magic DeFense power) 
                t.agi       : (AGIlity) 
                t.luk       : (LUcK)
                t.hir       : (HIT rate) 
                t.eva       : (EVAsion rate) 
                t.cri       : (CRItical rate)
                t.cev       : (Critical EVasion rate) 
                t.mev       : (Magic EVasion rate) 
                t.mrf       : (Magic ReFlection rate) 
                t.cnt       : (CouNTer attack rate) 
                t.hrg       : (Hp ReGeneration rate) 
                t.mrg       : (Mp ReGeneration rate) 
                t.trg       : (Tp ReGeneration rate) 
                t.tgr       : (TarGet Rate) 
                t.grd       : (GuaRD effect rate) 
                t.rec       : (RECovery effect rate) 
                t.pha       : (PHArmacology) 
                t.mcr       : (Mp Cost Rate) 
                t.tcr       : (Tp Charge Rate) 
                t.pdr       : (Physical Damage Rate) 
                t.mdr       : (Magic Damage Rate)
                t.fdr       : (Floor Damage Rate) 
                t.exr       : (EXperience Rate) 
                t.level     : (level) 


-------------------------------------------

In case of multiples FORMULADIVERSION{} only will effect the first in
meet some condition. 

Warning: If FORMULADIVERSION{} not have conditions, always will be 
activate when is affected by skill or object but never by state effect.


------------------------------Practical examples----------------------------
--------------------Antinatura.
Desing a new state named "Antinatura" (Based on Wakfu videogame).
The target is that the fire damages will heal and  the recoverys 
will damage.
The recovery/damage effect from states too.

In the notes I write the next: 
            FORMULADIVERSION{
                AHP:-50% 
                AHP:-10%A
                CONDITION:!EL = 2 OR DT = 3?
                CONDITIONE:!es:(4,15)?
            }
In my RPG the element two is fire, my state number 4 is poison and the 15th is
"recovery HP". 
With the AHP:-50% I will convert the damage/recovery to zero.
In addition AHP:-10%A will add or substract the 10% of damage to the hp. 
(If I recivied 100 damage of fire, I will recovery 10 hp in place of
suffer the damage. If I recivied 100 recovery, I will suffer 10 ho in 
place of the recovery)
The CONDITIONE only is active with effect of states and CONDITION with 
effects of skills and items.

--------------------Mana charge per damage.
In this case, I wish a pasive skill for one of my actors.I want only this 
actor when he recieves damage, he recovers 50% of the damage as mp, but 
never when damage is recovery. I also don't want the actor to suffer less 
damage.


To do this, I write in the actor's note:
            FORMULADIVERSION{
                AMP:-50%A 
                CONDITION:!val > 0? 
                CONDITIONE:!val > 0?
            }
Thanks to "A" after -50% I'm sure the damage won't diversion and thanks to 
val> 0 in both conditions I'm sure this is only achieved when my actor suffers
damage

--------------------Mana shield I.
A state where damage will diversion to mp when possible from skills.

To do this, I  write in a new state:
            FORMULADIVERSION{
                AMP:50% 
                CONDITION:!TD = 1 O DT = 5 O ST = -1? 
            }
If the damage type is hp or drain hp or is an item then the 50% of damage will 
be diversion to mp. Because I don't use CONDITIONE, this never will be activated 
for a state effect.

--------------------Mana shield II.

Other shield of mana but only direct damage. 

In a state I write: 
            FORMULADIVERSION{
                AMP:50% 
                CONDITION:!nEfect AND val > 0? 
            }
In this case, if not is an effect AND the damage is damage.  
(only for formulas)

-------------------- Mana shield III

And the last example about of shields. 

Now the effect is when the damage is different from zero (on recoveries ir will 
heal mp and on damage it will lose mana)
            FORMULADIVERSION{
                AMP:50% 
                CONDITIONE:¿val != 0? 
            }
 */


Zausen.FZ_SistemaDesvioPV.Regex = {//gi
    general: /FORMULADIVERSION[{]([\s\S]*?)[}]/ig,
    aptmv: /(A[TMH]P)[:]([-][1-9]\d{0,3}|[1-9]\d{0,3})([%]|)([A]|)/ig,
    condicionG: /CONDITION[:][!]([\s\S]*?)[?]/ig,
    tOpciones: /[T][.](HP|MAXTP[(][)]|MP|TP|LEVEL|[A-Z]{3})/ig,
    estAlter: /es[:][(]([0-9,]*?)[)]/,
    condicionE: /CONDITIONE[:][!]([\s\S]*?)[?]/ig
};


Zausen.FZ_SistemaDesvioPV.Etiquetas = {
    APM: 'AMP',
    APT: 'ATP',
    APV: 'AHP',
    TH: 'ST',
    TG: 'HT',
    TD: 'DT',
    EL: 'EL',
    PC: '%',
    A: 'A',
    OBJETQ: ['level', 'hp', 'mp', 'tp', 'mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk', 'hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg', 'tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr']
};

/* ****************************************************************************************************************************************** 
***************************************************************** DataManager ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaDesvioPV.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaDesvioPV.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaDesvioPV.BBDDCargada) {
        Zausen.FZ_SistemaDesvioPV.BBDDCargada = true;
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataActors);
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataEnemies); 
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataClasses);
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataStates); 
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataWeapons);
        Zausen.FZ_SistemaDesvioPV.Inicializar($dataArmors);
    }
    return true;
};
Zausen.FZ_SistemaDesvioPV.InicializarComponente = function (componente) {
    componente.desvioPV = [];
};

Zausen.FZ_SistemaDesvioPV.ContenedorTipoDesvio = function () {
    return {
        activo: false,
        valorFijo: 0,
        fijoAdicional: 0,
        valorPorcentual: 0,
        porcentualAdicional: 0
    };
};

Zausen.FZ_SistemaDesvioPV.ContenedorDesvioPv = function () {
    return {
        aPM: null,
        aPT: null,
        aPV: null,
        condiciones: [],
        condicionesEstados: []
    };
};
Zausen.FZ_SistemaDesvioPV.CombinarTipoEfecto = function (tipoE, incluible) {
    if (!tipoE) {
        return incluible;
    } else {
        tipoE.valorFijo += incluible.valorFijo;
        tipoE.valorFijo += incluible.fijoAdicional;
        tipoE.valorPorcentual += incluible.valorPorcentual;
        tipoE.porcentualAdicional += incluible.porcentualAdicional;
        return tipoE;
    }
};
Zausen.FZ_SistemaDesvioPV.AplicarEfectos = function (efectos, contenido) {
    let subconjunto;
    while (subconjunto = Zausen.FZ_SistemaDesvioPV.Regex.aptmv.exec(contenido)) {
        if (!subconjunto) continue;
        let tipo = subconjunto[1].toUpperCase();
        let valor = subconjunto[2];
        if (valor && !isNaN(valor)) valor = parseInt(valor);
        let esP = subconjunto[3] && subconjunto[3].toUpperCase() == Zausen.FZ_SistemaDesvioPV.Etiquetas.PC;
        let esA = subconjunto[4] && subconjunto[4].toUpperCase() == Zausen.FZ_SistemaDesvioPV.Etiquetas.A;
        if (esP) valor /= 100;
        let incluible = Zausen.FZ_SistemaDesvioPV.ContenedorTipoDesvio();
        incluible.activo = true;
        incluible.valorFijo = !esP && !esA ? valor : 0;
        incluible.fijoAdicional = !esP && esA ? valor : 0;
        incluible.valorPorcentual = esP  && !esA? valor : 0;
        incluible.porcentualAdicional = esP && esA ? valor : 0;
        switch (tipo) {
            case Zausen.FZ_SistemaDesvioPV.Etiquetas.APM:
                efectos.aPM = Zausen.FZ_SistemaDesvioPV.CombinarTipoEfecto(efectos.aPM, incluible);
                break;
            case Zausen.FZ_SistemaDesvioPV.Etiquetas.APT:
                efectos.aPT = Zausen.FZ_SistemaDesvioPV.CombinarTipoEfecto(efectos.aPT, incluible);
                break;
            case Zausen.FZ_SistemaDesvioPV.Etiquetas.APV:
                efectos.aPV = Zausen.FZ_SistemaDesvioPV.CombinarTipoEfecto(efectos.aPV, incluible);
                break;
        }
    }
};
Zausen.FZ_SistemaDesvioPV.AplicarCondiciones = function (efectos, contenido) {
    let subconjunto;
    while (subconjunto = Zausen.FZ_SistemaDesvioPV.Regex.condicionG.exec(contenido)) {
        if (!subconjunto) continue;
        var formula = subconjunto[1].toLowerCase();
        formula = formula.trim().replace(/\n|[ ]|\t/g, "");
        formula = formula.replace(/AND/ig, " && ");
        formula = formula.replace(/OR/ig, " || ");
        formula = formula.replace(/[=]/g, " == ");
        formula = formula.replace(/[<][ ][=]{2}/g, " <=");
        formula = formula.replace(/[>][ ][=]{2}/g, " >=");
        formula = formula.replace(/[!][ ][=]{2}/g, " !=");
        let buscaEstados = null;
        let max = 100;
        do {
            buscaEstados = formula.match(Zausen.FZ_SistemaDesvioPV.Regex.estAlter);
            if (!buscaEstados) continue;
            let opciones = buscaEstados[1].split(',');
            let resultado = "";
            opciones.forEach(o => {
                if (resultado != "") resultado += " || ";
                resultado += "es.indexOf(" + o + ") >= 0"
            });
            formula = formula.replace(Zausen.FZ_SistemaDesvioPV.Regex.estAlter, "(" + resultado + ")");
        } while ((buscaEstados) && --max > 0);
        formula = formula.replace(/val/g, " valO ");
        formula = formula.replace(/[:][+][:]/ig, " valO > 0 ");
        formula = formula.replace(/[:][-][:]/ig, " valO < 0 ");
        let st = 1;
        let ht = 1;
        let dt = 1;
        let el = 1;
        let es = [0, 1, 2, 3];
        let valO = 0;
        let iseffect = false;
        let neffect = false;
        let vali = formula.replace(Zausen.FZ_SistemaDesvioPV.Regex.tOpciones, 1);
        try {
            let validar = eval(vali);
            if (typeof (validar) === "boolean") efectos.condiciones.push(formula);
        } catch (ex) {
            console.log(subconjunto[1] + "\n" + " Está mal diseñada. Revísela por favor.");
        }
    }
};
Zausen.FZ_SistemaDesvioPV.AplicarCondicionesE = function (efectos, contenido) {
    let subconjunto;
     while (subconjunto = Zausen.FZ_SistemaDesvioPV.Regex.condicionE.exec(contenido)) {
        if (!subconjunto) continue;
        var formula = subconjunto[1].toLowerCase();
        formula = formula.trim().replace(/\n|[ ]|\t/g, "");
        formula = formula.replace(/AND/ig, " && ");
        formula = formula.replace(/OR/ig, " || ");
        formula = formula.replace(/[=]/g, " == ");
        formula = formula.replace(/[<][ ][=]{2}/g, " <=");
        formula = formula.replace(/[>][ ][=]{2}/g, " >=");
        formula = formula.replace(/[!][ ][=]{2}/g, " !=");
        let buscaEstados = null;
        let max = 100;
         do {
            buscaEstados = formula.match(Zausen.FZ_SistemaDesvioPV.Regex.estAlter);
            if (!buscaEstados) continue;
            let opciones = buscaEstados[1].split(',');
            let resultado = "";
            opciones.forEach(o => {
                if (resultado != "") resultado += " || ";
                resultado += "es.indexOf(" + o + ") >= 0"
            });
            formula = formula.replace(Zausen.FZ_SistemaDesvioPV.Regex.estAlter, "(" + resultado + ")");
        } while ((buscaEstados) && --max > 0);
        formula = formula.replace(/[:][+][:]/ig, " valO > 0 ");
        formula = formula.replace(/[:][-][:]/ig, " valO < 0 ");
        formula = formula.replace(/val/g, " valO ");
        let es = [0, 1, 2, 3];
        let valO = 0; 
        try {
            let validar = eval(formula.replace(Zausen.FZ_SistemaDesvioPV.Regex.tOpciones, 1));
            if (typeof (validar) === "boolean") efectos.condicionesEstados.push(formula);
        } catch (ex) {
            console.log(subconjunto[1] + "\n" + " Está mal diseñada. Revísela por favor.");
        }
    }
};

Zausen.FZ_SistemaDesvioPV.Inicializar = function (componentes) {
    for (let x = 0; x <= componentes.length; x++) {
        var comp = componentes[x];
        if (!comp) continue;
        Zausen.FZ_SistemaDesvioPV.InicializarComponente(comp);
        let nota = comp.note;
        let conjunto;
        while (conjunto = Zausen.FZ_SistemaDesvioPV.Regex.general.exec(nota)) { 
            if (!conjunto || !conjunto[1]) continue;
            let contenido = conjunto[1];
            var desvio = Zausen.FZ_SistemaDesvioPV.ContenedorDesvioPv();
            Zausen.FZ_SistemaDesvioPV.AplicarEfectos(desvio, contenido);
            if (!desvio.aPM && !desvio.aPT && !desvio.aPV) continue;
            Zausen.FZ_SistemaDesvioPV.AplicarCondiciones(desvio, contenido);
            Zausen.FZ_SistemaDesvioPV.AplicarCondicionesE(desvio, contenido);
            comp.desvioPV.push(desvio);
        }
    }
};

Zausen.FZ_SistemaDesvioPV.UnificarDesviosDanno = function (valO, habilidad, objetivo, grupoDeGruposDesvios, esEfect) {
    const st = habilidad ? (habilidad.stypeId ?  habilidad.stypeId  : -1) : null; //en caso de un objeto, esto será nulo o undefined. (pero si es un objeto, será -1);
    const ht = habilidad ? habilidad.hitType : null;
    const dt = habilidad ? habilidad.damage.type : null;
    const el = habilidad ? habilidad.damage.elementId : null; 
    const es = objetivo.statesId();
    const t = objetivo;
    const iseffect = esEfect ? true : false; //puede venir nulo o undefined. Todo lo demás lo considero true.
    const neffect = !esefect;
    const mult = valO > 0 ? 1 : -1; //Según el valor original, debe invertirse el resto de opciones para que vayan en la misma línea y se comporten igual.

    let unificador = {
        aPM: null,
        aPT: null,
        aPV: null
    };
    for (let gdgd = 0; gdgd < grupoDeGruposDesvios.length; gdgd++) {
         let grupoDesvios = grupoDeGruposDesvios[gdgd];
         for (let x = 0; x < grupoDesvios.length; x++) {
             let desvi = grupoDesvios[x];
            let condiciones = habilidad ? desvi.condiciones : desvi.condicionesEstados;
            let cumple = habilidad ? true : false; //Si la habilidad no tiene condiciones se cumple siempre, pero si hablamos de efectos pasivos, por defecto estará a false.
            for (let c = 0; c < condiciones.length; c++) {
                
                cumple = eval(condiciones[c]);
                if (cumple) break;
            }
            if (!cumple) continue; //este desvío ya no se cumple.  
            unificador.aPM = Zausen.FZ_SistemaDesvioPV.MezclarDesviosDanno(unificador.aPM, desvi.aPM, mult);
            unificador.aPT = Zausen.FZ_SistemaDesvioPV.MezclarDesviosDanno(unificador.aPT, desvi.aPT, mult);
            unificador.aPV = Zausen.FZ_SistemaDesvioPV.MezclarDesviosDanno(unificador.aPV, desvi.aPV, mult);

            break; //Una vez se ha encontrado qué aplicar, se pasa al siguiente objeto, no hace falta seguir.
        }
    }
    if (unificador.aPM == null && unificador.aPT == null && unificador.aPV == null) return null;
    return unificador

};
Zausen.FZ_SistemaDesvioPV.MezclarDesviosDanno = function (total, agregado, mult) {
    if (!total) total = {
        valorFijo: 0,
        fijoAdicional: 0,
        valorPorcentual: 0,
        porcentualAdicional: 0
    };
    if (agregado == null) return total;
    total.valorFijo += (agregado.valorFijo * mult);
    total.fijoAdicional += (agregado.fijoAdicional * mult);
    total.valorPorcentual += (agregado.valorPorcentual * mult);
    total.porcentualAdicional += (agregado.porcentualAdicional * mult);
    return total;
};
Zausen.FZ_SistemaDesvioPV.DistribuidorDeDanno = function (valorOiginal, habilidad, grupoDeGruposDesvios, objetivo, esEfect) {
     if (valorOiginal == 0 || !grupoDeGruposDesvios || grupoDeGruposDesvios.length <= 0 || !objetivo) return null;
     let valO = valorOiginal;

    let hp = objetivo.hp;
    let mp = objetivo.mp;
    let tp = objetivo.tp;
    let mmp = objetivo.mmp;
    let mtp = objetivo.maxTp();

    let respuesta = {
        dhp: 0,
        dmp: 0,
        dtp: 0
    };
    let unificador = Zausen.FZ_SistemaDesvioPV.UnificarDesviosDanno(valO, habilidad, objetivo, grupoDeGruposDesvios, esEfect);
     
    if (unificador == null) return null;
    unificador.aPV.valorPorcentual *= Math.abs(valorOiginal);
    unificador.aPV.porcentualAdicional *= Math.abs(valorOiginal);
    unificador.aPM.valorPorcentual *= Math.abs(valorOiginal);
    unificador.aPM.porcentualAdicional *= Math.abs(valorOiginal);
    unificador.aPT.valorPorcentual *= Math.abs(valorOiginal);
    unificador.aPT.porcentualAdicional *= Math.abs(valorOiginal);
    let dmp = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDannoPA(mp, valO, unificador.aPM.valorFijo + unificador.aPM.valorPorcentual, unificador.aPM.fijoAdicional + unificador.aPM.porcentualAdicional, mmp);
    let dtp = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDannoPA(tp, dmp.valorDActual, unificador.aPT.valorFijo + unificador.aPT.valorPorcentual, unificador.aPT.fijoAdicional + unificador.aPT.porcentualAdicional, mtp);
    let dhp = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDannoPA(hp, dtp.valorDActual, unificador.aPV.valorFijo + unificador.aPV.valorPorcentual, unificador.aPV.fijoAdicional + unificador.aPV.porcentualAdicional, 999999);
    respuesta.dmp = dmp.valorRetorno;
    respuesta.dtp = dtp.valorRetorno;
    respuesta.dhp = dhp.valorRetorno + dhp.valorDActual;
    return respuesta;
};
Zausen.FZ_SistemaDesvioPV.DistribuidorDeDannoPA = function (pA, valorDActual, valor, valorA, maxPa) {
    let respuesta = {
        valorRetorno: valorA, //Siempre presente, será sumado siempre.
        valorDActual: 0 //Hay que ver el resultado al final 
    };

    if (valorDActual == 0) return respuesta;
    let valorDA = valorDActual;
    let val = valor;
    multV = (val < 0 ? -1 : 1);
    multDa = (valorDA < 0 ? -1 : 1);
    //se verifica el valor máximo para ser absorvido. 
    if (Math.abs(val) > Math.abs(valorDA)) val = Math.abs(valorDA) * multV; //no se puede abosrver más del daño Actual. 
    //ahora se limita la absorción por sobrecarga e infracarga.
    //  Infracarga, cuando se baja de 0. Se comprueba que incluso con la sobrecarga de valorA no baja de 0.  
    if ((pA - val) < 0 && (pA - (val + valorA)) < 0) val = pA * multV;
    
    //  Sobrecarga, cuando sube del máximo. Se comprueba que incluso con la infracarga de valorA no sube del máximo
    if ((pA - val) > maxPa && (pA - (val + valorA)) > maxPa) val = (maxPa - pA) * multV;
    //Una vez limitado el valor del daño absorvible... se resta al daño.
    respuesta.valorDActual = (Math.abs(valorDA) - Math.abs(val)) * multDa;
    respuesta.valorRetorno += val;
    respuesta.valorDActual = Math.round(respuesta.valorDActual);
    respuesta.valorRetorno = Math.round(respuesta.valorRetorno);
    return respuesta;
};


/* ****************************************************************************************************************************************** 
************************************************************** Game_BattlerBase *************************************************************
*********************************************************************************************************************************************/

Game_BattlerBase.prototype.desvios = function () {
    let estados = this.states().filter(est => est.desvioPV.length > 0); 
    if (!estados) return [];
    return estados.map(est => est.desvioPV);
};

Game_BattlerBase.prototype.statesId = function () {
    return this._states.map(id => parseInt(id));
};


/* ****************************************************************************************************************************************** 
***************************************************************** Game_Enemy ****************************************************************
*********************************************************************************************************************************************/

Game_Enemy.prototype.desvios = function () {
    let desvBase = Game_BattlerBase.prototype.desvios.call(this);
    if (this.enemy().desvioPV.length <= 0) return desvBase;
    return desvBase.concat([this.enemy().desvioPV]);
};

/* ****************************************************************************************************************************************** 
***************************************************************** Game_Actor ****************************************************************
*********************************************************************************************************************************************/
Game_Actor.prototype.desvios = function () {
    let desvBase = Game_BattlerBase.prototype.desvios.call(this);
    if (this.actor().desvioPV.length > 0) desvBase = desvBase.concat([this.actor().desvioPV]);
    if (this.currentClass().desvioPV.length > 0) desvBase.concat([this.currentClass().desvioPV]);

    let desvEquipo = this.equips().filter(eq => eq).map(eq => eq.desvioPV).filter(eq => eq.length > 0);
    if (desvEquipo && desvEquipo.length > 0) desvBase.concat(desvEquipo);
    return desvBase;
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Action ***************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaDesvioPV.Game_Action = Zausen.FZ_SistemaDesvioPV.Game_Action || {};

Zausen.FZ_SistemaDesvioPV.Game_Action.executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function (target, value) {
    let nuevoValor = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDanno(value, this.item(), target.desvios(), target);
    if (nuevoValor == null) {
        Zausen.FZ_SistemaDesvioPV.Game_Action.executeHpDamage.call(this, target, value);
        return;
    }
    if (nuevoValor.dhp != 0 || (nuevoValor.dhp === 0 && nuevoValor.dmp === 0 && nuevoValor.dtp === 0)) Zausen.FZ_SistemaDesvioPV.Game_Action.executeHpDamage.call(this, target, nuevoValor.dhp);
    if (nuevoValor.dmp != 0) target.gainMp(-nuevoValor.dmp);
    if (nuevoValor.dtp != 0) target.gainTp(-nuevoValor.dtp);
    this.makeSuccess(target);
};


Zausen.FZ_SistemaDesvioPV.Game_Action.itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value); 
    let nuevoValor = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDanno(-value, this.item(), target.desvios(), target, true);
    if (nuevoValor == null) {
        Zausen.FZ_SistemaDesvioPV.Game_Action.itemEffectRecoverHp.call(this, target, effect);
        return;
    }
    //Como en este caso no es daño, es recuperación, los valores no se cambian de signo.
    if (nuevoValor.dhp != 0 || (nuevoValor.dhp === 0 && nuevoValor.dmp === 0 && nuevoValor.dtp === 0)) target.gainHp(-nuevoValor.dhp);
    if (nuevoValor.dmp != 0) target.gainMp(-nuevoValor.dmp);
    if (nuevoValor.dtp != 0) target.gainTp(-nuevoValor.dtp);
    if (nuevoValor.dhp != 0 || nuevoValor.dmp != 0 || nuevoValor.dtp != 0) this.makeSuccess(target);

};

/* ****************************************************************************************************************************************** 
************************************************************** Game_BattlerBase *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaDesvioPV.Game_Battler = Zausen.FZ_SistemaDesvioPV.Game_Battler || {};

Zausen.FZ_SistemaDesvioPV.Game_Battler.regenerateHp = Game_Battler.prototype.regenerateHp;
Game_Battler.prototype.regenerateHp = function () {
    const minRecover = -this.maxSlipDamage();
    const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
    let nuevoValor = Zausen.FZ_SistemaDesvioPV.DistribuidorDeDanno(-value, null, this.desvios(), this);
    if (nuevoValor == null) {
        Zausen.FZ_SistemaDesvioPV.Game_Battler.regenerateHp.call(this);
        return;
    }
    //Como en este caso no es daño, es pasivo, los valores no se cambian de signo.
    if (nuevoValor.dhp != 0 || (nuevoValor.dhp === 0 && nuevoValor.dmp === 0 && nuevoValor.dtp === 0)) this.gainHp(-nuevoValor.dhp);
    if (nuevoValor.dmp != 0) this.gainMp(-nuevoValor.dmp);
    if (nuevoValor.dtp != 0) this.gainTp(-nuevoValor.dtp);
};