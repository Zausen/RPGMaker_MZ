var Zausen = Zausen || {};
Zausen.FZ_DetencionMovimientoAutomatico = Zausen.FZ_DetencionMovimientoAutomatico || {};
/*:
 * @target MZ
 * @plugindesc This plugin adds a functionality to stop the player's route of movement.
 * @author Fer Zacrón
 *
 * @help AutomaticStopMovementRoute.js
 * 
 * Add the plugin command "Stop Movement", if you put in "Position" 0, nothing or a very high 
 * number, it will completely cancel the route, otherwise, it will go to the 
 * identified point.
 * 
 * Add the method "thePlayerCanPass()" with an integer parameter (optional). No parameter or 0 is 
 * equal to the forward direction. Returns true or false if the player can 
 * advance one step in the reported direction.
 * 
 * Example: thePlayerCanPass(0) returns true if the player can pass.
 * 
 * Example: !thePlayerCanPass(0) returns true if the player can't pass.
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * @command detenerMovimientoAutomaticoJugador
 * @text Stop Movement
 * @desc Stops automatic player movement.
 * 
 * 
 * @arg donde
 * @text Position:
 * @desc An integer between the first(1) and last position where you want the process to skip (0 or less equals canceling the automatic move).
 * @type number
 * @min 0
 * @max 9999999
 * @default 0
 * 
 * 
 */
Zausen.FZ_DetencionMovimientoAutomatico.pluginName = 'AutomaticStopMovementRoute';
Zausen.FZ_DetencionMovimientoAutomatico.PluggingManager = PluginManager.parameters(Zausen.FZ_DetencionMovimientoAutomatico.pluginName);
Zausen.FZ_DetencionMovimientoAutomatico.Parametros = Zausen.FZ_DetencionMovimientoAutomatico.Parametros || {};


PluginManager.registerCommand(Zausen.FZ_DetencionMovimientoAutomatico.pluginName, 'detenerMovimientoAutomaticoJugador', args => {
    let donde = args.donde; 
    donde = !donde || isNaN(donde) ? 0 : parseInt(donde);
    if(!$gamePlayer) return; 
    $gamePlayer.detenerMovimientoForzado(donde -1);
});
var thePlayerCanPass = function(d){
    const direction = d && !isNaN(d) && d > 0 ? d : $gamePlayer.direction();
    return $gamePlayer.canPass($gamePlayer.x, $gamePlayer.y, direction);
};
Game_Player.prototype.detenerMovimientoForzado = function(donde) { 
    if(!this._moveRouteForcing) return; 
    if(this._moveRouteIndex < donde) this._moveRouteIndex = donde;
    if(donde < 0 || donde >= this._moveRoute.list.length) this._moveRouteIndex = this._moveRoute.list.length -1;
};
Game_Character.prototype.detenerMovimientoForzado = function(params) { };



