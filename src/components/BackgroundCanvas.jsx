import { useEffect, useRef } from 'react'

// ---------- subtle code palette (low alpha = subtle) ----------
const C = {
  plain:     'rgba(74, 222, 128, 0.10)',
  plain2:    'rgba(74, 222, 128, 0.20)',
  keyword:   'rgba(192, 132, 252, 0.07)',
  string:    'rgba(251, 191, 36, 0.065)',
  comment:   'rgba(110, 231, 183, 0.04)',
  decorator: 'rgba(255, 122, 92, 0.07)',
  function:  'rgba(96, 165, 250, 0.065)',
  number:    'rgba(255, 122, 92, 0.065)',
  tag:       'rgba(255, 122, 92, 0.07)',
  className: 'rgba(255, 200, 110, 0.065)',
  caret:     'rgba(74, 222, 128, 0.14)',
}

const PY_KW = /^(import|from|def|class|return|if|elif|else|for|while|in|await|async|raise|with|lambda|None|True|False|and|or|not|as)$/
const JS_KW = /^(import|from|export|default|const|let|var|function|return|if|else|for|while|new|await|async|null|undefined|true|false)$/

function highlightLine(line, lang) {
  if (/^\s*(#|\/\/)/.test(line)) return [{ text: line, color: C.comment }]
  const kw = lang === 'jsx' ? JS_KW : PY_KW
  const tokens = []
  let last = 0
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@\w+)|(<\/?[A-Za-z][\w.]*|\/>)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*(?=\())|([A-Za-z_]\w*)/g
  let m
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push({ text: line.slice(last, m.index), color: C.plain })
    const t = m[0]
    if (m[1]) tokens.push({ text: t, color: C.string })
    else if (m[2]) tokens.push({ text: t, color: C.decorator })
    else if (m[3]) tokens.push({ text: t, color: C.tag })
    else if (m[4]) tokens.push({ text: t, color: C.number })
    else if (m[5]) tokens.push({ text: t, color: kw.test(t) ? C.keyword : C.function })
    else if (m[6]) {
      // jsx attr (id followed by "="), class name if capitalised, keyword, else plain
      const next = line[m.index + t.length]
      if (lang === 'jsx' && next === '=') tokens.push({ text: t, color: C.function })
      else if (kw.test(t)) tokens.push({ text: t, color: C.keyword })
      else if (/^[A-Z]/.test(t)) tokens.push({ text: t, color: C.className })
      else tokens.push({ text: t, color: C.plain })
    }
    last = m.index + t.length
  }
  if (last < line.length) tokens.push({ text: line.slice(last), color: C.plain })
  return tokens
}

const SNIPPETS = [
  {
    lang: 'py',
    lines: [
      'import pandas as pd',
      'import numpy as np',
      '',
      'df = pd.read_csv("orders.csv")',
      'df = df.dropna(subset=["amount"])',
      'df["amount"] = df["amount"].astype(float)',
      '',
      'daily = df.groupby("date").agg(',
      '    amount=("amount", "sum"),',
      '    orders=("order_id", "count"),',
      ')',
      '',
      'daily = daily.sort_index()',
      'top = daily["amount"].sort_values().tail(5)',
      '',
      'print(top.describe())',
      'print("shape:", df.shape)',
      '',
      'weekly = daily.resample("W").mean()',
      'print(weekly.tail(10))',
      '',
      'df["margin"] = df["revenue"] - df["cost"]',
      'health = df.groupby("region")["margin"].mean()',
      'print(health.sort_values(ascending=False))',
      '',
      'merged = df.merge(products, on="sku", how="left")',
      'merged = merged.rename(columns={"sku": "product_id"})',
      '',
      'merged["week_number"] = merged["date"].dt.isoweek',
      'merged["is_weekend"] = merged["date"].dt.dayofweek >= 5',
      '',
      '# flag the big spenders',
      'merged["high_value"] = np.where(',
      '    merged["amount"] > 500, True, False',
      ')',
      '',
      '# save the clean output',
      'merged.to_parquet("orders_clean.parquet")',
      'daily.to_json("summary.json")',
      'top.to_json("top_products.json")',
    ],
  },
  {
    lang: 'py',
    lines: [
      'from pyspark.sql import SparkSession',
      'from pyspark.sql import functions as F',
      'from pyspark.sql.types import DoubleType',
      '',
      'spark = SparkSession.builder',
      '    .appName("events-pipeline")',
      '    .getOrCreate()',
      '',
      'df = spark.read.parquet("lake/events")',
      'df = df.withColumn("price",',
      '    F.col("price").cast(DoubleType()))',
      '',
      'clean = df.na.drop(subset=["date", "price"])',
      'clean = clean.filter(clean.price > 0)',
      '',
      'users = spark.read.parquet("lake/users")',
      'joined = clean.join(users, "user_id", "left")',
      '',
      'daily = joined.groupBy("date").agg(',
      '    F.sum("price").alias("revenue"),',
      '    F.count("event_id").alias("events"),',
      '    F.countDistinct("user_id").alias("users"),',
      ')',
      '',
      'daily = daily.orderBy("date")',
      'daily = daily.cache()',
      '',
      'top_users = joined.groupBy("user_id").agg(',
      '    F.sum("price").alias("spend")',
      ').orderBy(F.desc("spend"))',
      '',
      'top_users.show(10)',
      '',
      '# write results as partitioned parquet',
      'daily.write',
      '    .mode("overwrite")',
      '    .partitionBy("date")',
      '    .parquet("out/revenue/")',
    ],
  },
  {
    lang: 'py',
    lines: [
      'from fastapi import FastAPI, HTTPException',
      'from fastapi.middleware.cors import CORSMiddleware',
      'from pydantic import BaseModel',
      '',
      'app = FastAPI()',
      'db = Db(pool)',
      '',
      'class User(BaseModel):',
      '    id: int',
      '    name: str',
      '    role: str',
      '',
      'class NewUser(BaseModel):',
      '    name: str',
      '    role: str',
      '',
      'app.add_middleware(',
      '    CORSMiddleware, allow_origins=["*"]',
      ')',
      '',
      '@app.get("/health")',
      'async def health():',
      '    return {"status": "ok"}',
      '',
      '@app.get("/users")',
      'async def list_users(limit: int = 20):',
      '    return await db.fetch_all(',
      '        "SELECT * FROM users LIMIT $1", limit',
      '    )',
      '',
      '@app.get("/users/{user_id}")',
      'async def get_user(user_id: int):',
      '    user = await db.fetch_user(user_id)',
      '    if user is None:',
      '        raise HTTPException(404)',
      '    return {"user": user}',
      '',
      '@app.post("/users")',
      'async def create_user(user: NewUser):',
      '    await db.insert(user)',
      '    return {"status": "created"}',
    ],
  },
  {
    lang: 'jsx',
    lines: [
      'function UserCard({ user, onSelect }) {',
      '  const [open, setOpen] = useState(false)',
      '  const [loading, setLoading] = useState(true)',
      '',
      '  useEffect(() => {',
      '    if (!user) return',
      '    setLoading(true)',
      '    const t = setTimeout(() => {',
      '      setLoading(false)',
      '    }, 400)',
      '    return () => clearTimeout(t)',
      '  }, [user.id])',
      '',
      '  if (loading) return <Spinner />',
      '  if (!user) return <EmptyState />',
      '',
      '  return (',
      '    <div className={open ? "card open" : "card"}>',
      '      <h2>{user.name}</h2>',
      '      <p>{user.role}</p>',
      '      <p className="muted">{user.bio}</p>',
      '',
      '      <div className="actions">',
      '        <button onClick={() => onSelect(user)}>',
      '          View profile',
      '        </button>',
      '',
      '        <button onClick={() => setOpen(!open)}>',
      '          {open ? "Close" : "Details"}',
      '        </button>',
      '      </div>',
      '',
      '      {open && <UserDetails id={user.id} />}',
      '    </div>',
      '  )',
      '}',
    ],
  },
]

export default function BackgroundCanvas({ mode }) {
  const canvasRef = useRef(null)
  const modeRef = useRef(mode)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w = 0
    let h = 0
    let lastMode = null
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // flashlight: light pool follows the cursor (smoothed)
    let targetX = 0.5
    let targetY = 0.4
    let lightX = targetX
    let lightY = targetY

    function onMouseMove(e) {
      targetX = e.clientX / window.innerWidth
      targetY = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove)

    // offscreen layers: code is drawn at full alpha, then masked by the lights
    const codeLayer = document.createElement('canvas')
    const clCtx = codeLayer.getContext('2d')
    const maskLayer = document.createElement('canvas')
    const mCtx = maskLayer.getContext('2d')

    // ---------- python / react typing terminals ----------
    const FONT = 13
    const LINE_H = 19
    let terminals = []
    let charW = 7

    const LAYOUT = [
      { x: 0.03, y: 0.12, interval: 102, speed: 1 },
      { x: 0.63, y: 0.20, interval: 139, speed: 2 },
      { x: 0.24, y: 0.66, interval: 112, speed: 1 },
      { x: 0.60, y: 0.72, interval: 125, speed: 1 },
    ]

    function initCode() {
      ctx.font = `${FONT}px monospace`
      charW = ctx.measureText('0').width
      terminals = SNIPPETS.map((snippet, i) => {
        const layout = LAYOUT[i]
        return {
          x: layout.x,
          y: layout.y,
          interval: layout.interval,
          speed: layout.speed,
          lines: snippet.lines.map((line) => ({
            tokens: highlightLine(line, snippet.lang),
            len: line.length,
          })),
          lineIdx: 0,
          chars: 0,
          acc: -i * 900,
          resting: false,
        }
      })
    }

    function drawPartial(target, tokens, upto, x0, y0) {
      let offset = 0
      for (const tok of tokens) {
        if (offset >= upto) break
        const visible = Math.min(tok.text.length, upto - offset)
        if (visible > 0) {
          target.fillStyle = tok.color
          target.fillText(tok.text.slice(0, visible), x0 + offset * charW, y0)
        }
        offset += tok.text.length
      }
    }

    function applyFlashlight() {
      // smooth follow
      lightX += (targetX - lightX) * 0.35
      lightY += (targetY - lightY) * 0.35
      const lx = lightX * w
      const ly = lightY * h
      // neutral warm-white lift inside the pool
      const lift = ctx.createRadialGradient(lx, ly, 0, lx, ly, 300)
      lift.addColorStop(0, 'rgba(255, 252, 245, 0.045)')
      lift.addColorStop(1, 'rgba(255, 252, 245, 0)')
      ctx.fillStyle = lift
      ctx.fillRect(0, 0, w, h)
      // darken away from the pool
      const grad = ctx.createRadialGradient(lx, ly, 140, lx, ly, 620)
      grad.addColorStop(0, 'rgba(19, 17, 24, 0)')
      grad.addColorStop(0.55, 'rgba(19, 17, 24, 0.25)')
      grad.addColorStop(1, 'rgba(19, 17, 24, 0.66)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }

function drawCode(dt) {
      // resize offscreen layers if needed (initial)
      if (codeLayer.width !== canvas.width) {
        codeLayer.width = canvas.width
        codeLayer.height = canvas.height
        maskLayer.width = canvas.width
        maskLayer.height = canvas.height
        clCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        mCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      // ---- draw the code at full "lit" alpha into the offscreen layer ----
      clCtx.clearRect(0, 0, w, h)
      clCtx.font = `${FONT}px monospace`
      clCtx.textBaseline = 'top'
      const caretOn = Math.floor(performance.now() / 500) % 2 === 0

      terminals.forEach((term) => {
        const x0 = w * term.x
        const y0 = h * term.y
        const maxVisible = Math.max(4, Math.floor((h - y0 - 30) / LINE_H))

        if (term.resting) {
          term.acc += dt
          if (term.acc >= 2640) {
            term.resting = false
            term.lineIdx = 0
            term.chars = 0
            term.acc = 0
          }
        } else {
          term.acc += dt
          while (term.acc >= term.interval && !term.resting) {
            term.acc -= term.interval
            const line = term.lines[term.lineIdx]
            if (!line) {
              term.resting = true
              term.acc = 0
              break
            }
            if (line.len === 0 || term.chars >= line.len) {
              term.lineIdx += 1
              term.chars = 0
              term.acc -= 198
              if (term.lineIdx >= term.lines.length) {
                term.resting = true
                term.acc = 0
                break
              }
            } else {
              term.chars += term.speed
            }
          }
        }

        // scroll window: show the most recent lines that fit
        const windowStart = Math.max(0, term.lineIdx + 1 - maxVisible)
        for (let i = windowStart; i < term.lineIdx; i++) {
          const line = term.lines[i]
          if (!line || line.len === 0) continue
          drawPartial(clCtx, line.tokens, line.len, x0, y0 + (i - windowStart) * LINE_H)
        }

        const cur = term.lines[term.lineIdx]
        if (cur && cur.len > 0 && !term.resting) {
          const row = term.lineIdx - windowStart
          drawPartial(clCtx, cur.tokens, term.chars, x0, y0 + row * LINE_H)
          if (caretOn) {
            const cx = x0 + term.chars * charW
            clCtx.fillStyle = C.caret
            clCtx.fillRect(cx + 2, y0 + row * LINE_H, 7, FONT + 2)
          }
        }
      })

      // ---- build the light mask (static name light + dynamic mouse light) ----
      mCtx.clearRect(0, 0, w, h)
      mCtx.globalCompositeOperation = 'lighter'

      // static light anchored to the "Nolan Carey" heading
      const nameEl = document.querySelector('#hero h1')
      if (nameEl) {
        const r = nameEl.getBoundingClientRect()
        if (r.bottom > 0 && r.top < h + 400) {
          const sx = r.left + r.width / 2
          const sy = r.top + r.height / 2
          const fl = 0.82 + 0.18 * Math.sin(performance.now() / 1450) * Math.sin(performance.now() / 450)
          const dip = Math.sin(performance.now() / 280) > 0.88 ? 0.45 : 1
          const a = fl * dip
          const g = mCtx.createRadialGradient(sx, sy, 0, sx, sy, 1330)
          g.addColorStop(0, `rgba(255,255,255,${a})`)
          g.addColorStop(0.45, `rgba(255,255,255,${a * 0.55})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          mCtx.fillStyle = g
          mCtx.fillRect(0, 0, w, h)
        }
      }

      // dynamic light following the mouse
      const lx = lightX * w
      const ly = lightY * h
      const g2 = mCtx.createRadialGradient(lx, ly, 0, lx, ly, 320)
      g2.addColorStop(0, 'rgba(255,255,255,1)')
      g2.addColorStop(0.45, 'rgba(255,255,255,0.55)')
      g2.addColorStop(1, 'rgba(255,255,255,0)')
      mCtx.fillStyle = g2
      mCtx.fillRect(0, 0, w, h)

      mCtx.globalCompositeOperation = 'source-over'

      // ---- reveal the code only where the lights are ----
      clCtx.globalCompositeOperation = 'destination-in'
      clCtx.drawImage(maskLayer, 0, 0, w, h)
      clCtx.globalCompositeOperation = 'source-over'

      // ---- composite ----
      ctx.fillStyle = '#131118'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(codeLayer, 0, 0, w, h)

      applyFlashlight()
    }

        // ---------- corexy printer state ----------
    const printer = {
      layer: 0,
      completed: [],
      path: null,
      dist: 0,
      pause: 0,
    }

    function makeBed() {
      const size = Math.min(w, h) * 0.58
      return { cx: w / 2, cy: h / 2, half: size / 2 }
    }

    function makePath(layer) {
      const bed = makeBed()
      const inset = 30 + layer * 10
      const x0 = bed.cx - bed.half + inset
      const y0 = bed.cy - bed.half + inset
      const x1 = bed.cx + bed.half - inset
      const y1 = bed.cy + bed.half - inset
      const pts = [
        [x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0],
      ]
      const step = 16
      let dir = 1
      for (let y = y0 + step; y <= y1 - 2; y += step) {
        if (dir > 0) {
          pts.push([x0, y], [x1, y])
        } else {
          pts.push([x1, y], [x0, y])
        }
        dir *= -1
      }
      return buildPath(pts)
    }

    function buildPath(pts) {
      const segs = []
      let total = 0
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]
        const b = pts[i + 1]
        const len = Math.hypot(b[0] - a[0], b[1] - a[1])
        segs.push({ a, b, len })
        total += len
      }
      return { pts, segs, total }
    }

    function pointAt(path, dist) {
      let d = dist
      for (const seg of path.segs) {
        if (d <= seg.len) {
          const t = d / seg.len
          return [
            seg.a[0] + (seg.b[0] - seg.a[0]) * t,
            seg.a[1] + (seg.b[1] - seg.a[1]) * t,
          ]
        }
        d -= seg.len
      }
      return path.pts[path.pts.length - 1]
    }

    function drawPolyPartial(path, upTo, color, width) {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(path.pts[0][0], path.pts[0][1])
      let d = 0
      for (const seg of path.segs) {
        if (d + seg.len <= upTo) {
          ctx.lineTo(seg.b[0], seg.b[1])
          d += seg.len
        } else {
          const [px, py] = pointAt(path, upTo)
          ctx.lineTo(px, py)
          break
        }
      }
      ctx.stroke()
    }

    function drawPrinter(dt) {
      const bed = makeBed()
      ctx.fillStyle = '#131118'
      ctx.fillRect(0, 0, w, h)

      // bed grid
      ctx.strokeStyle = 'rgba(255, 122, 92, 0.04)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = bed.cx - bed.half; x <= bed.cx + bed.half; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, bed.cy - bed.half)
        ctx.lineTo(x, bed.cy + bed.half)
        ctx.stroke()
      }
      for (let y = bed.cy - bed.half; y <= bed.cy + bed.half; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(bed.cx - bed.half, y)
        ctx.lineTo(bed.cx + bed.half, y)
        ctx.stroke()
      }

      // bed frame
      ctx.strokeStyle = 'rgba(255, 122, 92, 0.18)'
      ctx.lineWidth = 2
      ctx.strokeRect(bed.cx - bed.half, bed.cy - bed.half, bed.half * 2, bed.half * 2)

      // corner pulleys
      ctx.fillStyle = 'rgba(255, 122, 92, 0.3)'
      const corners = [
        [bed.cx - bed.half, bed.cy - bed.half],
        [bed.cx + bed.half, bed.cy - bed.half],
        [bed.cx - bed.half, bed.cy + bed.half],
        [bed.cx + bed.half, bed.cy + bed.half],
      ]
      corners.forEach(([cx, cy]) => {
        ctx.beginPath()
        ctx.arc(cx, cy, 6, 0, Math.PI * 2)
        ctx.fill()
      })

      // completed layers
      printer.completed.forEach((p, i) => {
        drawPolyPartial(p, p.total, `rgba(255, 122, 92, ${0.25 + i * 0.08})`, 1.2)
      })

      if (printer.path) {
        drawPolyPartial(printer.path, printer.dist, 'rgba(255, 122, 92, 0.55)', 1.5)
      }

      // head position
      const head = printer.path ? pointAt(printer.path, printer.dist) : [bed.cx, bed.cy - bed.half + 30]
      ctx.strokeStyle = 'rgba(255, 200, 110, 0.12)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(bed.cx - bed.half, head[1])
      ctx.lineTo(bed.cx + bed.half, head[1])
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(head[0], bed.cy - bed.half)
      ctx.lineTo(head[0], bed.cy + bed.half)
      ctx.stroke()

      // head body
      ctx.fillStyle = 'rgba(255, 200, 110, 0.9)'
      ctx.beginPath()
      ctx.roundRect(head[0] - 9, head[1] - 9, 18, 18, 3)
      ctx.fill()
      ctx.fillStyle = 'rgba(255, 122, 92, 0.35)'
      ctx.beginPath()
      ctx.arc(head[0], head[1] + 10, 3, 0, Math.PI * 2)
      ctx.fill()

      // motion
      if (printer.pause > 0) {
        printer.pause -= dt
        if (printer.pause <= 0) {
          printer.layer++
          if (printer.layer > 3) printer.layer = 0
          while (printer.completed.length >= 3) printer.completed.shift()
          printer.path = makePath(printer.layer)
          printer.dist = 0
        }
      } else if (printer.path) {
        printer.dist += 3.2
        if (printer.dist >= printer.path.total) {
          printer.completed.push(printer.path)
          printer.path = null
          printer.pause = 900
        }
      } else if (printer.pause === 0 && !printer.path) {
        printer.path = makePath(printer.layer)
        printer.dist = 0
      }

      applyFlashlight()
    }

    function frame() {
      const dt = 16
      const mode = modeRef.current === 'software' ? 'code' : modeRef.current
      if (mode !== lastMode) {
        ctx.fillStyle = '#131118'
        ctx.fillRect(0, 0, w, h)
        if (mode === 'code') initCode()
        if (mode === 'printing') {
          printer.layer = 0
          printer.completed = []
          printer.path = null
          printer.dist = 0
          printer.pause = 300
        }
        lastMode = mode
      }
      if (mode === 'code') drawCode(dt)
      else if (mode === 'printing') drawPrinter(dt)
      else {
        ctx.fillStyle = '#131118'
        ctx.fillRect(0, 0, w, h)
      }
      raf = requestAnimationFrame(frame)
    }

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastMode = null
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
