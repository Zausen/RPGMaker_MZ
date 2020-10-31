var Zausen = Zausen || {};
Zausen.FZ_DetencionMovimientoAutomatico = Zausen.FZ_DetencionMovimientoAutomatico || {};
/*:
 * @target MZ
 * @plugindesc Añade la capacidad de detener el movimiento de ruta del jugador.
 * @author Fer Zacrón
 *
 * @help DetencionMovimientoAutomatico.js
 * 
 * Se añade el comando «Detener movimiento», si se le pone en Posición 0 o nada o un 
 * número muy alto, anulará por completo la posición, si no, irá al punto marcado.
 * 
 * Se añade el método "elJugadorPuedePasar()", si se le añade el número de la 
 * dirección verifica si se puede pasar en esa posición o no, si no se especifica 
 * nada o se le da un 0 como parámetro lo comprueba delante del jugador. 
 * 
 * Ej: elJugadorPuedePasar(0) retorna true si se puede pasar.
 * 
 * Ej: !elJugadorPuedePasar(0) retorna true si no se puede pasar.
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * @command detenerMovimientoAutomaticoJugador
 * @text Detener movimiento
 * @desc Detiene el movimiento automático del jugador.
 * 
 * 
 * @arg donde
 * @text Posición:
 * @desc Entre la primera y la última posición, dónde quieres que adelante el movimeinto (0 o menos es que lo termine del todo).
 * @type number
 * @min 0
 * @max 9999999
 * @default 0
 * 
 * 
 */
Zausen.FZ_DetencionMovimientoAutomatico.pluginName = 'DetencionMovimientoAutomatico';
Zausen.FZ_DetencionMovimientoAutomatico.PluggingManager = PluginManager.parameters(Zausen.FZ_DetencionMovimientoAutomatico.pluginName);
Zausen.FZ_DetencionMovimientoAutomatico.Parametros = Zausen.FZ_DetencionMovimientoAutomatico.Parametros || {};


PluginManager.registerCommand(Zausen.FZ_DetencionMovimientoAutomatico.pluginName, 'detenerMovimientoAutomaticoJugador', args => {
    let donde = args.donde; 
    donde = !donde || isNaN(donde) ? 0 : parseInt(donde);
    if(!$gamePlayer) return; 
    $gamePlayer.detenerMovimientoForzado(donde -1);
});
var elJugadorPuedePasar = function(d){
    const direction = d && !isNaN(d) && d > 0 ? d : $gamePlayer.direction();
    return $gamePlayer.canPass($gamePlayer.x, $gamePlayer.y, direction);
};
Game_Player.prototype.detenerMovimientoForzado = function(donde) { 
    if(!this._moveRouteForcing) return; 
    if(this._moveRouteIndex < donde) this._moveRouteIndex = donde;
    if(donde < 0 || donde >= this._moveRoute.list.length) this._moveRouteIndex = this._moveRoute.list.length -1;
};
Game_Character.prototype.detenerMovimientoForzado = function(params) { };



