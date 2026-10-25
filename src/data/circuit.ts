import schematics from './schematics.json'
export type Schematic=typeof schematics[number]
export function circuitBounds(data:Schematic){
 const coords=data.wires.flatMap(w=>[[w[0],w[1]],[w[2],w[3]]]).concat(data.symbols.map(s=>[s.x,s.y]))
 const xs=coords.map(p=>p[0]),ys=coords.map(p=>p[1]);const x=Math.min(...xs)-80,y=Math.min(...ys)-80
 return {x,y,w:Math.max(...xs)-x+220,h:Math.max(...ys)-y+220}
}

export type MosfetKind='nmos'|'pmos'
export function mosfetKind(symbol:string):MosfetKind|null{const name=symbol.toLowerCase();return name.startsWith('nmos')?'nmos':name.startsWith('pmos')?'pmos':null}
