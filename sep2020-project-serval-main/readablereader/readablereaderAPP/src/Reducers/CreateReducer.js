import { pinOnlyHasNumbers } from "../functions";

const initialCreateState = {
    username: "",
    pin: "",
    loading: false,
    warning: "",
    step: 1
}

const CreateReducer = ( state = initialCreateState, action ) => {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.

    switch(action.type) {
        case "UPDATE_CREATE_USERNAME":
        return { ...state, username: action.username }

        case "UPDATE_CREATE_PIN":
        return pinOnlyHasNumbers(action.pin) ? { ...state, pin: action.pin } : { ...state };

        case "SET_CREATE_WARNING":
        return { ...state, warning: action.warning }

        case "SET_CREATE_LOADING":
        return { ...state, loading: action.loading }

        case "NEXT_CREATE_STEP":
        return { ...state, step: state.step + 1}

        case "PREVIOUS_CREATE_STEP":
        return { ...state, step: state.step - 1}

        case "RESET_CREATE_PAGE":
        return { username: "", pin: "", loading: false, warning: "", step: 1 }

        default:
        return state;
    }
}

export default CreateReducer;
