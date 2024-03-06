
const Events = require('events')


const eventEmitter = new (Events).EventEmitter()

eventEmitter.all = function (events, callback) {
    const eventList = events.slice(0)

    events.forEach((event) => {
        eventEmitter.on(event, () => {
            const index = eventList.indexOf(event)
            if (index === -1) {
                return
            }
            eventList.splice(index, 1)
            if (eventList.length === 0) {
                callback()
            }
        })
    })
}

eventEmitter.any = function (events, callback) {
    events.forEach((event) => {
        eventEmitter.on(event, () => {
            if (events !== null) {
                callback()
            }

            events = null
        })
    })
}


module.exports = eventEmitter
