export interface Version {
    siteId: number,
    counter: number,
    exceptions: number[]
}

export interface VersionInterface {
    update: (version: number) => void
}

export const VersionInterface: VersionInterface = {
    update: (version: number) => {

    }
}