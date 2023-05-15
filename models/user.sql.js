// modeling in the sequelise way
const Sequelize = require("sequelize")
const sqldb = require("../config/sqlConnect")


const User = sqldb.define(
    "users",
    {
      users_Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        // allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      telNumber: {
        type: Sequelize.INTEGER,
      },

      password: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      DOB: {
        type: Sequelize.DATEONLY,
      },

      location: {
        type: Sequelize.STRING,
      },

      userBVN: {
        type: Sequelize.INTEGER,
      },
      createdBy: {
        type: Sequelize.STRING,
        foreignKey: true,
      },

      agent_manager: {
        type: Sequelize.INTEGER,
      },
      //*******logo_id, country_id, state_id,lga_id are associated
      //*******columns that will appear in when fully mapped

      user_residential_address: {
        type: Sequelize.STRING,
      },
      user_uniqe_identification_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
      },
      user_unique_identification_no: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      get() {
            return moment(this.getDataValue('createdAt')).format('MMMM Do YYYY, h:mm:ss a');
        }
      },
      updatedAt: {
        type: Sequelize.DATE,
      get() {
            return moment(this.getDataValue('createdAt')).format('MMMM Do YYYY, h:mm:ss a');
        }
      }
    },
    {
      deletedAt: "deletedAt",
      paranoid: true,
      timestamps: true,
    }
  );

module.exports= User;


 
