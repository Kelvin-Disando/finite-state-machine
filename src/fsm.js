class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.machine = config;
        if (this.machine == undefined) {
            throw new Error('');
        }
        this.current = this.machine.states.normal;
        this.state;
        this.redoStack = [];
        this.undoStack = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        for (let key in this.machine.states) {
            if (this.machine.states[key] === this.current) {
                this.state = key;
                return this.state;
            }
        }
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.machine.states[state]) { throw new Error('') }
        else {
            this.undoStack.push(this.getState()); /*add state before change to know where to return*/
            this.current = this.machine.states[state];
            this.undoStack.push(this.getState());/*add state after change for redo to return*/
            this.redoStack.length = 0;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.current.transitions[event]) { throw new Error('') }
        else {
            let transitionPropertyTrigger = this.current.transitions[event];
            this.undoStack.push(this.getState()); /*add state before change to know where to return*/
            this.current = this.machine.states[transitionPropertyTrigger];
            this.undoStack.push(this.getState()); /*add state before change to know where to return*/
            this.redoStack.length = 0;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.current = this.machine.states.normal;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesCollection = [];

        if (event == undefined) {
            for (let key in this.machine.states) {
                statesCollection.push(key);
            }
        } else {
            for (let key in this.machine.states) {
                if (this.machine.states[key].transitions[event]) {
                    statesCollection.push(key);
                }
            }
        }
        return statesCollection;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.undoStack.length == 0) { return false }
        else {
            this.redoStack.push(this.undoStack.pop());
            this.current = this.machine.states[this.undoStack.pop()];
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.redoStack.length == 0) { return false }
        else {
            this.current = this.machine.states[this.redoStack.pop()];
            //this.redoStack.length = 0;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoStack.length = 0;
        this.redoStack.length = 0;
     }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
