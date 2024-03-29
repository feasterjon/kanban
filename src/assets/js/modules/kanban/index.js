/*
Title: Kanban
Author: Jonathan Feaster, JonFeaster.com
Date: 2022-04-06
*/

import Column from './view/column.js';
import { LocalData } from '../localdata/index.js';

export class Kanban {
	constructor(data, root) {
    this.data = data;
    this.swimlanes = data.swimlanes;
		this.root = root;
    this.localData = new LocalData(this.data.localData);
	}
  render() {
    let columns = Object.values(this.swimlanes);
    for (let column of columns) {
      const columnView = new Column(column.id, column.title);
      this.root.appendChild(columnView.elements.root);
    }
  }
}
