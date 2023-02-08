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
    cancellationTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'cancellation_time'
    },
    reasonForCancellation: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'reason_for_cancellation'
    },
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requested_rides',
        key: 'id'
      },
      field: 'trip_id'
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
  const incompleteRideModel = sequelize.define('incomplete_rides', getAttributes(sequelize, DataTypes), {
    tableName: 'incomplete_rides',
    paranoid: true,
    timestamps: true
  });

  incompleteRideModel.associate = function(models) {
    incompleteRideModel.belongsTo(models.requestedRideModel, {
      foreignKey: 'trip_id'
    });
  };
  return incompleteRideModel;
}
