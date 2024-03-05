import { Avatar } from "../types/Avatar";
import { peerIdToAvatar } from "../avatarmap/peerIdToAvatar";

export interface AvatarMapInterface {
  peerIdToAvatar: (peerId: string) => Avatar;
}

export const AvatarMapInterface: AvatarMapInterface = {
  peerIdToAvatar: (...args) => peerIdToAvatar(...args),
};
