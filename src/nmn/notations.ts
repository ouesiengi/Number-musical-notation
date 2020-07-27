const default_spacing = {
    number: {width: 10, height: 20},
    segment: {width: 1.5, height: 30}
}

enum TONES {C= 1, D, E, F, G, A, B}

interface OffsetNotations {
    getOffset(): coordinate
}

interface coordinate {
    offsetX: number
    offsetY: number
}

class NumberNotation implements OffsetNotations {
    getOffset(): coordinate {
        return { offsetX: 0,offsetY: 0 }
    }
}

class SegmentNotation implements OffsetNotations {
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

class LenNotation implements OffsetNotations {
    getOffset(): coordinate {
        return {
            offsetX: 0,
            offsetY: 5
        }
    }
}

class Transition {
    static parseTone(tone: string): number {
        let t:string = tone.substr(0, 1)
        switch (t) {
            case 'C':
                return TONES.C
            case 'D':
                return TONES.D
            case 'E':
                return TONES.E
            case 'F':
                return TONES.F
            case 'G':
                return TONES.G
            case 'A':
                return TONES.A
            case 'B':
                return TONES.B
            default:
                return 0
        }
    }
}

export {SegmentNotation, NumberNotation, LenNotation, Transition}