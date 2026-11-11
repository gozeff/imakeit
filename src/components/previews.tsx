import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ArrowUpRightIcon, BatteryFullIcon, CheckIcon, Maximize2Icon, Minimize2Icon, MousePointerClickIcon, SendIcon, SignalIcon, WifiIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const TG_USER = "BarniSolo"
export const LEGAL = "самозанятый Александров Александр Михайлович, ИНН 100118989078"

/* Живой сайт в iframe, уменьшенный под ширину контейнера.
   fill - заполнить родителя целиком (экран телефона), высота сайта подстраивается */
function ScaledFrame({
  src,
  w,
  h,
  title,
  poster,
  fill,
}: {
  src: string
  w: number
  h: number
  title: string
  poster?: string
  fill?: boolean
}) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ k: 0, ih: h })
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => {
      if (!el.offsetWidth) return
      const k = el.offsetWidth / w
      setSize({ k, ih: fill && el.offsetHeight ? el.offsetHeight / k : h })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener("resize", fit)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", fit)
    }
  }, [w, h, fill])
  // После клика по сайту клавиши уходят в него, и Esc не закрывает окно.
  // Курсор вернулся на окно вокруг сайта - отдаём фокус окну, Esc снова работает
  const frame = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    const back = () => {
      const f = frame.current
      if (!f || document.activeElement !== f) return
      const dlg = f.closest<HTMLElement>("[role=dialog]")
      if (dlg) dlg.focus()
      else f.blur()
    }
    document.addEventListener("pointermove", back)
    return () => document.removeEventListener("pointermove", back)
  }, [])
  const { k, ih } = size
  return (
    <div
      ref={box}
      className={cn("relative w-full overflow-clip bg-muted", fill && "h-full")}
      style={fill ? undefined : { aspectRatio: `${w} / ${h}` }}
    >
      {poster && <img src={poster} alt="" className="absolute inset-0 size-full object-cover object-left-top" />}
      {k > 0 && (
        <iframe
          ref={frame}
          src={src}
          title={title}
          className="absolute top-0 left-0 origin-top-left border-0 bg-transparent"
          style={{ width: w, height: ih, transform: `scale(${k})` }}
        />
      )}
    </div>
  )
}

/* Телефон: ровная тонкая рамка, боковые кнопки, строка состояния. Размер задаётся шириной */
export function PhoneFrame({
  children,
  className,
  style,
  bar = "light",
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  bar?: "light" | "dark"
}) {
  const side = "absolute w-[1.1cqw] rounded-full bg-neutral-700"
  return (
    <div className={cn("@container relative", className)} style={{ aspectRatio: "0.4754", ...style }}>
      <span aria-hidden="true" className={cn(side, "top-[17%] -left-[0.7cqw] h-[5%]")} />
      <span aria-hidden="true" className={cn(side, "top-[25%] -left-[0.7cqw] h-[9%]")} />
      <span aria-hidden="true" className={cn(side, "top-[36%] -left-[0.7cqw] h-[9%]")} />
      <span aria-hidden="true" className={cn(side, "top-[28%] -right-[0.7cqw] h-[13%]")} />
      <div className="size-full rounded-[15cqw] bg-neutral-950 p-[2.6cqw] shadow-2xl ring-1 ring-neutral-700/60">
        <div
          className={cn(
            "flex size-full flex-col overflow-clip rounded-[12.4cqw]",
            bar === "dark" ? "bg-neutral-950 text-white" : "bg-white text-neutral-900",
          )}
        >
          <div aria-hidden="true" className="flex h-[10cqw] shrink-0 items-end justify-between px-[8cqw] pb-[1.2cqw] text-[3.6cqw] font-semibold">
            <span className="tabular-nums">9:41</span>
            <span className="flex items-center gap-[1.4cqw]">
              <SignalIcon className="size-[3.8cqw]" />
              <WifiIcon className="size-[3.8cqw]" />
              <BatteryFullIcon className="size-[4.6cqw]" />
            </span>
          </div>
          <div className="relative min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

/* Плитка-скриншот → окно с живым сайтом */
export function SitePreview({
  trigger,
  name,
  url,
  href,
  poster,
}: {
  trigger: React.ReactElement
  name: string
  url: string
  href: string
  poster: string
}) {
  const [full, setFull] = useState(false)
  return (
    <Dialog onOpenChange={(o) => !o && setFull(false)}>
      <DialogTrigger nativeButton={false} render={trigger} />
      <DialogContent
        className={cn("gap-0 overflow-clip p-0 transition-none sm:max-w-none", full && "flex flex-col")}
        style={
          full
            ? { width: "calc(100vw - 1rem)", height: "calc(100svh - 1rem)", maxWidth: "none" }
            : { width: "min(64rem, calc((100svh - 11rem) * 1.6), calc(100vw - 2rem))", maxWidth: "none" }
        }
      >
        <DialogHeader className="shrink-0 flex-row items-center justify-between gap-4 border-b px-4 py-3 pr-12">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription className="sr-only">Живой сайт: можно смотреть, кликать и листать</DialogDescription>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden rounded-full sm:inline-flex">
              {url}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              aria-label={full ? "Свернуть" : "На весь экран"}
              onClick={() => setFull((v) => !v)}
            >
              {full ? <Minimize2Icon data-icon="inline-start" /> : <Maximize2Icon data-icon="inline-start" />}
              <span className="hidden sm:inline">{full ? "Свернуть" : "На весь экран"}</span>
            </Button>
          </div>
        </DialogHeader>
        <div className={cn(full && "min-h-0 flex-1")}>
          <ScaledFrame fill={full} src={href} w={1440} h={900} title={name} poster={poster} />
        </div>
        <DialogFooter className="m-0 shrink-0 flex-col items-stretch gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <MousePointerClickIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            Это живой сайт - можно смотреть, кликать и листать
          </span>
          <Button size="lg" render={<a href={href} target="_blank" rel="noreferrer" />}>
            Перейти и посмотреть, как это работает
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* Телефон → крупный живой телефон, можно листать */
export function PhonePreview({
  trigger,
  name,
  href,
  poster,
  bar,
}: {
  trigger: React.ReactElement
  name: string
  href: string
  poster: string
  bar?: "light" | "dark"
}) {
  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={trigger} />
      <DialogContent
        showCloseButton={false}
        className="w-auto max-w-none items-center justify-items-center gap-3 bg-transparent p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{name} на телефоне</DialogTitle>
        <PhoneFrame bar={bar} style={{ width: "min(22rem, calc((100svh - 6rem) * 0.4754))" }}>
          <ScaledFrame fill src={href} w={390} h={844} title={`${name} на телефоне`} poster={poster} />
        </PhoneFrame>
        <Badge variant="secondary" className="rounded-full">
          Живой сайт - можно смотреть, кликать и листать
        </Badge>
      </DialogContent>
    </Dialog>
  )
}

/* Пакет → большое окно с подробностями и заявкой */
export type Plan = {
  t: string
  price: string
  d: string
  b: readonly string[]
  more: readonly string[]
  need: readonly string[]
  ex: readonly [string, string, string] | null
}

export type Tone = { chip: string; wash: string; line: string; badge: string }

export function PlanDialog({
  plan,
  trigger,
  tone,
  icon: Icon,
}: {
  plan: Plan
  trigger: React.ReactElement
  tone: Tone
  icon: React.ComponentType<{ className?: string }>
}) {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [note, setNote] = useState("")
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = [
      `Здравствуйте! Хочу: ${plan.t} (${plan.price} ₽).`,
      name && `Имя: ${name}`,
      contact && `Связь: ${contact}`,
      note && `Комментарий: ${note}`,
    ]
      .filter(Boolean)
      .join("\n")
    window.open(`https://t.me/${TG_USER}?text=${encodeURIComponent(text)}`, "_blank")
  }
  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={trigger} />
      <DialogContent initialFocus={false} className="max-h-[92svh] gap-0 overflow-y-auto p-0 sm:max-w-4xl">
        <div className="relative overflow-hidden border-b px-6 pt-6 pb-5">
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-radial-[at_0%_0%] to-transparent to-70%", tone.wash)} />
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent", tone.line)} />
          <DialogHeader className="relative flex-row flex-wrap items-end justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl ring-1", tone.chip)}>
                <Icon className="size-6" />
              </span>
              <div className="flex flex-col gap-0.5">
                <DialogTitle className="text-2xl">{plan.t}</DialogTitle>
                <DialogDescription className="text-base text-foreground/75">{plan.d}</DialogDescription>
              </div>
            </div>
            <p className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-base text-muted-foreground">от</span>
              <span className="text-4xl font-semibold tracking-tight">{plan.price.replace(/^от\s/, "")} ₽</span>
            </p>
          </DialogHeader>
        </div>

        <div className="grid gap-6 px-6 py-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">Что входит</h3>
            <ul className="flex flex-col gap-2">
              {plan.more.map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-1", tone.chip)}>
                    <CheckIcon className="size-3" aria-hidden="true" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">Что нужно от вас</h3>
              <ol className="flex flex-col gap-2">
                {plan.need.map((x, i) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    {x}
                  </li>
                ))}
              </ol>
            </div>
            {plan.ex && (
              <a
                href={plan.ex[1]}
                target="_blank"
                rel="noreferrer"
                className="group/ex flex items-center gap-3 rounded-xl border bg-muted/40 p-2 pr-4 transition-colors hover:bg-muted"
              >
                <img
                  src={plan.ex[2]}
                  alt={plan.ex[0]}
                  className="aspect-[16/10] w-36 shrink-0 rounded-lg object-cover object-left-top ring-1 ring-foreground/10"
                />
                <span className="flex flex-1 flex-col">
                  <span className="text-xs text-muted-foreground">Пример</span>
                  <span className="font-medium">{plan.ex[0]}</span>
                </span>
                <ArrowUpRightIcon className="size-4 transition-transform group-hover/ex:translate-x-0.5 group-hover/ex:-translate-y-0.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <form onSubmit={send} className="relative flex flex-col gap-3 overflow-hidden border-t px-6 py-4">
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-radial-[at_100%_100%] to-transparent to-70%", tone.wash)} />
          <div className="relative flex flex-col gap-0.5">
            <h3 className="text-lg font-semibold">Оставить заявку</h3>
            <p className="text-sm text-foreground/70">Заявка откроется в Telegram - останется нажать «Отправить».</p>
          </div>
          <FieldGroup className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
            <Field>
              <FieldLabel htmlFor="pl-name">Как к вам обращаться</FieldLabel>
              <Input id="pl-name" className="bg-background/70" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="pl-contact">Телефон или Telegram</FieldLabel>
              <Input id="pl-contact" className="bg-background/70" value={contact} onChange={(e) => setContact(e.target.value)} />
            </Field>
            <Field className="sm:col-span-2 lg:col-span-1">
              <FieldLabel htmlFor="pl-note">Канал, Авито или пара слов о деле</FieldLabel>
              <Input id="pl-note" className="bg-background/70" value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          </FieldGroup>
          <div className="relative flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Исполнитель: {LEGAL}</p>
            <Button type="submit" size="lg" className="shrink-0">
              <SendIcon data-icon="inline-start" />
              Отправить заявку в Telegram
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
