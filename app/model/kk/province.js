/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('province', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pin_yin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pin_yin_two: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1'
    },
    province_id_two: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'province',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
