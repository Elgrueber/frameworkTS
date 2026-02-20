import type { Cookie } from '@playwright/test';

export async function authenticateUser(request: any, baseURL: string) {
  const authResponse = await request.post(`${baseURL}/auth`, {
    data: {
      username: process.env.RESTFUL_BOOKER_USERNAME,
      password: process.env.RESTFUL_BOOKER_PASSWORD,
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const authBody = await authResponse.json();
  return authBody.token;
}

export async function authenticateAdminAndGetCookie(page: any) {
  await page.goto(`${process.env.BASE_UI_URL}/admin`);
  
  await page.fill('input[placeholder="Enter username"]', process.env.ADMIN_USERNAME);
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD);
  await page.click('button:has-text("Login")');
  
  await page.waitForTimeout(2000);
  
  const cookies = await page.context().cookies();
  const authCookie = cookies.find((cookie: Cookie) => cookie.name.includes('token') || cookie.name.includes('session') || cookie.name.includes('auth'));
  
  if (!authCookie) {
    throw new Error('Authentication cookie not found after login');
  }
  
  return authCookie;
}