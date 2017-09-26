import { addAction, addReducer } from 'meteor/vulcan:core';

addAction({
  bountiesViewed: {
    setViewed: (postId) => ({
      type: 'SET_VIEWED',
      postId,
    }),
  },
});

addReducer({
  bountiesViewed: (state = [], action) => {
    if (action.type === 'SET_VIEWED') {
      return [
        ...state,
        action.postId,
      ];
    }
    
    return state;
  },
});
