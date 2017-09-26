import Users from 'meteor/vulcan:users';
import ICOs from './collection.js'

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
ICOs.addDefaultView(terms => ({
  selector: {
    status: Posts.config.STATUS_APPROVED,
    isFuture: {$ne: true} // match both false and undefined
  }
}));

/**
 * @summary Top view
 */
ICOs.addView("top", terms => ({
  options: {
    sort: {score: -1}
  }
}));

/**
 * @summary New view
 */
ICOs.addView("new", terms => ({
  options: {
    sort: { postedAt: -1}
  }
}));

/**
 * @summary Best view
 */
ICOs.addView("best", terms => ({
  options: {
    sort: { baseScore: -1}
  }
}));

/**
 * @summary Pending view
 */
ICOs.addView("pending", terms => ({
  selector: {
    status: ICOs.config.STATUS_PENDING
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Rejected view
 */
ICOs.addView("rejected", terms => ({
  selector: {
    status: ICOs.config.STATUS_REJECTED
  },
  options: {
    sort: {createdAt: -1}
  }
}));

/**
 * @summary Scheduled view
 */
ICOs.addView("scheduled", terms => ({
  selector: {
    status: ICOs.config.STATUS_APPROVED,
    isFuture: true
  },
  options: {
    sort: {postedAt: -1}
  }
}));

/**
 * @summary User posts view
 */
ICOs.addView("userICOss", terms => ({
  selector: {
    userId: terms.userId,
    status: ICOs.config.STATUS_APPROVED,
    isFuture: {$ne: true}
  },
  options: {
    limit: 5,
    sort: {
      postedAt: -1
    }
  }
}));
