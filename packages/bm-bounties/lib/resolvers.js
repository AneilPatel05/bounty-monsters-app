import { addGraphQLResolvers, Utils } from 'meteor/vulcan:core';

const specificResolvers = {
  Mutation: {
    increaseBountyViewCount(root, { bountyId }, context) {
      return context.Bounties.update({_id: bountyId}, { $inc: { viewCount: 1 }});
    }
  }
};

addGraphQLResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'bountiesList',

    resolver(root, {terms}, {currentUser, Users, Bounties}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Bounties.getParameters(terms);
      options.skip = terms.offset;
      const bounties = Bounties.find(selector, options).fetch();

      // restrict documents fields
      const viewableBounties = _.filter(bounties, bounty => Bounties.checkAccess(currentUser, bounty));
      const restrictedBounties = Users.restrictViewableFields(currentUser, Bounties, viewableBounties);

      // prime the cache
      restrictedBounties.forEach(bounty => Bounties.loader.prime(bounty._id, bounty));

      return restrictedBounties;
    },

  },

  single: {
    
    name: 'bountiesSingle',

    async resolver(root, {documentId, slug}, {currentUser, Users, Bounties}) {

      // don't use Dataloader if bounty is selected by slug
      const bounty = documentId ? await Bounties.loader.load(documentId) : Bounties.findOne({slug});

      Utils.performCheck(Bounties.checkAccess, currentUser, bounty, Bounties, documentId);

      return Users.restrictViewableFields(currentUser, Bounties, bounty);
    },
  
  },

  total: {
    
    name: 'bountiesTotal',
    
    resolver(root, {terms}, {Bounties}) {
      const {selector} = Bounties.getParameters(terms);
      return Bounties.find(selector).count();
    },
  
  }
};

export default resolvers;
