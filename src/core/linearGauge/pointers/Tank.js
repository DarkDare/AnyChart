goog.provide('anychart.core.linearGauge.pointers.Tank');
goog.require('anychart.core.linearGauge.pointers.Base');



/**
 * Tank pointer class.
 * @param {anychart.charts.LinearGauge} gauge Gauge.
 * @param {number} dataIndex Pointer data index.
 * @extends {anychart.core.linearGauge.pointers.Base}
 * @constructor
 */
anychart.core.linearGauge.pointers.Tank = function(gauge, dataIndex) {
  anychart.core.linearGauge.pointers.Tank.base(this, 'constructor', gauge, dataIndex);

  /**
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.bodyLayer_ = null;
  /**
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.bulbLayer_ = null;

  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bodyMainPath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bodyTopShadePath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bodyBottomShadePath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bodyMainShadePath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bodyTopBlurPath_ = null;

  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bulbMainPath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bulbTopShadePath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bulbMainShadePath_ = null;
  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.bulbTopBlurPath_ = null;
};
goog.inherits(anychart.core.linearGauge.pointers.Tank, anychart.core.linearGauge.pointers.Base);


//region --- PROPERTIES ---
/**
 * Calculated number to find small radius of bulb ellipse
 * @type {number}
 */
anychart.core.linearGauge.pointers.Tank.MULTIPLIER = 0.14880952380;
//endregion


//region --- INHERITED API ----
/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.getType = function() {
  return anychart.enums.LinearGaugePointerType.TANK;
};


/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.getReservedBounds = function(parentWidth, parentHeight) {
  var w = anychart.utils.normalizeSize(/** @type {number|string} */ (this.width()), parentWidth);
  var gap = w * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
  var left, top, right, bottom;
  left = top = right = bottom = 0;

  if (this.isVertical())
    top = bottom = gap;
  else
    left = right = gap;

  return [left, top, right, bottom];
};
//endregion


//region --- BOUNDS ---
/**
 * Calculate tank bounds.
 * @private
 */
anychart.core.linearGauge.pointers.Tank.prototype.calculateBounds_ = function() {
  var isVertical = this.isVertical();
  var bounds = /** @type {anychart.math.Rect} */ (this.parentBounds());
  var scale = this.scale();
  var inverted = scale.inverted();
  var val = this.applyRatioToBounds(this.getEndRatio());
  var totalMin = this.applyRatioToBounds(scale.transform(scale.minimum()));
  var totalMax = this.applyRatioToBounds(scale.transform(scale.maximum()));
  if (isVertical) {
    if (inverted) {
      this.bodyBounds_ = anychart.math.rect(bounds.left, totalMin, bounds.width, val - totalMin);
      this.bulbBounds_ = anychart.math.rect(bounds.left, val, bounds.width, totalMax - val);
    } else {
      this.bodyBounds_ = anychart.math.rect(bounds.left, val, bounds.width, totalMin - val);
      this.bulbBounds_ = anychart.math.rect(bounds.left, totalMax, bounds.width, val - totalMax);
    }
  } else {
    if (inverted) {
      this.bodyBounds_ = anychart.math.rect(val, bounds.top, totalMin - val, bounds.height);
      this.bulbBounds_ = anychart.math.rect(totalMax, bounds.top, val - totalMax, bounds.height);
    } else {
      this.bodyBounds_ = anychart.math.rect(totalMin, bounds.top, val - totalMin, bounds.height);
      this.bulbBounds_ = anychart.math.rect(val, bounds.top, totalMax - val, bounds.height);
    }
  }
  this.pointerBounds = this.bodyBounds_;
};


/**
 * Returns point coordinate.
 * @param {number} wRadius Radius X.
 * @param {number} angle Angle.
 * @return {number} Point x.
 */
anychart.core.linearGauge.pointers.Tank.prototype.getPointX = function(wRadius, angle) {
  if (wRadius <= 0) return 0;
  return wRadius * Math.round(Math.cos(angle * Math.PI / 180) * 1e15) / 1e15;
};


/**
 * Returns point coordinate.
 * @param {number} hRadius Radius Y.
 * @param {number} angle Angle.
 * @return {number} Point y.
 */
anychart.core.linearGauge.pointers.Tank.prototype.getPointY = function(hRadius, angle) {
  if (hRadius <= 0) return 0;
  return hRadius * Math.round(Math.sin(angle * Math.PI / 180) * 1e15) / 1e15;
};
//endregion


//region --- DRAWERS ---
/**
 * Draws main part.
 * @param {acgraph.vector.Path} path Path.
 * @param {anychart.math.Rect} bounds Bounds.
 */
anychart.core.linearGauge.pointers.Tank.prototype.drawMain = function(path, bounds) {
  var isVertical = this.isVertical();
  if (isVertical) {
    var rx = bounds.width / 2;
    var ry = bounds.width * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var right = bounds.left + bounds.width;
    var bottom = bounds.top + bounds.height;
    path
      .moveTo(bounds.left, bounds.top)
      .arcToByEndPoint(right, bounds.top, rx, ry, false, true)
      .lineTo(right, bottom)
      .arcToByEndPoint(bounds.left, bottom, rx, ry, false, true);
  } else {
    var xR = bounds.height * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var yR = bounds.height / 2;

    var yStart = bounds.top + bounds.height / 2 + this.getPointY(yR, 90);
    path.moveTo(bounds.left + this.getPointX(xR, 90), yStart)
      .arcToByEndPoint(bounds.left, bounds.top, xR, yR, true, true)
      .lineTo(bounds.left + bounds.width, bounds.top)
      .arcToByEndPoint(bounds.left + bounds.width, yStart, xR, yR, false, true);
  }
};


/**
 * Draws top shade
 * @param {acgraph.vector.Path} path Path.
 * @param {anychart.math.Rect} bounds Bounds.
 */
anychart.core.linearGauge.pointers.Tank.prototype.drawTopShade = function(path, bounds) {
  var isVertical = this.isVertical();
  if (isVertical) {
    var rx = bounds.width / 2;
    var ry = bounds.width * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    path.moveTo(bounds.left, bounds.top);
    path.arcToByEndPoint(bounds.left, bounds.top - 0.1, rx, ry, true, false);
  } else {
    var xR = bounds.height * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var yR = bounds.height / 2;
    var yStart = bounds.top + bounds.height / 2 + this.getPointY(yR, 90);

    path.moveTo(bounds.left + bounds.width + 1.5, bounds.top + 1);
    path.arcToByEndPoint(bounds.left + bounds.width + 1.5, yStart, xR, yR, true, false);
  }
};


/**
 * Draws bottom shade.
 * @param {acgraph.vector.Path} path Path.
 * @param {anychart.math.Rect} bounds Bounds.
 */
anychart.core.linearGauge.pointers.Tank.prototype.drawBottomShade = function(path, bounds) {
  if (this.isVertical()) {
    var rx = bounds.width / 2;
    var ry = bounds.width * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var right = bounds.left + bounds.width;
    var bottom = bounds.top + bounds.height;
    path.moveTo(bounds.left, bottom - 1);
    path.arcToByEndPoint(right, bottom, rx, ry, false, false);
  } else {
    var xR = bounds.height * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var yR = bounds.height / 2;
    var yStart = bounds.top + bounds.height / 2 + this.getPointY(yR, 90);

    path.moveTo(bounds.left + 1, bounds.top);
    path.arcToByEndPoint(bounds.left, yStart, xR, yR, false, false);
  }
};


/**
 * Draws top blur.
 * @param {acgraph.vector.Path} path Path.
 * @param {anychart.math.Rect} bounds Bounds.
 */
anychart.core.linearGauge.pointers.Tank.prototype.drawTopBlur = function(path, bounds) {
  if (this.isVertical()) {
    path.moveTo(bounds.left, bounds.top);
    path.arcToByEndPoint(bounds.left, bounds.top - 0.1, bounds.width / 2, bounds.width * anychart.core.linearGauge.pointers.Tank.MULTIPLIER, true, false);
  } else {
    var xR = bounds.height * anychart.core.linearGauge.pointers.Tank.MULTIPLIER;
    var yR = bounds.height / 2;
    path.moveTo(bounds.left + bounds.width - 1, bounds.top);
    path.arcToByEndPoint(bounds.left + bounds.width - 1 + 0.1, bounds.top, xR, yR, true, false);
  }
};
//endregion


//region --- DRAWING ---
/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.createShapes = function() {
  // create layers for different parts of tank pointer.
  if (!this.bodyLayer_) this.bodyLayer_ = this.rootLayer.layer();
  if (!this.bulbLayer_) this.bulbLayer_ = this.rootLayer.layer();
  var inverted = this.scale().inverted();

  // Position of parts depends on scale inversion.
  if (inverted) {
    this.bulbLayer_.zIndex(0);
    this.bodyLayer_.zIndex(1);
  } else {
    this.bodyLayer_.zIndex(0);
    this.bulbLayer_.zIndex(1);
  }

  if (!this.bodyMainPath_)
    this.bodyMainPath_ = this.bodyLayer_.path().zIndex(0);
  else
    this.bodyMainPath_.clear();
  if (!this.bodyTopShadePath_)
    this.bodyTopShadePath_ = this.bodyLayer_.path().zIndex(1);
  else
    this.bodyTopShadePath_.clear();
  if (!this.bodyBottomShadePath_)
    this.bodyBottomShadePath_ = this.bodyLayer_.path().zIndex(2);
  else
    this.bodyBottomShadePath_.clear();
  if (!this.bodyMainShadePath_)
    this.bodyMainShadePath_ = this.bodyLayer_.path().zIndex(3);
  else
    this.bodyMainShadePath_.clear();
  if (!this.bodyTopBlurPath_)
    this.bodyTopBlurPath_ = this.bodyLayer_.path().zIndex(4);
  else
    this.bodyTopBlurPath_.clear();

  if (!this.bulbMainPath_)
    this.bulbMainPath_ = this.bulbLayer_.path().zIndex(0);
  else
    this.bulbMainPath_.clear();
  if (!this.bulbTopShadePath_)
    this.bulbTopShadePath_ = this.bulbLayer_.path().zIndex(1);
  else
    this.bulbTopShadePath_.clear();
  if (!this.bulbMainShadePath_)
    this.bulbMainShadePath_ = this.bulbLayer_.path().zIndex(2);
  else
    this.bulbMainShadePath_.clear();
  if (!this.bulbTopBlurPath_)
    this.bulbTopBlurPath_ = this.bulbLayer_.path().zIndex(3);
  else
    this.bulbTopBlurPath_.clear();

  if (!this.hatch)
    this.hatch = this.rootLayer.path();
  else
    this.hatch.clear();

  this.makeInteractive(this.rootLayer);
};


/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.drawVertical = function() {
  this.calculateBounds_();

  // body layer
  this.drawMain(this.bodyMainPath_, this.bodyBounds_);
  this.drawTopShade(this.bodyTopShadePath_, this.bodyBounds_);
  this.drawBottomShade(this.bodyBottomShadePath_, this.bodyBounds_);
  this.drawMain(this.bodyMainShadePath_, this.bodyBounds_);
  this.drawTopBlur(this.bodyTopBlurPath_, this.bodyBounds_);

  // bulb layer
  this.drawMain(this.bulbMainPath_, this.bulbBounds_);
  this.drawTopShade(this.bulbTopShadePath_, this.bulbBounds_);
  this.drawMain(this.bulbMainShadePath_, this.bulbBounds_);
  this.drawTopBlur(this.bulbTopBlurPath_, this.bulbBounds_);

  this.hatch.deserialize(this.bodyMainPath_.serialize());
};


/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.drawHorizontal = anychart.core.linearGauge.pointers.Tank.prototype.drawVertical;


/**
 * Shade.
 * @type {acgraph.vector.Stroke}
 */
anychart.core.linearGauge.pointers.Tank.SHADE = /** @type {acgraph.vector.Stroke} */ ({'thickness': 1, 'opacity': 0.3, 'color': '#FFFFFF'});


/**
 * @type {acgraph.vector.Fill}
 */
anychart.core.linearGauge.pointers.Tank.BODY_SHADE_FILL = /** @type {acgraph.vector.Fill} */ ({
  'angle': 0,
  'keys': [
    {'color': '#FFFFFF', 'offset': '0', 'opacity': 0},
    {'color': '#FFFFFF', 'offset': '0.2', 'opacity': Number(160.0 / 255.0)},
    {'color': '#FFFFFF', 'offset': '0.25', 'opacity': Number(140.0 / 255.0)},
    {'color': '#FFFFFF', 'offset': '0.3', 'opacity': Number(30.0 / 255.0)},
    {'color': '#FFFFFF', 'offset': '0.35', 'opacity': 0},
    {'color': '#FFFFFF', 'offset': '1', 'opacity': 0}
  ]
});


/**
 * @type {acgraph.vector.Fill}
 */
anychart.core.linearGauge.pointers.Tank.BULB_SHADE_FILL = /** @type {acgraph.vector.Fill} */ ({
  'angle': 0,
  'keys': [
    {'color': '#FFFFFF', 'offset': '0', 'opacity': 0},
    {'color': '#FFFFFF', 'offset': '0.2', 'opacity': Number(160.0 / 255.0) * 0.3},
    {'color': '#FFFFFF', 'offset': '0.25', 'opacity': Number(140.0 / 255.0) * 0.3},
    {'color': '#FFFFFF', 'offset': '0.3', 'opacity': Number(30.0 / 255.0) * 0.3},
    {'color': '#FFFFFF', 'offset': '0.35', 'opacity': 0},
    {'color': '#FFFFFF', 'offset': '1', 'opacity': 0}
  ]
});


/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.colorizePointer = function(pointerState) {
  var isVertical = this.isVertical();
  var angle = isVertical ? 0 : 90;

  var color = this.getFinalFill(true, pointerState);
  var colorDarken = anychart.color.darken(color);
  var colorLighten = anychart.color.lighten(color);
  var fill = /** @type {acgraph.vector.Fill} */ ({
    'angle': angle,
    'keys': [
      {'color': colorDarken, 'offset': '0', 'opacity': 1},
      {'color': colorDarken, 'offset': '0.05', 'opacity': 1},
      {'color': colorLighten, 'offset': '0.85', 'opacity': 1},
      {'color': colorLighten, 'offset': '0.85', 'opacity': 1},
      {'color': colorDarken, 'offset': '1', 'opacity': 1}
    ]
  });
  this.bodyMainPath_.fill(fill);
  this.bodyMainPath_.stroke('none');

  this.bodyTopShadePath_.fill('none');
  this.bodyTopShadePath_.stroke(anychart.core.linearGauge.pointers.Tank.SHADE);

  anychart.core.linearGauge.pointers.Tank.BODY_SHADE_FILL['angle'] = angle;
  this.bodyMainShadePath_.fill(anychart.core.linearGauge.pointers.Tank.BODY_SHADE_FILL);
  this.bodyMainShadePath_.stroke('none');

  fill = /** @type {acgraph.vector.Fill} */ ({
    'angle': isVertical ? 50 : 140,
    'keys': [
      {'color': '#FFFFFF', 'offset': '0', 'opacity': 0.1},
      {'color': colorDarken, 'offset': '1', 'opacity': 1}
    ]
  });
  this.bodyTopBlurPath_.fill(fill);
  this.bodyTopBlurPath_.stroke('none');

  this.bodyBottomShadePath_.fill('none');
  this.bodyBottomShadePath_.stroke(anychart.core.linearGauge.pointers.Tank.SHADE);

  ////////////////////

  colorDarken = anychart.color.darken('#FFFFFF');
  colorLighten = anychart.color.lighten('#FFFFFF');
  fill = /** @type {acgraph.vector.Fill} */ ({
    'angle': -angle,
    'keys': [
      {'color': colorDarken, 'offset': '0', 'opacity': 0.3},
      {'color': colorDarken, 'offset': '0.05', 'opacity': 0.3},
      {'color': colorLighten, 'offset': '0.85', 'opacity': 0.3},
      {'color': colorLighten, 'offset': '0.85', 'opacity': 0.3},
      {'color': colorDarken, 'offset': '1', 'opacity': 0.3}
    ]
  });
  this.bulbMainPath_.fill(fill);
  this.bulbMainPath_.stroke('none');

  this.bulbTopShadePath_.fill('none');
  this.bulbTopShadePath_.stroke(anychart.core.linearGauge.pointers.Tank.SHADE);

  anychart.core.linearGauge.pointers.Tank.BULB_SHADE_FILL['angle'] = angle;
  this.bulbMainShadePath_.fill(anychart.core.linearGauge.pointers.Tank.BULB_SHADE_FILL);
  this.bulbMainShadePath_.stroke('none');

  fill = /** @type {acgraph.vector.Fill} */ ({
    'angle': isVertical ? 50 : 140,
    'keys': [
      {'color': '#FFFFFF', 'offset': '0', 'opacity': 0.1 * 0.3},
      {'color': colorDarken, 'offset': '1', 'opacity': 0.3}
    ]
  });
  this.bulbTopBlurPath_.fill(fill);
  this.bulbTopBlurPath_.stroke('none');


  var hatch = this.getFinalHatchFill(true, pointerState);
  this.hatch.fill(hatch);
  this.hatch.stroke('none');
};
//endregion


//region --- SETUP/DISPOSE ---
/** @inheritDoc */
anychart.core.linearGauge.pointers.Tank.prototype.disposeInternal = function() {
  // we do not need to dispose this paths, because they will be disposed on parent's layer disposing.
  this.bodyMainPath_ = null;
  this.bodyTopShadePath_ = null;
  this.bodyBottomShadePath_ = null;
  this.bodyMainShadePath_ = null;
  this.bodyTopBlurPath_ = null;
  this.bulbMainPath_ = null;
  this.bulbTopShadePath_ = null;
  this.bulbMainShadePath_ = null;
  this.bulbTopBlurPath_ = null;

  goog.disposeAll(this.bodyLayer_, this.bulbLayer_);
  this.bodyLayer_ = null;
  this.bulbLayer_ = null;

  anychart.core.linearGauge.pointers.Tank.base(this, 'disposeInternal');
};
//endregion
