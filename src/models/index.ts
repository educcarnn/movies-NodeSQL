import { Pool } from "pg";
import { dbConfig } from "../database/db";

interface Movie {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

export const MovieModel = {
  async findByName(name: string): Promise<Movie | null> {
    const pool = new Pool(dbConfig);

    const result = await pool.query<Movie>("SELECT * FROM movies WHERE name = $1", [name]);

    pool.end();

    return result.rows.length ? result.rows[0] : null;
  },

  async create(name: string, description: string, duration: number, price: number): Promise<Movie> {
    const pool = new Pool(dbConfig);

    const result = await pool.query<Movie>(
      "INSERT INTO movies (name, description, duration, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, duration, price]
    );

    pool.end();

    return result.rows[0];
  },

  async findAll(page: number, perPage: number, sort: string | null, order: string): Promise<Movie[]> {
    const pool = new Pool(dbConfig);

    const offset = (page - 1) * perPage;

    let query = `SELECT * FROM movies`;

    if (sort) {
      query += ` ORDER BY "${sort}" ${order}`;
    }

    query += ` LIMIT $1 OFFSET $2`;

    const result = await pool.query<Movie>(query, [perPage, offset]);

    pool.end();

    return result.rows;
  },

  async count(): Promise<number> {
    const pool = new Pool(dbConfig);

    const result = await pool.query("SELECT COUNT(*) FROM movies");

    pool.end();

    return parseInt(result.rows[0].count);
  },

  async findById(id: string): Promise<Movie | null> {
    const pool = new Pool(dbConfig);

    const result = await pool.query<Movie>("SELECT * FROM movies WHERE id = $1", [id]);

    pool.end();

    return result.rows.length ? result.rows[0] : null;
  },

  async update(id: string, name: string, description: string, duration: number, price: number): Promise<Movie> {
    const pool = new Pool(dbConfig);

    const result = await pool.query<Movie>(
      "UPDATE movies SET name = $1, description = $2, duration = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, description, duration, price, id]
    );

    pool.end();

    return result.rows[0];
  },

  async delete(id: string): Promise<void> {
    const pool = new Pool(dbConfig);

    await pool.query("DELETE FROM movies WHERE id = $1", [id]);

    pool.end();
  },
};