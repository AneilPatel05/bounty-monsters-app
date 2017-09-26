import moment from 'moment';
import Bounties from './collection.js';
import Users from 'meteor/vulcan:users';
import { Utils, getSetting } from 'meteor/vulcan:core';

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Return a bounty's link if it has one, else return its bounty page URL
 * @param {Object} bounty
 */
Bounties.getLink = function (bounty, isAbsolute = false, isRedirected = true) {
  const url = isRedirected ? Utils.getOutgoingUrl(bounty.url) : bounty.url;
  return !!bounty.url ? url : Bounties.getPageUrl(bounty, isAbsolute);
};

/**
 * @summary Depending on the settings, return either a bounty's URL link (if it has one) or its page URL.
 * @param {Object} bounty
 */
Bounties.getShareableLink = function (bounty) {
  return getSetting("outsideLinksPointTo", "link") === "link" ? Bounties.getLink(bounty) : Bounties.getPageUrl(bounty, true);
};

/**
 * @summary Whether a bounty's link should open in a new tab or not
 * @param {Object} bounty
 */
Bounties.getLinkTarget = function (bounty) {
  return !!bounty.url ? "_blank" : "";
};

/**
 * @summary Get URL of a bounty page.
 * @param {Object} bounty
 */
Bounties.getPageUrl = function(bounty, isAbsolute = false){
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0,-1) : "";
  return `${prefix}/bounties/${bounty._id}/${bounty.slug}`;
};

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a bounty author's name
 * @param {Object} bounty
 */
Bounties.getAuthorName = function (bounty) {
  var user = Users.findOne(bounty.userId);
  if (user) {
    return Users.getDisplayName(user);
  } else {
    return bounty.author;
  }
};

/**
 * @summary Get default status for new bountys.
 * @param {Object} user
 */
Bounties.getDefaultStatus = function (user) {
  const canBountyApproved = typeof user === 'undefined' ? false : Users.canDo(user, "bountys.new.approved");
  if (!getSetting('requireBountiesApproval', false) || canBountyApproved) {
    // if user can bounty straight to "approved", or else bounty approval is not required
    return Bounties.config.STATUS_APPROVED;
  } else {
    return Bounties.config.STATUS_PENDING;
  }
};

/**
 * @summary Get status name
 * @param {Object} user
 */
Bounties.getStatusName = function (bounty) {
  return Utils.findWhere(Bounties.statuses, {value: bounty.status}).label;
};

/**
 * @summary Check if a bounty is approved
 * @param {Object} bounty
 */
Bounties.isApproved = function (bounty) {
  return bounty.status === Bounties.config.STATUS_APPROVED;
};

/**
 * @summary Check if a bounty is pending
 * @param {Object} bounty
 */
Bounties.isPending = function (bounty) {
  return bounty.status === Bounties.config.STATUS_PENDING;
};


/**
 * @summary Check to see if bounty URL is unique.
 * We need the current user so we know who to upvote the existing bounty as.
 * @param {String} url
 */
Bounties.checkForSameUrl = function (url) {

  // check that there are no previous bountys with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var bountyWithSameLink = Bounties.findOne({url: url, bountyedAt: {$gte: sixMonthsAgo}});

  return !!bountyWithSameLink;
};

/**
 * @summary When on a bounty page, return the current bounty
 */
Bounties.current = function () {
  return Bounties.findOne("foo");
};

/**
 * @summary Check to see if a bounty is a link to a video
 * @param {Object} bounty
 */
Bounties.isVideo = function (bounty) {
  return bounty.media && bounty.media.type === "video";
};

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} bounty
 */
Bounties.getThumbnailUrl = (bounty) => {
  const thumbnailUrl = bounty.thumbnailUrl;
  if (!!thumbnailUrl) {
    return thumbnailUrl.indexOf('//') > -1 ? Utils.addHttp(thumbnailUrl) : Utils.getSiteUrl().slice(0,-1) + thumbnailUrl;
  }
};

/**
 * @summary Get URL for sharing on Twitter.
 * @param {Object} bounty
 */
Bounties.getTwitterShareUrl = bounty => {
  const via = getSetting("twitterAccount", null) ? `&via=${getSetting("twitterAccount")}` : "";
  return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(bounty.title) }%20${ encodeURIComponent(Bounties.getLink(bounty, true)) }${via}`;
};

/**
 * @summary Get URL for sharing on Facebook.
 * @param {Object} bounty
 */
Bounties.getFacebookShareUrl = bounty => {
  return `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(Bounties.getLink(bounty, true)) }`;
};

/**
 * @summary Get URL for sharing by Email.
 * @param {Object} bounty
 */
Bounties.getEmailShareUrl = bounty => {
  const subject = `Interesting link: ${bounty.title}`;
  const body = `I thought you might find this interesting:

${bounty.title}
${Bounties.getLink(bounty, true, false)}

(found via ${getSetting("siteUrl")})
  `;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
