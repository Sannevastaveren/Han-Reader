import BookshelfReducer from "../Reducers/BookshelfReducer";

describe('Bookshelf', function () {
	it('loading books loads books, sets status to loaded and loading to false', () => {
        const state = {
            books: [],
            loading: false,
            status: "unloaded"
        }

        const books = [
    		{
				id: "4wfr3ww3er",
				title: "A Game of Thrones"
			},
			{
				id: "r4drete5e",
				title: "A Clash of Kings"
			},
			{
				id: "5rgy5gt5rt",
				title: "A Storm of Swords"
			},
			{
				id: "tgre45yhrt5",
				title: "A Dance with Dragons"
			},
			{
				id: "ewr4wtr45y",
				title: "The Winds of Winter"
			},
			{
				id: "7uiytgjyu6t6",
				title: "A Dream of Spring"
			}
        ]
        
        const output1 = BookshelfReducer(state, { type: 'SET_BOOKLIST', books: books, status: "loaded", loading: false });

        expect(output1.books).toEqual(books);
        expect(output1.status).toEqual("loaded");
        expect(output1.loading).toEqual(false);
    });

    it('can set loading to both true and false', () => {
        const state = {
            books: [],
            loading: false,
            status: "unloaded"
        }
        
        const output2 = BookshelfReducer(state, { type: 'SET_LOADING', loading: true });
        expect(output2.loading).toEqual(true);

        const output3 = BookshelfReducer(state, { type: 'SET_LOADING', loading: false });
        expect(output3.loading).toEqual(false);
    });
});