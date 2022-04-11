import CONFIG from '../../config.js';

const API_CONFIG = fetch(CONFIG)
.then(response => response.json());

export default await API_CONFIG;