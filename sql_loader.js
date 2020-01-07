// Delete all tables in current db then run db script from sql directory

const fs = require('fs');
const path = require('path');
const pgdb = require('./pgdb');

class sql_loader {
  constructor(db = null) {
    this._extDb = db;
  }

  _init() {
    this._db = this._extDb || new pgdb();
  }

  _end() {
    if (!this._extDb) {
      this._db.end();
      this._db = null;
    }
  }

  async _dropAllTables() {
    const query = `
      SELECT quote_ident(table_schema) || '.' || quote_ident(table_name) AS fqtn
      FROM   information_schema.tables
      WHERE  table_schema = 'public'
    `;

    const res = await this._db.query(query);
    for (let i = 0; i < res.rows.length; i++) {
      let e = res.rows[i].fqtn;
      console.log(`dropping ${e}`);
      await this._db.query(`DROP TABLE ${e} CASCADE`);
    }
  }

  async _load(path) {
    let sql = fs.readFileSync(path).toString();
    sql = sql.replace(/^\s*(SET\s+default_table_access_method)/m, "-- $1"); // postgres 12 to 11 compatibility

    return this._db.query(sql);
  }

  async reset(dbName) {
    const relPath = `./sql/${dbName}.sql`;
    const absPath = path.resolve(relPath);

    if (fs.existsSync(absPath)) {
      this._init();

      await this._dropAllTables();
      await this._load(absPath);

      this._end();

      return true;
    }

    return false;
  }
}

module.exports = sql_loader;
