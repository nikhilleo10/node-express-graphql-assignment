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
    dlNo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'dl_no'
    },
    dlExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'dl_expiry'
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'average_rating'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
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
  const driverModel = sequelize.define('driver', getAttributes(sequelize, DataTypes), {
    tableName: 'driver',
    paranoid: true,
    timestamps: true
  });
  driverModel.associate = async function(models) {
    driverModel.belongsTo(models.userModel);
  };
  return driverModel;
}
