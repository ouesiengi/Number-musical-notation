const default_spacing = {
    number: {width: 10, height: 20},
    segment: {width: 1, height: 30}
}

interface Notations {
    getOffset(): coordinate
}

interface coordinate {
    offsetX: number
    offsetY: number
}

class NumberNotation implements Notations {
    getOffset(): coordinate {
        return { offsetX: 0,offsetY: 0 }
    }
}

class SegmentNotation implements Notations {
    public width: number
    public height: number
    constructor() {
        this.width = default_spacing.segment.width
        this.height = default_spacing.segment.height
    }
    getOffset(): coordinate {
        return {
            offsetX: default_spacing.number.width / 2,
            offsetY: -(default_spacing.number.height)
        }
    }
}

export {SegmentNotation, NumberNotation}