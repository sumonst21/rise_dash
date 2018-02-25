import { combineReducers } from 'redux';

import PostsReducer from './posts_reducer';

const rootReducer = combineReducers({
  filters: PostsReducer,
});


export default rootReducer;