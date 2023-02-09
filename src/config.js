const PG_USER = 'postgres';
const PG_PASSWORD = 'postgres';
const PG_HOST = 'localhost';
const PG_DB = 'postgres';
const PG_PORT = 5432;

module.exports = {
    server: {
      PORT: 3000,
    },
    db: {
        PG_USER: PG_USER,
        PG_PASSWORD: PG_PASSWORD,
        PG_HOST: PG_HOST,
        PG_PORT: PG_PORT,
        PG_DB: PG_DB
    }
}