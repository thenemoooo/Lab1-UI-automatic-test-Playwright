import { test, expect, Page } from '@playwright/test';

/**
 * Лаборатори №1: UI автомат тест — Playwright
 * Тестийн сайт: https://www.saucedemo.com
 *
 * Тестүүд бие даасан (test isolation): Playwright тест бүрт шинэ,
 * цэвэр browser context өгдөг тул тестүүд хоорондоо хамааралгүй ажилладаг.
 * Тест бүр өөрийн нэвтрэх/гарах (login/logout) үйлдлийг бүрэн гүйцэтгэнэ.
 */

const BASE_URL = 'https://www.saucedemo.com';
const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

/**
 * Тусламж функц: тухайн page дээр нэвтрэх үйлдэл гүйцэтгэнэ.
 * Локаторыг getByPlaceholder ашиглан олж байна — орчин үеийн,
 * тогтвортой (resilient) арга бөгөөд XPath-аас илүү уншигдахуйц.
 */
async function login(page: Page, username: string, password: string) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/**
 * Тусламж функц: нэвтэрсэн хэрэглэгчийг системээс гаргана (logout).
 * Hamburger цэсийг нээж, "Logout" холбоос дээр дарна.
 */
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
}

test.describe('SauceDemo — нэвтрэх ба үндсэн үйлдлүүд', () => {

  test('1. Амжилттай нэвтрэх', async ({ page }) => {
    await login(page, VALID_USER, VALID_PASS);

    // Нэвтэрсний дараа "Products" гарчиг харагдаж байгааг шалгана
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Тестийг зөв төгсгөх — logout хийнэ
    await logout(page);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('2. Амжилтгүй нэвтрэх (буруу нууц үг)', async ({ page }) => {
    await login(page, VALID_USER, 'wrong_password');

    // Алдааны мессеж гарч ирснийг шалгана
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');

    // Амжилтгүй нэвтрэлт учир Products хуудас руу шилжээгүй эсэхийг шалгана
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('3. Нэвтэрсний дараах үйлдэл — бараа сагслах', async ({ page }) => {
    await login(page, VALID_USER, VALID_PASS);
    await expect(page.getByText('Products')).toBeVisible();

    // Нэг барааг сагслах товч дээр дарна (getByRole ашиглав)
    await page
      .getByRole('button', { name: 'Add to cart' })
      .first()
      .click();

    // Сагсны badge дээр "1" гарч буйг шалгана
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // Сагс руу орж, бараа жагсаалтад орсныг баталгаажуулна
    await page.locator('.shopping_cart_link').click();
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Тестийг зөв төгсгөх — Products хуудас руу буцаад logout хийнэ
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await logout(page);
  });

});

/*
 * ТАЙЛБАР — Санаатайгаар унагах тест (debugging дадлагын жишээ, Алхам 4):
 * Доорх тестийг ТАЙЛБАРААС нь гаргаж, буруу assertion-той ажиллуулснаар
 * trace viewer дээр алдааг хэрхэн мөшгихийг ажиглаж болно.
 *
 * test('ЗОРИУДААР унагах тест — trace дадлага', async ({ page }) => {
 *   await login(page, VALID_USER, VALID_PASS);
 *   // Санаатайгаар буруу текст хүлээж байна — энэ тест унана
 *   await expect(page.getByText('Wrong Title Text')).toBeVisible();
 * });
 */
