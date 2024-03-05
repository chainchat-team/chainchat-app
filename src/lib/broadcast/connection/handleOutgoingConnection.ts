import { Peer as PeerJs, DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import {
  BroadcastCrdtEvent,
  BroadcastEvent,
  BroadcastForwardRequestEvent,
  BroadcastSyncRequestEvent,
} from "../../types/BroadcastEventTypes";
import { Network } from "../../interfaces/Network";
import { fetchNetwork } from "../../events/fetchNetwork";
import { VersionVectorInterface } from "../../interfaces/VersionVector";
import { PeerAddToNetworkEvent, PeerEvent, PeerRemoveFromNetworkEvent } from "../../types/PeerEventTypes";
export function handleOutgoingConnection(broadcast: Broadcast, peerjs: PeerJs, targetId: string) {
  const connection: DataConnection = peerjs.connect(targetId);

  connection.on("open", () => {
    connection.send({
      type: "connRequest",
      peerId: peerjs.id,
      siteId: broadcast.siteId,
    });
    connection.on("data", (payload: unknown) => {
      const connData = payload as BroadcastEvent | PeerEvent;

      let data;
      switch (connData.type) {
        case "syncRequest":
          BroadcastInterface.addOutGoingConnection(broadcast, {
            peerId: connData.peerId,
            siteId: connData.siteId,
            connection: connection,
          });
          eventBus.emit("handleSyncRequest", connData as BroadcastSyncRequestEvent);
          eventBus.emit("initNetwork", (connData as BroadcastSyncRequestEvent).network as Network);
          break;
        case "forwardRequest":
          BroadcastInterface.handleOutgoingConnection(
            broadcast,
            peerjs,
            (connData as BroadcastForwardRequestEvent).avialablePeer.peerId
          );
          broadcast._isCloser = true;
          connection.close();
          break;
        case "networkFull":
          broadcast._isCloser = true;
          connection.close();
          break;
        case "addToNetwork":
          data = connData as PeerAddToNetworkEvent;
          eventBus.emit("addToNetwork", {
            peerToBeAdded: data.peerToBeAdded,
            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
            networkVersion: data.networkVersion,
          });
          break;
        case "removeFromNetwork":
          data = connData as PeerRemoveFromNetworkEvent;
          eventBus.emit("removeFromNetwork", {
            peerToBeRemoved: data.peerToBeRemoved,
            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
            networkVersion: data.networkVersion,
            connectionType: data.connectionType,
          });
          break;
        default:
          eventBus.emit("handleRemoteOperation", connData as BroadcastCrdtEvent);
          break;
      }
    });
    connection.on("error", async () => {
      const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection);
      const broadcastRemoveFromNetworkListener = () => {
        BroadcastInterface.findNewTarget(broadcast);
        eventBus.off("broadcastRemoveFromNetwork", broadcastRemoveFromNetworkListener);
      };
      eventBus.on("broadcastRemoveFromNetwork", broadcastRemoveFromNetworkListener);
      const network: Network = await fetchNetwork();
      if (network.versionVector === null) throw new Error("Network version vector is null.");
      const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector);
      networkVersion.counter++;
      eventBus.emit("removeFromNetwork", {
        peerToBeRemoved: peerToBeRemoved,
        peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
        networkVersion: networkVersion,
        connectionType: "out",
      });
    });
    connection.on("close", async () => {
      if (!broadcast._isCloser) {
        const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection);
        const broadcastRemoveFromNetworkListener = () => {
          BroadcastInterface.findNewTarget(broadcast);
          eventBus.off("broadcastRemoveFromNetwork", broadcastRemoveFromNetworkListener);
        };
        eventBus.on("broadcastRemoveFromNetwork", broadcastRemoveFromNetworkListener);
        const network: Network = await fetchNetwork();
        if (network.versionVector === null) throw new Error("Network version vector is null.");
        const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector);
        networkVersion.counter++;
        eventBus.emit("removeFromNetwork", {
          peerToBeRemoved: peerToBeRemoved,
          peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
          networkVersion: networkVersion,
          connectionType: "out",
        });
      }
    });
  });
}
