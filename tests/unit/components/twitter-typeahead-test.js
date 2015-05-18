/* jshint expr:true */
import { expect } from 'chai';

import {
  describe,
  beforeEach,
  afterEach
} from 'mocha';

import {
  describeComponent,
  it
} from 'ember-mocha';

import Ember from 'ember';

describeComponent(
  'twitter-typeahead',
  'TwitterTypeaheadComponent',
  {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  },
  function() {
    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    var component;

    beforeEach(function () {
      component = this.subject();
    });

    afterEach(function () {
      component = null;
    });

    it('renders', function() {
      // creates the component instance
      expect(component._state).to.equal('preRender');
      // renders the component on the page
      this.render();
      expect(component._state).to.equal('inDOM');
    });

    describe('#retrieveResults', function () {

      it('should filter the results', function () {
        var results;
        var synchronousCallback = function (r) {
          results = r;
        };

        component.content = states;
        component.retrieveResults('x', synchronousCallback);

        expect(results.length).to.eq(2);
        expect(results).to.include.members(['New Mexico', 'Texas']);
      });

    });

    describe('#value', function () {

      it('should set the value on the typeahead, when before render', function (done) {
        component.content = states;
        component.set('value', 'Iowa');

        this.render();

        Ember.run.next(function () {
          expect(component.get('$inputElement').typeahead('val')).to.eq('Iowa');
          done();
        });
      });

      it('should set the value on the typeahead, when after render', function (done) {
        component.content = states;

        this.render();

        Ember.run.next(function () {
          component.set('value', 'Kentucky');

          Ember.run(function () {
            expect(component.get('$inputElement').typeahead('val')).to.eq('Kentucky');
            done();
          });
        });
      });

      it('should set the value on the component when the typeahead value changes', function (done) {
        component.content = states;
        this.render();

        Ember.run.next(function () {
          component.get('$inputElement').typeahead('val', 'Ohio');
          // Idle will only trigger based on focus state, which does not work well with unit tests.
          component.get('$inputElement').trigger('typeahead:idle');

          Ember.run(function () {
            expect(component.get('value')).to.eq('Ohio');
            done();
          });
        });
      });
    });

    describe('Class name overrides for Twitter Typeahead', function () {
      it('should override the input class', function (done) {
        component.inputClass = 'custom-input-css-class';
        this.render();
        Ember.run.next(function () {
          expect(component.$('.custom-input-css-class').length > 0).to.be.true;
          done();
        });
      });

      it('should override the hint class', function (done) {
        component.hintClass = 'custom-hint-css-class';
        this.render();
        Ember.run.next(function () {
          expect(component.$('.custom-hint-css-class').length > 0).to.be.true;
          done();
        });
      });

      it('should override the menu class', function (done) {
        component.menuClass = 'custom-menu-css-class';
        this.render();
        Ember.run.next(function () {
          expect(component.$('.custom-menu-css-class').length > 0).to.be.true;
          done();
        });
      });

      it('should override the dataset class', function (done) {
        component.datasetClass = 'custom-dataset-css-class';
        this.render();
        Ember.run.next(function () {
          expect(component.$('.custom-dataset-css-class').length > 0).to.be.true;
          done();
        });
      });
    });
  }
);
