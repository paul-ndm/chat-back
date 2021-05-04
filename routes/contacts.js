import express from 'express'

var contacts = express.Router();

contacts.post('/', addContact)
contacts.get('/', getAllContacts)
contacts.put('/', updateContact)

export default contacts