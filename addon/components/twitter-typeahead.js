import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['twitter-typeahead'],

  // --- Component parameters -------------------------------------------------
  content: null,

  /**
   * @type {String|String.[]}
   */
  inputClassNames: null,

  value: Ember.computed({
    get: function () {
      var $inputElement = this.get('$inputElement');
      var value = '';

      if ($inputElement) {
        value = $inputElement.typeahead('val');
      }

      return value;
    },
    set: function (key, value) {
      var $inputElement = this.get('$inputElement');
      if ($inputElement) {
        $inputElement.typeahead('val', value);
      }
      return value;
    }
  }),

  customEventMap: [
    {
      functionName: 'typeaheadActiveTriggered',
      eventName: 'typeahead:active'
    },
    {
      functionName: 'typeaheadIdleTriggered',
      eventName: 'typeahead:idle'
    },
    {
      functionName: 'typeaheadOpenTriggered',
      eventName: 'typeahead:open'
    },
    {
      functionName: 'typeaheadCloseTriggered',
      eventName: 'typeahead:close'
    },
    {
      functionName: 'typeaheadChangeTriggered',
      eventName: 'typeahead:change'
    },
    {
      functionName: 'typeaheadRenderTriggered',
      eventName: 'typeahead:render'
    },
    {
      functionName: 'typeaheadSelectTriggered',
      eventName: 'typeahead:select'
    },
    {
      functionName: 'typeaheadAutoCompleteTriggered',
      eventName: 'typeahead:autocomplete'
    },
    {
      functionName: 'typeaheadCursorChangeTriggered',
      eventName: 'typeahead:cursorchange'
    },
    {
      functionName: 'typeaheadAsyncRequestTriggered',
      eventName: 'typeahead:asyncrequest'
    },
    {
      functionName: 'typeaheadAsyncCancelTriggered',
      eventName: 'typeahead:asynccancel'
    },
    {
      functionName: 'typeaheadAsyncReceiveTriggered',
      eventName: 'typeahead:asyncreceive'
    }
  ],

  // --- Non-bindable attributes of the typeahead -----------------------------
  highlight: null,
  hint: null,
  limit: null,
  minLength: null,
  name: null,

  // --- Component class names, also non-bindable -----------------------------

  inputClass: null,
  hintClass: null,
  menuClass: null,
  datasetClass: null,

  // --- Component custom events, can use these as hooks ----------------------

  typeaheadActiveTriggered: null,

  typeaheadIdleTriggered: function () {
    this.set('value', this.get('$inputElement').typeahead('val'));
  },

  typeaheadOpenTriggered: null,
  typeaheadCloseTriggered: null,
  typeaheadChangeTriggered: null,
  typeaheadRenderTriggered: null,
  typeaheadAutoCompleteTriggered: null,
  typeaheadCursorChangeTriggered: null,
  typeaheadAsyncRequestTriggered: null,
  typeaheadAsyncCancelTriggered: null,
  typeaheadAsyncReceiveTriggered: null,

  // --- The functions that make things happen --------------------------------
  itemMatchesQuery: function (query, item) {
    var regexp = new RegExp(query, 'i');
    return !!(item.match(regexp));
  },

  retrieveResults: function (query, syncResultsCallback) {
    var results = [];
    var content = this.get('content');

    if (content) {
      Ember.$.each(content, (i, item) => {
        if (this.itemMatchesQuery(query, item)) {
          results.push(item);
        }
      });
    }

    syncResultsCallback(results);
  },

  $inputElement: Ember.computed({
    get: function () {
      return this.$('input');
    }
  }),

  _initializeElement: Ember.on('didInsertElement', function () {
    let $input = this.get('$inputElement');

    $input.typeahead(
      {
        hint: this.get('hint'),
        highlight: this.get('highlight'),
        minLength: this.get('minLength'),
        classNames: {
          input: this.get('inputClass') || undefined,           // This undefined keeps twitter typeahead from not
          hint: this.get('hintClass') || undefined,             // using the default class
          menu: this.get('menuClass') || undefined,
          dataset: this.get('datasetClass') || undefined
        }
      },
      {
        limit: this.get('limit'),
        name: this.get('name'),
        source: Ember.run.bind(this, this.retrieveResults)
      }
    );

    let customEventMap = this.get('customEventMap');
    let customEventMapLength = this.get('customEventMap.length');
    let i;

    for (i = 0; i < customEventMapLength; i++) {
      let eventName = customEventMap[i].eventName;
      let functionName = customEventMap[i].functionName;
      let handlerFunction = this.get(functionName);

      if (handlerFunction) {
        $input.bind(eventName, Ember.run.bind(this, handlerFunction));
      }
    }

    let value = this.get('value');

    if (value) {
      $input.typeahead('val', value);
    }
  }),

  concatenatedProperties: ['inputClassNames', 'customEventMap']
});
