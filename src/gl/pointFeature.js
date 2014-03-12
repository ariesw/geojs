//////////////////////////////////////////////////////////////////////////////
/**
 * @module geo.gl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, indent: 2*/

/*global geo, ggl, inherit, document$*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of pointFeature
 *
 * @class
 * @returns {ggl.pointFeature}
 */
//////////////////////////////////////////////////////////////////////////////
ggl.pointFeature = function(arg) {
  "use strict";
  if (!(this instanceof ggl.pointFeature)) {
    return new ggl.pointFeature(arg);
  }
  arg = arg || {};
  geo.pointFeature.call(this, arg);

  ////////////////////////////////////////////////////////////////////////////
  /**
   * @private
   */
  ////////////////////////////////////////////////////////////////////////////
  var m_actor = null,
      m_buildTime = vgl.timestamp(),
      s_init = this._init,
      s_update = this._update;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Initialize
   */
  ////////////////////////////////////////////////////////////////////////////
  this._init = function(arg) {
    s_init.call(this, arg);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Build
   *
   * @override
   */
  ////////////////////////////////////////////////////////////////////////////
  this._build = function() {
    if (m_actor) {
      this.renderer()._contextRenderer().removeActor(m_actor);
    }

    m_actor = vgl.utils.createPoints(this.positions(), this.style().colors);
    this.renderer()._contextRenderer().addActor(m_actor);
    m_buildTime.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Update
   *
   * @override
   */
  ////////////////////////////////////////////////////////////////////////////
  this._update = function() {
    s_update.call(this);

    if (this.dataTime().getMTime() >= m_buildTime.getMTime()) {
      this._build();
    }

    if (this.updateTime().getMTime() <= this.getMTime()) {
      if (this.style.color instanceof vgl.lookupTable) {
        vgl.utils.updateColorMappedMaterial(this.material(),
          this.style.color);
      }
      this.updateTime().modified();
    }
  };

  this._init(arg);
  return this;
};

inherit(ggl.pointFeature, geo.pointFeature);

// Now register it
geo.registerFeature('webgl', 'pointFeature', ggl.pointFeature);