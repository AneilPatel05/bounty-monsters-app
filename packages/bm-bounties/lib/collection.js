import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
// import views from './views.js';
import { createCollection } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary The global namespace for Bounties.
 * @namespace Bounties
 */
const Bounties = createCollection({

  collectionName: 'Bounties',

  typeName: 'Bounties',

  schema,

  resolvers,

  mutations,

});

// refactor: moved here from schema.js
Bounties.config = {};

Bounties.config.STATUS_PENDING = 1;
Bounties.config.STATUS_APPROVED = 2;
Bounties.config.STATUS_REJECTED = 3;
Bounties.config.STATUS_SPAM = 4;
Bounties.config.STATUS_DELETED = 5;


/**
 * @summary Bounties statuses
 * @type {Object}
 */
Bounties.statuses = [
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

Bounties.checkAccess = (currentUser, post) => {
  if (Users.isAdmin(currentUser) || Users.owns(currentUser, post)) { // admins can always see everything, users can always see their own Bounties
    return true;
  } else if (post.isFuture) {
    return false;
  } else { 
    const status = _.findWhere(Bounties.statuses, {value: post.status});
    return Users.canDo(currentUser, `Bounties.view.${status.label}`);
  }
}

export default Bounties;
