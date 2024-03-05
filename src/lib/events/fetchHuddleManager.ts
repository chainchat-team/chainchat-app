import { HuddleManager } from "../interfaces/HuddleManager";
import { eventBus } from "./create-eventbus";

export function fetchHuddleManager(): Promise<HuddleManager> {
  return new Promise((resolve, reject) => {
    const responseHuddleManagerListener = (payload: HuddleManager) => {
      eventBus.off("responseHuddleManager", responseHuddleManagerListener);
      resolve(payload);
    };
    eventBus.on("responseHuddleManager", responseHuddleManagerListener);
    eventBus.emit("requestHuddleManager");
  });
}
