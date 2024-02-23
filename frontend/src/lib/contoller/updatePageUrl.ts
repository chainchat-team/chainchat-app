// import { Controller, ControllerInterface } from "../interfaces/Controller";

// /**
//  * Updating the URL displayed in the browser's address bar to the value specified in newURL without causing a full page reload.
//  * It adds a new state to the browser's history stack,
//  * allowing the user to navigate back and forth within the web application while changing the URL as needed for the application's functionality,
//  * such as handling different views or states within the application.
//  * @param controller
//  * @param id
//  * @param win
//  */
// export function updatePageURL(controller: Controller, id: string, win = window) {
//     ControllerInterface.setUrlId(controller, id)

//     const newURL = controller.host + '?' + id;
//     win.history.pushState({}, '', newURL);
// }
