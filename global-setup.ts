import { FullConfig } from '@playwright/test';
import { authenticateUser } from './helpers/apiMethods.js';

async function globalSetup(config: FullConfig) {
  const baseURL = process.env.BASE_API_URL!;
  const uiURL = process.env.BASE_UI_URL!;
  const authFile = 'admin.json';

  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const response = await page.request.post(`${baseURL}/auth/login`, {
      data: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
      }
    });
    
    const authToken = await response.text();
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }
    
    await page.addInitScript((token) => {
      document.cookie = `token=${token}; path=/; domain=${window.location.hostname}`;
    }, authToken);
    
    await page.goto(`${uiURL}/admin`);
    await page.waitForTimeout(2000);
    
    await context.storageState({ path: authFile });
    await context.close();
    
    console.log('Global authentication setup completed');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;