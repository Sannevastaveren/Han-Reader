import ComponentReducer from "../Reducers/ComponentReducer";

describe('The tabbar component', function () {
	it('opens when the menu is closed', () => {
        const state = {
            showMenu: false
        }
        let output;
      
        output = ComponentReducer(state, { type: 'TOGGLE_MENU' });

        expect(output.showMenu).toEqual(true)
    });
    
    it('opens when the menu is closed', () => {
        const state = {
            showMenu: true
        }
        let output2;
      
        output2 = ComponentReducer(state, { type: 'TOGGLE_MENU' });

        expect(output2.showMenu).toEqual(false)
    });
});