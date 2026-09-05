# Лаборатори №1 — UI автомат тест (Playwright)
**Оюутан:** [Н.Ням-Од], [B222270805]
**Хичээл:** F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест (2026)
**Тестийн сайт:** [saucedemo.com](https://www.saucedemo.com)

## Юу хийсэн

- `npm init playwright@latest` командаар Playwright/TypeScript төсөл үүсгэсэн.
- `tests/mytest.spec.ts` файлд саучdemo.com дээр ажилладаг 3 тест бичсэн:
  1. **Амжилттай нэвтрэх** — `standard_user` / `secret_sauce` ашиглан нэвтэрч, "Products" хуудас руу шилжсэнийг шалгасан.
  2. **Амжилтгүй нэвтрэх** — буруу нууц үгээр нэвтрэхэд алдааны мессеж гарч ирснийг шалгасан.
  3. **Нэвтэрсний дараах үйлдэл** — нэг барааг сагслаж, сагсны badge болон агуулгыг шалгасан.
- Бүх тест `getByRole`, `getByPlaceholder`, `getByText` зэрэг орчин үеийн locator ашигласан бөгөөд XPath ашиглаагүй.
- Тест бүр `logout` үйлдлээр төгсдөг, мөн тестүүд бие биенээсээ хамааралгүй (test isolation) — Playwright тест бүрт шинэ browser context үүсгэдэг тул автоматаар хангагдана.
- `playwright.config.ts`-д HTML report, trace болон video бичлэгийг идэвхжүүлсэн.
- Codegen (`npx playwright codegen saucedemo.com`) ашиглан автоматаар үүсгэсэн кодтой өөрийн гараар бичсэн кодоо харьцуулсан.
- Trace viewer ашиглан (`npx playwright test --trace on` → `npx playwright show-trace`) тестийг санаатайгаар унагаж, алдааг хэрхэн мөшгихийг ажигласан (доор тайлбарласан).

## Playwright vs Selenium — ажиглалт

Playwright-ийн хамгийн мэдрэгдэхүйц давуу тал нь **auto-wait** механизм байлаа — Selenium дээр элемент бэлэн болтол `WebDriverWait`, `expected_conditions` гэх мэтийг гараар бичих шаардлагатай байдаг бол Playwright үүнийг автоматаар хийдэг тул код мэдэгдэхүйц цөөн, унших хялбар болсон. Мөн **trace viewer** нь алдаа мөшгих (debugging) явцыг эрс хөнгөвчилсөн: тест бүрийн алхам, DOM snapshot, сүлжээний хүсэлт бүгд нэг дор харагддаг тул Selenium-ий лог, скриншот шалгахтай харьцуулахад хамаагүй хурдан асуудлыг олж харах боломжтой байсан. **Codegen**-ээр үүсгэсэн код нь миний гараар бичсэн кодтой ерөнхийдөө төстэй байсан ч, автоматаар үүссэн код нь ихэвчлэн `id`, `css` selector ашигладаг байхад миний бичсэн код `getByRole`/`getByPlaceholder` зэрэг илүү тогтвортой (resilient), хэрэглэгчийн харах өнцгөөс тодорхойлогдсон locator ашигласан — энэ нь ирээдүйд UI өөрчлөгдөхөд тест эвдрэх магадлалыг бууруулна. Driver суулгах талаар ч ялгаа мэдэгдэхүйц байсан: Selenium дээр хөтөч бүрд тусдаа driver (`chromedriver`, `geckodriver` гэх мэт) татаж, замыг тохируулах шаардлагатай байдаг бол Playwright дээр `npx playwright install` гэсэн ганц командаар бүх хөтөч суудаг. Ерөнхийд нь Playwright нь илүү орчин үеийн, "battery included" (бэлэн хэрэгслүүдтэй) framework гэдгийг мэдэрсэн бол Selenium нь илүү өргөн платформ дэмжлэгтэй, тогтворжсон, industry-д удаан хугацаанд ашиглагдсан хэрэгсэл хэвээр байна.

## XPath-аас яагаад зайлсхийсэн

XPath нь HTML бүтэц дэх байрлалаас (жишээ нь: `/div[2]/span[1]`) хамааралтай байдаг тул хуудасны загвар бага зэрэг өөрчлөгдөхөд амархан эвдэрдэг. `getByRole`, `getByPlaceholder`, `getByText` зэрэг нь харин хэрэглэгчийн харж, ойлгож буй элементийн шинж чанар (дүр, текст, placeholder) дээр үндэслэдэг тул илүү тогтвортой бөгөөд accessibility-д ч сайнаар нөлөөлдөг — учир нь эдгээр locator нь дэлгэцийн уншигч (screen reader) хэрэглэгчдийн ашигладаг элементийн ARIA role-той ижил зарчмаар ажилладаг.

## Тестүүдийг ажиллуулах

```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Trace үзэх

```bash
npx playwright test --trace on
npx playwright show-trace test-results/<test-name>/trace.zip
```
