import type { Page } from '@playwright/test';
import { HOME } from '../constants/home.constants';
import { HomePage } from './home.page';

export class CartPage extends HomePage {
  constructor(page: Page) {
    super(page);
  }

}
