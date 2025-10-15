import { SqliteDialect } from "@sequelize/sqlite3";
import { Sequelize } from "@sequelize/core";
import { User } from './model/user';
import * as path from "path"

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: path.join(__dirname, "db.sqlite"),
    pool: { max: 1, idle: Infinity, maxUses: Infinity },
    models: [User], // Import models after they're defined
    logQueryParameters: true,
    benchmark: true,
});

// Helper function to initialize database
export async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
        throw error;
    }
}

export { User };