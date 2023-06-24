const client = require('./db.database')

class Methods {

    async getUsers() {
        const query = {
            text: 'SELECT * FROM person'
        }

        try {
            const allPersons = await client.query(query)
            if (allPersons.rows?.length) {
                return allPersons.rows
            }
        } catch (error) {
            this.#ErrorMaps(`Can't get users, please check your info again!`, 500, error.stack)
        }
    }

    async getUser(id) {
        const query = {
            text: 'SELECT * FROM person WHERE id = $1',
            values: [id]
        }

        try {
            const allPersons = await client.query(query)
            if (allPersons.rows?.length) {
                return allPersons.rows
            } else {
                this.#ErrorMaps(`Not Found params 'ID': ${id}`, 404)
            }
        } catch (error) {
            this.#ErrorMaps(error, error.code ? error.code : 500)
        }
    }

    async createUsers(body) {
        const listParams = ['first_name', 'last_name', 'email', 'gender', 'phone_number', 'wallet_coin']

        for (let i = 0; i < listParams.length; i++) {
            if (!(body.hasOwnProperty(listParams[i]))) {
                this.#ErrorMaps(`BAD REQUEST. Not Found params "body": ${listParams[i]}`, 400)
            }
        }

        const query = {
            text: 'INSERT INTO person(first_name, last_name, email, gender, phone_number, wallet_coin) VALUES($1, $2, $3, $4, $5, $6)',
            values: [body.first_name, body.last_name, body.email, body.gender, body.phone_number, body.wallet_coin],
        }

        try {
            await client.query(query)
            return
        } catch (error) {
            this.#ErrorMaps(`Can't created users, please check your info again!`, error.code ? error.code : 500, error.stack ? error.stack : {})
        }
    }

    async deleteUsers(id) {
        let checkIsColomn = await this.onePost(id)
        if (checkIsColomn.some(el => el.hasOwnProperty('first_name'))) {
            const query = `DELETE FROM person WHERE id = ${id}`;
            try {
                await client.query(query)
                return true
            } catch (error) {
                this.#ErrorMaps(`Can't deleted users, please check your info again!`, 500, error.stack)
            }
        }
    }

    async updateUsers(id, body) {
        let checkIsColomn = await this.getUser(id)
        if (checkIsColomn.some(el => el.hasOwnProperty('id'))) {
            const args = Object.values(body)
            const keys = Object.keys(body).join(',')
            const argKeys = Object.keys(body).map((obj, index) => `$${index + 1}`).join(',')

            const query = `UPDATE person SET (${keys}) = (${argKeys}) WHERE id = ${id}`;
            try {
                await client.query(query, args)
                return true
            } catch (error) {
                this.#ErrorMaps(`Can't update user, please check your info again!`, 500, error.stack)
            }
        }
    }

    #ErrorMaps(message, code, err) {
        const error = {
            message,
            ...(code ? { code } : {}),
            ...(err ? { err } : {})
        }
        throw error
    }
}

module.exports = Methods