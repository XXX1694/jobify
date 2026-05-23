# Jobify — правила для Claude Code

Это Go-бэкенд для IT job-платформы. Пиши код как живой мидл/сеньор: коротко, по делу, без воды. Ниже — жёсткие правила. Соблюдай их, даже если я прошу "быстро сделай".

## 1. Стиль кода

- **Минимум комментариев.** Комментарии только там, где без них непонятно *почему* (не *что*). Не комментируй очевидное типа `// create user` перед `userRepo.Create(...)`.
- **Никаких заглушек и "TODO".** Если нужно что-то дописать — допиши. Если реально не можешь — явно скажи мне в чате, не оставляй `// TODO: implement`.
- **Никаких эмодзи** в коде, комментариях, логах, коммитах.
- **Не пиши "на русском в комментариях"**, весь код и комментарии — английский.
- **Имена переменных короткие в локальном скоупе**, осмысленные в публичном API. `ctx`, `err`, `f`, `q` — ок внутри функции. Для экспортируемых — полные (`userRepo`, не `ur`).
- **Ошибки оборачивай через `fmt.Errorf("... : %w", err)`**, не теряй контекст. Сентинел-ошибки сравнивай через `errors.Is`.
- **Не добавляй логи в каждый метод.** Логируй только на границах: middleware, startup/shutdown, background worker, неожиданные ошибки в репозиториях.

## 2. Структура проекта (не ломай)

```
cmd/api/main.go              — entrypoint, wiring, graceful shutdown
internal/
  config/                    — env parsing, ничего больше
  domain/                    — модели + доменные ошибки, НЕ импортирует ничего из internal/
  handler/                   — HTTP: парсинг, вызов сервиса, response. НИКАКОЙ бизнес-логики
  middleware/                — auth, logger, rate_limit, cors (каждая в своём файле)
  repository/
    interfaces.go            — все interface-ы репозиториев в одном файле
    postgres/                — реализации на pgx
    redis/                   — кэш, rate-limit storage
  service/                   — бизнес-логика, чистая от HTTP
  worker/                    — background goroutines (job_aggregator и т.п.)
pkg/                         — переиспользуемые утилиты (jwt, hasher, response, validator)
migrations/                  — *.up.sql / *.down.sql, версионные
docker/                      — Dockerfile + docker-compose.yml
```

**Правила слоёв:**
- `handler` → `service` → `repository`. Перескакивать через слой нельзя.
- `domain` — это дно, ни на что из `internal` не зависит.
- Интерфейсы репозиториев живут в `internal/repository/interfaces.go`, реализации — в `postgres/` и `redis/`.
- Сервисы принимают интерфейсы, не конкретные типы (для тестируемости).
- DI руками в `main.go`, без wire/fx.

**Именование файлов:** `snake_case.go` (`auth_service.go`, `job_handler.go`). Тесты: `*_test.go` рядом с кодом.

## 3. Паттерны, которые уже есть в проекте — не нарушай

- Все методы сервисов и репозиториев первым аргументом принимают `ctx context.Context`.
- ID-шники — `uuid.UUID` (github.com/google/uuid), не строки, не int.
- Ошибки домена в `internal/domain/errors.go`: `ErrNotFound`, `ErrConflict`, `ErrUnauthorized`. Репозитории возвращают их, сервисы прокидывают, хендлеры мапят на HTTP-коды через `pkg/response`.
- HTTP-ответы только через `pkg/response` (`response.JSON`, `response.Error`). Не делай `w.Write(...)` руками.
- Роутер — Chi v5. Группы роутов в `internal/handler/router.go`.
- Middleware навешиваются в `router.go`, порядок: RequestID → Logger → CORS → RateLimit → (для защищённых) Auth.
- Конфиг читается один раз в `main.go` через `config.Load()`, дальше передаётся явно.
- Graceful shutdown: `signal.NotifyContext` + `server.Shutdown(ctx)` + отмена worker-контекста.

## 4. Работа с БД

- Только `pgx/v5`, без ORM и без `database/sql`.
- SQL пиши inline в репозитории, без query-builder'ов.
- Миграции — `golang-migrate`, пара `.up.sql` / `.down.sql`, нумерация `NNNNNN_name.up.sql`. Новая миграция = новый файл, старые не правим.
- Индексы: для `skills []string` используй `GIN` (как уже сделано). Для FK всегда индекс.
- `created_at`, `updated_at` — `TIMESTAMPTZ DEFAULT NOW()`.

## 5. Тесты

- **Реальные тесты, не заглушки.** Если не можешь протестировать без мока — сделай интерфейс и мок, не `t.Log("testing...")`.
- Моки репозиториев — руками, в том же `_test.go` или `mocks_test.go`, без mockery/gomock.
- Сервисный слой тестируется с моками репо. Хендлеры — через `httptest`.
- Table-driven tests: `tests := []struct{ name string; ... }{...}` + `t.Run(tt.name, ...)`.
- Проверяй и позитив, и негатив (ошибки, edge-cases).
- Если меняешь сигнатуру функции — **обязательно** проверь и почини все её тесты. Сломанные тесты не оставляй.

## 6. Когда я прошу добавить фичу

1. Посмотри, как реализованы соседние фичи (auth, jobs, applications) — скопируй паттерн.
2. Новая сущность: `domain/<name>.go` → `repository/interfaces.go` (добавить интерфейс) → `repository/postgres/<name>_repo.go` → `service/<name>_service.go` → `handler/<name>_handler.go` → роуты в `router.go` → миграция → тесты сервиса.
3. Wiring в `main.go` — в самом конце, когда всё остальное готово.

## 7. Коммиты

- Короткие, в нижнем регистре, без точки в конце.
- Формат: `<scope>: <что сделано>`. Примеры: `auth: add refresh token endpoint`, `middleware: redis rate limiter`, `tests: fix CalculateMatch signature`.
- Один коммит = одно логическое изменение. Не мешай рефакторинг с фичей.

## 8. Что делать, если находишь косяк

Если по ходу работы видишь:
- сломанный тест,
- несоответствие сигнатур,
- захардкоженный секрет,
- отсутствие проверки `err`,
- протекающую горутину —

**сразу чини** в том же изменении и напиши в ответе одной строкой, что починил. Не молчи, но и не спрашивай разрешения на очевидные баги.

## 9. Чего не делать

- Не добавляй зависимости без необходимости. Текущий `go.mod` минимален — держи его таким.
- Не переписывай чужие слои "заодно". Трогай только то, что относится к задаче.
- Не меняй публичные подписи сервисов/репо без причины — это ломает хендлеры и тесты.
- Не пиши обёртки ради обёрток (`UserServiceWrapper`, `JobRepoAdapter` и т.п.).
- Не используй `panic` вне `main.go` при старте.
- Не глотай ошибки через `_ =`, кроме случаев где это осознанно (и тогда — коммент *почему*).

## 10. Текущие известные долги (можно чинить по пути)

- `internal/service/job_service_test.go` — `TestCalculateMatch` не компилируется (ожидает один `int`, функция возвращает три значения).
- `internal/service/auth_service_test.go`, `application_service_test.go` — по сути пустые, нужно переписать с моками.
- Rate-limit middleware отсутствует, хотя заявлен в плане. Реализация — Redis `INCR` + `EXPIRE` по ключу `rl:<ip>:<minute>`.
- Swagger-аннотации в хендлерах отсутствуют, есть только `docs.go` с общими тегами. `/swagger/*` route не подключён.
- `docker-compose.yml` передаёт `JWT_SECRET` с дефолтом — для прод-сборки убрать дефолт.
