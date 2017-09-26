import { newMutation, editMutation, removeMutation, addGraphQLMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';


const mutations = {

  new: {
    
    name: 'bountiesNew',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'bounties.new');
    },
    
    mutation(root, {document}, context) {
      
      Utils.performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.Bounties,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'bountiesEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'bounties.edit.own') : Users.canDo(user, `bounties.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Bounties.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document);

      return editMutation({
        collection: context.Bounties, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  remove: {

    name: 'bountiesRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'bounties.remove.own') : Users.canDo(user, `bounties.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.Bounties.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.Bounties, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

addGraphQLMutation('increaseBountyViewCount(bountyId: String): Float');

export default mutations;
