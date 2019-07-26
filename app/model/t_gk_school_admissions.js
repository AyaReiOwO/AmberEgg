/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('t_gk_school_admissions', {
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
    yuan_xiao_lei_xing: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    yuan_xiao_lei_xing_id: {
      type: DataTypes.INTEGER(4),
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
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    avg_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    virtual_avg_score: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    max_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    virtual_max_score: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    min_score2: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    min_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
    virtual_min_score: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    prov_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    min_score_rank: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    diff_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    min_diff_score: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    admission_count: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    enroll_count: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    tmp_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    v_max_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
    v_min_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
    v_min_score_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
    v_avg_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
    v_avg_score_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1',
    },
  }, {
    tableName: 't_gk_school_admissions',
  });

  Model.associate = function() {

  };

  return Model;
};
