export interface Identifier {
    digit: number;
    siteId: number;
}

export interface IdentifierInterface {
    compareTo: (val: Identifier, other: Identifier) => number;
}

export const IdentifierInterface: IdentifierInterface = {
    compareTo: (val: Identifier, other: Identifier): number => {
        // Compare the digits
        if (val.digit < other.digit) {
            return -1;
        } else if (val.digit > other.digit) {
            return 1;
        }

        // If the digits are equal, compare the siteIds
        if (val.siteId < other.siteId) {
            return -1;
        } else if (val.siteId > other.siteId) {
            return 1;
        }

        // If both digits and siteIds are equal, return 0
        return 0;

    }
}

