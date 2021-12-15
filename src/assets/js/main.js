/*
Title: Kanban
Author: Jonathan Feaster, JonFeaster.com
Date: 2021-12-15
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
    if (this.data) {
      const kanbanData = this.localData.readField(this.data.dataName);
      if (!kanbanData) {
        this.localData.destroy(this.data.localData.name);
      }
      let heading = this.data.defaultKanbanName;
      let json = this.localData.read(this.data.localData.name);
      if (json) {
        let name = JSON.parse(json)[this.data.dataName][0]['name'];
        if (name) {
          heading = name;
        }
      }
      let tags = [
        {
          "name": "heading",
          "value": heading
        }
      ];
      let template = document.getElementById(this.data.templateId).innerHTML;
      let templateView = new jmodules.Template(tags, template);
      template = templateView.compile();
      document.body.innerHTML = template;
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('ldadmin') !== 'true') {
        document.getElementById(this.data.localDataAdminId).style.display = 'none';
      }
      if (searchParams.get('action') === 'reset') {
        const check = confirm('Are you sure you want to reset your data?');
        if (check) {
          this.localData.destroy(this.data.localData.name);
        }
        else {
          location.href = '?ldadmin=true';
        }
      }
      new Kanban(
        this.data,
        document.querySelector(".kanban")
      );
      this.localData.updateView(); // update view
      this.events.blur(this.data.headingId, () => {
        let output = {};
        let kanbanName = document.getElementById(this.data.headingId).textContent;
        if (!kanbanName) {
          kanbanName = this.data.defaultKanbanName;
        }
        let json = this.localData.read(this.data.localData.name);
        if (json) {
          json = JSON.parse(json);
          json[this.data.dataName][0]['name'] = kanbanName;
          json[this.data.dataName][0]['update'] = Date.now().toString();
          output = json;
        }
        else {
          output[this.data.dataName] = [];
          output[this.data.dataName].push({
            "id": Math.floor(Math.random() * 100000),
            "name": kanbanName,
            "update": Date.now().toString()
          });
        }
        this.localData.store(this.data.localData.name, JSON.stringify(output));
        this.localData.updateView(); // update view
      });
      this.events.click('localdata-copy', () => {
        this.interaction.copyClip(this.data.localData.viewId, 'localdata-copy', 'Copied');
      });
      this.events.click('localdata-save', () => {
        this.localData.saveView(); // save view
        this.interaction.feedback('localdata-save', 'Saving');
      });
      this.events.click(this.data.templateButtons.manageDataId, () => {
        this.localData.updateView(); // update view
        this.effects.toggle(this.data.localDataAdminId);
      });
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
