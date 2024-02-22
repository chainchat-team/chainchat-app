import { Avatar } from "../types/Avatar";
import { eventBus } from "./create-eventbus";

export function fetchAvatar(peerId: string): Promise<Avatar> {
  return new Promise((resolve, reject) => {
    const responseAvatarListener = (avatarPayload: Avatar) => {
      eventBus.off("responseAvatar", responseAvatarListener);
      console.log("---fetchAvatar---");
      console.log(avatarPayload);
      resolve(avatarPayload);
    };
    eventBus.on("responseAvatar", responseAvatarListener);
    eventBus.emit("requestAvatar", peerId);
  });
}
