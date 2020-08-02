import {Nmn, Vex} from './nmn/main'
import data from './data'

const Renderer = Vex.Flow.Renderer;

const renderer = new Renderer(<HTMLElement>document.getElementById('tabs'), Renderer.Backends.SVG);

//step 1
const nmn = new Nmn({nodeMarginRight:50, rowMarginTop: 100, ctxWidth: 700})

//step 2 parse data && render
nmn.parse(data).render(renderer)
