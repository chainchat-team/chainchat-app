import { Controller } from "../interfaces/Controller";

export function handleEvent(controller: Controller, eventName: string, ...args: any[]): void {
    if (controller._eventListeners[eventName]) {
        controller._eventListeners[eventName].forEach((listener) => {
            listener(...args);
        });
    }
}