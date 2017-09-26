import { addAction, addReducer } from 'meteor/vulcan:core';

addAction({
  icosViewed: {
    setViewed: (icoId) => ({
      type: 'SET_VIEWED',
      icoId,
    }),
  },
});

addReducer({
  icosViewed: (state = [], action) => {
    if (action.type === 'SET_VIEWED') {
      return [
        ...state,
        action.icoId,
      ];
    }
    
    return state;
  },
});
