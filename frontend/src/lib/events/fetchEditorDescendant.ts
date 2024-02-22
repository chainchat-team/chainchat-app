import { Descendant } from "../../types/Descendant";
import { eventBus } from "./create-eventbus";

export function fetchEditorDescendant(): Promise<Descendant[]> {
    return new Promise((resolve, reject) => {
        const responseEditorDescendantListener = (descendantPayload: Descendant[]) => {
            resolve(descendantPayload)
            eventBus.off('responseEditorDescendant', responseEditorDescendantListener)
        }
        eventBus.on('responseEditorDescendant', responseEditorDescendantListener)
        eventBus.emit('requestEditorDescendant')
    })
}