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
  SearchIcon,
  SparklesIcon,
  WalletIcon,
  RocketIcon,
  SmartphoneIcon,
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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { LEGAL, PhoneFrame, PhonePreview, PlanDialog, SitePreview } from "@/components/previews"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const TG = "https://t.me/BarniSolo"
const AURORA = ["#6366f1", "#8b5cf6", "#0ea5e9", "#6366f1"]
const tones = {
  indigo: { chip: "bg-indigo-500/15 text-indigo-600 ring-indigo-500/30 dark:text-indigo-300", wash: "from-indigo-500/25", line: "via-indigo-400/80", badge: "bg-indigo-500 text-white" },
  violet: { chip: "bg-violet-500/15 text-violet-600 ring-violet-500/30 dark:text-violet-300", wash: "from-violet-500/25", line: "via-violet-400/80", badge: "bg-violet-500 text-white" },
  sky: { chip: "bg-sky-500/15 text-sky-600 ring-sky-500/30 dark:text-sky-300", wash: "from-sky-500/25", line: "via-sky-400/80", badge: "bg-sky-500 text-white" },
  emerald: { chip: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-300", wash: "from-emerald-500/25", line: "via-emerald-400/80", badge: "bg-emerald-500 text-white" },
} as const
const tile = "bg-card/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl light:bg-radial-[at_0%_0%] light:to-transparent light:to-65%"
// Светлая тема: цвет уголка карточки - как у карточек цен (Сайт продукта - фиолетовый, витрина - голубой)
const tileWash = { violet: "light:from-violet-500/25", sky: "light:from-sky-500/25", indigo: "light:from-indigo-500/25" } as const
const projWash = (id: ProjectId) => (id === "disp" ? tileWash.violet : tileWash.sky)

type ProjectId = "disp" | "alex"

const projects: Record<
  ProjectId,
  { name: string; kind: string; short: string; url: string; href: string; desk: string; phone: string; bar: "light" | "dark"; links: [string, string, string][] }
> = {
  disp: {
    name: "Голосовой диспетчер",
    short: "Доставка суши",
    kind: "Приём заказов по телефону для доставки суши",
    url: "restdisp.ru",
    href: "https://restdisp.ru",
    desk: "img/rd-home.jpg",
    phone: "img/disp-phone.jpg",
    bar: "light",
    links: [
      ["Главная", "https://restdisp.ru/#home", "img/rd-home.jpg"],
      ["Экономия", "https://restdisp.ru/#calc", "img/rd-calc.jpg"],
      ["Касса", "https://restdisp.ru/#pos", "img/rd-pos.jpg"],
      ["Веб-панель", "https://restdisp.ru/#panel", "img/rd-panel.jpg"],
      ["Бронь и баллы", "https://restdisp.ru/#more", "img/rd-more.jpg"],
      ["Механика", "https://restdisp.ru/#logic", "img/rd-logic.jpg"],
      ["Сравнение", "https://restdisp.ru/#compare", "img/rd-compare.jpg"],
      ["Тарифы", "https://restdisp.ru/#tariff", "img/rd-tariff.jpg"],
    ],
  },
  alex: {
    name: "Алекс Авто",
    kind: "Витрина автомобилей",
    short: "Витрина автомобилей",
    url: "alex-cars.ru",
    href: "https://alex-cars.ru",
    desk: "img/alex-desk.jpg",
    phone: "img/alex-phone.jpg",
    bar: "dark",
    links: [
      ["Главная", "https://alex-cars.ru/", "img/alex-desk.jpg"],
      ["Каталог", "https://alex-cars.ru/#/catalog", "img/al-catalog.jpg"],
      ["Статьи", "https://alex-cars.ru/#/live", "img/al-live.jpg"],
      ["Как работаем", "https://alex-cars.ru/#/#how", "img/al-how.jpg"],
      ["Контакты", "https://alex-cars.ru/#/#contacts", "img/al-contacts.jpg"],
    ],
  },
}

const pages = ["Работы", "Услуги и цены"]

const doing: { icon: typeof LayersIcon; tone: keyof typeof tones; t: string; d: string }[] = [
  { icon: LayersIcon, tone: "violet", t: "Сайт продукта", d: "как restdisp.ru" },
  { icon: SendIcon, tone: "sky", t: "Витрина из Telegram-канала", d: "как alex-cars.ru" },
  { icon: StoreIcon, tone: "emerald", t: "Витрина из Авито", d: "объявления и сообщения в одном месте" },
  { icon: PencilRulerIcon, tone: "indigo", t: "Визитка", d: "одна страница с контактами" },
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

function Shot({ url, src, href, dark }: { url: string; src: string; href?: string; dark?: boolean }) {
  const inner = (
    <>
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b px-3">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="mx-auto rounded bg-muted px-6 text-[11px] text-muted-foreground">{url}</span>
      </div>
      <div className={cn("relative flex-1 overflow-hidden", dark ? "bg-neutral-950" : "bg-white")}>
        <img
          src={src}
          alt={url}
          className="absolute inset-x-0 top-0 h-auto w-full origin-top transition-transform duration-700 ease-out group-hover/shot:scale-[1.03]"
        />
      </div>
    </>
  )
  const cls =
    "group/shot flex min-h-48 flex-1 flex-col overflow-hidden rounded-lg border bg-muted/40 shadow-sm ring-1 ring-foreground/5"
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
    <Card className={cn("relative overflow-hidden md:row-span-2", tile, tileWash.indigo)}>
      <ShineBorder shineColor={AURORA} duration={16} />
      <DotPattern
        className={cn(
          "text-muted-foreground/25",
          "[mask-image:radial-gradient(320px_circle_at_top_left,white,transparent)]"
        )}
      />
      <CardContent className="relative flex flex-1 flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-balance [@media(min-height:821px)]:text-4xl xl:[@media(min-height:821px)]:text-5xl [.scene_&]:text-5xl">
          Делаю красивые сайты <AuroraText colors={AURORA}>по канонам</AuroraText>
        </h1>
        <p className="text-muted-foreground">
          Сайты продуктов и витрины, которые наполняются сами. Заявки сразу в Telegram, свой
          домен, хостинг бесплатно.
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="block font-medium text-foreground">Настоящий код, не конструктор.</span> Сайт
          ваш и ни к какой платформе не привязан.
        </p>
        <div className="mt-auto flex flex-col gap-3">
          {doing.map((s) => (
            <div key={s.t} className="flex items-center gap-3">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg ring-1", tones[s.tone].chip)}>
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
    </Card>
  )
}

function MainTile({ id }: { id: ProjectId }) {
  const p = projects[id]
  const [sec, setSec] = useState(0)
  const [, secHref, secImg] = p.links[sec]
  useEffect(() => {
    p.links.forEach(([, , src]) => {
      new Image().src = src
    })
  }, [p])
  return (
    <Card
      id="work-main"
      className={cn("relative overflow-hidden md:col-span-2 md:row-span-2", tile, projWash(id))}
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
          href={secHref}
          poster={secImg}
          trigger={
            <div className="flex flex-1 cursor-zoom-in flex-col" aria-label={`Увеличить ${p.name}`}>
              <Shot url={p.url} src={secImg} dark={p.bar === "dark"} />
            </div>
          }
        />
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <span className="text-center text-sm text-muted-foreground">Разделы сайта</span>
        <div
          className={cn(
            "grid grid-cols-2 gap-2",
            p.links.length === 5 ? "sm:grid-cols-5" : "sm:grid-cols-4"
          )}
        >
          {p.links.map(([label, href], i) => (
            <Button
              key={href}
              variant={i === sec ? "default" : "outline"}
              size="sm"
              className="w-full"
              aria-pressed={i === sec}
              onClick={() => setSec(i)}
            >
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
      className={cn("relative cursor-pointer overflow-hidden", tile, projWash(id))}
      style={{ viewTransitionName: `proj-${id}` }}
    >
      <CardHeader>
        <CardDescription>
          {p.short} · {p.url}
        </CardDescription>
        <CardTitle className="text-xl">{p.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="relative flex flex-1 flex-col animate-nudge group-hover/card:[animation-play-state:paused]">
          <Shot url={p.url} src={p.desk} dark={p.bar === "dark"} />
          <Badge className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-1.5 rounded-full px-3 py-1 shadow-lg">
            <ArrowLeftRightIcon data-icon="inline-start" />
            Смотреть этот сайт
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function PhoneTile({ id }: { id: ProjectId }) {
  const p = projects[id]
  return (
    <Card className={cn("group/phone relative gap-3 overflow-hidden pb-0", tile, projWash(id))}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 75%, rgba(99,102,241,.35), transparent 70%), radial-gradient(40% 40% at 75% 35%, rgba(14,165,233,.22), transparent 70%)",
        }}
      />
      <CardHeader className="relative">
        <CardTitle className="text-xl">На телефоне</CardTitle>
        <CardDescription>{p.url} · нажмите и листайте</CardDescription>
        <CardAction>
          <SmartphoneIcon className="size-5 text-muted-foreground" aria-hidden="true" />
        </CardAction>
      </CardHeader>
      <PhonePreview
        name={p.name}
        href={p.href}
        poster={p.phone}
        bar={p.bar}
        trigger={
          <div
            className="relative h-[22rem] cursor-zoom-in overflow-hidden md:h-auto md:min-h-0 md:flex-1"
            aria-label={`Полистать ${p.name} на телефоне`}
          >
            <PhoneFrame
              bar={p.bar}
              className="absolute top-5 left-1/2 origin-top -translate-x-1/2 transition-[translate,scale] duration-500 ease-out group-hover/phone:-translate-y-4 group-hover/phone:scale-[1.06] motion-reduce:transition-none"
              style={{ width: "13rem", viewTransitionName: "phone" }}
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
      t: "Визитка", price: "от 15 000", d: "Одна страница: кто вы, что делаете, как связаться.", ex: null,
      icon: PencilRulerIcon, tone: "indigo",
      b: ["Кнопки звонка и Telegram", "Форма заявки на странице", "Светлая и тёмная тема"],
      more: ["Одна красивая страница о вас и вашем деле", "Кнопки Telegram и телефона", "Форма заявки - заявки приходят в Telegram", "Версия для телефона", "Светлая и тёмная тема", "Свой домен с https, хостинг бесплатно"],
      need: ["Рассказ о деле: что делаете и для кого", "Логотип и фото, если есть", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Сайт продукта", price: "от 60 000", d: "Экраны листаются, как презентация.", ex: ["restdisp.ru", "https://restdisp.ru", "img/rd-home.jpg"],
      icon: LayersIcon, tone: "violet",
      b: ["Экраны с вкладками", "Расчёт по цифрам клиента", "Примеры, сравнение, тарифы"],
      more: ["Несколько экранов, каждый со своей мыслью", "Вкладки сверху, «Назад» и «Дальше» снизу", "Расчёт выгоды прямо на странице - по цифрам клиента", "Примеры, сравнение, тарифы", "Отдельная вёрстка для телефона", "Заявки в Telegram, свой домен с https"],
      need: ["Рассказ о продукте и кому он нужен", "Цифры для расчёта и тарифы", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Витрина из канала", price: "от 40 000", d: "Пост в Telegram-канале сам становится карточкой на сайте.", ex: ["alex-cars.ru", "https://alex-cars.ru", "img/alex-desk.jpg"],
      icon: SendIcon, tone: "sky",
      b: ["Каталог из постов канала", "Новый пост на сайте за минуты", "Подбор по цене и параметрам"],
      more: ["Каталог собирается из постов канала сам", "Новый пост на сайте через пару минут", "Подбор по цене и параметрам", "Заявки с сайта сразу в Telegram", "Все заявки в Excel одной кнопкой", "Версия для телефона, свой домен с https"],
      need: ["Ссылка на открытый Telegram-канал", "Добавить нашего бота в канал администратором", "Домен - поможем выбрать и подключить"],
    },
    {
      t: "Витрина из Авито", price: "от 50 000", d: "Объявления с Авито сами появляются на сайте.", ex: null,
      icon: StoreIcon, tone: "emerald",
      b: ["Объявления переносятся сами", "Сообщения с Авито - в Telegram", "Заявки в Excel одной кнопкой"],
      more: ["Ваши объявления с Авито сами появляются на сайте", "Сообщения покупателей с Авито приходят в Telegram", "Заявки с сайта - туда же", "Все заявки в Excel одной кнопкой", "Версия для телефона, свой домен с https"],
      need: ["Кабинет Авито и ключи доступа из раздела «Для профессионалов»", "Домен - поможем выбрать и подключить"],
    },
  ] as const
  return (
    <>
      {plans.map((p, i) => {
        const t = tones[p.tone]
        return (
          <PlanDialog
            key={p.t}
            plan={p}
            tone={t}
            icon={p.icon}
            trigger={
              <Card className={cn("relative cursor-pointer gap-3 overflow-visible md:col-span-2 lg:col-span-1 [.scene_&]:gap-6 [.scene_&]:pt-8", tile)}>
                <span
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute inset-0 rounded-[inherit] bg-radial-[at_0%_0%] to-transparent to-65%", t.wash)}
                />
                <span
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent", t.line)}
                />
                {i === 1 && <ShineBorder shineColor={AURORA} borderWidth={2} duration={10} />}
                {p.ex && (
                  <Badge className={cn("absolute -top-2.5 right-4 z-10 rounded-full shadow-md", t.badge)}>
                    {"Как\u00a0" + p.ex[0]}
                  </Badge>
                )}
                <CardHeader className="relative">
                  <div className="flex items-center gap-2.5 lg:flex-col lg:items-start lg:gap-2 min-[68.75rem]:flex-row min-[68.75rem]:items-center min-[68.75rem]:gap-2.5 [.scene_&]:flex-row [.scene_&]:items-center [.scene_&]:gap-2.5">
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg ring-1", t.chip)}>
                      <p.icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-lg">{p.t}</CardTitle>
                  </div>
                  <CardDescription className="md:min-h-10 lg:min-h-15 min-[75rem]:min-h-10 [.scene_&]:min-h-10">{p.d}</CardDescription>
                </CardHeader>
                <CardContent className="relative flex flex-1 flex-col gap-3 [.scene_&]:gap-6">
                  <p className="flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-sm text-muted-foreground">от</span>
                    <span className="text-3xl font-semibold tracking-tight">{p.price.replace(/^от\s/, "")} ₽</span>
                  </p>
                  <ul className="flex flex-col gap-1.5 text-sm text-foreground/90 [.scene_&]:gap-3.5">
                    {p.b.map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className={cn("mt-px flex size-5 shrink-0 items-center justify-center rounded-full ring-1", t.chip)}>
                          <CheckIcon className="size-3" aria-hidden="true" />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative justify-between py-2.5 text-sm font-medium [.scene_&]:py-5">
                  Подробнее и заявка
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full ring-1 transition-transform group-hover/card:translate-x-1",
                      t.chip
                    )}
                  >
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </span>
                </CardFooter>
              </Card>
            }
          />
        )
      })}
    </>
  )
}

function How() {
  const steps = [
    { icon: SearchIcon, dot: "from-indigo-500 to-violet-500", seg: "bg-violet-500/60", t: "Смотрю, что у вас есть", d: "Канал, Авито, старый сайт или просто рассказ." },
    { icon: SparklesIcon, dot: "from-violet-500 to-blue-500", seg: "bg-blue-500/60", t: "Готовлю демо бесплатно", d: "Присылаю ссылку, смотрите на телефоне." },
    { icon: WalletIcon, dot: "from-blue-500 to-sky-500", seg: "bg-sky-500/60", t: "Правки и оплата", d: "Платите, когда сайт нравится." },
    { icon: RocketIcon, dot: "from-sky-500 to-emerald-500", seg: "", t: "Запуск", d: "Ваш домен, https и бот заявок. Код ваш, без конструкторов." },
  ]
  return (
    <Card className="relative gap-0 overflow-hidden bg-card/85 py-0 backdrop-blur-md md:col-span-4">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"
      />
      <CardContent className="grid gap-5 py-4 lg:grid-cols-5 lg:gap-6 [.scene_&]:py-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Как работаю</span>
          <h2 className="text-2xl leading-tight font-semibold tracking-tight">
            Сначала сайт,{" "}
            <span className="lg:block">
              <AuroraText colors={AURORA}>потом оплата</AuroraText>
            </span>
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex gap-3 lg:flex-col lg:gap-2.5">
              {s.seg && (
                <span
                  aria-hidden="true"
                  className={cn("absolute top-[1.1875rem] -right-3 left-[3.25rem] hidden h-0.5 rounded-full lg:block", s.seg)}
                />
              )}
              <span
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg",
                  s.dot
                )}
              >
                <s.icon className="size-5" aria-hidden="true" />
                <span className="absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full bg-background text-[0.625rem] font-bold text-foreground ring-1 ring-foreground/15 tabular-nums">
                  {i + 1}
                </span>
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-base leading-snug font-semibold">{s.t}</span>
                <span className="text-sm text-foreground/70">{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter className="relative bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-sky-500/20 py-3 [.scene_&]:py-4">
        <form
          className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const link = new FormData(e.currentTarget).get("channel")?.toString().trim()
            const text = link ? `Здравствуйте! Хочу сайт. Вот что у меня есть: ${link}` : "Здравствуйте! Хочу сайт."
            window.open(`${TG}?text=${encodeURIComponent(text)}`, "_blank")
          }}
        >
          <label htmlFor="channel" className="shrink-0 text-base font-semibold">
            Расскажите, какой сайт нужен
          </label>
          <InputGroup className="h-10 bg-background/80 lg:flex-1">
            <InputGroupInput id="channel" name="channel" placeholder="Ссылка на канал, Авито или сайт" />
          </InputGroup>
          <Button type="submit" size="lg" className="shrink-0">
            <SendIcon data-icon="inline-start" />
            Отправить в Telegram
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

/* ---------- Каркас ---------- */

/* Сцена: на компьютере страница считается под 1440×900 и целиком масштабируется под окно,
   поэтому масштаб Windows/браузера и размер экрана не меняют раскладку. Телефоны не трогаем. */
const SCENE_W = 1440
const SCENE_H = 900
const SCENE_MIN = 0.2

function useScene() {
  const calc = () => {
    if (typeof window === "undefined") return null
    const w = window.innerWidth
    const h = window.innerHeight
    // Ширина окна в точках экрана: от масштаба браузера не зависит (innerWidth при «+» уменьшается)
    const screenW = window.outerWidth || w
    if (screenW < 1024 || !window.matchMedia("(pointer: fine)").matches) return null
    const k = Math.max(SCENE_MIN, Math.min(w / SCENE_W, h / SCENE_H))
    return { k, w: w / k, h: h / k }
  }
  const [scene, setScene] = useState(calc)
  useEffect(() => {
    const on = () => setScene(calc())
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return scene
}

export default function App() {
  const scene = useScene()
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const { theme } = useTheme()
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  // В центре - сайт в тон теме: на тёмной Алекс Авто, на светлой Диспетчер
  const [main, setMain] = useState<ProjectId>(dark ? "alex" : "disp")
  useEffect(() => setMain(dark ? "alex" : "disp"), [dark])
  const side: ProjectId = main === "disp" ? "alex" : "disp"

  // На телефоне выбранный сайт уезжает наверх, в большую карточку: поднимаем экран к ней
  const reveal = (smooth: boolean) => {
    const el = document.getElementById("work-main")
    const box = el?.closest("section")
    if (scene || !el || !box) return
    const gap = el.getBoundingClientRect().top - box.getBoundingClientRect().top
    if (gap < 0) box.scrollTo({ top: box.scrollTop + gap - 16, behavior: smooth ? "smooth" : "instant" })
  }
  const swap = () => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (!doc.startViewTransition) {
      flushSync(() => setMain(side))
      return reveal(true)
    }
    let done = false
    doc.startViewTransition(() => {
      done = true
      flushSync(() => setMain(side))
      reveal(false)
    })
    setTimeout(() => {
      if (done) return
      flushSync(() => setMain(side))
      reveal(true)
    }, 400)
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
    <div
      className={cn("relative flex h-svh flex-col overflow-hidden bg-background text-foreground light:bg-muted/50", scene && "scene")}
      style={scene ? { zoom: scene.k, width: scene.w, height: scene.h } : undefined}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-indigo-500/10 blur-3xl light:bg-indigo-500/20" />
        <div className="absolute top-1/3 -right-40 size-[32rem] rounded-full bg-sky-500/10 blur-3xl light:bg-sky-500/20" />
        <div className="absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-violet-500/10 blur-3xl light:bg-violet-500/20" />
        <DotPattern
          className={cn(
            "text-muted-foreground/20",
            "[mask-image:radial-gradient(70%_60%_at_50%_40%,white,transparent)]"
          )}
        />
      </div>
      <header className="relative border-b bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="hidden flex-1 sm:flex">
            <ThemeSwitch />
          </div>
          <Tabs value={String(page)} onValueChange={(v) => goTo(Number(v))}>
            <TabsList>
              {pages.map((p, i) => (
                <TabsTrigger key={p} value={String(i)} className="px-3">
                  {p}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-1 justify-end">
            <Button size="sm" render={ext(TG)}>
              <SendIcon data-icon="inline-start" />
              <span className="sm:hidden">Telegram</span>
              <span className="hidden sm:inline">Написать в Telegram</span>
            </Button>
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
            <MainTile key={main} id={main} />
            <SideTile id={side} onPick={swap} />
            <PhoneTile id={main} />
          </div>
        </section>
        <section className={panel} aria-label={pages[1]}>
          <div className={cn(grid, "md:h-auto md:min-h-full md:content-center md:gap-y-8 [.scene_&]:gap-x-5 [.scene_&]:gap-y-10")}>
            <Plans />
            <How />
            <p className="text-center text-xs text-muted-foreground md:col-span-4 lg:hidden">Исполнитель: {LEGAL}</p>
          </div>
        </section>
      </div>

      <footer className="relative border-t bg-background/60 backdrop-blur-md">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-center px-4 md:px-6">
          {page === pages.length - 1 && (
            <p className="absolute left-6 hidden max-w-[calc(50%-7rem)] text-xs text-muted-foreground lg:block">
              Исполнитель: {LEGAL}
            </p>
          )}
          {page < pages.length - 1 ? (
            <Button size="lg" className="w-40" onClick={() => goTo(page + 1)}>
              Дальше
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button size="lg" className="w-40" onClick={() => goTo(page - 1)}>
              <ArrowLeftIcon data-icon="inline-start" />
              Назад
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
