import Bounties from '../collection.js'
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting } from 'meteor/vulcan:core';
import Events from 'meteor/vulcan:events';

// ------------------------------------- bounties.remove.sync -------------------------------- //

function BountiesRemoveOperations (bounty) {
  Users.update({_id: bounty.userId}, {$inc: {"bountyCount": -1}});
  return bounty;
}
addCallback("bounties.remove.sync", BountiesRemoveOperations);

// ------------------------------------- bounties.approve.async -------------------------------- //

/**
 * @summary set bountyedAt when a bounty is approved and it doesn't have a bountyedAt date
 */
function BountiesSetPostedAt (modifier, bounty) {
  if (!modifier.$set.postedAt && !bounty.postedAt) {
    modifier.$set.postedAt = new Date();
    if (modifier.$unset) {
      delete modifier.$unset.postedAt;
    }
  }
  return modifier;
}
addCallback("bounties.approve.sync", BountiesSetPostedAt);

// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeleteBounties (user, options) {
  if (options.deleteBounties) {
    Bounties.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Bounties.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
addCallback("users.remove.async", UsersRemoveDeleteBounties);


// /**
//  * @summary Increase the number of clicks on a bounty
//  * @param {string} Bounties – the ID of the bounty being edited
//  * @param {string} ip – the IP of the current user
//  */
Bounties.increaseClicks = (bounty, ip) => {
  const clickEvent = {
    name: 'click',
    properties: {
      bountyId: bounty._id,
      ip: ip
    }
  };

  if (getSetting('trackClickEvents', true)) {
    // make sure this IP hasn't previously clicked on this bounty
    const existingClickEvent = Events.findOne({name: 'click', 'properties.bountyId': bounty._id, 'properties.ip': ip});

    if(!existingClickEvent) {
      Events.log(clickEvent);
      return Bounties.update(bounty._id, { $inc: { clickCount: 1 }});
    }
  } else {
    return Bounties.update(bounty._id, { $inc: { clickCount: 1 }});
  }
};

function BountiesClickTracking(bounty, ip) {
  return Bounties.increaseClicks(bounty, ip);
}

// track links clicked, locally in Events collection
// note: this event is not sent to segment cause we cannot access the current user 
// in our server-side route /out -> sending an event would create a new anonymous 
// user: the free limit of 1,000 unique users per month would be reached quickly
addCallback('bounties.click.async', BountiesClickTracking);