import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
// import moment from 'moment';
import ICOs from '../collection.js';

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};


const addJob = function () {
  SyncedCron.add({
    name: 'checkScheduledICOs',
    schedule(parser) {
      return parser.text('every 10 minutes');
    },
    job() {
      // fetch all icos tagged as future
      const scheduledICOs = ICOs.find({isFuture: true}, {fields: {_id: 1, status: 1, postedAt: 1, userId: 1, title: 1}}).fetch();

      // filter the scheduled icos to retrieve only the one that should update, considering their schedule
      const icosToUpdate = scheduledICOs.filter(ico => ico.postedAt <= new Date());

      // update icos found
      if (!_.isEmpty(icosToUpdate)) {
        const icosIds = _.pluck(icosToUpdate, '_id');
        ICOs.update({_id: {$in: icosIds}}, {$set: {isFuture: false}}, {multi: true});

        // log the action
        console.log('// Scheduled icos approved:', icosIds); // eslint-disable-line
      }
    }
  });
};

Meteor.startup(function () {
  addJob();
});

