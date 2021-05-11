import express from 'express'
import { getAllEvents, getEventsOfAccount, leaveEvent } from '../components/event-components.js'

var events = express.Router();

events.get('/:id', getEventsOfAccount)
events.get('/', getAllEvents)
events.put('/', leaveEvent)

export default events