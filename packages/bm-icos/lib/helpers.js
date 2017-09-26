import moment from 'moment';
import ICOs from './collection.js';
import Users from 'meteor/vulcan:users';
import { Utils, getSetting } from 'meteor/vulcan:core';

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Return a ico's link if it has one, else return its ico page URL
 * @param {Object} ico
 */
ICOs.getLink = function (ico, isAbsolute = false, isRedirected = true) {
  const url = isRedirected ? Utils.getOutgoingUrl(ico.url) : ico.url;
  return !!ico.url ? url : ICOs.getPageUrl(ico, isAbsolute);
};

/**
 * @summary Depending on the settings, return either a ico's URL link (if it has one) or its page URL.
 * @param {Object} ico
 */
ICOs.getShareableLink = function (ico) {
  return getSetting("outsideLinksPointTo", "link") === "link" ? ICOs.getLink(ico) : ICOs.getPageUrl(ico, true);
};

/**
 * @summary Whether a ico's link should open in a new tab or not
 * @param {Object} ico
 */
ICOs.getLinkTarget = function (ico) {
  return !!ico.url ? "_blank" : "";
};

/**
 * @summary Get URL of a ico page.
 * @param {Object} ico
 */
ICOs.getPageUrl = function(ico, isAbsolute = false){
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0,-1) : "";
  return `${prefix}/icos/${ico._id}`;
};

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a ico author's name
 * @param {Object} ico
 */
ICOs.getOwnerName = function (ico) {
  var user = Users.findOne(ico.userId);
  if (user) {
    return Users.getDisplayName(user);
  } else {
    return ico.owner;
  }
};

/**
 * @summary Get default status for new posts.
 * @param {Object} user
 */
ICOs.getDefaultStatus = function (user) {
  const canPostApproved = typeof user === 'undefined' ? false : Users.canDo(user, "icos.new.approved");
  if (!getSetting('requireICOsApproval', false) || canICOApproved) {
    // if user can ico straight to "approved", or else ico approval is not required
    return ICOs.config.STATUS_APPROVED;
  } else {
    return ICOs.config.STATUS_PENDING;
  }
};

/**
 * @summary Get status name
 * @param {Object} user
 */
ICOs.getStatusName = function (ico) {
  return Utils.findWhere(ICOs.statuses, {value: ico.status}).label;
};

/**
 * @summary Check if a ico is approved
 * @param {Object} ico
 */
ICOs.isApproved = function (ico) {
  return ico.status === ICOs.config.STATUS_APPROVED;
};

/**
 * @summary Check if a ico is pending
 * @param {Object} ico
 */
ICOs.isPending = function (ico) {
  return ico.status === ICOs.config.STATUS_PENDING;
};


/**
 * @summary Check to see if ico URL is unique.
 * We need the current user so we know who to upvote the existing ico as.
 * @param {String} url
 */
ICOs.checkForSameUrl = function (url) {

  // check that there are no previous posts with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var postWithSameLink = ICOs.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  return !!postWithSameLink;
};

/**
 * @summary When on a ico page, return the current ico
 */
ICOs.current = function () {
  return ICOs.findOne("foo");
};

/**
 * @summary Get URL for sharing on Twitter.
 * @param {Object} ico
 */
ICOs.getTwitterShareUrl = ico => {
  const via = getSetting("twitterAccount", null) ? `&via=${getSetting("twitterAccount")}` : "";
  return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(ico.title) }%20${ encodeURIComponent(ICOs.getLink(ico, true)) }${via}`;
};

/**
 * @summary Get URL for sharing on Facebook.
 * @param {Object} ico
 */
ICOs.getFacebookShareUrl = ico => {
  return `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(ICOs.getLink(ico, true)) }`;
};

/**
 * @summary Get URL for sharing by Email.
 * @param {Object} ico
 */
ICOs.getEmailShareUrl = ico => {
  const subject = `Interesting link: ${ico.title}`;
  const body = `I thought you might find this interesting:

${ico.title}
${ICOs.getLink(ico, true, false)}

(found via ${getSetting("siteUrl")})
  `;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
