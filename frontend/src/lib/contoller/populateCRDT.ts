import { Descendant } from "slate";
import { Controller, ControllerInterface } from "../interfaces/Controller";

export function populateCRDT(controller: Controller, initalValue: Descendant): void {
    ControllerInterface.emit(controller, 'initialValue', initalValue)
}