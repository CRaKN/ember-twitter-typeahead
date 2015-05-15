/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-twitter-typeahead',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/typeahead.js/dist/typeahead.jquery.min.js');
  }
};
