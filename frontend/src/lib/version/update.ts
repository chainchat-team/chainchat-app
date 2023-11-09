import { Version } from "../interfaces/Version";

export function update(version: Version, otherVersion: Version): Version {
    if (!version.exceptions) {
        throw new Error(`Version's exception property is undefined: ${JSON.stringify(version)}`)
    }
    const incomingCounter = otherVersion.counter;
    var updatedVersion: Version;
    if (incomingCounter <= version.counter) {
        const index = version.exceptions.indexOf(incomingCounter)

        const updatedExceptions = [...version.exceptions.slice(0, index), ...version.exceptions.slice(index + 1)]
        updatedVersion = { ...version, exceptions: updatedExceptions }
    } else if (incomingCounter === version.counter + 1) {
        updatedVersion = {
            ...version,
            counter: incomingCounter
        }
    } else {
        const nextExpectedOperation = version.counter + 1
        const updatedExceptions: number[] = [...version.exceptions]
        for (let i = nextExpectedOperation; i < incomingCounter; i++) {
            updatedExceptions.push(i)
        }

        updatedVersion = {
            ...version,
            counter: incomingCounter,
            exceptions: updatedExceptions
        }
    }
    return updatedVersion
}