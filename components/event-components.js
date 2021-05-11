import Event from '../models/events.js'

export const newEvent = async (socketData) => {
    const { eventId, recipients, messages, details, name, place, date } = socketData
    const newEvent = await Event.create({
        eventId,
        recipients,
        messages,
        name,
        place,
        date
    })
    return newEvent}

    export const updateEvent = async (eventId, message) => {
        const updatedEvent = await Event.findOneAndUpdate(
            { eventId }, {$push: { messages: message }}
            )
        return updatedEvent
    }

    export const addMember = async (eventId, newMembers) => {
        const updatedEvent = await Event.findOneAndUpdate(
            { eventId }, {$push: { recipients: newMembers }}
            )
        return updatedEvent
    }

    export const leaveEvent = async (req, res) => {
        try {
            const { userId, userName, eventId } = req.body

            const data = await Event.findOneAndUpdate(
                { eventId }, {$pull: { recipients: { id: userId} }}
                )
            // console.log(data)
            
            // if(!data.recipients.lengh) {
            //     await Event.deleteOne({ eventId })
            //     console.log(data.recipients.lengh)
            // }
            res.send("left event")
        } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }





export const getEventsOfAccount = async (req, res) => {
    try {
        const { id } = req.params

        const data = await Event.find({ "recipients.id": id });

        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

// for testing 

export const getAllEvents = async (req, res) => {
    try {
        const data = await Event.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
      }
}