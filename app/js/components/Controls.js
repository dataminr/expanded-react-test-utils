define(function(require) {
    'use strict';

    var _ = require('lodash');
    var React = require('react');
    var AgeStore = require('stores/AgeStore');

    var Controls = React.createClass({
        propTypes: {
            ageData: React.PropTypes.object.isRequired,
            selectedAges: React.PropTypes.object.isRequired
        },

        /**
         * Updates the state of an age group within the store, givin it's key
         * @param {String} key Name of the index that is changing
         */
        toggleAgeHandler: function(key) {
            AgeStore.toggleAgeSelected(key);
        },

        /**
         * Returns markup for a single age range checkbox. Also adds change handler to
         * update store of selected age ranges.
         * @param  {String}       key     Name of age range
         * @param  {Bool}         enabled Whether age range is currently enabled
         * @return {ReactElement}         Markup for checkbox
         */
        getAgeToggleMarkup: function(key, enabled) {
            return (
                <div className="age-type" key={key}>
                    <input id={key} ref={key} type="checkbox" checked={enabled} onChange={this.toggleAgeHandler.bind(this, key)} />
                    <label htmlFor={key}>{this.props.ageData[key].label}</label>
                </div>
            );
        },

        /**
         * Returns the markup for all age ranges select boxes
         * @return {ReactElement} Checkbox area markup
         */
        getAgeControlsMarkup: function() {
            var ageToggles = [];

            _.each(this.props.selectedAges, function(enabled, key) {
                ageToggles.push(this.getAgeToggleMarkup(key, enabled));
            }, this);

            return (
                <div className="age-controls">
                    {ageToggles}
                </div>
            );
        },

        render: function() {
            return (
                <div className="header">
                    <div className="controls">
                        {this.getAgeControlsMarkup()}
                    </div>
                </div>
            );
        }
    });

    return Controls;
});
