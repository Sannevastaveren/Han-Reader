import {combineReducers} from 'redux'
import bookReducer from './BookReducer'
import bookshelfReducer from './BookshelfReducer'
import fileReducer from './FileReducer'
import loginReducer from './LoginReducer'
import createReducer from './CreateReducer'
import changepassReducer from './ChangepassReducer'
import componentReducer from './ComponentReducer'

export const mainReducer = combineReducers({
    book: bookReducer,
    bookshelf: bookshelfReducer,
    file: fileReducer,
    component: componentReducer,
    login: loginReducer,
    create: createReducer,
    changepass: changepassReducer
})
