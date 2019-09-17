/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/no-on-calls-in-components */
/* eslint-disable ember/closure-actions */
import Component from '@ember/component';
import { observer, get } from '@ember/object';
import { on } from '@ember/object/evented';
import { bind } from '@ember/runloop';
import $ from 'jquery';

// import layout from '../templates/components/twitter-typeahead';

export default Component.extend({
  classNames: ['twitter-typeahead'],

  // --- Component parameters -------------------------------------------------
  content: null,
  inputClassNames: null,
  displayKey: null,
  placeholder: null,

  // This is the Ember-style object value
  value: null,

  // This is the Typeahead-style string value
  _valueChanged: observer('value', function () {
    let displayValue = this.formatDisplay(this.get('value'));
    let $inputElement = this.get('$inputElement');

    if ($inputElement) {
      $inputElement.typeahead('val', displayValue);
    }
  }),

  clearValue: function () {
    if(!this.set) {
      return;
    }

    this.set('lastAutocompleteSuggestion', null);
    this.set('value', null);
    this._valueChanged();
  },

  closeAutocomplete: function () {
    let $inputElement = this.get('$inputElement');
    if ($inputElement) {
      $inputElement.typeahead('close');
    }
  },

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
      functionName: 'typeaheadAutocompleteTriggered',
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
  suggestionClass: null,

  // --- Component template names, non-bindable -------------------------------

  footerTemplateFunction: null,
  headerTemplateFunction: null,
  notFoundTemplateFunction: null,
  pendingTemplateFunction: null,
  suggestionTemplateFunction: null,

  // --- Component custom events, can use these as hooks ----------------------

  typeaheadActiveTriggered: null,

  typeaheadIdleTriggered: function () {
    this._setValue(this.getTypeaheadValue());
  },

  typeaheadOpenTriggered: null,
  typeaheadCloseTriggered: null,
  typeaheadChangeTriggered: null,
  typeaheadRenderTriggered: null,

  typeaheadSelectTriggered: function (evt, object) {
    this._setValue(object, true);
  },

  typeaheadCursorChangeTriggered: null,
  typeaheadAsyncRequestTriggered: null,
  typeaheadAsyncCancelTriggered: null,
  typeaheadAsyncReceiveTriggered: null,

  // --- The functions that make things happen --------------------------------
  itemMatchesQuery: function (query, item) {
    var regexp = new RegExp(query, 'i');
    return !!(item.match(regexp));
  },

  formatDisplay: function (obj) {
    var ret = '';

    if (obj) {
      ret = this.get('displayKey') ? get(obj, this.get('displayKey')) : obj;
    }

    return ret;
  },

  defaultRetrieveResults: function (query, syncResultsCallback) {
    var results = [];
    var content = this.get('content');
    var displayKey = this.get('displayKey');

    if (content) {
      $.each(content, (i, item) => {
        let value = displayKey ? get(item, displayKey) : item;

        if (this.itemMatchesQuery(query, value)) {
          results.push(item);
        }
      });
    }

    syncResultsCallback(results);
  },

  customRetrieveResults: function (query, syncResultsCallback, asyncResultsCallback) {
    this.sendAction('onRetrieveResults', query, syncResultsCallback, asyncResultsCallback);
  },

  _setValue: function (value, isFromSelect=false) {
    if (this.get('onSelectValue')) {
      this.customSetValue(value, isFromSelect);
    } else {
      this.defaultSetValue(value, isFromSelect);
    }
  },

  defaultSetValue: function (value) {
    this.set('value', value);
  },

  customSetValue: function (value, isFromSelect) {
    var typedValue;
    var selectedValue;

    if (isFromSelect) {
      selectedValue = value;
      typedValue = this.getTypeaheadValue();
    } else {
      typedValue = value;
    }

    this.sendAction('onSelectValue', typedValue, selectedValue);
  },

  $inputElement: null,

  getTypeaheadValue: function () {
    return this.get('$inputElement').typeahead('val');
  },

  _initializeElement: on('didInsertElement', function () {
    this.set('$inputElement', this.$('input'));

    this.get('$inputElement').typeahead(
      {
        hint: this.get('hint'),
        highlight: this.get('highlight'),
        minLength: this.get('minLength'),
        classNames: {
          input: this.get('inputClass') || undefined,           // This undefined keeps twitter typeahead from not
          hint: this.get('hintClass') || undefined,             // using the default class
          menu: this.get('menuClass') || undefined,
          dataset: this.get('datasetClass') || undefined,
          suggestion: this.get('suggestionClass') || undefined
        }
      },
      {
        display: bind(this, this.formatDisplay),
        limit: this.get('limit'),
        name: this.get('name'),
        source: this.get('onRetrieveResults') ? bind(this, this.customRetrieveResults) : bind(this, this.defaultRetrieveResults),
        templates: {
          footer: this.get('footerTemplateFunction') || undefined,
          header: this.get('headerTemplateFunction') || undefined,
          notFound: this.get('notFoundTemplateFunction') || undefined,
          pending: this.get('pendingTemplateFunction') || undefined,
          suggestion: this.get('suggestionTemplateFunction') || undefined
        }
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
        this.get('$inputElement').bind(eventName, bind(this, handlerFunction));
      }
    }

    this._valueChanged();
  }),

  _teardownElement: on('willDestroyElement', function () {
    this.get('$inputElement').typeahead('destroy');
    this.set('$inputElement', null);
  }),

  concatenatedProperties: ['inputClassNames', 'customEventMap']
});
