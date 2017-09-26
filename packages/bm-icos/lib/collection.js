import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
// import views from './views.js';
import { createCollection } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary The global namespace for Posts.
 * @namespace Posts
 */
const ICOs = createCollection({

  collectionName: 'ICOs',

  typeName: 'ICO',

  schema,

  resolvers,

  mutations,

});

// refactor: moved here from schema.js
ICOs.config = {};

ICOs.config.STATUS_PENDING = 1;
ICOs.config.STATUS_APPROVED = 2;
ICOs.config.STATUS_REJECTED = 3;
ICOs.config.STATUS_SPAM = 4;
ICOs.config.STATUS_DELETED = 5;


/**
 * @summary Posts statuses
 * @type {Object}
 */
ICOs.statuses = [
  {
    value: 1,
    label: 'pending'
  },
  {
    value: 2,
    label: 'approved'
  },
  {
    value: 3,
    label: 'rejected'
  },
  {
    value: 4,
    label: 'spam'
  },
  {
    value: 5,
    label: 'deleted'
  }
];

ICOs.checkAccess = (currentUser, ico) => {
  if (Users.isAdmin(currentUser) || Users.owns(currentUser, ico)) { // admins can always see everything, users can always see their own posts
    return true;
  } else if (ico.isFuture) {
    return false;
  } else { 
    const status = _.findWhere(ICOs.statuses, {value: ico.status});
    return Users.canDo(currentUser, `icos.view.${status.label}`);
  }
}

export default ICOs;
