import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ArrowUpRightIcon, BatteryFullIcon, CheckIcon, MousePointerClickIcon, SendIcon, SignalIcon, WifiIcon } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const TG_USER = "BarniSolo"
export const LEGAL = "самозанятый Александров Александр Михайлович, ИНН 100118989078"

/* Живой сайт в iframe, уменьшенный под ширину контейнера.
   fill - заполнить родителя целиком (экран телефона), высота сайта подстраивается */
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
  const { k, ih } = size
  return (
    <div
      ref={box}
      className={cn("relative w-full overflow-hidden bg-muted", fill && "h-full")}
      style={fill ? undefined : { aspectRatio: `${w} / ${h}` }}
    >
      {poster && <img src={poster} alt="" className="absolute inset-0 size-full object-cover object-left-top" />}
      <iframe
        src={src}
        title={title}
        className="absolute top-0 left-0 origin-top-left border-0 bg-transparent"
        style={{ width: w, height: ih, transform: `scale(${k || 0.5})`, visibility: k ? "visible" : "hidden" }}
      />
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
            "flex size-full flex-col overflow-hidden rounded-[12.4cqw]",
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
  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={trigger} />
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-none"
        style={{ width: "min(64rem, calc((100svh - 11rem) * 1.6), calc(100vw - 2rem))", maxWidth: "none" }}
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b px-4 py-3 pr-12">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription className="sr-only">Живой сайт: можно смотреть, кликать и листать</DialogDescription>
          <Badge variant="outline" className="hidden rounded-full sm:inline-flex">
            {url}
          </Badge>
        </DialogHeader>
        <ScaledFrame src={href} w={1440} h={900} title={name} poster={poster} />
        <DialogFooter className="m-0 flex-row items-center justify-between gap-4 border-t px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <MousePointerClickIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            Это живой сайт - можно смотреть, кликать и листать
          </span>
          <Button size="lg" render={<a href={href} target="_blank" rel="noreferrer" />}>
            Перейти и посмотреть, как это работает
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
        <DialogTitle className="sr-only">{name} на телефоне</DialogTitle>
        <PhoneFrame bar={bar} style={{ width: "min(22rem, calc((100svh - 6rem) * 0.4754))" }}>
          <ScaledFrame fill src={href} w={390} h={844} title={`${name} на телефоне`} poster={poster} />
        </PhoneFrame>
        <Badge variant="secondary" className="rounded-full">
          Живой сайт - можно смотреть, кликать и листать
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

export function PlanDialog({ plan, trigger }: { plan: Plan; trigger: React.ReactElement }) {
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
      <DialogContent className="max-h-[90svh] gap-6 overflow-y-auto p-6 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{plan.t}</DialogTitle>
          <DialogDescription className="text-base">{plan.d}</DialogDescription>
          <p className="pt-1 text-4xl font-semibold tracking-tight tabular-nums">{plan.price} ₽</p>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="font-medium">Что входит</h3>
            <ul className="flex flex-col gap-2">
              {plan.more.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckIcon className="size-3" aria-hidden="true" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Что нужно от вас</h3>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                {plan.need.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            {plan.ex && (
              <a
                href={plan.ex[1]}
                target="_blank"
                rel="noreferrer"
                className="group/ex overflow-hidden rounded-xl border"
              >
                <img
                  src={plan.ex[2]}
                  alt={plan.ex[0]}
                  className="aspect-[16/9] w-full object-cover object-left-top transition-transform duration-500 group-hover/ex:scale-[1.03]"
                />
                <span className="flex items-center justify-between px-3 py-2 text-sm font-medium">
                  Пример: {plan.ex[0]}
                  <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                </span>
              </a>
            )}
          </div>
        </div>

        <Separator />

        <form onSubmit={send} className="flex flex-col gap-4">
          <h3 className="font-medium">Оставить заявку</h3>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="pl-name">Как к вам обращаться</FieldLabel>
              <Input id="pl-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="pl-contact">Телефон или Telegram</FieldLabel>
              <Input id="pl-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="pl-note">Ссылка на канал, Авито или пара слов о деле</FieldLabel>
              <Textarea id="pl-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          </FieldGroup>
          <Button type="submit" size="lg" className="w-full sm:w-fit">
            <SendIcon data-icon="inline-start" />
            Отправить заявку в Telegram
          </Button>
          <p className="text-xs text-muted-foreground">Исполнитель: {LEGAL}</p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
