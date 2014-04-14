goog.provide('anychart.cartesian.series.RangeStepLineArea');

goog.require('anychart.cartesian.series.ContinuousRangeBase');



/**
 * @param {!(anychart.data.View|anychart.data.Set|Array|string)} data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.cartesian.series.ContinuousRangeBase}
 */
anychart.cartesian.series.RangeStepLineArea = function(data, opt_csvSettings) {
  goog.base(this, data, opt_csvSettings);

  // Определяем значения опорных полей серии.
  this.referenceValueNames = ['x', 'low', 'high'];
  this.referenceValueMeanings = ['x', 'y', 'y'];
  this.referenceValuesSupportStack = false;
};
goog.inherits(anychart.cartesian.series.RangeStepLineArea, anychart.cartesian.series.ContinuousRangeBase);


/** @inheritDoc */
anychart.cartesian.series.RangeStepLineArea.prototype.drawFirstPoint = function() {
  var referenceValues = this.getReferenceCoords();
  if (!referenceValues)
    return false;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    var x = referenceValues[0];
    var low = referenceValues[1];
    var high = referenceValues[2];

    this.finalizeSegment();

    this.path
        .moveTo(x, low)
        .lineTo(x, high);
    this.highPath
        .moveTo(x, high);

    this.prevX_ = x;
    this.prevY_ = high;

    this.lowsStack = [x, low];

    this.getIterator().meta('x', x).meta('low', low).meta('high', high);
  }

  return true;
};


/** @inheritDoc */
anychart.cartesian.series.RangeStepLineArea.prototype.drawSubsequentPoint = function() {
  var referenceValues = this.getReferenceCoords();
  if (!referenceValues)
    return false;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    var x = referenceValues[0];
    var low = referenceValues[1];
    var high = referenceValues[2];

    var midX = (x + this.prevX_) / 2;
    this.path
        .lineTo(midX, this.prevY_)
        .lineTo(midX, high)
        .lineTo(x, high);
    this.highPath
        .lineTo(midX, this.prevY_)
        .lineTo(midX, high)
        .lineTo(x, high);

    this.prevX_ = x;
    this.prevY_ = high;

    this.lowsStack.push(x, low);

    this.getIterator().meta('x', x).meta('low', low).meta('high', high);
  }

  return true;
};


/** @inheritDoc */
anychart.cartesian.series.RangeStepLineArea.prototype.finalizeSegment = function() {
  if (this.lowsStack) {
    /** @type {number} */
    var prevX = NaN;
    /** @type {number} */
    var prevY = NaN;
    var first = true;
    for (var i = this.lowsStack.length - 1; i >= 0; i -= 2) {
      /** @type {number} */
      var x = /** @type {number} */(this.lowsStack[i - 1]);
      /** @type {number} */
      var y = /** @type {number} */(this.lowsStack[i]);
      if (first) {
        this.lowPath.moveTo(x, y);
        first = false;
      } else {
        var midX = (x + prevX) / 2;
        this.path
            .lineTo(midX, prevY)
            .lineTo(midX, y);
        this.lowPath
            .lineTo(midX, prevY)
            .lineTo(midX, y);
      }
      this.path.lineTo(x, y);
      this.lowPath.lineTo(x, y);
      prevX = x;
      prevY = y;
    }
    this.path.close();
    this.lowsStack = null;
  }
};


/**
 * @inheritDoc
 */
anychart.cartesian.series.RangeStepLineArea.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['seriesType'] = 'rangesteplinearea';
  return json;
};


/**
 * @inheritDoc
 */
anychart.cartesian.series.RangeStepLineArea.prototype.deserialize = function(config) {
  return goog.base(this, 'deserialize', config);
};
