import API_CONFIG from '../api_config.js';
import { LocalData } from '../../localdata/index.js';

const kanbanData = API_CONFIG.data[0].attributes;

export default class KanbanAPI {
	static getItems(columnId) {
		const column = read().find(column => column.id == columnId);

		if (!column) {
			return [];
		}

		return column.items;
	}

	static insertItem(columnId, content) {
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			id: Math.floor(Math.random() * 100000),
			content
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}

	static updateItem(itemId, newProps) {
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		if (!item) {
			throw new Error("Item not found.");
		}

		item.content = newProps.content === undefined ? item.content : newProps.content;

		// Update column and position
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);

			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
	}

	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}
}

function read() {
	let output = formatDefaultData(kanbanData.swimlanes);
  const localData = new LocalData(kanbanData.localData);
	let json = localData.read(kanbanData.localData.name);
	
	if (json) {
		let content = JSON.parse(json).data[0].attributes.content;
		if (content) {
      output = content;
    }
  }
  return output;
}

function save(data) {
  let output = {};
  let dataName = kanbanData.dataName;
  let kanbanId = Math.floor(Math.random() * 100000).toString();
  let kanbanName = document.getElementById(kanbanData.headingId).textContent;
  const localData = new LocalData(kanbanData.localData);
  let json = localData.read(kanbanData.localData.name);
  
  if (json) {
    kanbanId = JSON.parse(json).data[0].id;
  }
  if (!kanbanName) {
    kanbanName = kanbanData.defaultKanbanName;
  }
  
	output.data = [];
	output.data[0] = {
		"type": dataName,
		"id": kanbanId,
		"meta": {
			"name": kanbanName,
			"update": Date.now().toString()
		},
		"attributes": {
			"content": data
		}
	};
	localData.store(kanbanData.localData.name, JSON.stringify(output));
}

function formatDefaultData(data) {
  let output = [];
  let columns = Object.values(data);
  for (let column of columns) {
    output.push({
      "id": column.id,
      "items": []
    });
  }
  return output;
}