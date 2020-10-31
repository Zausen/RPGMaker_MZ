var Zausen = Zausen || {};
Zausen.FZ_SistemaDesvioPV = Zausen.FZ_SistemaDesvioPV || {};
/*:
 * @target MZ
 * @plugindesc Desvía el daño de PV recibido.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaDesvioPV.js
 *
 * Este plugin permite desvíar el daño de PV al PM o al PT e incluso a sí mismo.
 * 
 * Se debe aplicar a las notas de: Personajes, Clases, Armas, Armaduras, 
 * Enemigos y Estados.
 * 
 * La etiqueta que englobará todo es: DESVIOPVFORMULA{}. Esto puede repetirse 
 * varias veces, pero sólo tendrá efecto el primero que cumpla los requisitos 
 * por cada elemento. (1 por el personaje, 1 por la clase, 1  por cada elemento 
 * equipado y 1 por cada estado alterado).
 * 
 * Dentro de DESVIOPVFORMULA tenemos las siguientes opciones:
 * 
 * APM:N para desviar el daño a los puntos de magia.
 * APT:N para desviar el daño a los puntos de técnica.
 * APV:N para redesviar el daño a los pv (Si, a sí mismo).
 * 
 * donde N puede ser un número positivo(sin signo) o un número negativo,
 * además este número puede ser un porcentage (con el símbolo de «%» después del 
 * número) y también puede aplicarse de forma normal o adicionalmente (con una 
 * «A» al final).
 * 
 * Que el número sea negativo hace que el desvio sea inverso a la naturaleza del 
 * daño, es decir, si es daño de PV y el desvio es al PM, en vez de perder PM, 
 * los ganará, por el contrario, si el daño es de recuperación de PV, en vez de 
 * recuperar los PM los dañará.
 * 
 * La distribución del daño prioriza en el siguiente orden:
 * 1º se ataca a los PM, luego a los PT y finalmente lo que queda es para los 
 * PV.
 * 
 * Ejemplo1:
 * 
 * DESVIOPVFORMULA{
 *      APM:100 
 * } Cada vez que el usuario reciba daño o curación, primero el efecto se 
 * desviará a los PM, cuando lleguen a 0 o al máximo si es curación, lo que 
 * reste irá de forma normal. (es decir, si recibe 120 de daño y tiene 100 
 * de pm, sólo recibirá 20 de daño, si por el contrario se fuera a curar 120 
 * y su máximo fuera de 200, sólo se curará 20).
 * 
 * Ejemplo2:
 * DESVIOPVFORMULA{
 *      APT:25%
 *      APT:30A
 * } //hasta un 25% del daño lo sufrirán los PT (si es posible) y el resto del 
 * daño lo sufrirá en el PV (Ya que no hay mmás condiciones.)Además, si o sí 
 * recibirá 30 puntos de daño en los PT.
 * 
 * Ejemplo3:
 * DESVIOPVFORMULA{
 *      APM:-5%A
 * } Cada vez que sufra daño, el 5% del daño sufrido lo ganará en forma de PM, 
 * pero cuando se cure perderá esa cantidad., como es adicional, no se resta 
 * al valor del daño.
 * 
 * Además a se pueden añadir las etiquetas CONDICION:¿? y CONDICIONE:¿? que 
 * ayduan a decidir cuándo tendrá efecto (Entre los interrogantes debe ir 
 * nuestra pregunta):
 * Ejemplo (Y a continuación se explica):
 * DESVIOPVFORMULA{
 *      APT:25%
 *      APT:30A
 *      CONDICION:¿TH = 1 Y TG = 2?
 *      CONDICIONE:¿4 Y 5 Y t.hp > 50?
 * } Este desvio de PV sólo se efectuará cuando el ataque recibido sea de tipo 
 * de habilidad Magia y tipo de golpe mágico (por lo que ya no es efectivo con 
 * objetos)
 * Además si sufre estado alterado 4 (supongamos coincide con VENENO) y 5 
 * (Supongamos coincide con CEGERA) y su vida es mayor que 50, los atributos 
 * también seguirán está vía. (sólo los que afecten a recuperación de PV de 
 * algún tipo, así como los efectos en caso de habilidades).
 * 
 * Las condiciones siguen un poco el mismo funcionamiento que la Fórmula de 
 * Daño de habilidades y objetos, la diferencia es que el resultado de la 
 * pregunta debe poder responderse con «Sí, No, Verdadero o Falso», si no 
 * pueden responder eso, no se aplicarán. 
 * 
 * Para ello, además de los operadores matemáticos básicos, los cuales siguen 
 * siendo usables, tenemos los siguientes operadores lógicos:
 * 
 * =        :Sirve para comparar dos cosas, dice que lo de la izquierda debe ser igual a lo de la derecha.
 * !=       :Especifica lo opuesto al igual, es decir, pide que lo de la izquierda sea distinto que lo de la derecha.
 * >        :lo de la derecha es mayor que lo de la izquierda.
 * <        :lo de la derecha es menor que lo de la izquierda.
 * >=       :lo de la derecha es mayor o igual que lo de la izquierda.
 * <=       :lo de la derecha es menor o igual que lo de la izquierda.
 * 
 * También para unir comparaciones tenemos
 * Y        : es para concatenar dos preguntas, por ejemplo TH = 1 Y TD = 2, es inclusivo (Se puede poner entre paréntesis para que sean combo)
 * O        : es para concatenar dos preguntas, por ejemplo EL = 3 O TG = 1, no es inclusivo, por lo que le valdrá correcto cualquiera de las dos preguntas (Se puede poner entre paréntesis para que sean combo)
 * Ejemplo «TH = 1 O TD = 2» ó «TH = 1 Y TD = 2» ó «(TH = 1 O TD = 2) O (TH = 1 Y TD = 2)» de forma que podemos hacer más complejas nuestras preguntas.
 * (la ultima de los tres ejemplos tiene que dar verdadero cualqueira de los dos paréntesis porque he usado O y he agrupado la parte de Y).
 * 
 * Para la etiqueta CONDICION tenemos las siguientes etiquetas:
 * 
 * TH       :Representa el valor del tipo de habilidad. (0 = nada, y el resto de valores está en el apartado Tipos, -1 es objeto. )
 * TG       :Reperesenta el tipo de golpe de la habidliad u objeto. (0 = golpe certero, 1 = ataque físico y 2 = ataque mágico)
 * TD       :Representa el tipo de daño (Nada = 0 y 6 es drenaje de PM). Cabe destacar que los desvíos sólo surten cuando se daña (o cura) los PV.
 * EL       :representa el tipo de elemento de la fórmula. (Nada = 0 y el resto de ids están en el apartado Tipos)
 * esEfect : no hace falta compararlo con nada, se responde solo. Es para comprobar si hablamos de un efecto o un atributo y que lo sea.
 * nEfect : no hace falta compararlo con nada, se responde solo. Es para comprobaro si hablamos de un efecto o un atributo y que no lo sea.
 * Para los objetos TH valdrá siempre -1.
 * 
 * 
 * Para la etiqueta CONDICIONE no tenemos las anteriores opciones, no obstante, si comparte con CONDICION las siguientes opciones:
 * ES:      :(idEstado, idEstado, idEstado) : Este representa los estados alterados, cada idEstado es para preguntar si posee este u otro. (Ej. es:(1,2)) (busca el primero que se posea).
 * val      : representa el daño original sufrido. Si es positivo significa que hará daño (sea del lugar que sea), si es negativo, significa que curará. (Venga de donde venga el daño)
 * t        : representa el usuario afectado por el daño(o curación)
 * Algunas de las opciones que hay son las siguientes:
                t.hp        : (Hit Points) o puntos de vida actuales.
                t.mp        : (Magic Points) o puntos de magia actuales.
                t.tp        : (Tactical Points) o puntos de técnica actuales.
                t.mhp       : (Maximum Hit Points) o puntos de vida máximos.
                t.mmp       : (Maximum Magic Points) o puntos de magia máximos.
                t.maxTp()   : (Maximum Tactical Points) o máximo puntos de técnica.
                t.atk       : (ATtacK power) o poder de ataque.
                t.def       : (DEFense power) o poder de defensa.
                t.mat       : (Magic ATtack power) o poder de ataque mágico.
                t.mdf       : (Magic DeFense power) o poder de defensa mágica. 
                t.agi       : (AGIlity) o agilidad.
                t.luk       : (LUcK) o suerte.
                t.hir       : (HIT rate) o tasa de acierto.
                t.eva       : (EVAsion rate) o tasa de evasión.
                t.cri       : (CRItical rate) o tasa de crítico.
                t.cev       : (Critical EVasion rate) tasa de evasión de crítico.
                t.mev       : (Magic EVasion rate) o tasa de evasión mágica.
                t.mrf       : (Magic ReFlection rate) o tasa de refracción mágica.
                t.cnt       : (CouNTer attack rate) o tasa de contraataque. 
                t.hrg       : (Hp ReGeneration rate) o tasa de regeneración de pv.
                t.mrg       : (Mp ReGeneration rate) o tasa de regeneracion de pm.
                t.trg       : (Tp ReGeneration rate) o tasa de regeneración de pt.
                t.tgr       : (TarGet Rate) o tasa de ser objetivo.
                t.grd       : (GuaRD effect rate) o tasa de efecto guardia.
                t.rec       : (RECovery effect rate) o tasa de recuperación de efectos.
                t.pha       : (PHArmacology) o farmacología.
                t.mcr       : (Mp Cost Rate) o tasa de coste de pm.
                t.tcr       : (Tp Charge Rate) o tasa de coste de pt.
                t.pdr       : (Physical Damage Rate) o tasa de daño físico.
                t.mdr       : (Magic Damage Rate) o tasa de daño mágico.
                t.fdr       : (Floor Damage Rate) o tasa de daño por pisar. 
                t.exr       : (EXperience Rate) o tasa de experiencia. 
                t.level     : (level) o nivel actual.


-------------------------------------------

Cabe destacar que por cada DESVIOPVFORMULA{} se pueden poner varios 
CONDICION:¿? y CONDICIONE:¿?, se escogerá por cada elemento
el primer desvio que cumpla al menos una condición o en caso de que sea un 
efecto o un atributo de PV el primer CONDICIONE que lo cumpla.

Nota: Si no hay ninguna CONDICION, se cumplicará siempre cuando se use una 
habilidad u objeto. Pero si no hay ninguna CONDICIONE, nuncase cumplirá
cuando se efectúe el atributo Recuperación de PV.
------------------------------Ejemplos prácticos----------------------------
--------------------Antinatura.
Se diseña un estado nuevo al que se le va a llamar Antinatura (Basado en 
Wakfu). Los daños de fuego curarán y las curaciones harán daño. 
Las recuperaciones y los envenenamientos también. 
(o sea, los efectos y atributos sobre los PV).

Para ello creo un estado es simple, me centro en las notas y escribo lo siguiente.
            DESVIOPVFORMULA{
                APV:-50% 
                APV:-10%A
                CONDICION:¿EL = 2 O TD = 3?
                CONDICIONE:¿es:(4,15)?
            }
En mi RPG el elemento 2 es fuego, mi estado 4 es veneno y mi estado 15 es 
recuperación de PV. Con el APV:-50% le quito al daño sufrido (o curado) 
la mitad y se lo sumará como su negativo, haciéndolo 0, y de forma adicional
le digo que el 10% en negativo se lo añada si o sí. Con las condiciones o el
tipo de elemento es Fuego o es una recuperación de PV se invierten los daños.
Con la segunda condición si sufre efectos del veneno se curará pero
si sufre efectos de Recuperación de PV se dañará.

--------------------Carga de maná por daño.
En este caso deseo una pasiva para uno de mis actores, quiero que sólo
cuando reciba daño (Y no le cure) recupere la mitad del daño sufrido
en forma de pm (pero no quiero que sufra menos daño).

PAra ello busco el actor que quiero que tenga la pasiva (o la clase)
y le meto en las notas lo siguiente:
            DESVIOPVFORMULA{
                APM:-50%A 
                CONDICION:¿val > 0? 
                CONDICIONE:¿val > 0?
            }
Recuperará PM igual al 50% del daño sufrido, pero no reducirá el daño
recibido, ya que al poner la A, estoy pidiendo que sea adicional.
Cabe destacar que si no es por la condición colocada, también perdería
puntos de magia cuando fuera a ser curado.

--------------------Protección de maná 1.
Otro estado donde el daño que reciba el usuario lo absorverán los pm siempre
que sea posible. (Sólo daño directo). También si el daño resulta curar,
recuperará pm. 

Se crea otro estado simple y se le pone nombre, me centro en las notas y 
escribo lo siguiente.
            DESVIOPVFORMULA{
                APM:50% 
                CONDICION:¿TD = 1 O TD = 5 O TH = -1? 
            }
Si el tipo de daño es de PV o de drenaje de PV, surtirá efecto y desviará el 50%
del daño a los pm. También pregunto si el tipo de habilidad es -1 (Que entonces es
un objeto). Como son O, con que se cumpla una de las tres condiciones es suficiente.
No hay CONDICIONE porque  en este caso no interesa que funcione con efectos pasivos, 
como veneno.

--------------------Protección de maná 2.

Otro estado donde el daño que reciba el usuario lo absorverán los pm siempre
que sea posible. (Sólo daño directo) y sólo el que venga de fórmulas. 

Se crea otro estado simple y se le pone nombre

Para ello creo un estado es simple, me centro en las notas y escribo lo siguiente.
            DESVIOPVFORMULA{
                APM:50% 
                CONDICION:¿nEfect Y val > 0? 
            }
La única manera de saber si el daño viene o no de la fórmula, es con nEfect o esEfect,
nEfect dice que no viene del apartado efectos, así que pregunto literalmente
¿no es de efectos y el daño es mayor que cero?. Cuando esto sea sí, entonces se
activará el escudo de maná y surtirá efecto.
No hay CONDICIONE porque  en este caso no interesa que funcione con efectos pasivos, 
como veneno.

--------------------Protección de maná 3.

Todo efecto directo sobre la vida desviará el 50% al pm. 
También los efectos pasivos.
Se crea otro estado simple y se le pone nombre

Para ello creo un estado es simple, me centro en las notas y escribo lo siguiente.
            DESVIOPVFORMULA{
                APM:50% 
                CONDICIONE:¿val != 0? 
            }
No hay ninguna condición porque quiero que se efectúe siempre.
Pero si he puesto una CONDICIONE ya que es necesario que haya algo para que se ejecute,
en este caso con que el valor del daño (o curación) a recibir sea distinto de cero me
basta y me sobra. por lo que el veneno dañará el pm pero la recuperación de pv lo
restaurará.
 */


Zausen.FZ_SistemaDesvioPV.Regex = {//gi
    general: /DESVIOPVFORMULA[{]([\s\S]*?)[}]/ig,
    aptmv: /(AP[TMV])[:]([-][1-9]\d{0,3}|[1-9]\d{0,3})([%]|)([A]|)/ig,
    condicionG: /CONDICION[:][¿]([\s\S]*?)[?]/ig,
    tOpciones: /[T][.](HP|MAXTP[(][)]|MP|TP|LEVEL|[A-Z]{3})/ig,
    estAlter: /es[:][(]([0-9,]*?)[)]/,
    condicionE: /CONDICIONE[:][¿]([\s\S]*?)[?]/ig
    //condicionE: /CONDICIONE[:][¿]([\n\t 0-9YO()/*+LEVHPMTAKDFGIUCRNX.\-]*?)[?]/ig
};


Zausen.FZ_SistemaDesvioPV.Etiquetas = {
    APM: 'APM',
    APT: 'APT',
    APV: 'APV',
    TH: 'TH',
    TG: 'TG',
    TD: 'TD',
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
        formula = formula.replace(/Y/ig, " && ");
        formula = formula.replace(/O/ig, " || ");
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
        let th = 1;
        let tg = 1;
        let td = 1;
        let el = 1;
        let es = [0, 1, 2, 3];
        let valO = 0;
        let esefect = false;
        let nefect = false;
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
        formula = formula.replace(/Y/ig, " && ");
        formula = formula.replace(/O/ig, " || ");
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
    const th = habilidad ? (habilidad.stypeId ?  habilidad.stypeId  : -1) : null; //en caso de un objeto, esto será nulo o undefined. (pero si es un objeto, será -1);
    const tg = habilidad ? habilidad.hitType : null;
    const td = habilidad ? habilidad.damage.type : null;
    const el = habilidad ? habilidad.damage.elementId : null; 
    const es = objetivo.statesId();
    const t = objetivo;
    const esefect = esEfect ? true : false; //puede venir nulo o undefined. Todo lo demás lo considero true.
    const nefect = !esefect;
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