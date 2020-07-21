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
    public default_spacing: number = 30

    constructor(option: Options) {
        this.options = option
        this.x = 0.0
        this.y = this.options.row_spacing
        this.ctx_width = this.options.ctx_spacing
        this.fact_spacing = this.options.ctx_spacing - (this.options.padding_spacing * 2)
    }

    public parse(tones: any): void {
        if(tones) {
            for(let idx in tones) {
                let section: Section = {
                    section_idx: parseInt(idx),
                    spacing: tones[idx].notes.length * this.options.padding_spacing + this.options.padding_spacing,
                    tones: tones[idx].notes
                }
                this.tones.push(section)
            }
        }
        this.correct()
    }

    public correct(): void {

        for(let idx in this.tones) {
            const section = this.tones[idx]
            this.row_tone_total += section.tones.length
            this.row_spacing += section.spacing
            if(this.row_spacing > this.fact_spacing) {
                this.row_node_total = this.row_node_total + (this.row_tone_total - section.tones.length) - 1
                const correct_spacing = this.fact_spacing / this.row_node_total
                const config = {
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

            for(let key in  section.tones) {
                const node = section.tones[key]
                if(row_start) {
                    this.x = this.default_spacing
                    row_start = false
                } else {
                    this.x += correct_spacing
                }

                let textNode = {
                    option: {x: this.x, y: this.y},
                    type: 'text',
                    tones: node.tones,
                    slur: node.slur || null
                }
                toneMaps.push(textNode)
            }

            this.x += correct_spacing

            let rectNode = {
                option: {width: 1, height: 30, x: this.x + 5, y: this.y - 20},
                type: 'rect',
                tones: null,
                slur: null
            }
            toneMaps.push(rectNode)

        }
        return toneMaps
    }

}

export {Layout, Options}