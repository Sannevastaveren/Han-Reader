const initialComponentState = {
    showMenu: false
}

const ComponentReducer = ( state = initialComponentState, action ) => {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.

    switch(action.type) {

        case "TOGGLE_MENU":
            const newValue = state.showMenu ? false : true;
        return { ...state, showMenu: newValue }

        default:
        return state;
    }
}

export default ComponentReducer;