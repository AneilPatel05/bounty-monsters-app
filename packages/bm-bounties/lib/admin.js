import { extendFragment, addAdminColumn } from 'meteor/vulcan:core';
import AdminUsersBounties from './components/AdminUsersBounties';

extendFragment('UsersAdmin', `
  bounties(limit: 5){
    ...BountiesPage
  }
`);

addAdminColumn({
  name: 'bounties',
  order: 50,
  component: AdminUsersBounties
});