import { addGraphQLResolvers, Utils } from 'meteor/vulcan:core';



const resolvers = {

  list: {

    name: 'icosList',

    resolver(root, {terms}, {currentUser, Users, ICOs}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = ICOs.getParameters(terms);
      options.skip = terms.offset;
      const icos = ICOs.find(selector, options).fetch();

      // restrict documents fields
      const viewableICOs = _.filter(icos, ico => ICOs.checkAccess(currentUser, ico));
      const restrictedICOs = Users.restrictViewableFields(currentUser, ICOs, viewableICOs);

      // prime the cache
      restrictedICOs.forEach(ico => ICOs.loader.prime(ico._id, ico));

      return restrictedICOs;
    },

  },

  single: {
    
    name: 'icosSingle',

    async resolver(root, {documentId, _id}, {currentUser, Users, ICOs}) {

      // don't use Dataloader if ico is selected by slug
      const ico = documentId ? await ICOs.loader.load(documentId) : ICOs.findOne({_id});

      Utils.performCheck(ICOs.checkAccess, currentUser, ico, ICOs, documentId);

      return Users.restrictViewableFields(currentUser, ICOs, ico);
    },
  
  },

  total: {
    
    name: 'icosTotal',
    
    resolver(root, {terms}, {ICOs}) {
      const {selector} = ICOs.getParameters(terms);
      return ICOs.find(selector).count();
    },
  
  }
};

export default resolvers;
