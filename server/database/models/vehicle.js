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
    brand: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    vehicleNo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'vehicle_no'
    },
    type: {
      type: DataTypes.ENUM('CAR', 'BIKE', 'AUTO'),
      allowNull: false
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'max_capacity'
    },
    engineType: {
      type: DataTypes.ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'CNG'),
      allowNull: false,
      field: 'engine_type'
    },
    insuranceNo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'insurance_no'
    },
    insuranceExp: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'insurance_exp'
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  const vehicleModel = sequelize.define('vehicle', getAttributes(sequelize, DataTypes), {
    tableName: 'vehicle',
    paranoid: true,
    timestamps: true
  });
  vehicleModel.associate = async function(models) {
    vehicleModel.belongsTo(models.driverModel);
  };
  return vehicleModel;
}
