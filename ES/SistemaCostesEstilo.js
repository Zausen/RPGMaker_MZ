var Zausen = Zausen || {};
Zausen.FZ_SistemaCostesEstilo = Zausen.FZ_SistemaCostesEstilo || {};
/*:
 * @target MZ
 * @plugindesc (Opcional) Amplia y cambia la información en combate y menú de las habilidades. Necesita de SistemaCostes.
 * @author Fer Zacrón, test: Efímero
 *
 * @base SistemaCostes
 * @orderAfter SistemaCostes
 * 
 * @help SistemaCostesEstilo.js
 *
 * Este plugin, en combinación con el SistemaCostes basico cambia ligeramente 
 * el aspecto del menú de selección de habildiades tanto del sistema de batalla 
 * como del menú. 
 *
 * @param Texto Golpe Certero
 * @desc Texto para golpe certero.
 * @default Certero
 * 
 * @param Texto Ataque Fisico
 * @desc Texto para ataque físico.
 * @default Físico
 * 
 * @param Texto Ataque Magico
 * @desc Texto para ataque mágico.
 * @default Mágico
 * 
 * @param Imagenes Elementos
 * @desc separados por una coma y sin espacios las id de los iconos en orden de los elementos.
 * @default 78,64,65,66,67,68,69,70,71
 * 
 * @param Texto Coste General
 * @desc Texto general para la muestra de estadísticas en el menú
 * @default Coste estadísticas: 
 * 
 * @param Texto Estados Necesarios
 * @desc Texto para enunciar los estados alterados necesarios del menú.
 * @default Estados necesarios: 
 * 
 * @param Texto Objetos Necesarios
 * @desc Texto para enunciar los objetos necesarios del menú.
 * @default Objetos necesarios:
 * 
 * @param Texto Tipo Habilidad
 * @desc Texto para enunciar el tipo de habilidad.
 * @default Tipo de habilidad: 
 *
 * @param Segundos Actualizacion Overlay
 * @desc Es el tiempo entre estados alterados que hay para mostrar sobre el personaje. (-1 o 0 para desactivar)
 * @default 3
 * 
 */
Zausen.FZ_SistemaCostesEstilo.PluginName = "SistemaCostesEstilo";
Zausen.FZ_SistemaCostesEstilo.PluginManager = PluginManager.parameters(Zausen.FZ_SistemaCostesEstilo.PluginName);
Zausen.FZ_SistemaCostesEstilo.Parametros = Zausen.FZ_SistemaCostesEstilo.Parametros || {};

Zausen.FZ_SistemaCostesEstilo.Parametros.TxtGolpeCertero = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Golpe Certero'] || '');//1
Zausen.FZ_SistemaCostesEstilo.Parametros.TxtAtaqueFisico = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Ataque Fisico'] || '');//2
Zausen.FZ_SistemaCostesEstilo.Parametros.TxtAtaqueMagico = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Ataque Magico'] || '');//3
Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Imagenes Elementos'] || '');//4
Zausen.FZ_SistemaCostesEstilo.Parametros.TextoCosteGeneral = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Coste General'] || '');//5
Zausen.FZ_SistemaCostesEstilo.Parametros.TextoEstadosNecesarios = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Estados Necesarios'] || '');//6
Zausen.FZ_SistemaCostesEstilo.Parametros.TextoObjetosNecesarios = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Objetos Necesarios'] || '');//7
Zausen.FZ_SistemaCostesEstilo.Parametros.TextoTipoHabilidad = String(Zausen.FZ_SistemaCostesEstilo.PluginManager['Texto Tipo Habilidad'] || '');//8
Zausen.FZ_SistemaCostesEstilo.Parametros.VueltasActualizacionOverlay = Number(Zausen.FZ_SistemaCostesEstilo.PluginManager['Segundos Actualizacion Overlay'] * 8 || -1);//8

Zausen.FZ_SistemaCostesEstilo.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Zausen.FZ_SistemaCostesEstilo.isDatabaseLoaded.call(this)) return false;
    if (!Zausen.FZ_SistemaCostesEstilo.BBDDCargada) {
        Zausen.FZ_SistemaCostesEstilo.BBDDCargada = true;
        if (Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos) {
            Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos = Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos.split(",").map(txt => txt.replace(/\s/g, ''));
        } else {
            Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos = null;
        }
    }
    return true;
};

/* ****************************************************************************************************************************************** 
***************************************************************** Scene_Battle **************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostesEstilo.Scene_Battle = Zausen.FZ_SistemaCostesEstilo.Scene_Battle || {};


Zausen.FZ_SistemaCostesEstilo.Scene_Battle.createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
    this.createHelpWindowSkill();
    Zausen.FZ_SistemaCostesEstilo.Scene_Battle.createAllWindows.call(this);
};

Zausen.FZ_SistemaCostesEstilo.Scene_Battle.initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function () {
    Zausen.FZ_SistemaCostesEstilo.Scene_Battle.initialize.call(this);
};

Scene_Battle.prototype.helpWindowRectSkill = function () {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(3, false);
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Battle.prototype.updateLogWindowVisibility = function () {
    this._logWindow.visible = !(this._helpWindow.visible || this._helpWindowSkill.visible);
};
Scene_Battle.prototype.createHelpWindowSkill = function () {
    const rect = this.helpWindowRectSkill();
    this._helpWindowSkill = new Window_HelpSkill(rect);
    this._helpWindowSkill.hide();
    this.addWindow(this._helpWindowSkill);
};

Scene_Battle.prototype.createSkillWindow = function () {
    const rect = this.skillWindowRect();
    this._skillWindow = new Window_BattleSkillB(rect);
    this._skillWindow.setHelpWindow(this._helpWindowSkill);
    this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
    this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Zausen.FZ_SistemaCostesEstilo.Scene_Battle.update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    this.updateSkillWindow();
    Zausen.FZ_SistemaCostesEstilo.Scene_Battle.update.call(this);
};
Scene_Battle.prototype.updateSkillWindow = function () {
    if (!this.isActive()) return;
    this._skillWindow.rotar();


}
Zausen.FZ_SistemaCostesEstilo.Scene_Battle.updateCancelButton = Scene_Battle.prototype.updateCancelButton;
Scene_Battle.prototype.updateCancelButton = function () {
    if (this._valorBaseCancelButtonY) {
        this._cancelButton.y = this._valorBaseCancelButtonY;
        this._valorBaseCancelButtonY = null;
    }
    Zausen.FZ_SistemaCostesEstilo.Scene_Battle.updateCancelButton.call(this);
    if (this._cancelButton && this._cancelButton.visible && this._skillWindow && this._skillWindow.visible && !this._valorBaseCancelButtonY) {
        this._valorBaseCancelButtonY = this._cancelButton.y;
        this._cancelButton.y += 36;
    }
};

/* ****************************************************************************************************************************************** 
*************************************************************** Window_HelpSkill ************************************************************
*********************************************************************************************************************************************/
function Window_HelpSkill() {
    this.initialize.apply(this, arguments);
}

Window_HelpSkill.prototype = Object.create(Window_Help.prototype);
Window_HelpSkill.prototype.constructor = Window_HelpSkill;

Window_HelpSkill.prototype.initialize = function (x, y, width, height) {
    this._ultimoEstadoDibujado = 0;
    this._ultimoObjetoDibujado = 0;
    this._muestraDeIconos = 3;
    this._actor = null;
    this._item = null;
    Window_Help.prototype.initialize.call(this, x, y, width, height);

    this._pvLbl = this.extraerAbreviacion(TextManager.hpA);
    this._pmLbl = this.extraerAbreviacion(TextManager.mpA);
    this._ptLbl = this.extraerAbreviacion(TextManager.tpA);
    this._oroLbl = $dataSystem.currencyUnit ? $dataSystem.currencyUnit[0] : "";
    this._separacionBase = 20;
};
Window_HelpSkill.prototype.extraerAbreviacion = function (txt) {
    var resp = "";
    for (var l = 0; l < Math.min(txt.length, 2); l++) resp += txt[l];
    return resp;
};

Window_HelpSkill.prototype.setItem = function (item) {
    if (this._item && item && DataManager.isSkill(item)) {
        var h1 = $dataSkills[this._item.id];
        var h2 = $dataSkills[item.id];
        if (h1.id === h2.id) return;

    }
    this._ultimoEstadoDibujado = 0;
    this._ultimoObjetoDibujado = 0;
    this._item = item;
    this.setText(item ? item.description : "");
    this.refresh();
};

Window_HelpSkill.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    if (this._item && DataManager.isSkill(this._item) && this._actor) {
        this.drawSkillCost(rect.x, rect.y + this.lineHeight() * 2, rect.width);
    }
};

Window_HelpSkill.prototype.drawSkillCostBasicos = function (x, y, width) {
    var skill = this._item;

    var pvTxt = this._actor.skillHpCost(skill) > 0 ? this._actor.skillHpCost(skill) : null;
    var pmTxt = this._actor.skillMpCost(skill) > 0 ? this._actor.skillMpCost(skill) : null;
    var ptTxt = this._actor.skillTpCost(skill) > 0 ? this._actor.skillTpCost(skill) : null;
    var oroTxt = this._actor.skillGoldCost(skill) > 0 ? this._actor.skillGoldCost(skill) : null;
    var sumatorioX = 0;
    if (pvTxt) {
        this.changePaintOpacity(this._actor.canPaySkillHpCost(skill));
        sumatorioX = this.escribirValor(ColorManager.hpGaugeColor1(), pvTxt, x + sumatorioX, y, width);
        sumatorioX = this.escribirValor(ColorManager.darkHpGaugeColor1(), this._pvLbl, sumatorioX + 1, y, width);
        sumatorioX += this._separacionBase;
    }
    if (pmTxt) {
        this.changePaintOpacity(this._actor.skillMpCost(skill) <= this._actor._mp);
        sumatorioX = this.escribirValor(ColorManager.darkMpCostColor(), pmTxt, sumatorioX, y, width);
        sumatorioX = this.escribirValor(ColorManager.mpCostColor(), this._pmLbl, sumatorioX + 1, y, width);
        sumatorioX += this._separacionBase;
    }
    if (ptTxt) {
        this.changePaintOpacity(this._actor.skillTpCost(skill) <= this._actor._tp);
        sumatorioX = this.escribirValor(ColorManager.tpCostColor(), ptTxt, sumatorioX, y, width);
        sumatorioX = this.escribirValor(ColorManager.darkTpCostColor(), this._ptLbl, sumatorioX + 1, y, width);
        sumatorioX += this._separacionBase;
    }
    if (oroTxt) {
        this.changePaintOpacity(this._actor.canPaySkillGoldCost(skill));
        sumatorioX = this.escribirValor(ColorManager.gold(), oroTxt, sumatorioX, y, width);
        sumatorioX = this.escribirValor(ColorManager.darkGold(), this._oroLbl, sumatorioX + 1, y, width);
        sumatorioX += this._separacionBase;
    }
    this.changeTextColor(ColorManager.normalColor());
    this.changePaintOpacity(true);
    return sumatorioX;
};
Window_HelpSkill.prototype.drawSkillCostEstados = function (x, y) {
    var skill = this._item;
    var sumatorioX = 0;
    if (skill.costeEstados && skill.costeEstados.length > 0) {
        if (this._ultimoEstadoDibujado >= skill.costeEstados.length) this._ultimoEstadoDibujado = 0;
        var muestreo = 0;
        var seleccion = this._ultimoEstadoDibujado;
        var cantidadIconos = Math.min(this._muestraDeIconos, skill.costeEstados.length);
        while (muestreo < cantidadIconos) {
            if (seleccion < 0) seleccion = skill.costeEstados.length - 1;
            var estSeleccionado = $dataStates[skill.costeEstados[seleccion]];
            this.changePaintOpacity(this._actor.isStateAffected(skill.costeEstados[seleccion]));
            this.drawIcon(estSeleccionado.iconIndex, x + sumatorioX + 4, y + 2);
            sumatorioX += ImageManager.iconWidth + 4;
            seleccion--;
            muestreo++;
        }
        if (this._muestraDeIconos < skill.costeEstados.length) this._ultimoEstadoDibujado++;

    }
    this.changePaintOpacity(true);
    sumatorioX += 30;
    return sumatorioX;
};
Window_HelpSkill.prototype.drawSkillCostObjetos = function (x, y, width) {
    var skill = this._item;
    var sumatorioX = 0;
    if (skill.costeObjetos && skill.costeObjetos.length > 0) {
        if (this._ultimoObjetoDibujado >= skill.costeObjetos.length) this._ultimoObjetoDibujado = 0;
        var muestreo = 0;
        var seleccion = this._ultimoObjetoDibujado;
        var separacion = this.textWidth("x99");
        var cantidadIconos = Math.min(this._muestraDeIconos, skill.costeObjetos.length);
        while (muestreo < cantidadIconos) {
            if (seleccion >= skill.costeObjetos.length) seleccion = 0;
            if (seleccion < 0) seleccion = skill.costeObjetos.length - 1;
            var informeSeleccionado = skill.costeObjetos[seleccion];
            var objSeleccionado = $dataItems[informeSeleccionado.id];
            this.changePaintOpacity($gameParty.hasItem(objSeleccionado, false) && $gameParty.numItems(objSeleccionado) >= informeSeleccionado.cantidad);
            this.drawIcon(objSeleccionado.iconIndex, x + sumatorioX + 4, y + 2);
            this.changeTextColor(ColorManager.normalColor());
            var texto = informeSeleccionado.cantidad + "";
            if (texto.length < 2) texto = "0" + texto;
            texto = "x" + texto;
            this.drawText(texto, x + sumatorioX + ImageManager.iconWidth + 4, y, width, "left");
            sumatorioX += separacion + ImageManager.iconWidth + 4;
            seleccion--;
            muestreo++;
        }
        if (this._muestraDeIconos < skill.costeObjetos.length) this._ultimoObjetoDibujado++;
    }
    this.changePaintOpacity(true);
};
Window_HelpSkill.prototype.drawSkillCost = function (x, y, width) {
    var sumatorioX = this.drawSkillCostBasicos(x, y, width);
    sumatorioX += this.drawSkillCostEstados(x + sumatorioX, y);
    sumatorioX += this.drawSkillCostObjetos(x + sumatorioX, y, width);


};

Window_HelpSkill.prototype.escribirValor = function (color, texto, x, y, width) {
    this.changeTextColor(color);
    this.drawText(texto, x, y, width, "left");
    return x + this.textWidth(texto);
};



/* ****************************************************************************************************************************************** 
*************************************************************** Window_HelpSkill ************************************************************
*********************************************************************************************************************************************/

function Window_BattleSkillB() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkillB.prototype = Object.create(Window_BattleSkill.prototype);
Window_BattleSkillB.prototype.constructor = Window_BattleSkillB;

Window_BattleSkillB.prototype.initialize = function (x, y, width, height) {
    Window_BattleSkill.prototype.initialize.call(this, x, y, width, height);
};

Window_BattleSkillB.prototype.setActor = function (actor) {
    if (this._actor !== actor) this._helpWindow._actor = actor;
    Window_BattleSkill.prototype.setActor.call(this, actor);
};

Window_BattleSkillB.prototype.initialize = function (rect) {
    Window_BattleSkill.prototype.initialize.call(this, rect);
    this._rotacionesActuales = 0;
    this._rotacionesDeActualizacion = 60;
};

Window_BattleSkillB.prototype.autoRefresca = function () {
    return this.visible && this._rotacionesActuales >= this._rotacionesDeActualizacion;
};

Window_BattleSkillB.prototype.rotarTiempo = function () {
    if (!this.visible) {
        this._rotacionesActuales = 0;
        return;
    }

    this._rotacionesActuales++;
};
Window_BattleSkillB.prototype.rotar = function () {
    if (this.autoRefresca()) {
        this._helpWindow.refresh();
        this._rotacionesActuales = 0;
    } else {
        this.rotarTiempo();
    }
};

Window_BattleSkillB.prototype.drawSkillCost = function (skill, x, y, width) { };
Zausen.FZ_SistemaCostesEstilo.drawItem = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        var tipo = width + x + 8;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth - ImageManager.iconWidth);
        if (item && item.damage && item.damage.elementId > 0 && Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos) {
            var elementoSeleccionado = Zausen.FZ_SistemaCostesEstilo.Parametros.IconosElementos[item.damage.elementId - 1];
            this.drawIcon(elementoSeleccionado ? elementoSeleccionado : 1, tipo, iconY);
        }

        //this.drawICon();
    }
};
Window_BattleSkillB.prototype.drawItemName = function (item, x, y, width) {
    Zausen.FZ_SistemaCostesEstilo.drawItem.call(this, item, x, y, width);
};


/* ****************************************************************************************************************************************** 
***************************************************************** ColorManager **************************************************************
*********************************************************************************************************************************************/
ColorManager.gold = function () {
    return "rgba(212, 175, 55, 1)";
};
ColorManager.darkGold = function () {
    return "rgba(197, 121, 52, 1)";
};
ColorManager.darkMpCostColor = function () {
    return "rgba(63, 232, 227, 1)";
};
ColorManager.darkTpCostColor = function () {
    return "rgba(0, 224, 29, 1)";
};
ColorManager.darkHpGaugeColor1 = function () {
    // return "rgba(201, 75, 59, 1)";
    return "rgba(201, 90, 75, 1)";
};

/* ****************************************************************************************************************************************** 
***************************************************************** Scene_SkillB **************************************************************
*********************************************************************************************************************************************/
function Scene_SkillB() {
    this.initialize(...arguments);
}

Scene_SkillB.prototype = Object.create(Scene_Skill.prototype);
Scene_SkillB.prototype.constructor = Scene_SkillB;

Scene_SkillB.prototype.initialize = function () {
    Scene_ItemBase.prototype.initialize.call(this);
};
Scene_SkillB.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createHelpWindowSkill();
    this.createActorWindow();
    this._itemWindow.setSkillWindowSkill(this._helpWindowSkill);

};

Scene_SkillB.prototype.createHelpWindowSkill = function () {
    const rect = this.itemWindowRect(this._itemWindow.width);
    this._helpWindowSkill = new Window_HelpSkillMenu(rect);
    this.addWindow(this._helpWindowSkill);
    //  this._itemWindow.setSkillWindowSkill(this._helpWindowSkill);
};

Scene_SkillB.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect(0);
    this._itemWindow = new Window_SkillListB(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this._helpWindow.y = this._statusWindow.y + this._statusWindow.height;
    this.addWindow(this._itemWindow);
};

Scene_SkillB.prototype.itemWindowRect = function (xAdicional) {
    const wx = xAdicional;
    const wy = this._statusWindow.y + this._statusWindow.height + this._helpWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._statusWindow.height;
    return new Rectangle(wx, wy, Math.floor(ww / 2), wh);
};

Scene_SkillB.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_SkillB.prototype.helpWindowRect = function () {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};
Scene_SkillB.prototype.update = function () {
    if (this._helpWindowSkill && this._helpWindowSkill.visible) this._helpWindowSkill.refresh();
    Scene_Skill.prototype.update.call(this);
};

/* ****************************************************************************************************************************************** 
***************************************************************** Scene_SkillB **************************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostesEstilo.Scene_Menu = Zausen.FZ_SistemaCostesEstilo.Scene_Menu || {};
Zausen.FZ_SistemaCostesEstilo.Scene_Menu.onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function () {
    if (this._commandWindow.currentSymbol() == "skill") {
        SceneManager.push(Scene_SkillB);
    } else {
        Zausen.FZ_SistemaCostesEstilo.Scene_Menu.onPersonalOk.call(this);
    }
};

//--------------------------------------------------------

function Window_SkillListB() {
    this.initialize.apply(this, arguments);
}

Window_SkillListB.prototype = Object.create(Window_SkillList.prototype);
Window_SkillListB.prototype.constructor = Window_SkillListB;

Window_SkillListB.prototype.initialize = function (x, y, width, height) {
    this._helpWindowSkill = null;
    Window_SkillList.prototype.initialize.call(this, x, y, width, height);
};
Window_SkillListB.prototype.maxCols = function () {
    return 1;
};

Window_SkillListB.prototype.setSkillWindowSkill = function (skillWindow) {
    this._helpWindowSkill = skillWindow;
    this.callUpdateHelp();
};

Window_SkillListB.prototype.showHelpWindow = function () {
    Window_SkillList.prototype.showHelpWindow.call();
    if (this._helpWindowSkill) {
        this._helpWindowSkill.show();
    }
};

Window_SkillListB.prototype.hideHelpWindow = function () {
    Window_SkillList.prototype.hideHelpWindow.call(this);
    if (this._helpWindowSkill) {
        this._helpWindowSkill.hide();
    }
};

Window_SkillListB.prototype.callUpdateHelp = function () {
    if (this.active && this._helpWindow && this._helpWindowSkill) {
        this.updateHelp();
    }
};


Window_SkillListB.prototype.setHelpWindowItem = function (item) {
    Window_SkillList.prototype.setHelpWindowItem.call(this, item);
    if (this._helpWindowSkill) {
        this._helpWindowSkill.setItem(item, this._actor);
    }
};
Window_SkillListB.prototype.drawSkillCost = function (skill, x, y, width) { };


Window_SkillListB.prototype.drawItemName = function (item, x, y, width) {
    Zausen.FZ_SistemaCostesEstilo.drawItem.call(this, item, x, y, width);
};

/* ****************************************************************************************************************************************** 
***************************************************************** Window_HelpSkillMenu ******************************************************
*********************************************************************************************************************************************/

function Window_HelpSkillMenu() {
    this.initialize(...arguments);
}

Window_HelpSkillMenu.prototype = Object.create(Window_HelpSkill.prototype);
Window_HelpSkillMenu.prototype.constructor = Window_HelpSkillMenu;

Window_HelpSkillMenu.prototype.initialize = function (rect) {
    Window_HelpSkill.prototype.initialize.call(this, rect);
    this._enEspera = 0;
    this._vecesEnEspera = 60;
    this._enTransicion = 0;
    this._retroceso = 0;
    this._separacionBase = 15;
};

Window_HelpSkillMenu.prototype.setItem = function (item, actor) {
    if (this._item && item && DataManager.isSkill(item)) {
        var h1 = $dataSkills[this._item.id];
        var h2 = $dataSkills[item.id];
        if (h1.id === h2.id) return;
    }
    this._actor = actor;
    this._item = item;
    this._ultimoEstadoDibujado = 0;
    this._ultimoObjetoDibujado = 0;
    this._enEspera = 0;
    this._enTransicion = 0;
    this._retroceso = 0;
    this.refresh();
};

Window_HelpSkillMenu.prototype.refresh = function () {
    if (this._item == null || this._actor == null) return;
    const rect = this.baseTextRect();
    this.contents.clear();
    if (this._item && DataManager.isSkill(this._item) && this._actor) {
        this.drawSkillCost(rect.x, rect.y, rect.width);
    }
};
var extraLinea = 0;
Window_HelpSkillMenu.prototype.drawSkillCost = function (x, y, width) {
    var colorTitulo = ColorManager.systemColor();
    this.changeTextColor(ColorManager.normalColor());
    var nuevaY = y;
    var skill = this._item;
    if (!skill) return;
    this.changeTextColor(colorTitulo);
    this.drawText(Zausen.FZ_SistemaCostesEstilo.Parametros.TextoCosteGeneral, x, nuevaY, width, "left");
    this.changeTextColor(ColorManager.normalColor());
    nuevaY += this.lineHeight();
    this.drawSkillCostBasicos(x, nuevaY, width);
    nuevaY += this.lineHeight();
    this.retroceder(x);
    if (skill.costeEstados && skill.costeEstados.length > 0) {
        nuevaY += extraLinea;
        this.changeTextColor(colorTitulo);
        this.drawText(Zausen.FZ_SistemaCostesEstilo.Parametros.TextoEstadosNecesarios, x, nuevaY, width, "left");
        this.changeTextColor(ColorManager.normalColor());
        nuevaY += this.lineHeight();
        this.drawSkillCostEstados(x, nuevaY, width);
        nuevaY += this.lineHeight();
    }
    if (skill.costeObjetos && skill.costeObjetos.length > 0) {
        nuevaY += extraLinea;
        this.changeTextColor(colorTitulo);
        this.drawText(Zausen.FZ_SistemaCostesEstilo.Parametros.TextoObjetosNecesarios, x, nuevaY, width, "left");
        this.changeTextColor(ColorManager.normalColor());
        nuevaY += this.lineHeight();
        this.drawSkillCostObjetos(x, nuevaY, width); 
        nuevaY += this.lineHeight();
    }
    this.transitar(width);
    this.changeTextColor(colorTitulo);
    this.drawText(Zausen.FZ_SistemaCostesEstilo.Parametros.TextoTipoHabilidad, x, nuevaY, width, "left");
    this.changeTextColor(ColorManager.normalColor());
    nuevaY += this.lineHeight();
    this.drawSkillTipo(x, nuevaY, width);
};
Window_HelpSkillMenu.prototype.retroceder = function (x) {
    this._retroceso = x - this._enTransicion * 4;
};
Window_HelpSkillMenu.prototype.transitar = function (width) {
    if (this._enEspera >= this._vecesEnEspera && Math.abs(this._retroceso) >= width) {
        this._ultimoEstadoDibujado++;
        this._ultimoObjetoDibujado++;
        this._enEspera = 0;
        this._enTransicion = 0;
    }
    if (this._enEspera >= this._vecesEnEspera) this._enTransicion++;
    if (this._enEspera < this._vecesEnEspera) this._enEspera++;
};
Window_HelpSkillMenu.prototype.drawSkillCostEstados = function (x, y, width) {
    var skill = this._item;
    var actor = this._actor;
    
    if (skill.costeEstados && skill.costeEstados.length > 0) {
        if (this._ultimoEstadoDibujado >= skill.costeEstados.length) this._ultimoEstadoDibujado = 0;
        var retro = skill.costeEstados.length > 1 ? this._retroceso : x;
        this.changePaintOpacity(actor.isStateAffected(skill.costeEstados[this._ultimoEstadoDibujado]));
        var estSeleccionado = $dataStates[skill.costeEstados[this._ultimoEstadoDibujado]];
        this.drawIcon(estSeleccionado.iconIndex, retro, y + 2);
        this.drawText(estSeleccionado.name, retro + ImageManager.iconWidth + 4, y, width, "left");
        if (skill.costeEstados.length > 1) {
            var siguienteEstado = this._ultimoEstadoDibujado + 1;
            if (siguienteEstado >= skill.costeEstados.length) siguienteEstado = 0;
            this.changePaintOpacity(actor.isStateAffected(skill.costeEstados[siguienteEstado]));
            var estSeleccionado2 = $dataStates[skill.costeEstados[siguienteEstado]];
            this.drawIcon(estSeleccionado2.iconIndex, this._retroceso + width + 8, y + 2);
            this.drawText(estSeleccionado2.name, this._retroceso + width + ImageManager.iconWidth + 12, y, width, "left");


        }

    }
    this.changePaintOpacity(true);
    return width;
};

Window_HelpSkillMenu.prototype.drawSkillCostObjetos = function (x, y, width) {
    var skill = this._item;
    if (skill.costeObjetos && skill.costeObjetos.length > 0) {
        if (this._ultimoObjetoDibujado >= skill.costeObjetos.length) this._ultimoObjetoDibujado = 0;
        var widthR = width - 40;
        var informeSeleccionado = skill.costeObjetos[this._ultimoObjetoDibujado];
        var objSeleccionado = $dataItems[informeSeleccionado.id];
        var retro = skill.costeObjetos.length > 1 ? this._retroceso : x;
        this.changePaintOpacity($gameParty.hasItem(objSeleccionado, false) && $gameParty.numItems(objSeleccionado) >= informeSeleccionado.cantidad);
        this.drawIcon(objSeleccionado.iconIndex, retro, y + 2);
        this.drawText(objSeleccionado.name, retro + ImageManager.iconWidth + 4, y, widthR, "left");
        var texto = informeSeleccionado.cantidad + "";
        if (texto.length < 2) texto = "0" + texto;
        texto = "x" + texto;
        this.drawText(texto, retro + widthR, y, 40, "left");
        if (skill.costeObjetos.length > 1) {
            var siguienteObjeto = this._ultimoObjetoDibujado + 1;
            if (siguienteObjeto >= skill.costeObjetos.length) siguienteObjeto = 0;
            var informeSeleccionado2 = skill.costeObjetos[siguienteObjeto];
            var objSeleccionado2 = $dataItems[informeSeleccionado2.id];
            this.changePaintOpacity($gameParty.hasItem(objSeleccionado2, false) && $gameParty.numItems(objSeleccionado2) >= informeSeleccionado2.cantidad);
            this.drawIcon(objSeleccionado2.iconIndex, this._retroceso + width + 8, y + 2);
            this.drawText(objSeleccionado2.name, this._retroceso + ImageManager.iconWidth + 12 + width, y, widthR, "left");
            var texto = informeSeleccionado2.cantidad + "";
            if (texto.length < 2) texto = "0" + texto;
            texto = "x" + texto;
            this.drawText(texto, this._retroceso + widthR + width + 6, y, 40, "left");
        }
    }
    this.changePaintOpacity(true);
};


Window_HelpSkillMenu.prototype.drawSkillTipo = function (x, y, width) {
    var skill = this._item;
    var texto = "";
    switch (skill.hitType) {
        case 0:
            texto = Zausen.FZ_SistemaCostesEstilo.Parametros.TxtGolpeCertero;
            break;
        case 1:
            texto = Zausen.FZ_SistemaCostesEstilo.Parametros.TxtAtaqueFisico;
            break;
        case 2:
            texto = Zausen.FZ_SistemaCostesEstilo.Parametros.TxtAtaqueMagico;
            break;
    }
    this.drawText(texto, x, y, width);

};


/* ****************************************************************************************************************************************** 
***************************************************************** Game_BattlerBase **********************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostesEstilo.Game_BattlerBase = Zausen.FZ_SistemaCostesEstilo.Game_BattlerBase || {};

Zausen.FZ_SistemaCostesEstilo.Game_BattlerBase.initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function () {
    Zausen.FZ_SistemaCostesEstilo.Game_BattlerBase.initMembers.call(this);
    this._idOverlayActual = 0;
};
Game_BattlerBase.prototype.actualizarOverlayAMostrar = function () {
    const states = this.states();
    if (states.length <= 1) {
        this._idOverlayActual = 0;
        return;
    }
    this._idOverlayActual++;
    this.ajustarIdOverlayActual();
};
Game_BattlerBase.prototype.ajustarIdOverlayActual = function () {
    if (this._idOverlayActual >= this.states().length) this._idOverlayActual = 0;
};

Game_BattlerBase.prototype.stateOverlayIndex = function () {
    this.ajustarIdOverlayActual();
    const states = this.states();
    if (states.length > 0) {
        return states[this._idOverlayActual].overlay;
    } else {
        this._idOverlayActual = 0;
        return 0;
    }
};

/* ****************************************************************************************************************************************** 
***************************************************************** Game_BattlerBase **********************************************************
*********************************************************************************************************************************************/
Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay = Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay || {};

Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay.initialize = Sprite_StateOverlay.prototype.initialize;
Sprite_StateOverlay.prototype.initialize = function () {
    Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay.initialize.call(this);
    this._vueltasOverlay = 0;
};


Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay.updatePattern = Sprite_StateOverlay.prototype.updatePattern;
Sprite_StateOverlay.prototype.updatePattern = function () {
    Zausen.FZ_SistemaCostesEstilo.Sprite_StateOverlay.updatePattern.call(this);
    if (isNaN(Zausen.FZ_SistemaCostesEstilo.Parametros.VueltasActualizacionOverlay) || Zausen.FZ_SistemaCostesEstilo.Parametros.VueltasActualizacionOverlay <= 0) return;
    if (this._battler) {
        this._vueltasOverlay++;
        this._vueltasOverlay %= Zausen.FZ_SistemaCostesEstilo.Parametros.VueltasActualizacionOverlay;
        if (this._vueltasOverlay == 0) this._battler.actualizarOverlayAMostrar();
    } else {
        this._vueltasOverlay = 0;
    }
};
