import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['twitter-typeahead'],

  // --- Component parameters -------------------------------------------------
  content: null,
  /**
   * @type {String|String.[]}
   */
  inputClassNames: null,
  value: null,

  // --- Non-bindable attributes of the typeahead -----------------------------
  highlight: null,
  hint: null,
  limit: null,
  minLength: null,
  name: null,

  // --- Component class names, also non-bindable -----------------------------

  regexQuery: function (query) {
    return new RegExp(query, 'i');
  },

  retrieveResults: function (query, syncResultsCallback) {
    var results = [];
    var content = this.get('content');

    if (content) {
      results = content;
    }

    syncResultsCallback(results);
  },

  $inputElement: Ember.computed({
    get: function () {
      return this.$('input');
    }
  }),

  _initializeElement: Ember.on('didInsertElement', function () {
    this.get('$inputElement').typeahead(
      {
        hint: this.get('hint'),
        highlight: this.get('highlight'),
        minLength: this.get('minLength')
      },
      {
        limit: this.get('limit'),
        name: this.get('name'),
        source: Ember.run.bind(this, this.retrieveResults)
      }
    );
  }),

  concatenatedProperties: ['inputClassNames']
});
