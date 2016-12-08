goog.provide('anychart.ui.Label');
goog.require('anychart.core.ui.Label');



/**
 * @constructor
 * @extends {anychart.core.ui.Label}
 */
anychart.ui.Label = function() {
  goog.base(this);
};
goog.inherits(anychart.ui.Label, anychart.core.ui.Label);


/**
 * Constructor function.
 * @return {!anychart.ui.Label}
 */
anychart.ui.label = function() {
  var res = new anychart.ui.Label();
  res.setup(anychart.getFullTheme()['standalones']['label']);
  return res;
};


//exports
goog.exportSymbol('anychart.ui.label', anychart.ui.label);
anychart.ui.Label.prototype['draw'] = anychart.ui.Label.prototype.draw;
anychart.ui.Label.prototype['parentBounds'] = anychart.ui.Label.prototype.parentBounds;
anychart.ui.Label.prototype['container'] = anychart.ui.Label.prototype.container;