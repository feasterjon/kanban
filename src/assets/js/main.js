/*
Title: Kanban
Author: Jonathan Feaster, JonFeaster.com
Date: 2022-04-11
*/

import * as jmodules from './modules/jmodules/index.js';
import { Kanban } from './modules/kanban/index.js';
import { LocalDataAdmin as LocalData } from './modules/localdata/admin.js';

export class Main {
  constructor(data) {
    this.data = data.data[0].attributes;
    this.effects = new jmodules.Effects();
    this.events = new jmodules.Events();
    this.interaction = new jmodules.Interaction();
    this.localData = new LocalData(this.data.localData);
  }
  render() {
    if (this.data) {
      const kanbanData = this.localData.readField("data");
      if (!kanbanData || kanbanData[0].type !== this.data.dataName) {
        this.localData.destroy(this.data.localData.name);
      }
      let heading = this.data.defaultKanbanName;
      let json = this.localData.read(this.data.localData.name);
      if (json) {
        let name = JSON.parse(json).data[0].meta.name;
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
          location.href = './';
        }
        else {
          location.href = './';
        }
      }
      const kanban = new Kanban(
        this.data,
        document.querySelector(".kanban")
      );
      kanban.render();
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
          json.data[0].meta.name = kanbanName;
          json.data[0].meta.update = Date.now().toString();
          output = json;
        }
        else {
          output.data = [];
          output.data[0] = {
            "type": this.data.dataName,
            "id": Math.floor(Math.random() * 100000).toString(),
            "meta": {
              "name": kanbanName,
              "update": Date.now().toString()
            },
            "attributes": {}
          };
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