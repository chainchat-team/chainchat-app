import { Network } from "../interfaces/Network";
import { VersionVectorInterface } from "../interfaces/VersionVector";

export function incrementVersionVector(network: Network) {
  const newVersionVector = VersionVectorInterface.increment(network.versionVector!);
  network.versionVector = newVersionVector;
}
