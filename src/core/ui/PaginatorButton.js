goog.provide('anychart.core.ui.PaginatorButton');
goog.require('acgraph');
goog.require('anychart.core.ui.Button');



/**
 * Paginator button class.
 * @constructor
 * @extends {anychart.core.ui.Button}
 */
anychart.core.ui.PaginatorButton = function() {
  goog.base(this);

  /**
   * Drawer for the button background.
   * @type {function(acgraph.vector.Path, anychart.math.Rect)}
   * @private
   */
  this.buttonDrawer_ = goog.nullFunction;

  this.supportedStates(anychart.core.ui.Button.State.CHECKED, false);
};
goog.inherits(anychart.core.ui.PaginatorButton, anychart.core.ui.Button);


/**
 * Getter for a button drawer.
 * @return {function(acgraph.vector.Path, anychart.math.Rect)} Current drawer function.
 *//**
 * Setter for button drawer.
 * @param {function(acgraph.vector.Path, anychart.math.Rect)=} opt_value Value to set.
 * @return {!anychart.core.ui.PaginatorButton} An instance of the {@link anychart.core.ui.PaginatorButton} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {function(acgraph.vector.Path, anychart.math.Rect)=} opt_value Drawer function.
 * @return {(anychart.core.ui.PaginatorButton|function(acgraph.vector.Path, anychart.math.Rect))} Current drawer function or self for chaining.
 */
anychart.core.ui.PaginatorButton.prototype.buttonDrawer = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.buttonDrawer_ != opt_value) {
      this.buttonDrawer_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BUTTON_BACKGROUND, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.buttonDrawer_;
};


/**
 * Overloaded to avoid drawing text.
 * @inheritDoc
 */
anychart.core.ui.PaginatorButton.prototype.drawText = goog.nullFunction;


/**
 * Overloaded to have an option of button display customization.
 * @inheritDoc
 */
anychart.core.ui.PaginatorButton.prototype.drawBackground = function(fill, stroke) {
  if (!this.backgroundPath) {
    this.backgroundPath = acgraph.path();
    this.bindHandlersToGraphics(this.backgroundPath, this.handleMouseOver, this.handleMouseOut, null, null,
        this.handleMouseDown, this.handleMouseUp);
    this.registerDisposable(this.backgroundPath);
  }

  this.backgroundPath.clear();
  this.buttonDrawer_(this.backgroundPath, this.buttonBounds);

  this.backgroundPath.fill(fill);
  this.backgroundPath.stroke(stroke);
};


/** @inheritDoc */
anychart.core.ui.PaginatorButton.prototype.initStateSettings = function() {
  this.stateSettings_ = {
    'normal': {
      'stroke': '1 #666 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '-90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'hover': {
      'stroke': '1 #aaa 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '-90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'pushed': {
      'stroke': '1 #888 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '90'
      },
      'text': {
        'fontColor': '#333'
      }
    },
    'checked': {
      'stroke': '1 #666 1',
      'fill': {
        'keys': ['0 #ffffff', '0.5 #e7e7e7', '1 #d0d0d0'],
        'angle': '90'
      },
      'text': {
        'fontColor': '#000'
      }
    },
    'disabled': {
      'stroke': '1 #666 1',
      'fill': '#aaa',
      'text': {
        'fontColor': '#777'
      }
    }
  };
};
