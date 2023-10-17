import { Controller } from "../interfaces/Controller";

export function setUrlId(controller: Controller, urlId: string): Controller {
    return {
        ...controller,
        urlId: urlId
    }
}