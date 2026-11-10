import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  LayersIcon,
  MoonIcon,
  PencilRulerIcon,
  SendIcon,
  StoreIcon,
  SunIcon,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { AuroraText } from "@/components/ui/aurora-text"
import { BorderBeam } from "@/components/ui/border-beam"
import { ShineBorder } from "@/components/ui/shine-border"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { LEGAL, PhoneFrame, PhonePreview, PlanDialog, SitePreview } from "@/components/previews"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const TG = "https://t.me/BarniSolo"
const AURORA = ["#6366f1", "#8b5cf6", "#0ea5e9", "#6366f1"]
const tile = "bg-card/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"

type ProjectId = "disp" | "alex"

const projects: Record<
  ProjectId,
  { name: string; kind: string; url: string; href: string; desk: string; phone: string; links: [string, string][] }
> = {
  disp: {
    name: "Голосовой диспетчер",
    kind: "Приём заказов по телефону для доставки суши",
    url: "restdisp.ru",
    href: "https://restdisp.ru",
    desk: "img/rd-home.jpg",
    phone: "img/disp-phone.jpg",
    links: [
      ["Главная", "https://restdisp.ru/#home"],
      ["Экономия", "https://restdisp.ru/#calc"],
      ["Касса", "https://restdisp.ru/#pos"],
      ["Веб-панель", "https://restdisp.ru/#panel"],
      ["Бронь и баллы", "https://restdisp.ru/#more"],
      ["Механика", "https://restdisp.ru/#logic"],
      ["Сравнение", "https://restdisp.ru/#compare"],
      ["Тарифы", "https://restdisp.ru/#tariff"],
    ],
  },
  alex: {
    name: "Алекс Авто",
    kind: "Витрина автомобилей",
    url: "alex-cars.ru",
    href: "https://alex-cars.ru",
    desk: "img/alex-desk.jpg",
    phone: "img/alex-phone.jpg",
    links: [
      ["Главная", "https://alex-cars.ru/"],
      ["Каталог", "https://alex-cars.ru/#/catalog"],
      ["Статьи", "https://alex-cars.ru/#/live"],
      ["Как работаем", "https://alex-cars.ru/#/#how"],
      ["Контакты", "https://alex-cars.ru/#/#contacts"],
    ],
  },
}

const pages = ["Работы", "Услуги и цены"]

const doing = [
  { icon: LayersIcon, t: "Сайт продукта", d: "как restdisp.ru" },
  { icon: SendIcon, t: "Витрина из Telegram-канала", d: "как alex-cars.ru" },
  { icon: StoreIcon, t: "Витрина из Авито", d: "объявления и сообщения в одном месте" },
  { icon: PencilRulerIcon, t: "Визитка", d: "одна страница с контактами" },
]

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  return (
    <label className="flex items-center gap-2 text-muted-foreground">
      <SunIcon className="size-4" aria-hidden="true" />
      <Switch
        checked={dark}
        onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
        aria-label="Тёмная тема"
      />
      <MoonIcon className="size-4" aria-hidden="true" />
    </label>
  )
}

function ext(href: string) {
  return <a href={href} target="_blank" rel="noreferrer" />
}

function Shot({ url, src, href }: { url: string; src: string; href?: string }) {
  const inner = (
    <>
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b px-3">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="mx-auto rounded bg-muted px-6 text-[11px] text-muted-foreground">{url}</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <img
          src={src}
          alt={url}
          className="absolute inset-0 size-full object-cover object-left-top transition-transform duration-700 ease-out group-hover/shot:scale-[1.03]"
        />
      </div>
    </>
  )
  const cls =
    "group/shot flex min-h-48 flex-1 flex-col overflow-hidden rounded-xl border bg-muted/40 shadow-sm ring-1 ring-foreground/5"
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/* ---------- Экран 1: работы ---------- */

function Intro() {
  return (
    <Card className={cn("relative overflow-hidden md:row-span-2", tile)}>
      <ShineBorder shineColor={AURORA} duration={16} />
      <DotPattern
        className={cn(
          "text-muted-foreground/25",
          "[mask-image:radial-gradient(320px_circle_at_top_left,white,transparent)]"
        )}
      />
      <CardContent className="relative flex flex-1 flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
          Делаю красивые сайты <AuroraText colors={AURORA}>по канонам</AuroraText>
        </h1>
        <p className="text-muted-foreground">
          Сайты продуктов и витрины, которые наполняются сами. Заявки сразу в Telegram, свой
          домен, хостинг бесплатно.
        </p>
        <div className="mt-auto flex flex-col gap-3">
          {doing.map((s) => (
            <div key={s.t} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background shadow-xs">
                <s.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium">{s.t}</span>
                <span className="text-xs text-muted-foreground">{s.d}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="relative flex-col items-stretch gap-2">
        <Button render={ext(TG)}>
          <SendIcon data-icon="inline-start" />
          Написать в Telegram
        </Button>
      </CardFooter>
    </Card>
  )
}

function MainTile({ id }: { id: ProjectId }) {
  const p = projects[id]
  return (
    <Card
      className={cn("relative overflow-hidden md:col-span-2 md:row-span-2", tile)}
      style={{ viewTransitionName: `proj-${id}` }}
    >
      <BorderBeam size={240} duration={12} />
      <CardHeader>
        <CardDescription>
          {p.kind} · {p.url}
        </CardDescription>
        <CardTitle className="text-2xl">{p.name}</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" render={ext(p.href)}>
            Открыть сайт
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <SitePreview
          name={p.name}
          url={p.url}
          href={p.href}
          poster={p.desk}
          trigger={
            <div className="flex flex-1 cursor-zoom-in flex-col" aria-label={`Увеличить ${p.name}`}>
              <Shot url={p.url} src={p.desk} />
            </div>
          }
        />
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <span className="text-center text-sm text-muted-foreground">Посмотрите на сайте</span>
        <div
          className={cn(
            "grid grid-cols-2 gap-2",
            p.links.length === 5 ? "sm:grid-cols-5" : "sm:grid-cols-4"
          )}
        >
          {p.links.map(([label, href]) => (
            <Button key={href} variant="outline" size="sm" className="w-full rounded-full" render={ext(href)}>
              {label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

function SideTile({ id, onPick }: { id: ProjectId; onPick: () => void }) {
  const p = projects[id]
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
      className={cn("relative cursor-pointer overflow-hidden", tile)}
      style={{ viewTransitionName: `proj-${id}` }}
    >
      <CardHeader>
        <CardDescription>
          {p.kind} · {p.url}
        </CardDescription>
        <CardTitle className="text-xl">{p.name}</CardTitle>
        <CardAction>
          <Badge variant="secondary" className="gap-1 rounded-full">
            <ArrowLeftRightIcon data-icon="inline-start" />
            Смотреть
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Shot url={p.url} src={p.desk} />
      </CardContent>
    </Card>
  )
}

function PhoneTile({ id }: { id: ProjectId }) {
  const p = projects[id]
  return (
    <Card className={cn("relative min-h-80 overflow-hidden p-0", tile)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 70%, rgba(99,102,241,.35), transparent 70%), radial-gradient(40% 40% at 70% 30%, rgba(14,165,233,.25), transparent 70%)",
        }}
      />
      <Badge variant="outline" className="absolute top-4 left-4 z-10 rounded-full bg-background/70 backdrop-blur">
        Версия для телефона
      </Badge>
      <PhonePreview
        name={p.name}
        href={p.href}
        poster={p.phone}
        trigger={
          <div
            className="absolute inset-x-0 top-14 bottom-0 flex cursor-zoom-in justify-center"
            aria-label={`Увеличить ${p.name} на телефоне`}
          >
            <PhoneFrame
              className="h-fit w-[58%] max-w-56 transition-transform duration-500 group-hover/card:-translate-y-2"
              style={{ viewTransitionName: "phone" }}
            >
              <img src={p.phone} alt="" className="absolute inset-0 size-full object-cover object-top" />
            </PhoneFrame>
          </div>
        }
      />
    </Card>
  )
}

/* ---------- Экран 2: услуги и цены ---------- */
function Plans() {
  const plans = [
    {
      t: "Визитка", price: "от 15 000", d: "Одна страница: кто вы, что делаете, как связаться.", ex: null,
      b: ["Кнопки Telegram и телефона", "Заявки в Telegram", "Свой домен"],
      more: ["Одна красивая страница о вас и вашем деле", "Кнопки Telegram и телефона", "Форма заявки - заявки приходят в Telegram", "Версия для телефона", "Светлая и тёмная тема", "Свой домен с https, хостинг бесплатно"],
      need: ["Рассказ о деле: что делаете и для кого", "Логотип и фото, если есть", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Сайт продукта", price: "от 60 000", d: "Экраны листаются, как презентация.", ex: ["restdisp.ru", "https://restdisp.ru", "img/rd-home.jpg"],
      b: ["Расчёты прямо на странице", "Отдельная версия для телефона", "Светлая и тёмная тема"],
      more: ["Несколько экранов, каждый со своей мыслью", "Вкладки сверху, «Назад» и «Дальше» снизу", "Расчёт выгоды прямо на странице - по цифрам клиента", "Примеры, сравнение, тарифы", "Отдельная вёрстка для телефона", "Заявки в Telegram, свой домен с https"],
      need: ["Рассказ о продукте и кому он нужен", "Цифры для расчёта и тарифы", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Витрина из канала", price: "от 40 000", d: "Пост в Telegram-канале сам становится карточкой на сайте.", ex: ["alex-cars.ru", "https://alex-cars.ru", "img/alex-desk.jpg"],
      b: ["Подбор по цене и марке", "Заявки в Telegram", "Все заявки в Excel"],
      more: ["Каталог собирается из постов канала сам", "Новый пост на сайте через пару минут", "Подбор по цене и параметрам", "Заявки с сайта сразу в Telegram", "Все заявки в Excel одной кнопкой", "Версия для телефона, свой домен с https"],
      need: ["Ссылка на открытый Telegram-канал", "Добавить нашего бота в канал администратором", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Витрина из Авито", price: "от 50 000", d: "Объявления с Авито сами появляются на сайте.", ex: null,
      b: ["Сообщения покупателей в Telegram", "Заявки в Telegram", "Все заявки в Excel"],
      more: ["Ваши объявления с Авито сами появляются на сайте", "Сообщения покупателей с Авито приходят в Telegram", "Заявки с сайта - туда же", "Все заявки в Excel одной кнопкой", "Версия для телефона, свой домен с https"],
      need: ["Кабинет Авито и ключи доступа из раздела «Для профессионалов»", "Домен - поможем выбрать и подключить"],
    },
  ] as const
  return (
    <>
      {plans.map((p, i) => (
        <PlanDialog
          key={p.t}
          plan={p}
          trigger={
        <Card className={cn("relative cursor-pointer overflow-hidden", tile)}>
          {i === 1 && <ShineBorder shineColor={AURORA} borderWidth={2} duration={10} />}
          <CardHeader>
            <CardTitle className="text-lg">{p.t}</CardTitle>
            <CardDescription>{p.d}</CardDescription>
            {i === 1 && (
              <CardAction>
                <Badge className="rounded-full">Как restdisp.ru</Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">{p.price} ₽</p>
            <ul className="flex flex-col gap-2 text-sm">
              {p.b.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                    <CheckIcon className="size-3" aria-hidden="true" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="justify-between text-sm font-medium">
            Подробнее и заявка
            <ArrowRightIcon className="size-4 transition-transform group-hover/card:translate-x-1" aria-hidden="true" />
          </CardFooter>
        </Card>
          }
        />
      ))}
    </>
  )
}

function How() {
  const steps = [
    ["Смотрю, что у вас есть", "Канал, Авито, старый сайт или просто рассказ."],
    ["Собираю демо бесплатно", "Присылаю ссылку, смотрите на телефоне."],
    ["Правки и оплата", "Платите, когда сайт нравится."],
    ["Запуск", "Ваш домен, https и бот заявок."],
  ]
  return (
    <Card className={cn("md:col-span-2", tile)}>
      <CardHeader>
        <CardDescription>Как работаю</CardDescription>
        <CardTitle className="text-xl">Сначала сайт, потом оплата</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 gap-4 sm:grid-cols-2">
        {steps.map(([t, d], i) => (
          <div key={t} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold shadow-xs tabular-nums">
              {i + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{t}</span>
              <span className="text-sm text-muted-foreground">{d}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function Contact() {
  return (
    <Card className={cn("relative overflow-hidden md:col-span-2", tile)}>
      <DotPattern
        className={cn(
          "text-muted-foreground/25",
          "[mask-image:radial-gradient(300px_circle_at_top_right,white,transparent)]"
        )}
      />
      <CardHeader className="relative">
        <CardDescription>Связаться</CardDescription>
        <CardTitle className="text-xl">Пришлите ссылку - покажу ваш сайт</CardTitle>
      </CardHeader>
      <CardContent className="relative flex-1">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            window.open(TG, "_blank")
          }}
        >
          <Field className="flex-1">
            <FieldLabel htmlFor="channel">Канал, Авито или сайт</FieldLabel>
            <InputGroup>
              <InputGroupInput id="channel" placeholder="t.me/ваш_канал" />
            </InputGroup>
          </Field>
          <Button type="submit">
            Показать мой сайт
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="relative">
        <Button variant="link" className="px-0" render={ext(TG)}>
          или напишите в Telegram
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ---------- Каркас ---------- */

export default function App() {
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [main, setMain] = useState<ProjectId>("disp")
  const side: ProjectId = main === "disp" ? "alex" : "disp"

  const swap = () => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (!doc.startViewTransition) return setMain(side)
    let done = false
    doc.startViewTransition(() => {
      done = true
      flushSync(() => setMain(side))
    })
    setTimeout(() => !done && setMain(side), 400)
  }

  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  useEffect(() => {
    const el = track.current
    if (el && location.hash === "#uslugi") {
      el.scrollLeft = el.clientWidth
      setPage(1)
    }
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setPage(Math.round(el.scrollLeft / el.clientWidth))
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return
      if (e.key === "ArrowRight") goTo(Math.min(page + 1, pages.length - 1))
      if (e.key === "ArrowLeft") goTo(Math.max(page - 1, 0))
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("keydown", onKey)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onKey)
    }
  }, [page])

  const panel =
    "h-full w-full shrink-0 snap-start overflow-y-auto px-4 py-4 md:px-6 md:py-5"
  const grid = "mx-auto grid max-w-7xl gap-4 md:h-full md:grid-cols-4"

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[32rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-violet-500/10 blur-3xl" />
        <DotPattern
          className={cn(
            "text-muted-foreground/20",
            "[mask-image:radial-gradient(70%_60%_at_50%_40%,white,transparent)]"
          )}
        />
      </div>
      <header className="relative border-b bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="hidden w-24 sm:block" />
          <Tabs value={String(page)} onValueChange={(v) => goTo(Number(v))}>
            <TabsList>
              {pages.map((p, i) => (
                <TabsTrigger key={p} value={String(i)}>
                  {p}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="hidden w-24 justify-end sm:flex">
            <ThemeSwitch />
          </div>
        </div>
      </header>

      <div
        ref={track}
        className="relative flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none]"
      >
        <section className={panel} aria-label={pages[0]}>
          <div className={cn(grid, "md:grid-rows-2")}>
            <Intro />
            <MainTile id={main} />
            <SideTile id={side} onPick={swap} />
            <PhoneTile id={main} />
          </div>
        </section>
        <section className={panel} aria-label={pages[1]}>
          <div className={cn(grid, "md:h-auto md:min-h-full md:content-center")}>
            <Plans />
            <How />
            <Contact />
            <p className="text-center text-xs text-muted-foreground md:col-span-4">Исполнитель: {LEGAL}</p>
          </div>
        </section>
      </div>

      <footer className="relative border-t bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="w-32">
            {page > 0 && (
              <Button variant="outline" size="lg" className="w-full" onClick={() => goTo(page - 1)}>
                <ArrowLeftIcon data-icon="inline-start" />
                Назад
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {pages.map((p, i) => (
                <span
                  key={p}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === page ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
              {page + 1} из {pages.length}
            </span>
          </div>
          <div className="w-32">
            {page < pages.length - 1 && (
              <Button size="lg" className="w-full" onClick={() => goTo(page + 1)}>
                Дальше
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
