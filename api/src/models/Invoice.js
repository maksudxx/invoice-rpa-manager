import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Invoice",
    {
      invoice_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      invoice_file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      invoice_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "PENDIENTE",
      },
      invoice_upload_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      invoice_error_log: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    },
  );
};
