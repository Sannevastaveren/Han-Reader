const initialState = {
    status: "unloaded",
    uploadedBook: {
        uploadedBook: "",
		status: null
	},
	error: {
		for: null,
		message: null
	},
	alert: {
		title: null,
		text: null,
		show: false
	}
}
export default function fileReducer( state = initialState, action ) {
	const tempAlert = {...state.alert};

    switch(action.type) {

        case 'resetStatusAction':
            return { ...state, status: "unloaded" }

        case 'uploadFileIntoStateAction':
            return { ...state, uploadedBook: action.uploadedBook }

        case 'uploadFileAction':
            return state;
 
        case 'uploadBookFileAction':
            state.uploadedBook.uploadedBook = action.file;
            return state;

		case 'uploadBookErrorMessage':
			return { ...state, error: (action.error) ? action.error:initialState.error };
		case 'uploadBookStatus':
			const temp = {...state.uploadedBook};
			temp.status = action.status;
			return { ...state, uploadedBook: temp};
		
		case 'alertModalShow':
			tempAlert.show = action.show;
			return { ...state, alert: tempAlert }

		case 'alertModalUpdate':
			tempAlert.title = action.title;
			tempAlert.text = action.text;
			return { ...state, alert: tempAlert }

        default:
            return state;
    }
}