import Users from 'meteor/vulcan:users';

const guestsActions = [
  "icos.view.approved"
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  "icos.new", 
  "icos.edit.own", 
  "icos.remove.own",
];
Users.groups.members.can(membersActions);

const adminActions = [
  "icos.view.pending",
  "icos.view.rejected",
  "icos.view.spam",
  "icos.view.deleted",
  "icos.new.approved",
  "icos.edit.all",
  "icos.remove.all"
];
Users.groups.admins.can(adminActions);
