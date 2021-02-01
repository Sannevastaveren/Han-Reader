const initialBookshelfState = {
    books: [],
    loading: false,
    status: "unloaded"
}

const BookshelfReducer = ( state = initialBookshelfState, action ) => {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.

    switch(action.type) {
        
        case "SET_LOADING":
        return { ...state, loading: action.loading }

        case "SET_BOOKSHELF_STATUS":
        return { ...state, status: action.status }

        case "SET_BOOKLIST":
		return { ...state, books: action.books, status: "loaded", loading: false }
		
		case "COVER_LOADED":
			const temp_books = [ ...state.books ]
			temp_books[action.index].coverImage = action.coverImage;
		return { ...state, books: temp_books };
        
        default:
        return state;
    }
    
}

export default BookshelfReducer;
