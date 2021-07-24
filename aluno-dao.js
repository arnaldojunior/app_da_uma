class AlunoDao {
    constructor(connection) {
        this._connection = connection;
    }

    getEstados() {
        return new Promise((req, res) => {
            this._connection.query('SELECT * FROM estados', (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}