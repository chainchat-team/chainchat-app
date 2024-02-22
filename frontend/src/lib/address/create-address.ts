import { Peer as PeerJs } from "peerjs";
import { eventBus } from "../events/create-eventbus";
import { AddressInterface } from "../interfaces/Address";
import { fetchNetwork } from "../events/fetchNetwork";
export function createAddress(host: string, port: string, peerId: string, peerjs: PeerJs) {
  const address = {
    host: host,
    port: port,
    targetPeerId: peerId,
    peerId: "",
  };
  peerjs.on("open", (id) => {
    address.peerId = id;
    eventBus.emit("updateAddress", { ...address });
  });
  eventBus.on("broadcastAddToNetwork", ({ peerToBeAdded, peerSender, networkVersion }) => {
    if (address.targetPeerId === "") {
      address.targetPeerId = peerToBeAdded.peerId;
      window.history.pushState({}, "", AddressInterface.getAddressBarUrl(address));
      eventBus.emit("updateAddress", { ...address });
    }
  });
  eventBus.on("broadcastRemoveFromNetwork", async ({ peerToBeRemoved, peerSender, networkVersion, connectionType }) => {
    if (address.targetPeerId === peerToBeRemoved.peerId) {
      const network = await fetchNetwork();
      const possibleNextConnections = network.globalPeers.filter(
        (peer) => peer.peerId !== address.targetPeerId || peer.peerId !== address.peerId
      );
      if (possibleNextConnections.length > 1) {
        const randomIdx = Math.floor(Math.random() * possibleNextConnections.length);
        const nextPossiblePeer = possibleNextConnections[randomIdx];
        address.targetPeerId = nextPossiblePeer.peerId;
        window.history.pushState({}, "", AddressInterface.getAddressBarUrl(address));
      } else {
        address.targetPeerId = "";
        window.history.pushState({}, "", AddressInterface.getAddressBarUrl(address));
      }
    }
  });
  eventBus.on("requestAddress", () => {
    eventBus.emit("responseAddress", { ...address });
  });
}
