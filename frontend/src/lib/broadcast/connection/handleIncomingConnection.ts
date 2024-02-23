import { Peer as PeerJs, DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastEvent } from "../../types/BroadcastEventTypes";
import {
  PeerAddToNetworkEvent,
  PeerEvent,
  PeerForwardRequestEvent,
  PeerNetworkFullEvent,
  PeerRemoveFromNetworkEvent,
  PeerSyncRequestEvent,
} from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";
import { Peer } from "../../types/Peer";
import { VersionVectorInterface } from "../../interfaces/VersionVector";
import { fetchNetwork } from "../../events/fetchNetwork";
import { fetchCrdt } from "../../events/fetchCrdt";
import { fetchEditorDescendant } from "../../events/fetchEditorDescendant";

export function handleIncomingConnection(broadcast: Broadcast, peerjs: PeerJs) {
  peerjs.on("connection", (connection: DataConnection) => {
    connection.on("open", () => {});
    connection.on("data", async (payloaddata: unknown) => {
      const connData = payloaddata as BroadcastEvent | PeerEvent;
      const hasReachedMax = await BroadcastInterface.hasReachedMax(broadcast);
      let data;
      switch (connData.type) {
        case "connRequest":
          console.log("--received connRequest---");
          // you can send them a syncRequest or forwardRequest
          console.log(hasReachedMax);
          if (hasReachedMax) {
            //get a avialabe user.
            const availablePeer: Peer | undefined = await BroadcastInterface.getAvailablePeer(broadcast);
            if (availablePeer === undefined) {
              const initialData: PeerNetworkFullEvent = {
                type: "networkFull",
                siteId: broadcast.siteId,
                peerId: peerjs.id,
              };
              connection.send(initialData);
            } else {
              const initialData: PeerForwardRequestEvent = {
                type: "forwardRequest",
                siteId: broadcast.siteId,
                peerId: peerjs.id,
                avialablePeer: availablePeer,
              };
              connection.send(initialData);
            }
          } else {
            // only run this logic if the you haven't reached max
            BroadcastInterface.addIncomingConnection(broadcast, {
              peerId: connData.peerId,
              siteId: connData.siteId,
              connection: connection,
            });
            let network = await fetchNetwork();
            if (network.versionVector === null) throw new Error("Network version vector is null.");
            const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector);
            networkVersion.counter++;
            const payload = {
              peerToBeAdded: { peerId: connData.peerId, siteId: connData.siteId },
              peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
              networkVersion: networkVersion,
            };
            eventBus.emit("addToNetwork", payload);

            const crdt = await fetchCrdt();
            const initalStruct = await fetchEditorDescendant();
            network = await fetchNetwork();
            if (crdt.versionVector === null) throw new Error("Crdt version vector is null.");
            const initialData: PeerSyncRequestEvent = {
              type: "syncRequest",
              siteId: broadcast.siteId,
              peerId: peerjs.id,
              initialStruct: initalStruct,
              versionVector: crdt.versionVector,
              network: network,
            };
            console.log("---sending initaldata--");
            console.log(initialData);
            connection.send(initialData);
          }
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
          console.log("--emitting handlRemoteOperation---");
          eventBus.emit("handleRemoteOperation", connData as BroadcastCrdtEvent);
          break;
      }
    });

    connection.on("error", async () => {
      const peerToBeRemoved = BroadcastInterface.getIncomingPeer(broadcast, connection);
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
        connectionType: "in",
      });
    });
    connection.on("close", async () => {
      // what if the close happened because the user was not accepeted to local network
      if (!broadcast._isCloser) {
        try {
          const peerToBeRemoved = BroadcastInterface.getIncomingPeer(broadcast, connection);
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
            connectionType: "in",
          });
        } catch (error) {
          console.log(error);
          console.log("possiblly close connection because, it was forwarded");
          return;
        }
      }
    });
  });
}
