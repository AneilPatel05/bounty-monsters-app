
/**import Users from "meteor/vulcan:users";

Users.addField([
  /**
    Count of the user's bounties
  */

/**
  {
    fieldName: "bountiesCount",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    The user's associated bounties (GraphQL only)
  */

/**
  {
    fieldName: "bounties",
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName: 'bounties',
        arguments: 'limit: Int = 5',
        type: '[Bounty]',
        resolver: (user, { limit }, { currentUser, Users, bounties }) => {
          const bounties = Bounties.find({ userId: user._id }, { limit }).fetch();

          // restrict documents fields
          const viewablePosts = _.filter(bounties, post => Bounties.checkAccess(currentUser, post));
          const restrictedPosts = Users.restrictViewableFields(currentUser, Bounties, viewablePosts);
        
          return restrictedPosts;
        }
      }
    }
  }
]);
 */
