/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-twitter-typeahead',

  included: function(app) {
    this._super.included(app);

    app.import('vendor/typeahead.js/typeahead.jquery.min.js');
  }
};
