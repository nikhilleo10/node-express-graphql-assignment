import { GraphQLEnumType } from 'graphql';

export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';
export const MUTATION_TYPE = {
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

export const SUBSCRIPTION_TOPICS = {
  NEW_PURCHASED_PRODUCT: 'newPurchasedProduct'
};

// This date indicates when the mutations on createPurchasedProduct went live. We will not have to recalculate aggregate from database after this date.
export const REDIS_IMPLEMENTATION_DATE = '2022-03-16';

export const TRIP_STATUS = ['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];

export const TRIP_STATUS_TYPES = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const TYPE_OF_VEHICLE_ENUM_VALUES = new GraphQLEnumType({
  name: 'VehicleTypeEnum',
  values: {
    CAR: {
      value: 'CAR'
    },
    BIKE: {
      value: 'BIKE'
    },
    AUTO: {
      value: 'AUTO'
    }
  }
});

export const TYPE_OF_ENGINE_ENUM_VALUES = new GraphQLEnumType({
  name: 'EngineEnumType',
  values: {
    PETROL: {
      value: 'PETROL'
    },
    DIESEL: {
      value: 'DIESEL'
    },
    ELECTRIC: {
      value: 'ELECTRIC'
    },
    CNG: {
      value: 'CNG'
    }
  }
});

export const updateRideOptions = {
  ACCEPT_A_RIDE: 'ACCEPT_A_RIDE'
};
