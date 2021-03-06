/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('t_gk_major_admissions', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    yuan_xiao_lei_xing_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    yuan_xiao_lei_xing: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    major_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    major_name: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    original_major_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    province_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    province_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    avg_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    max_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    min_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    min_score_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    avg_score_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    people_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    is_standard: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
    },
    tmp_major_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    tmp_school_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  }, {
    tableName: 't_gk_major_admissions',
  });

  Model.associate = function() {

  };

  return Model;
};
