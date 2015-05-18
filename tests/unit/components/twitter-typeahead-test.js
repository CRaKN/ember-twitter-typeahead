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

    
  }
);
