import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ArrowUpRightIcon, CheckIcon, SendIcon } from "lucide-react"

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

export const TG_USER = "pv_bhp"

/* Живой сайт в iframe, уменьшенный под ширину контейнера */
function ScaledFrame({ src, w, h, title, poster }: { src: string; w: number; h: number; title: string; poster?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => el.offsetWidth && setK(el.offsetWidth / w)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener("resize", fit)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", fit)
    }
  }, [w])
  return (
    <div ref={box} className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: `${w} / ${h}` }}>
      {poster && <img src={poster} alt="" className="absolute inset-0 size-full object-cover object-left-top" />}
      <iframe
        src={src}
        title={title}
        className="absolute top-0 left-0 origin-top-left border-0 bg-transparent"
        style={{ width: w, height: h, transform: `scale(${k || 0.5})`, visibility: k ? "visible" : "hidden" }}
      />
    </div>
  )
}

/* Рамка телефона: камера в верхней рамке, экран не перекрывает */
export function PhoneFrame({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("rounded-[2.6rem] bg-neutral-950 p-2 pt-0 shadow-2xl ring-1 ring-white/10", className)}
      style={style}
    >
      <div className="flex h-6 items-center justify-center" aria-hidden="true">
        <span className="size-1.5 rounded-full bg-neutral-700" />
      </div>
      <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] bg-background">{children}</div>
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
          <div className="flex flex-col gap-0.5">
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>Живой сайт - можно листать и нажимать</DialogDescription>
          </div>
          <Badge variant="outline" className="hidden rounded-full sm:inline-flex">
            {url}
          </Badge>
        </DialogHeader>
        <ScaledFrame src={href} w={1440} h={900} title={name} poster={poster} />
        <DialogFooter className="m-0 flex-row items-center justify-end border-t px-4 py-3">
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
export function PhonePreview({ trigger, name, href, poster }: { trigger: React.ReactElement; name: string; href: string; poster: string }) {
  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={trigger} />
      <DialogContent
        showCloseButton={false}
        className="w-auto max-w-none items-center justify-items-center gap-3 bg-transparent p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{name} на телефоне</DialogTitle>
        <PhoneFrame style={{ width: "min(22rem, calc((100svh - 6rem) * 0.45))" }}>
          <ScaledFrame src={href} w={390} h={844} title={`${name} на телефоне`} poster={poster} />
        </PhoneFrame>
        <Badge variant="secondary" className="rounded-full">
          Листайте и нажимайте - это настоящий сайт
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
