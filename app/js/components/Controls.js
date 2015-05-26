define(function(require) {
    'use strict';

    var _ = require('lodash');
    var React = require('react');

    return React.createClass({
        propTypes: {
            ageData: React.PropTypes.object.isRequired,
            toggleAgeCallback: React.PropTypes.func.isRequired
        },

        render: function() {
            var ageControls = this.getAgeControlsMarkup();

            return (
                <div className="header">
                    <div className="controls">
                        {ageControls}
                    </div>
                </div>
            );
        },

        getAgeControlsMarkup: function() {
            var ageToggles = [];

            _.each(this.props.ageData, function(age, key) {
                ageToggles.push(this.getAgeToggleMarkup(age, key));
            }, this);

            return (
                <div className="age-controls">
                    {ageToggles}
                </div>
            );
        },

        getAgeToggleMarkup: function(age, key) {
            return (
                <div className="age-type" key={key}>
                    <input ref={key} type="checkbox" checked={this.props.selectedAges[key]} onChange={this.toggleAgeHandler.bind(this, key)} />
                    <span>{age.label}</span>
                </div>
            );
        },

        toggleAgeHandler: function(key) {
            /* TODO:
             * Ideally this would trigger an action to place this state in a Flux store.
             * A change event would then be received by the Page component to propagate the new state to child
             * components. To limit scope of this application we've decided to handle this through a simple callback
             * to set the state on the parent component.
             */
            var selectedAges = _.clone(this.props.selectedAges);
            selectedAges[key] = this.refs[key].getDOMNode().checked;
            this.props.toggleAgeCallback(selectedAges);
        }
    });
});
