import Users from 'meteor/vulcan:users';

const guestsActions = [
  "bounties.view.approved"
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  "bounties.new", 
  "bounties.edit.own", 
  "bounties.remove.own",
];
Users.groups.members.can(membersActions);

const adminActions = [
  "bounties.view.pending",
  "bounties.view.rejected",
  "bounties.view.spam",
  "bounties.view.deleted",
  "bounties.new.approved",
  "bounties.edit.all",
  "bounties.remove.all"
];
Users.groups.admins.can(adminActions);
