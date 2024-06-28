import * as fs from "fs/promises";
import * as path from "path";

/**
 * This file creates a "database" out of a JSON file. It's only for
 * demonstration purposes. A real app should use a real database.
 */
const DATABASE_FILE_PATH = path.join(__dirname, "db.json");

interface Database<T> {
  read(): Promise<T>;
  write(data: T): Promise<void>;
}

export class JSONFileDatabase<T> implements Database<T> {
  constructor(private readonly seedData: T) {}

  // Creates a database file if one doesn't already exist
  private async init(): Promise<void> {
    try {
      // Do nothing, since the database is initialized
      await fs.stat(DATABASE_FILE_PATH);
    } catch {
      const file = JSON.stringify(this.seedData);
      await fs.writeFile(DATABASE_FILE_PATH, file);
    }
  }

  // Loads and parses the database file
  async read(): Promise<T> {
    await this.init();
    const file = await fs.readFile(DATABASE_FILE_PATH, "utf8");
    return JSON.parse(file);
  }

  // Overwrites the database file with provided data
  async write(data: T): Promise<void> {
    await this.init();
    const file = JSON.stringify(data);
    await fs.writeFile(DATABASE_FILE_PATH, file);
  }
}
