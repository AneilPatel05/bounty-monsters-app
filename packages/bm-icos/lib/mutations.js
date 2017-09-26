import { newMutation, editMutation, removeMutation, addGraphQLMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';


const mutations = {

  new: {
    
    name: 'icosNew',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'icos.new');
    },
    
    mutation(root, {document}, context) {
      
      Utils.performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.ICOs,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'icosEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'icos.edit.own') : Users.canDo(user, `icos.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.ICOs.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document);

      return editMutation({
        collection: context.ICOs, 
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

    name: 'icosRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'icos.remove.own') : Users.canDo(user, `icos.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.ICOs.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.ICOs, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};


export default mutations;
