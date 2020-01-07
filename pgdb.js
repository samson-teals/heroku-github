const { Client } = require('pg')

class pgdb {
  constructor(config = {}) {
    // heroku support
    if (!config.connectionString && process.env.DATABASE_URL) {
      config.connectionString = process.env.DATABASE_URL;
      config.ssl = true;
    }

    this._config = config;
  }

  async client() {
    if (!this._client) {
      this._client = new Client(this._config);
      await this._client.connect();
    }

    return this._client;
  }

  async end() {
    if (this._client) {
      await this._client.end();
      this._client = null;
    }
  }

  async query(str, args = []) {
    return (await this.client()).query(str, args);
  }
};

module.exports = pgdb;
