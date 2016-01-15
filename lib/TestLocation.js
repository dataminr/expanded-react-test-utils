/**
 * A location that is convenient for testing and does not require a DOM. Copy of
 * TestLocation file in react-router (modules/Location/TestLocation). Copied here
 * because it isn't included as part of the bower package.
 */
function TestLocation(history, Router) {
    this.history = history || [];
    this.Router = Router;
    this.listeners = [];
    this.updateHistoryLength();
}

TestLocation.prototype = {
    needsDOM: false,
    updateHistoryLength: function () {
        this.Router.History.length = this.history.length;
    },
    notifyChange: function (type) {
        for (var i = 0, len = this.listeners.length; i < len; ++i){
            this.listeners[i].call(this, { path: this.getCurrentPath(), type: type });
        }
    },
    addChangeListener: function (listener) {
        this.listeners.push(listener);
    },
    removeChangeListener: function (listener) {
        this.listeners = this.listeners.filter(function (l) {return l !== listener;});
    },
    push: function (path) {
        this.history.push(path);
        this.updateHistoryLength();
        this.notifyChange('push');
    },
    replace: function (path) {
        this.history[this.history.length - 1] = path;
        this.notifyChange('replace');
    },
    pop: function () {
        this.history.pop();
        this.updateHistoryLength();
        this.notifyChange('pop');
    },
    getCurrentPath: function () {
        return this.history[this.history.length - 1];
    },
    toString: function () {
        return '<TestLocation>';
    }
};
module.exports = TestLocation;