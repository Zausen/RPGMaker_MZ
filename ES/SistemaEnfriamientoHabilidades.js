var Zausen = Zausen || {};
Zausen.FZ_SistemaEnfriamientoHabilidades = Zausen.FZ_SistemaEnfriamientoHabilidades || {};
/*:
 * @target MZ
 * @plugindesc Añade opciones de enfriamiento y uso limitado de habilidades durante el combate.
 * @author Fer Zacrón, test: Efímero
 *
 * @help SistemaEnfriamientoHabilidades.js
 * 
 * 
 * para usarlo hay que usar la etiqueta ENFRIAMIENTO{}
 * 
 * Dentro de las llaves podemos usar las siguientes etiquetas:
 * TURNOS:N (donde N es el número de turnos de enfriamiento)
 * TURNOS:N-M (donde N y M son el número mínimo y máximo de turnos, luego se ejecutará un número al azar entre ambos.)
 * USOS:N (Donde N es el número de veces por combate que se puede usar)
 * 
 * Ejemplo 1:
 * Enfriamiento{
 *  TURNOS:4
 * }
 * No podrá usar la habilidad hasta que no pasen 4 turnos.
 * Ejemplo 2:
 * Enfriamiento{
 *  TURNOS:0-10
 * }
 * Después de usar la habildiad, ésta permanecerá inactiva entre 0 y 10 turnos. (Depende del azar)
 * Ejemplo 3:
 * Enfriamiento{
 *  TURNOS:1-2
 * }
 * Después de usar la habidliad, ésta permanecerá inactiva entre 1 y 2 turnos. (Depende del azar)
 * 
 * Enfriamiento{
 *  USOS:3
 * }
 * cuando la habilidad se use tres veces, dejará de estar disponible durante esa batalla. 
 * 
 * TURNOS y USOS son compatibles, una habilidad además de usos limitados por combate, puede tener turnos de enfriamiento.
 * 
 * 
 * Los turnos de enfriamiento son completos y se ejecutan cada turno terminado (la ronda entera).
 *  * 
 */
Zausen.FZ_SistemaEnfriamientoHabilidades.Regex = {
    general : /ENFRIAMIENTO[{]([\s\S]*?)[}]/i,
    turnos: /TURNOS[:]([0-9]\d{0,1}[\-][1-9]\d{0,1}|[1-9]\d{0,1})/i,
    usos: /USOS[:]([+\-]\d{1,2}|\d{1,2})/i


};


Zausen.FZ_SistemaEnfriamientoHabilidades.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaEnfriamientoHabilidades.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaEnfriamientoHabilidades.BBDDCargada) { 
        Zausen.FZ_SistemaEnfriamientoHabilidades.BBDDCargada = true;
        Zausen.FZ_SistemaEnfriamientoHabilidades.InicializarHabilidades($dataSkills);
    }
    return true;
};

Zausen.FZ_SistemaEnfriamientoHabilidades.InicializarHabilidades = function(habilidades){
    for (var h = 0; h <= habilidades.length; h++) {
        if (!habilidades[h]) continue;
        var habilidad = habilidades[h];
        habilidad.enfriamiento = {minimo: 0, maximo : 0, usos: 0};
        let nota = habilidad.note;
        let conjunto = nota.match(Zausen.FZ_SistemaEnfriamientoHabilidades.Regex.general);
        if (conjunto) {
            Zausen.FZ_SistemaEnfriamientoHabilidades.aplicarTurnos(habilidad.enfriamiento, conjunto[1]);
            Zausen.FZ_SistemaEnfriamientoHabilidades.aplicarUsos(habilidad.enfriamiento, conjunto[1]); 
         }

    }
};

Zausen.FZ_SistemaEnfriamientoHabilidades.aplicarTurnos = function(enfriamiento,conjunto){
    let subconjunto = conjunto.match(Zausen.FZ_SistemaEnfriamientoHabilidades.Regex.turnos);
    if (subconjunto) { 
        let minMax = subconjunto[1].split('-');
        if(minMax.length <= 0) return;
        enfriamiento.minimo = parseInt(minMax[0]);
        enfriamiento.maximo = minMax.length == 2 ?  parseInt(minMax[1]) : enfriamiento.minimo;
        if(enfriamiento.minimo > enfriamiento.maximo){
            let conversor = enfriamiento.minimo;
            enfriamiento.minimo = enfriamiento.maximo;
            enfriamiento.maximo = conversor;
        }
     }
};


Zausen.FZ_SistemaEnfriamientoHabilidades.aplicarUsos = function(enfriamiento,conjunto){
    let subconjunto = conjunto.match(Zausen.FZ_SistemaEnfriamientoHabilidades.Regex.usos);
    if (subconjunto && !isNaN(subconjunto[1]))  enfriamiento.usos = parseInt(subconjunto[1]);
};
/* ****************************************************************************************************************************************** 
***************************************************************** Game_Actor ****************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor = Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor || {};

Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    this._habilidadesEnEnfriamiento = [];
    this._habilidadesAgotadas = [];
    this._enfriamientoPrevisto = null;
    this._agotamientoPrevisto = null;
    Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.initMembers.call(this);

};

Game_Actor.prototype.enfriamientoHabilidad = function(skill){
    if(!this.habilidadEnfriando(skill)) return 0;
    return this._habilidadesEnEnfriamiento[skill.id];
};

Game_Actor.prototype.reducirEnfriamiento = function(){
    let eliminar = [];
    this._habilidadesEnEnfriamiento.forEach((e,i) => {
        this._habilidadesEnEnfriamiento[i]--;
        if(this._habilidadesEnEnfriamiento[i] <= 0) eliminar.push(i);
    });
    eliminar.forEach(e => this._habilidadesEnEnfriamiento.splice(e,1));
};

Game_Actor.prototype.pagarUsosMaximosHabilidad = function(){
    if(!this._agotamientoPrevisto) return;
    if(!this._habilidadesAgotadas[this._agotamientoPrevisto.id]) this._habilidadesAgotadas[this._agotamientoPrevisto.id] = 0;
    this._habilidadesAgotadas[this._agotamientoPrevisto.id]++;
    this._agotamientoPrevisto = null;
};

Game_Actor.prototype.pagarEnfriamientoHabilidad = function(){
    if(!this._enfriamientoPrevisto || (this._enfriamientoPrevisto.minimo <= 0 && this._enfriamientoPrevisto.maximo <=0)) return;
    let min = this._enfriamientoPrevisto.minimo;
    let variacion = this._enfriamientoPrevisto.maximo-min;
    let sumatorio = Math.round(Math.random() * variacion);
    let resguardo =this._habilidadesEnEnfriamiento[this._enfriamientoPrevisto.id] ? this._habilidadesEnEnfriamiento[this._enfriamientoPrevisto.id] : 1; 
    this._habilidadesEnEnfriamiento[this._enfriamientoPrevisto.id] = min + sumatorio + resguardo; //Se le va a reducir ahora un turno o se acumula si habían varias acciones.
    this._enfriamientoPrevisto = null;
};

Game_Actor.prototype.habilidadAgotada = function(skill){
    return this._habilidadesAgotadas[skill.id] && this._habilidadesAgotadas[skill.id] >= skill.enfriamiento.usos;
};

Game_Actor.prototype.habilidadEnfriando = function(skill){
    return this._habilidadesEnEnfriamiento[skill.id] && this._habilidadesEnEnfriamiento[skill.id] > 0;
};

Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.canPaySkillCost = Game_Actor.prototype.canPaySkillCost;
Game_Actor.prototype.canPaySkillCost = function (skill) {
    return Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.canPaySkillCost.call(this, skill) && !this.habilidadEnfriando(skill) && !this.habilidadAgotada(skill);
};


Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function () {
    Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.refresh.call(this);
    if (this.isDead()){
        this._habilidadesEnEnfriamiento = [];
        this._enfriamientoPrevisto = null;
    } 
};

Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.paySkillCost = Game_Actor.prototype.paySkillCost;
Game_Actor.prototype.paySkillCost = function (skill) {
    Zausen.FZ_SistemaEnfriamientoHabilidades.Game_Actor.paySkillCost.call(this, skill);
    this.prepararEnfriamientoHabilidad(skill);
    this.prepararUsosMaximosHabilidad(skill);
};

Game_Actor.prototype.prepararEnfriamientoHabilidad = function(skill){
    if(skill.enfriamiento.minimo <= 0 && skill.enfriamiento.maximo <=0){
        this._enfriamientoPrevisto = null;
        return;
    }
    this._enfriamientoPrevisto = {minimo : skill.enfriamiento.minimo, maximo : skill.enfriamiento.maximo, id: skill.id};
};

Game_Actor.prototype.prepararUsosMaximosHabilidad = function(skill){
    if(skill.enfriamiento.usos <=0){
        this._agotamientoPrevisto = null;
        return; 
    } 
    this._agotamientoPrevisto = {id: skill.id};
};

/* ****************************************************************************************************************************************** 
***************************************************************** BattleManager *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager = Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager || {};

Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.endTurn = BattleManager.endTurn
BattleManager.endTurn = function() {
    $gameParty.battleMembers().forEach(b => b.reducirEnfriamiento());
    Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.endTurn.call(this);
};

Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.invokeNormalAction = BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction = function (subject, target) {
    Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.invokeNormalAction.call(this, subject, target);
    if(this._subject && this._subject.isActor()){
        this._subject.pagarUsosMaximosHabilidad();
        this._subject.pagarEnfriamientoHabilidad();
    }
};

Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    $gameParty.battleMembers().forEach(b => {
        b._habilidadesEnEnfriamiento = [];
        b._habilidadesAgotadas = [];  
    });
    Zausen.FZ_SistemaEnfriamientoHabilidades.BattleManager.endBattle.call(this, result);
};

/* ****************************************************************************************************************************************** 
***************************************************************** Window_SkillList *************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList = Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList || {};

Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList.drawItem = Window_SkillList.prototype.drawItem;
Window_SkillList.prototype.drawItem = function(index) {
    const skill = this.itemAt(index);
    Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList.drawItem.call(this, index);
    const costWidth = this.costWidth();
    const rect = this.itemLineRect(index); 
   if (skill && this._actor.habilidadEnfriando(skill)) this.drawItemEnfriando(this._actor.enfriamientoHabilidad(skill),  costWidth + rect.x, rect.y, rect.width- costWidth*2);
 
   
}; 
 Window_SkillList.prototype.drawItemEnfriando = function(enfriamiento, x, y, width){ 
    const intermedio = 50;
    const mitad1 = Math.round(width/2) - intermedio/2; 
    const mitad2 = width - mitad1;
    const h = this.lineHeight()-4 
    const c1 = ColorManager.transparent();
    const c2 = ColorManager.blackTranslucient();

    this.contents.gradientFillRect(x, y + 2, mitad1, h, c1, c2, false);
    this.contents.fillRect(x + mitad1, y + 2, intermedio, h, c2);
    this.contents.gradientFillRect(x + mitad1 + intermedio, y + 2, mitad2, h, c2, c1, false);
    this.changePaintOpacity(true);
    this.drawText(enfriamiento, x, y, width, "center");
};

Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList.includes = Window_SkillList.prototype.includes;
Window_SkillList.prototype.includes = function(item) {
    let respuesta = Zausen.FZ_SistemaEnfriamientoHabilidades.Window_SkillList.includes.call(this,item);
    if(DataManager.isSkill(item) && this._actor) respuesta &= !this._actor.habilidadAgotada(item);
    return respuesta; 
};


ColorManager.blackTranslucient = function () {
    return "rgba(0, 0, 0, 0.8)";
};

ColorManager.transparent = function () {
    return "rgba(0, 0, 0, 0)";
};




