/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('rate_table_2018', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    college: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aos: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    batch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    student_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    probability: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    low_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    low_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1'
    },
    r_school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'rate_table_2018'
  });

  Model.associate = function() {

  }

  return Model;
};
