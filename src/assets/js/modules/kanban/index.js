/*
Title: Kanban
Author: Jonathan Feaster, JonFeaster.com
Date: 2021-11-23
*/

import Column from "./view/column.js";

export default class Kanban {
	constructor(data, root) {
    this.data = data;
		this.root = root;
    
    let columns = Object.values(this.data);
    for (let column of columns) {
      const columnView = new Column(column.id, column.title);
      this.root.appendChild(columnView.elements.root);
    }
	}
}
