import { getBookCover } from '../functions';
import { apiURL } from '../index';

export const getBooks = () => {
    return async (dispatch) => {
        dispatch({type: 'SET_LOADING', loading: true})

        try {

            const request1 = await fetch(`${apiURL}/users/${sessionStorage.username}/books`, {
                method: 'GET',
                headers: []
            })

            const books = await request1.json();

			dispatch({type: 'SET_BOOKLIST', books: books})
			
			for ( let i = 0; i < books.length; i++ ) {
				const coverImage = await getBookCover(books[i]._id);
				dispatch({type: 'COVER_LOADED', coverImage: coverImage, index: i})
			}
			
        } catch(err) {
            console.log(err)
        }
    }
}
