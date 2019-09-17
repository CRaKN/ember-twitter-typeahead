'use strict';

module.exports = {
  name: 'ember-twitter-typeahead2',

  included: function(app) {
    this._super.included(app);

    app.import('node_modules/typeahead.js/dist/typeahead.jquery.min.js');
  }
};
