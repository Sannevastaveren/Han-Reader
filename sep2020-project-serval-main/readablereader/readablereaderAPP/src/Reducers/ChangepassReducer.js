import { pinOnlyHasNumbers } from "../functions";

const initialChangepassState = {
    pin: "",
    newPin: "",
    newPinRepeat: "",
    warning: "",
    step: 1,
    loading: false,
    showModal: false
}

const ChangepassReducer = ( state = initialChangepassState, action ) => {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.

    switch(action.type) {
        case "UPDATE_CHANGEPASS_PIN":
        return pinOnlyHasNumbers(action.pin) ? { ...state, pin: action.pin } : { ...state };
        
        case "UPDATE_CHANGEPASS_NEWPIN":
        return pinOnlyHasNumbers(action.pin) ? { ...state, newPin: action.pin } : { ...state };
        
        case "UPDATE_CHANGEPASS_NEWPINREPEAT":
        return pinOnlyHasNumbers(action.pin) ? { ...state, newPinRepeat: action.pin } : { ...state };

        case "SET_CHANGEPASS_WARNING":
        return { ...state, warning: action.warning }

        case "SET_CHANGEPASS_LOADING":
        return { ...state, loading: action.loading }

        case "SET_CHANGEPASS_MODAL":
        return { ...state, showModal: action.showModal }

        case "NEXT_CHANGEPASS_STEP":
        return { ...state, step: state.step + 1}

        case "PREVIOUS_CHANGEPASS_STEP":
        return { ...state, step: state.step - 1}

        case "RESET_CHANGEPASS_PAGE":
        return { pin: "", newPin: "", newPinRepeat: "", warning: "", loading: false, step: 1 }

        default:
        return state;
    }
}

export default ChangepassReducer;
