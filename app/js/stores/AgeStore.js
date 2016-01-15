var _ = require('lodash');
var ageData = require('./data/ageData');
var countyList = require('./data/countyList');
var mapData = require('./data/mapData');
var totalPopulationData = require('./data/totalPopulationData');

var AgeStore = {
    ageData: ageData,
    countyList: countyList,
    mapData: mapData,
    totalPopulationData: totalPopulationData,
    selectedAges: {
        underFive: true,
        fiveToNine: true,
        tenToFourteen: true,
        fifteenToNineteen: true,
        twentyToTwentyFour: true,
        twentyFiveToTwentyNine: true,
        thirtyToThirtyFour: true
    },

    eventListeners: [],

    subscribeToChange: function(callback){
        this.eventListeners.push(callback);
    },

    emitChange: function(){
        _.each(this.eventListeners, function(handler){
            handler();
        });
    },

    toggleAgeSelected: function(key){
        this.selectedAges[key] = !this.selectedAges[key];
        this.emitChange();
    },

    getSelectedAges: function(){
        return this.selectedAges;
    },

    getAgeData: function(){
        return this.ageData;
    },

    getCountyList: function(){
        return this.countyList;
    },

    getMapData: function(){
        return this.mapData;
    },

    getTotalPopulationData: function(){
        return this.totalPopulationData;
    },

    getTotalStatePopulation: function(){
        return 989415;
    }
};


module.exports = AgeStore;
