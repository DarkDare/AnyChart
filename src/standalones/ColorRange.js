goog.provide('anychart.standalones.ColorRange');
goog.require('anychart.core.ui.ColorRange');



/**
 * @constructor
 * @extends {anychart.core.ui.ColorRange}
 */
anychart.standalones.ColorRange = function() {
  anychart.standalones.ColorRange.base(this, 'constructor');
};
goog.inherits(anychart.standalones.ColorRange, anychart.core.ui.ColorRange);
anychart.core.makeStandalone(anychart.standalones.ColorRange, anychart.core.ui.ColorRange);


/**
 * Returns color range instance.
 * @return {!anychart.standalones.ColorRange}
 */
anychart.standalones.colorRange = function() {
  var colorRange = new anychart.standalones.ColorRange();
  colorRange.setupByVal(anychart.getFullTheme()['standalones']['colorRange'], true);
  return colorRange;
};


/**
 * Returns color range instance.
 * @return {!anychart.standalones.ColorRange}
 * @deprecated Since 7.12.0. Use anychart.standalones.colorRange instead.
 */
anychart.ui.colorRange = function() {
  anychart.core.reporting.warning(anychart.enums.WarningCode.DEPRECATED, null, ['anychart.ui.colorRange', 'anychart.standalones.colorRange'], true);
  return anychart.standalones.colorRange();
};


//exports
goog.exportSymbol('anychart.ui.colorRange', anychart.ui.colorRange);
goog.exportSymbol('anychart.standalones.colorRange', anychart.standalones.colorRange);
anychart.standalones.ColorRange.prototype['padding'] = anychart.standalones.ColorRange.prototype.padding;
anychart.standalones.ColorRange.prototype['draw'] = anychart.standalones.ColorRange.prototype.draw;
anychart.standalones.ColorRange.prototype['parentBounds'] = anychart.standalones.ColorRange.prototype.parentBounds;
anychart.standalones.ColorRange.prototype['container'] = anychart.standalones.ColorRange.prototype.container;
anychart.standalones.ColorRange.prototype['colorLineSize'] = anychart.standalones.ColorRange.prototype.colorLineSize;

