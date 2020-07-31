import * as Notations from './notations'
import {Transition} from "./notations";

class Options {
    public padding_spacing: number = 30
    public row_spacing: number = 80
    public ctx_spacing: number = 600
}

interface Section {
    section_idx: number,
    spacing: number,
    tones: Array<any>,
}

enum BeatIndex{}

class Layout {
    public options: Options
    public x: number
    public y: number
    public tones: Array<any> = []
    private row_index: number = 0
    public row_spacing: number = 0
    private row_node_total:number = 0
    private row_tone_total:number = 0
    public row_correct_option: Array<any> = []
    public fact_spacing: number
    public ctx_width: number = 0
    public ctx_height: number = 0
    public default_spacing: number

    constructor(option: Options) {
        this.options = option
        this.x = 0.0
        this.y = this.options.row_spacing
        this.ctx_width = this.options.ctx_spacing
        this.fact_spacing = this.options.ctx_spacing - (this.options.padding_spacing * 2)
        this.default_spacing = this.options.padding_spacing
    }

    public parse(tones: any): void {
        if(tones) {
            for(let idx in tones) {
                let notes: Array<any> = tones[idx].notes
                let note_total:number = notes.length
                let newTones: Array<any> = []
                //补充全音符和二分音符实际占位
                for(let i in notes) {
                    const duration = notes[i].duration
                    newTones.push({tone: Transition.parseTone(notes[i].tones[0]), duration: duration})
                    switch (duration) {
                        case 1:
                            note_total += 3
                            newTones.push({tone: '-', duration: 0}, {tone: '-', duration: 0}, {tone: '-', duration: 0})
                            break
                        case 2:
                            note_total += 1
                            newTones.push({tone: '-', duration: 0})
                            break
                        default:
                    }
                }

                //根据预设布局空间参数，计算每小节占用空间数据
                let section: Section = {
                    section_idx: parseInt(idx),
                    spacing: (note_total * this.options.padding_spacing) + this.options.padding_spacing,
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
            this.row_tone_total += section.tones.length
            this.row_spacing += section.spacing
            if(this.row_spacing > this.fact_spacing) {
                this.row_node_total = this.row_node_total + (this.row_tone_total - section.tones.length) - 1
                const correct_spacing: number = this.fact_spacing / this.row_node_total
                const config: object = {
                    correct_spacing: correct_spacing,
                    row_break: parseInt(idx) - 1
                }
                this.row_correct_option.push(config)
                this.row_index += 1
                this.row_spacing = section.spacing
                this.row_tone_total = section.tones.length
                this.row_node_total = 0
            }
            this.row_node_total++
        }
        this.ctx_height = this.options.row_spacing * (this.row_correct_option.length + 2)
        this.row_index = 0
        this.row_spacing = 0
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
            this.row_spacing += section.spacing
            if(this.row_spacing > this.fact_spacing){
                this.x = 0
                this.y += this.options.row_spacing
                this.row_index += 1
                this.row_spacing = section.spacing
                this.row_tone_total = section.tones.length
                this.row_node_total = 0
                row_start = true
            }

            let correct_spacing = this.row_correct_option[this.row_index] ? this.row_correct_option[this.row_index].correct_spacing : this.default_spacing

            //小节分析
            let section_hooks: Array<any> = this.analyzing(section, this.x, this.y, correct_spacing, row_start)
            toneMaps = toneMaps.concat(section_hooks)
            //音符节点
            for(let key in  section.tones) {
                const opts = section.tones[key]
                if(row_start) {
                    this.x = this.default_spacing
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
                option: {width: notation.segment.width, height: notation.segment.height, x: this.x + segment.offsetX, y: this.y + segment.offsetY},
                type: 'rect',
            }

            toneMaps.push(segmentNode)

        }
        return toneMaps
    }

    analyzing(section: any, x: number, y: number, correct_spacing: number, row_start: boolean): Array<any>{

        const toneTotal: number = section.tones.length
        const beat: number = 2 //歌曲节拍（丢手绢2/4，以4分音符为一拍，每小节两拍）
        const score: number = 4 //4分音符为一拍
        //const normalBeat: boolean = toneTotal % score == 0 ? true : false

        let _x: number = 0
        let _y: number = y

        _x = row_start ? this.default_spacing : (x + correct_spacing)

        let current_beat: number = 0

        let nodes: Array<any> = []
        for(let idx in section.tones) {

            const val = section.tones[idx]
            switch (val.duration) {
                case 2:
                    break
                case 4: //4分音符

                    _x += correct_spacing
                    break
                case 8: //八分音符
                    if (beat < 8) {}
                    if (beat == 8) {}
                    if (beat > 8) {}
                    current_beat += 0.5
                    nodes.push({
                        option: {width: 10, height: 2, x: _x, y: _y + 3},
                        type: 'rect',
                    })
                    _x += correct_spacing
                    break
                case 16: //十六分音符

                    _x += correct_spacing
                    break
                case 32: //三十二分音符
                    break
                default:
                    if(val.duration > 0) {
                        _x += correct_spacing
                    }

            }
        }

        return nodes

    }

}

export {Layout, Options}