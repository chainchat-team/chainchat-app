import { Controller } from "../interfaces/Controller";


export function closeEventHandler(controller: Controller, eventName: string, callback: Function): Controller {
    if (!controller._eventListeners[eventName]) {
        return controller
    }

    const eventListeners = { ...controller._eventListeners }
    eventListeners[eventName] = eventListeners[eventName].filter((listener) => {
        listener !== callback
    })
    return {
        ...controller,
        _eventListeners: eventListeners
    }

}