//import {Notations, Transition} from './notations'
import * as Notations from "./notations"

class Options {
    public nodeMarginRight: number = 30.0
    public rowMarginTop: number = 80.0
    public ctxWidth: number = 600.0
}

interface Section {
    section_idx: number,
    spacing: number,
    tones: Array<any>,
}

class Layout {
    public options: Options
    public x: number
    public y: number
    public tones: Array<any> = []
    private rowIndex: number = 0
    public rowWidth: number = 0
    private rowNodeTotal:number = 0
    private rowToneTotal:number = 0
    public rowCorrectOption: Array<any> = []
    public factWidth: number
    public ctxWidth: number
    public ctxHeight: number = 0
    public nodeMarginRight: number

    constructor(option: Options) {
        this.options = option
        this.x = 0.0
        this.y = this.options.rowMarginTop
        this.ctxWidth = this.options.ctxWidth
        this.nodeMarginRight = this.options.nodeMarginRight
        this.factWidth = this.ctxWidth - (this.nodeMarginRight * 2)

    }

    public parse(tones: any): void {
        if(tones) {
            const Transition = new Notations.Transition()
            for(let idx in tones) {
                let notes: Array<any> = tones[idx].notes
                let note_total:number = notes.length
                let newTones: Array<any> = []
                //补充全音符和二分音符实际占位
                for(let i in notes) {
                    const duration = notes[i].duration
                    newTones.push({tone: Transition.parseTone(notes[i].tones[0]), duration: duration})
                    switch (duration) {
                        case 1: //全音
                            note_total += 3
                            newTones.push({tone: '-', duration: 0}, {tone: '-', duration: 0}, {tone: '-', duration: 0})
                            break
                        case 2: //二分
                            note_total += 1
                            newTones.push({tone: '-', duration: 0})
                            break
                        default:
                    }
                }

                //计算每小节默认占用空间
                let section: Section = {
                    section_idx: parseInt(idx),
                    spacing: (note_total * this.nodeMarginRight) + this.nodeMarginRight,
                    tones: newTones,
                }

                this.tones.push(section)
            }
        }

        this.correction()
    }

    //根据布局空间实际宽度计算每行实际小节数，并计算节点实际间隔大小
    public correction(): void {
        for(let idx in this.tones) {
            const section: any = this.tones[idx]
            this.rowToneTotal += section.tones.length
            this.rowWidth += section.spacing
            if(this.rowWidth > this.factWidth) {
                this.rowNodeTotal = this.rowNodeTotal + (this.rowToneTotal - section.tones.length) - 1
                const correct_spacing: number = this.factWidth / this.rowNodeTotal
                const config: object = {
                    correct_spacing: correct_spacing,
                    row_break: parseInt(idx) - 1
                }
                this.rowCorrectOption.push(config)
                this.rowIndex += 1
                this.rowWidth = section.spacing
                this.rowToneTotal = section.tones.length
                this.rowNodeTotal = 0
            }
            this.rowNodeTotal++
        }
        this.ctxHeight = this.options.rowMarginTop * (this.rowCorrectOption.length + 2)
        this.rowIndex = 0
        this.rowWidth = 0
    }

    public render(): Array<any> {
        const notation = {
            number: new Notations.NumberNotation(),
            segment: new Notations.SegmentNotation()
        }

        const segment = notation.segment.getOffset()

        let toneMaps: Array<any> = []
        let row_start = true
        for(let idx in this.tones) {
            const section = this.tones[idx]
            this.rowWidth += section.spacing
            if(this.rowWidth > this.factWidth){
                this.x = 0
                this.y += this.options.rowMarginTop
                this.rowIndex += 1
                this.rowWidth = section.spacing
                this.rowToneTotal = section.tones.length
                this.rowNodeTotal = 0
                row_start = true
            }

            let correct_spacing = this.rowCorrectOption[this.rowIndex] ? this.rowCorrectOption[this.rowIndex].correct_spacing : this.nodeMarginRight

            //小节分析

            //音符节点
            for(let key in  section.tones) {
                const opts = section.tones[key]
                if(row_start) {
                    this.x = this.nodeMarginRight
                    row_start = false
                } else {
                    this.x += correct_spacing
                }

                let numberNode = {
                    option: {x: this.x, y: this.y},
                    type: 'text',
                    tones: opts.tone,
                    duration: opts.duration
                }
                toneMaps.push(numberNode)
            }

            this.x += correct_spacing

            //小段分隔符节点
            let segmentNode = {
                option: {
                    width: notation.segment.width,
                    height: notation.segment.height,
                    x: this.x + segment.offsetX,
                    y: this.y + segment.offsetY
                },
                type: 'rect',
            }

            toneMaps.push(segmentNode)

        }

        return toneMaps
    }

}

export {Layout, Options}