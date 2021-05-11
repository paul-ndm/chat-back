import mongoose from 'mongoose'
const { Schema, model } = mongoose

const MessageSchema = new Schema({text: String, id: String, name: String})
const RecipientSchema = new Schema({id: String, name: String})

const eventSchema = new Schema({
    eventId: { type: String, required: true},
    recipients: [RecipientSchema],
    messages: [MessageSchema],
    name: { type: String},
    place: { type: String},
    date: { type: String}

})

export default model('Event', eventSchema)