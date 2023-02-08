import { TRIP_STATUS, TRIP_STATUS_TYPES } from '@server/utils/constants';

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pickupLoc: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'pickup_loc'
    },
    dropLoc: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'drop_loc'
    },
    dateOfRide: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_ride'
    },
    bookingTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'booking_time'
    },
    estFare: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'est_fare'
    },
    estDistance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'est_distance'
    },
    tripStatus: {
      type: DataTypes.ENUM(...TRIP_STATUS),
      defaultValue: TRIP_STATUS_TYPES.PENDING,
      field: 'trip_status'
    },
    custId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      },
      field: 'cust_id'
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'driver',
        key: 'id'
      },
      field: 'driver_id'
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true
    }
  };
}
/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export function model(sequelize, DataTypes) {
  const requestedRideModel = sequelize.define('requested_rides', getAttributes(sequelize, DataTypes), {
    tableName: 'requested_rides',
    paranoid: true,
    timestamps: true
  });
  requestedRideModel.associate = async function(models) {
    requestedRideModel.belongsTo(models.customerModel, {
      foreignKey: 'cust_id'
    });
    requestedRideModel.belongsTo(models.driverModel, {
      foreignKey: 'driver_id'
    });
    requestedRideModel.hasOne(models.completedRideModel, {
      foreignKey: 'trip_id'
    });
    requestedRideModel.hasOne(models.incompleteRideModel, {
      foreignKey: 'trip_id'
    });
  };
  return requestedRideModel;
}
