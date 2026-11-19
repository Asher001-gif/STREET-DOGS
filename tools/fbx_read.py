"""Minimal binary-FBX reader (geometry only): returns meshes as positions/uvs/triangle lists."""
import struct, zlib
import numpy as np

def parse(path):
    d = open(path, 'rb').read()
    ver = struct.unpack('<I', d[23:27])[0]
    big = ver >= 7500
    hs = 8 if big else 4
    def rec(o):
        if big: end, n, pl, nl = struct.unpack('<QQQB', d[o:o+25]); o += 25
        else: end, n, pl, nl = struct.unpack('<IIIB', d[o:o+13]); o += 13
        if end == 0: return None, o
        name = d[o:o+nl].decode(); o += nl
        props = []
        for _ in range(n):
            t = chr(d[o]); o += 1
            if t in 'YCIFDL':
                fmt, sz = {'Y':('<h',2),'C':('<b',1),'I':('<i',4),'F':('<f',4),'D':('<d',8),'L':('<q',8)}[t]
                props.append(struct.unpack(fmt, d[o:o+sz])[0]); o += sz
            elif t in 'fdlib':
                ln, enc, cl = struct.unpack('<III', d[o:o+12]); o += 12
                raw = d[o:o+cl]; o += cl
                if enc: raw = zlib.decompress(raw)
                dt = {'f':'<f4','d':'<f8','l':'<i8','i':'<i4','b':'u1'}[t]
                props.append(np.frombuffer(raw, dtype=dt, count=ln))
            elif t in 'SR':
                ln = struct.unpack('<I', d[o:o+4])[0]; o += 4
                v = d[o:o+ln]; o += ln
                props.append(v.decode('latin1') if t == 'S' else v)
        kids = []
        while o < end:
            k, o = rec(o)
            if k is None: continue
            kids.append(k)
        return (name, props, kids), end
    o = 27; top = []
    while o < len(d) - 40:
        n, o = rec(o)
        if n is None: break
        top.append(n)
    return top

def find(node, name):
    return [k for k in node[2] if k[0] == name]

def meshes(path):
    out = []
    for top in parse(path):
        if top[0] != 'Objects': continue
        for g in find(top, 'Geometry'):
            if len(g[1]) < 3 or g[1][2] != 'Mesh': continue
            v = np.array(find(g, 'Vertices')[0][1][0]).reshape(-1, 3)
            idx = np.array(find(g, 'PolygonVertexIndex')[0][1][0])
            uvn = [k for k in find(g, 'LayerElementUV')]
            uv = uvi = None
            if uvn:
                uv = np.array(find(uvn[0], 'UV')[0][1][0]).reshape(-1, 2)
                ui = find(uvn[0], 'UVIndex')
                uvi = np.array(ui[0][1][0]) if ui else None
            tris = []; corner = 0; poly = []
            for i in idx:
                end = i < 0
                poly.append((i if i >= 0 else -i - 1, corner)); corner += 1
                if end:
                    for k in range(1, len(poly) - 1): tris.append((poly[0], poly[k], poly[k+1]))
                    poly = []
            pos = []; uvs = []
            for tri in tris:
                for (vi, c) in tri:
                    pos.append(v[vi])
                    if uv is not None:
                        uvs.append(uv[uvi[c] if uvi is not None else c])
            out.append((g[1][1], np.array(pos), np.array(uvs) if uvs else None))
    return out
