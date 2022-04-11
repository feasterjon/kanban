/*
Title: App
Author: Jonathan Feaster, JonFeaster.com
Date: 2022-04-11
*/

import CONFIG from './config.js';
import { Main } from './main.js';

export class App {
  async load() {
    let response = await fetch(CONFIG);
    if (response.status === 200) {
      let data = await response.json();
      const main = new Main(data);
      main.render();
    }
  }
}