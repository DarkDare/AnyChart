goog.provide('anychart.elements.TooltipItem');
goog.require('anychart.VisualBaseWithBounds');
goog.require('anychart.elements.Label');
goog.require('anychart.elements.Separator');
goog.require('anychart.elements.Title');
goog.require('goog.async.Delay');



/**
 * @constructor
 * @extends {anychart.VisualBase}
 */
anychart.elements.TooltipItem = function() {
  goog.base(this);

  /**
   * Tooltip item title.
   * @type {anychart.elements.Title}
   * @private
   */
  this.title_ = null;

  /**
   * Tooltip item separator.
   * @type {anychart.elements.Separator}
   * @private
   */
  this.separator_ = null;

  /**
   * Tooltip item content.
   * @type {anychart.elements.Label}
   * @private
   */
  this.label_ = null;

  /**
   * Tooltip item x coordinate.
   * @type {number}
   * @private
   */
  this.x_ = 0;

  /**
   * Tooltip item y coordinate.
   * @type {number}
   * @private
   */
  this.y_ = 0;

  /**
   * Tooltip item X offset.
   * @type {number}
   * @private
   */
  this.offsetX_ = 0;

  /**
   * Tooltip item Y offset.
   * @type {number}
   * @private
   */
  this.offsetY_ = 0;

  /**
   * Tooltip anchor settings.
   * @type {anychart.utils.NinePositions}
   * @private
   */
  this.anchor_;

  /**
   * Tooltip item background.
   * @type {anychart.elements.Background}
   * @private
   */
  this.background_ = null;

  /**
   * Tooltip item padding.
   * @type {anychart.utils.Padding}
   * @private
   */
  this.padding_ = null;

  /**
   * Is tooltip visible.
   * @type {boolean}
   * @private
   */
  this.visible_ = true;

  /**
   * Delay in milliseconds before tooltip item become invisible on visible(false) call.
   * @type {number}
   * @private
   */
  this.hideDelay_;

  /**
   * Timer object to hide tooltip item with delay.
   * @type {goog.async.Delay}
   * @private
   */
  this.timer_ = null;

  /**
   * Root tooltip item layer.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.layer_ = null;

  /**
   * Cache of content bounds of tooltip item.
   * @type {anychart.math.Rect}
   * @private
   */
  this.contentBounds_ = null;

  /**
   * Cache of content bounds with applied padding of tooltip item.
   * @type {anychart.math.Rect}
   * @private
   */
  this.boundsWithoutPadding_ = null;

  /**
   * Cache of content bounds with applied padding mines title bounds.
   * @type {anychart.math.Rect}
   * @private
   */
  this.titleRemainingBounds_ = null;

  /**
   * Cache of content bounds with applied padding mines title and separator bounds.
   * @type {anychart.math.Rect}
   * @private
   */
  this.separatorRemainingBounds_ = null;

  /**
   * Cache of tooltip item position.
   * @type {acgraph.math.Coordinate}
   * @private
   */
  this.position_;


  this.createTimerObject_();
  this.restoreDefaults();
  this.invalidate(this.SUPPORTED_CONSISTENCY_STATES);
};
goog.inherits(anychart.elements.TooltipItem, anychart.VisualBase);


/**
 * Supported signals. Adds BOUNDS_CHANGED to Base signals.
 * @type {number}
 */
anychart.elements.TooltipItem.prototype.SUPPORTED_SIGNALS = 0;
// Если придется использовать его как отдельную сущность, то нужно вернуть сюда поддержку сигналов.
// Если тултип так не будет поддерживать несколько разных TooltipItem, то эти два класса вообще нужно слить вместе.
// Сейчас здесь убрана поддержка сигналов, потому что итем управляется напрямую тултипом и ему не важно, что у него
// там где меняется, он сам вызывает у него draw() и доступа до item нету.


/**
 * Supported consistency states. Adds POSITION, BOUNDS, TITLE, SEPARATOR, LABELS, BACKGROUND, VISIBILITY to Base states.
 * @type {number}
 */
anychart.elements.TooltipItem.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
        anychart.ConsistencyState.POSITION |
        anychart.ConsistencyState.BOUNDS |
        anychart.ConsistencyState.TITLE |
        anychart.ConsistencyState.SEPARATOR |
        anychart.ConsistencyState.LABELS |
        anychart.ConsistencyState.BACKGROUND |
        anychart.ConsistencyState.VISIBILITY;


//----------------------------------------------------------------------------------------------------------------------
//
//  Title.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Tooltip item title.
 * @param {(anychart.elements.Title|Object|string|null)=} opt_value Tooltip settings.
 * @return {!(anychart.elements.Title|anychart.elements.TooltipItem)} Title instance or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.title = function(opt_value) {
  if (!this.title_) {
    this.title_ = new anychart.elements.Title();
    this.title_.zIndex(1);
    this.title_.listenSignals(this.onTitleSignal_, this);
    this.registerDisposable(this.title_);
  }

  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.elements.Title) {
      this.title_.deserialize(opt_value.serialize());
    } else if (goog.isObject(opt_value)) {
      this.title_.deserialize(opt_value);
    } else if (anychart.isNone(opt_value)) {
      this.title_.enabled(false);
    } else if (goog.isString(opt_value)) {
      this.title_.text(opt_value);
    }
    return this;
  } else {
    return this.title_;
  }
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.elements.TooltipItem.prototype.onTitleSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    this.contentBounds_ = null;
    this.invalidate((anychart.ConsistencyState.BOUNDS |
        anychart.ConsistencyState.POSITION |
        anychart.ConsistencyState.TITLE |
        anychart.ConsistencyState.SEPARATOR |
        anychart.ConsistencyState.LABELS |
        anychart.ConsistencyState.BACKGROUND),
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.TITLE, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Separator.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Tooltip item title separator.
 * @param {(anychart.elements.Separator|Object|string|null)=} opt_value Separator settings.
 * @return {!(anychart.elements.Separator|anychart.elements.TooltipItem)} Separator instance or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.separator = function(opt_value) {
  if (!this.separator_) {
    this.separator_ = new anychart.elements.Separator();
    this.separator_.zIndex(1);
    this.separator_.listenSignals(this.onSeparatorSignal_, this);
    this.registerDisposable(this.separator_);
  }

  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.elements.Separator) {
      this.separator_.deserialize(opt_value.serialize());
    } else if (goog.isObject(opt_value)) {
      this.separator_.deserialize(opt_value);
    } else if (anychart.isNone(opt_value)) {
      this.separator_.enabled(false);
    }
    return this;
  } else {
    return this.separator_;
  }
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.elements.TooltipItem.prototype.onSeparatorSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    this.contentBounds_ = null;
    this.invalidate((anychart.ConsistencyState.BOUNDS |
        anychart.ConsistencyState.POSITION |
        anychart.ConsistencyState.TITLE |
        anychart.ConsistencyState.SEPARATOR |
        anychart.ConsistencyState.LABELS |
        anychart.ConsistencyState.BACKGROUND),
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.SEPARATOR, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Content.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Tooltip item content.
 * @param {(anychart.elements.Label|Object|string|null)=} opt_value Content settings.
 * @return {!(anychart.elements.Label|anychart.elements.TooltipItem)} Labels instance or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.content = function(opt_value) {
  if (!this.label_) {
    this.label_ = new anychart.elements.Label();
    this.label_.zIndex(1);
    this.label_.listenSignals(this.onContentSignal_, this);
    this.registerDisposable(this.label_);
  }

  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.elements.Label) {
      this.label_.deserialize(opt_value.serialize());
    } else if (goog.isObject(opt_value)) {
      this.label_.deserialize(opt_value);
    } else if (anychart.isNone(opt_value)) {
      this.label_.enabled(false);
    } else if (goog.isString(opt_value)) {
      this.label_.text(opt_value);
    }
    return this;
  } else {
    return this.label_;
  }
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.elements.TooltipItem.prototype.onContentSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    this.contentBounds_ = null;
    this.invalidate((anychart.ConsistencyState.BOUNDS |
        anychart.ConsistencyState.POSITION |
        anychart.ConsistencyState.TITLE |
        anychart.ConsistencyState.SEPARATOR |
        anychart.ConsistencyState.LABELS |
        anychart.ConsistencyState.BACKGROUND),
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.LABELS, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Background.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Tooltip item background.
 * @param {(anychart.elements.Background|Object|string|null)=} opt_value Tooltip item background settings.
 * @return {!(anychart.elements.Background|anychart.elements.TooltipItem)} Background instance or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.background = function(opt_value) {
  if (!this.background_) {
    this.background_ = new anychart.elements.Background();
    this.background_.zIndex(0);
    this.background_.listenSignals(this.backgroundInvalidated_, this);
    this.registerDisposable(this.background_);
  }

  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.elements.Background) {
      this.background_.deserialize(opt_value.serialize());
    } else if (goog.isObject(opt_value)) {
      this.background_.deserialize(opt_value);
    } else if (anychart.isNone(opt_value)) {
      this.background_.enabled(false);
    }
    return this;
  } else {
    return this.background_;
  }
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.elements.TooltipItem.prototype.backgroundInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.BACKGROUND, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Padding.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Tooltip item padding.
 * @param {(anychart.utils.Padding|Object|string|null)=} opt_value Tooltip item padding settings.
 * @return {!(anychart.utils.Padding|anychart.elements.TooltipItem)} Padding instance or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.padding = function(opt_value) {
  if (!this.padding_) {
    this.padding_ = new anychart.utils.Padding();
    this.padding_.listenSignals(this.onPaddingSignal_, this);
    this.registerDisposable(this.padding_);
  }

  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.utils.Padding) {
      this.padding_.deserialize(opt_value.serialize());
    } else if (goog.isObject(opt_value)) {
      this.padding_.deserialize(opt_value);
    } else if (anychart.isNone(opt_value)) {
      this.padding_.enabled(false);
    }
    return this;
  } else {
    return this.padding_;
  }
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.elements.TooltipItem.prototype.onPaddingSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.contentBounds_ = null;
    this.invalidate(anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Position.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * X coordinate of tooltip item position.
 * @param {number=} opt_value New value of X coordinate of tooltip item position.
 * @return {number|anychart.elements.TooltipItem} X coordinate of tooltip item position of itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.x = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.x_ != opt_value) {
      this.x_ = opt_value;
      this.position_ = null;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.x_;
  }
};


/**
 * Y coordinate of tooltip item position.
 * @param {number=} opt_value New value of Y coordinate of tooltip item position.
 * @return {number|anychart.elements.TooltipItem} Y coordinate of tooltip item position of itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.y = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.y_ != opt_value) {
      this.y_ = opt_value;
      this.position_ = null;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.y_;
  }
};


/**
 * Offset by X of tooltip item position.
 * @param {number=} opt_value New value of X offset of tooltip item position.
 * @return {number|anychart.elements.TooltipItem} X offset of tooltip item position of itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.offsetX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.offsetX_ != opt_value) {
      this.offsetX_ = opt_value;
      this.position_ = null;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.offsetX_;
  }
};


/**
 * Y offset of tooltip item position.
 * @param {number=} opt_value New value of Y offset of tooltip item position.
 * @return {number|anychart.elements.TooltipItem} Y offset of tooltip item position of itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.offsetY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.offsetY_ != opt_value) {
      this.offsetY_ = opt_value;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.offsetY_;
  }
};


/**
 * Gets or sets Tooltip item anchor settings.
 * @param {(anychart.utils.NinePositions|string)=} opt_value Tooltip item anchor settings.
 * @return {anychart.elements.TooltipItem|anychart.utils.NinePositions} Tooltip item anchor settings or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.anchor = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.utils.normalizeNinePositions(opt_value);
    if (this.anchor_ != opt_value) {
      this.anchor_ = opt_value;
      this.position_ = null;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.anchor_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Visibility.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Change tooltip item visibility settings.
 * @param {boolean=} opt_value Tooltip item visibility settings.
 * @return {boolean|anychart.elements.TooltipItem} Tooltip item visibility settings or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.visible = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.visible_ != opt_value) {
      this.visible_ = opt_value;
      this.invalidate(anychart.ConsistencyState.VISIBILITY, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.visible_;
  }
};


/**
 * Sets/gets delay in milliseconds before tooltip item become invisible on visible(false) call.
 * @param {number=} opt_value Delay in milliseconds before tooltip item become invisible on visible(false) call.
 * @return {number|anychart.elements.TooltipItem} delay in milliseconds before tooltip item become invisible on visible(false) call or itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.hideDelay = function(opt_value) {
  if (goog.isDef(opt_value)) {
    //we no need to invalidate something here
    if (this.hideDelay_ != opt_value) {
      this.hideDelay_ = opt_value;
      this.createTimerObject_();
    }
    return this;
  } else {
    return this.hideDelay_;
  }
};


/**
 * Create timer object for hiding with delay, if hiding process already started,
 * mark timer to recreate after hiding process will end.
 * @private
 */
anychart.elements.TooltipItem.prototype.createTimerObject_ = function() {
  if (this.timer_ && this.timer_.isActive()) {
    this.disposeTimerOnTick_ = true;
  } else {
    goog.dispose(this.timer_);
    this.timer_ = new goog.async.Delay(function() {
      this.remove();
      if (this.disposeTimerOnTick_) {
        this.disposeTimerOnTick_ = false;
        this.createTimerObject_();
      }
    }, this.hideDelay_, this);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Draw tooltip item.
 * @return {anychart.elements.TooltipItem} Return itself for chaining call.
 */
anychart.elements.TooltipItem.prototype.draw = function() {
  if (!this.checkDrawingNeeded())
    return this;

  if (!this.layer_) {
    this.layer_ = acgraph.layer();
    this.layer_.pointerEvents('none');
  }


  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    this.layer_.zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER | anychart.ConsistencyState.VISIBILITY)) {
    if (this.visible()) {
      this.layer_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
      this.timer_.stop();
    } else {
      if (this.hideDelay_ <= 0) {
        this.remove();
      } else if (!this.timer_.isActive()) {
        this.timer_.start();
      }
    }
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
    this.markConsistent(anychart.ConsistencyState.VISIBILITY);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.POSITION)) {
    this.calculatePosition_();//НАГРУЗКА!!!

    this.layer_.setTransformationMatrix(1, 0, 0, 1, 0, 0);
    this.layer_.translate(this.position_.x, this.position_.y);

    this.markConsistent(anychart.ConsistencyState.POSITION);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.calculateContentBounds_();//НАГРУЗКА!!!
    this.boundsWithoutPadding_ = this.padding_ ?
        this.padding_.tightenBounds(/** @type {!anychart.math.Rect} */(this.contentBounds_)) :
        this.contentBounds_;
    this.titleRemainingBounds_ = null;
    this.separatorRemainingBounds_ = null;
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }


  if (this.hasInvalidationState(anychart.ConsistencyState.BACKGROUND)) {
    var background = /** @type {anychart.elements.Background} */(this.background());
    background.suspendSignalsDispatching();
    background.pixelBounds(this.contentBounds_);
    if (this.enabled() && this.visible()) background.container(this.layer_);
    background.resumeSignalsDispatching(false);
    background.draw();//НАГРУЗКА!!!

    this.markConsistent(anychart.ConsistencyState.BACKGROUND);
  }


  if (this.hasInvalidationState(anychart.ConsistencyState.TITLE)) {
    var title = /** @type {anychart.elements.Title} */ (this.title());
    title.suspendSignalsDispatching();
    if (this.enabled() && this.visible()) title.container(this.layer_);
    title.parentBounds(this.boundsWithoutPadding_);
    title.resumeSignalsDispatching(false);
    title.draw();//НАГРУЗКА!!!

    //title bounds
    if (!this.titleRemainingBounds_ && title.enabled())
      this.titleRemainingBounds_ = title.getRemainingBounds();

    this.markConsistent(anychart.ConsistencyState.TITLE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SEPARATOR)) {
    var separator = /** @type {anychart.elements.Separator} */(this.separator());
    separator.suspendSignalsDispatching();
    if (this.enabled() && this.visible()) separator.container(this.layer_);
    separator.parentBounds(this.titleRemainingBounds_ || this.contentBounds_);
    separator.resumeSignalsDispatching(false);
    separator.draw();//НАГРУЗКА!!!

    //separator bounds
    if (!this.separatorRemainingBounds_ && separator.enabled())
      this.separatorRemainingBounds_ = separator.getRemainingBounds();

    this.markConsistent(anychart.ConsistencyState.SEPARATOR);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.LABELS)) {
    var label = /** @type {anychart.elements.Label} */(this.content());
    var remainingBounds = this.separatorRemainingBounds_ || this.titleRemainingBounds_ || this.contentBounds_;
    label.suspendSignalsDispatching();
    if (this.enabled() && this.visible()) label.container(this.layer_);
    label.parentBounds(remainingBounds);
    label.resumeSignalsDispatching(false);
    label.draw();//НАГРУЗКА!!!

    this.markConsistent(anychart.ConsistencyState.LABELS);
  }

  return this;
};


/** @inheritDoc */
anychart.elements.TooltipItem.prototype.remove = function() {
  if (this.layer_) this.layer_.parent(null);
};


/**
 * Calculate tooltip item content bounds and cache it to this.contentBounds_.
 * @private
 */
anychart.elements.TooltipItem.prototype.calculateContentBounds_ = function() {
  if (!this.contentBounds_) {
    var result = new anychart.math.Rect(0, 0, 0, 0);
    var separatorBounds;

    var padding = /** @type {anychart.utils.Padding} */(this.padding());
    padding.widenBounds(result);

    var title = /** @type {anychart.elements.Title} */(this.title());
    if (title.enabled()) {
      title.parentBounds(null);
      var titleBounds = title.getContentBounds();
      result.width = Math.max(result.width, titleBounds.width);
      result.height += titleBounds.height;
    }

    var label = /** @type {anychart.elements.Label} */(this.content());
    if (label.enabled()) {
      var contentContentBounds = label.getContentBounds();
      result.width = Math.max(result.width, contentContentBounds.width);
      result.height += contentContentBounds.height;
    }

    var separator = /** @type {anychart.elements.Separator} */(this.separator());
    if (separator.enabled()) {
      separator.parentBounds((title.enabled() || label.enabled()) ? result : null);
      separatorBounds = separator.getContentBounds();
      result.width = Math.max(result.width, separatorBounds.width);
      result.height += separatorBounds.height;
    }

    this.contentBounds_ = result;
  }
};


/**
 * Calculate tooltip item position and cache it to this.position_.
 * @private
 */
anychart.elements.TooltipItem.prototype.calculatePosition_ = function() {
  this.calculateContentBounds_();

  if (!this.position_) {
    /** @type {acgraph.math.Coordinate} */
    var position = new acgraph.math.Coordinate(this.x_, this.y_);
    var anchor = anychart.utils.getCoordinateByAnchor(this.contentBounds_, this.anchor_);
    position.x -= anchor.x;
    position.y -= anchor.y;
    anychart.utils.applyOffsetByAnchor(/** @type {acgraph.math.Coordinate} */ (position), this.anchor_, this.offsetX_, this.offsetY_);
    this.position_ = position;
  }
};


/**
 * Return Tooltip item content bounds.
 * @return {anychart.math.Rect} Tooltip item content bounds.
 */
anychart.elements.TooltipItem.prototype.getPixelBounds = function() {
  this.calculatePosition_(); //also calculate content bounds, because it need it.
  return new anychart.math.Rect(this.position_.x, this.position_.y, this.contentBounds_.width, this.contentBounds_.height);
};


/**
 * Return Tooltip item content bounds.
 * @return {anychart.math.Rect} Tooltip item content bounds.
 */
anychart.elements.TooltipItem.prototype.getContentBounds = function() {
  this.calculateContentBounds_();
  return this.contentBounds_;
};


/**
 * Restore tooltip item default settings.
 */
anychart.elements.TooltipItem.prototype.restoreDefaults = function() {
  this.zIndex(100);
  this.anchor(anychart.utils.NinePositions.BOTTOM);
  this.offsetX(5);
  this.offsetY(5);
  this.hideDelay(0);

  var separator = /** @type {anychart.elements.Separator} */(this.separator());
  separator.height(1);
  separator.margin(0, 5, 10, 5);
  separator.enabled(false);

  var title = /** @type {anychart.elements.Title}*/(this.title());
  title.text('Tooltip item title');
  title.fontFamily('Lucida Grande, Lucida Sans Unicode, Verdana, Arial');
  title.fontSize(12);
  title.fontColor('rgb(51,51,51)');
  title.margin(0);
  title.padding(8, 8, 10, 10);
  title.background(null);

  var content = /** @type {anychart.elements.Label}*/(this.content());
  content.text('content text');
  content.fontColor('#0d233a');
  content.fontSize(14);
  content.padding(0, 10, 10, 10);
  content.background(null);

  var background = /** @type {anychart.elements.Background}*/(this.background());
  background.fill('#fefefe');
  background.stroke('#2f7ed8');
  background.corners(4);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  JSON.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @inheritDoc
 */
anychart.elements.TooltipItem.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  if (this.title_) json['title'] = this.title_.serialize();
  if (this.separator_) json['separator'] = this.separator_.serialize();
  if (this.label_) json['content'] = this.label_.serialize();
  if (this.background_) json['background'] = this.background_.serialize();
  if (this.padding_) json['padding'] = this.padding_.serialize();

  json['x'] = this.x_;
  json['y'] = this.y_;
  json['anchor'] = this.anchor_;
  json['visible'] = this.visible_;
  json['hideDelay'] = this.hideDelay_;

  return json;
};


/**
 * @inheritDoc
 */
anychart.elements.TooltipItem.prototype.deserialize = function(config) {
  goog.base(this, 'deserialize', config);

  this.title(config['title']);
  this.separator(config['separator']);
  this.content(config['content']);
  this.background(config['background']);
  this.padding(config['padding']);
  this.x(config['x']);
  this.y(config['y']);
  this.anchor(config['anchor']);
  this.visible(config['visible']);
  this.hideDelay(config['hideDelay']);

  return this;
};


