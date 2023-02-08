import { GraphQLNonNull, GraphQLInt, GraphQLObjectType } from 'graphql';
import { Op } from 'sequelize';
import deepMapKeys from 'deep-map-keys';
import { TRIP_STATUS_TYPES } from '@server/utils/constants';
import db from './models';
import moment from 'moment';

export const sequelizedWhere = (currentWhere = {}, where = {}) => {
  where = deepMapKeys(where, k => {
    if (Op[k]) {
      return Op[k];
    }
    return k;
  });
  return { ...currentWhere, ...where };
};
export const updateUsingId = async (model, args) => {
  let affectedRows;
  try {
    [affectedRows] = await model.update(args, {
      where: {
        id: args.id,
        deletedAt: null
      }
    });
  } catch (e) {
    throw new Error(`Failed to update ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return model.findOne({ where: { id: args.id } });
};

export const deleteUsingId = async (model, args) => {
  let affectedRows;
  try {
    affectedRows = await model.destroy({ where: { id: args.id, deletedAt: null } });
  } catch (e) {
    throw new Error(`Failed to delete ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return args;
};

export const deletedId = new GraphQLObjectType({
  name: 'Id',
  fields: () => ({ id: { type: new GraphQLNonNull(GraphQLInt) } })
});

export const acceptRide = async (model, args) => {
  let affectedRows;
  try {
    const rideDetails = await model.findOne({
      where: {
        id: args.id,
        tripStatus: TRIP_STATUS_TYPES.PENDING
      }
    });
    if (rideDetails) {
      const ridesData = await rideDetails.update({ ...args, tripStatus: TRIP_STATUS_TYPES.ASSIGNED });
      // We can create a row in completed rides when the user verifies OTP for the ride, but we are not going
      // with verify OTP API, so mocking and assuming that once the driver accepts a ride the ride has started
      await db.completedRideModel.create({
        pickupTime: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss'),
        tripId: rideDetails.id,
        createdAt: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss')
      });
      return ridesData;
    }
  } catch (e) {
    throw new Error(`Failed to update ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Ride must be in pending state to accept.');
  }
  return model.findOne({ where: { id: args.id } });
};

export const endRide = async (model, args) => {
  try {
    const rideDetails = await db.requestedRideModel.findOne({
      where: {
        id: args.tripId,
        tripStatus: TRIP_STATUS_TYPES.ASSIGNED
      }
    });
    if (rideDetails) {
      const completedRideDetails = await db.completedRideModel.findOne({
        where: {
          tripId: rideDetails.id
        }
      });
      if (completedRideDetails) {
        const dropoffTime = moment(moment.now()).format('YYYY-MM-DD HH:mm:ss');
        const duration = moment.duration(moment(dropoffTime).diff(moment(completedRideDetails.pickupTime)));
        const updateData = {
          dropoffTime,
          durationTravelled: `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`,
          actualFare: args.actualFare,
          tip: args.tip
        };
        await completedRideDetails.update(updateData);
        await rideDetails.update({
          tripStatus: TRIP_STATUS_TYPES.COMPLETED
        });
        return completedRideDetails;
      } else {
        throw new Error('No record found in completed ride.');
      }
    }
    throw new Error('No ride found in assigned state.');
  } catch (error) {
    throw new Error(`Failed to update ${model.name}, error: ${error.message}`);
  }
};

export const cancelRide = async (model, args) => {
  try {
    const rideDetails = await db.requestedRideModel.findOne({
      where: {
        id: args.tripId,
        tripStatus: TRIP_STATUS_TYPES.PENDING
      }
    });
    if (rideDetails) {
      const cancellationTime = moment(moment.now()).format('YYYY-MM-DD HH:mm:ss');
      const cancelRideData = {
        ...args,
        cancellationTime
      };
      await rideDetails.update({
        tripStatus: TRIP_STATUS_TYPES.CANCELLED
      });
      return db.incompleteRideModel.create(cancelRideData);
    }
    throw new Error('No ride found in Pending state.');
  } catch (error) {
    throw new Error(`Failed to update ${model.name}, error: ${error.message}`);
  }
};
