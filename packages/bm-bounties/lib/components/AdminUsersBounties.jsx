import React from 'react';
import Bounties from 'meteor/bm-bounties';
import { Link } from 'react-router';

const AdminUsersBounties = ({ document: user }) => 
  <ul>
    {user.bounties && user.bounties.map(bounty => 
      <li key={bounty._id}><Link to={Bounties.getLink(bounty)}>{bounty.title}</Link></li>
    )}
  </ul>

export default AdminUsersBounties;