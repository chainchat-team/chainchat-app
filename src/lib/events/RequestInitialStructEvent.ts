import { Emitter } from "mitt";

export function RegisterRequestInitialStructEvent(eventBus: Emitter<any>, callback: Function) {
    eventBus.on('request-initial-struct', () => {
        eventBus.emit('initial-struct', callback())
    })
}
