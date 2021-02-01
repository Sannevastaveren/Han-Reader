import LoginReducer from "../Reducers/LoginReducer";

describe('Login', function () {
	it('gives warning when username is empty', () => {
        const state = {
            username: "",
            loading: false,
            warning: ""
        }
        let output;
        
        if (state.username) {
            output = LoginReducer(state, { type: 'SET_WARNING', warning: "" });
        } else {
            output = LoginReducer(state, { type: 'SET_WARNING', warning: "'gebruikersnaam' mag niet leeg zijn" });
        }

        expect(output.warning).toEqual("'gebruikersnaam' mag niet leeg zijn")
    });
    
    it('can show a loading icon when loading',  (done) => {
        const state = {
            username: "aaa",
            loading: false,
            warning: ""
        }

        const boolean = true;

        const output = LoginReducer(state, { type: 'SET_LOGIN_LOADING', loading: boolean });

        expect(output.loading).toEqual(boolean);
        done()
    });
});