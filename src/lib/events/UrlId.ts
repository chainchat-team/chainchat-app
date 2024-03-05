import { Emitter } from "mitt";


export function RegisterUrlIdEventCallback(eventBus: Emitter<any>, callback: Function) {
    eventBus.on('urlid', (urlId) => {
        callback(urlId)
    })
}