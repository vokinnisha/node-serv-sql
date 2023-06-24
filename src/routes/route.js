const { Router } = require('express')
const bodyParser = require('body-parser');
const Methods = require('../db/db.method.js')

const database = new Methods()
const router = Router()

router.get(`/users/:id/info`, async (req, res) => {
    try {
        const response = await database.getUser(req.params.id);
        res.send(response);
    } catch (error) {
        console.log(error)
        res.status(error.code).send(error.message)
    }

});

router.get(`/users`, async (req, res) => {

    try {
        const response = await database.getUsers();
        res.send(response);
    } catch (error) {
        res.status(error.code).send(error.message)
    }
});

router.post("/create-users", bodyParser.json(), async (req, res) => {
    try {
        await database.createUsers(req.body);
        res.sendStatus(204);
    } catch (error) {
        console.log(error)
        res.status(error?.code).send(error?.message)
    }
});

router.patch("/update/users/:id", bodyParser.json(), async (req, res) => {
    try {
        await database.updateUsers(req.params.id, req.body);
        res.sendStatus(204);
    } catch (error) {
        console.log(error)
        res.status(error?.code).send(error?.message)
    }
});


router.delete("/deleted/users/:id", bodyParser.json(), async (req, res) => {
    try {
        await database.deleteUsers(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(error?.code).send(error?.message)
    }
});


module.exports = router