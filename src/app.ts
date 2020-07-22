import {Nmn, Vex} from './nmn/main'

const data = [
    { notes : [{ tones : ["b/5"]}, {tones : ["b/3"]}], slur: [1, 2] },
    { notes : [{ tones : ["b/5"]}, {tones : ["b/3"]}], slur: [1, 2] },
    { notes : [{ tones : ["b/5"]}, {tones : ["b/3"]}, { tones : ["b/2"]}, {tones : ["b/3"]}] },
    { notes : [{ tones : ["b/5"]}, {tones : ["-"]}]},
    { notes : [{ tones : ["b/5"]}, { tones : ["b/5"]}, { tones : ["b/3"]}]},
    { notes : [{ tones : ["b/6"]}, {tones : ["b/5"]}] },
    { notes : [{ tones : ["b/3"]}, {tones : ["b/5"]}, { tones : ["b/3"]}, {tones : ["b/2"]}] },
    { notes : [{ tones : ["b/1"]}, {tones : ["b/2"]}] },
    { notes : [{ tones : ["b/3"]}, {tones : ["b/5"]}] },
    { notes : [{ tones : ["b/3"]}, {tones : ["b/2"]}, { tones : ["b/1"]}, {tones : ["b/2"]}] },
    { notes : [{ tones : ["b/3"]}, {tones : ["-"]}]},
    { notes : [{ tones : ["b/6"]}, {tones : ["b/5"]}, { tones : ["b/6"]}, {tones : ["b/5"]}] },
    { notes : [{ tones : ["b/2"]}, {tones : ["b/3"]}, { tones : ["b/5"]}] },
    { notes : [{ tones : ["b/6"]}, {tones : ["b/5"]}, { tones : ["b/6"]}, {tones : ["b/5"]}] },
    { notes : [{ tones : ["b/2"]}, {tones : ["b/3"]}] },
    { notes : [{ tones : ["b/1"]}]},
]


const Renderer = Vex.Flow.Renderer;

const renderer = new Renderer(<HTMLElement>document.getElementById('tabs'), Renderer.Backends.SVG);

//step 1
const nmn = new Nmn({padding_spacing:50, row_spacing: 100, ctx_spacing: 700})

//step 2 parse data && render
nmn.parse(data).render(renderer)
