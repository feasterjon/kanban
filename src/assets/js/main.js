/*
Title: Kanban
Author: Jonathan Feaster, JonFeaster.com
Date: 2021-11-22
*/

import CONFIG from './config.js';
import * as jmodules from './modules/jmodules/index.js';
import Kanban from "./modules/kanban/index.js";
import { LocalDataAdmin as LocalData } from './modules/localdata/admin.js';

class Main {
  constructor() {
    this.data = CONFIG;
    this.effects = new jmodules.Effects();
    this.events = new jmodules.Events();
    this.interaction = new jmodules.Interaction();
    this.localData = new LocalData(this.data.localData);
  }
  
  // mount interface
  
  mount() {
    if (typeof this.data !== 'undefined') {
      let template = document.getElementById(this.data.templateId).innerHTML;
      let templateView = new jmodules.Template(this.data.template.tags, template);
      template = templateView.compile();
      document.body.innerHTML = template;
      new Kanban(
        document.querySelector(".kanban")
      );
      this.localData.updateView(); // update view
      this.events.click('localdata-copy', () => {
        this.interaction.copyClip(this.data.localData.viewId, 'localdata-copy', 'Copied');
      });
      this.events.click('localdata-save', () => {
        this.localData.saveView(); // save view
        this.interaction.feedback('localdata-save', 'Saving');
      });
      this.events.click('localdata-refresh', () => {
        location.reload();
      });
      this.events.click('localdata-reset', () => {
        this.localData.destroy();
        this.localData.updateView(); // update view
      });
      if (typeof this.data.localDataAdminId !== 'undefined') {
        document.getElementById(this.data.localDataAdminId).style.display = 'none';
        this.events.click(this.data.templateButtons.manageDataId, () => {
          this.localData.updateView(); // update view
          this.effects.toggle(this.data.localDataAdminId);
        });
      }
      if (this.data.enableCreds === true) {
        try {
          document.getElementById('description').innerHTML = document.getElementsByName('description')[0].getAttribute('content');
        } catch(err) {}
        try {
          document.getElementById('author').innerHTML = document.getElementsByName('author')[0].getAttribute('content');
        } catch(err) {}
      }
    }
  }
}

const main = new Main();
main.mount();
