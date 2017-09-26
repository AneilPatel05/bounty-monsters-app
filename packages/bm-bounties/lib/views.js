import Users from 'meteor/vulcan:users';
import Bounties from './collection.js'

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
Bounties.addDefaultView(terms => ({
  selector: {
    status: Bounties.config.STATUS_APPROVED,
    isFuture: {$ne: true} // match both false and undefined
  }
}));

/**
 * @summary Top view
 */
Bounties.addView("top", terms => ({
  options: {
    sort: {score: -1}
  }
}));

/**
 * @summary New view
 */
Bounties.addView("new", terms => ({
  options: {
    sort: { postedAt: -1}
  }
}));

/**
 * @summary Best view
 */
Bounties.addView("best", terms => ({
  options: {
    sort: { baseScore: -1}
  }
}));

/**
 * @summary Pending view
 */
Bounties.addView("pending", terms => ({
  selector: {
    status: Bounties.config.STATUS_PENDING
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Rejected view
 */
Bounties.addView("rejected", terms => ({
  selector: {
    status: Bounties.config.STATUS_REJECTED
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Scheduled view
 */
Bounties.addView("scheduled", terms => ({
  selector: {
    status: Bounties.config.STATUS_APPROVED,
    isFuture: true
  },
  options: {
    sort: {postedAt: -1}
  }
}));

/**
 * @summary User Bounties view
 */
Bounties.addView("userBounties", terms => ({
  selector: {
    userId: terms.userId,
    status: Bounties.config.STATUS_APPROVED,
    isFuture: {$ne: true}
  },
  options: {
    limit: 5,
    sort: {
      postedAt: -1
    }
  }
}));

/**
 * @summary User upvoted Bounties view
 */
Bounties.addView("userUpvotedBounties", (terms, apolloClient) => {
  var user = apolloClient ? Users.findOneInStore(apolloClient.store, terms.userId) : Users.findOne(terms.userId);

  var BountiesIds = _.pluck(user.upvotedBounties, "itemId");
  return {
    selector: {_id: {$in: BountiesIds}, userId: {$ne: terms.userId}}, // exclude own Bounties
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

/**
 * @summary User downvoted Bounties view
 */
Bounties.addView("userDownvotedBounties", (terms, apolloClient) => {
  var user = apolloClient ? Users.findOneInStore(apolloClient.store, terms.userId) : Users.findOne(terms.userId);

  var BountiesIds = _.pluck(user.downvotedBounties, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    selector: {_id: {$in: BountiesIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});
