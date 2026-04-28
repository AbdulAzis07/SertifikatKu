/**
 * Bootstrap file for the application.
 * Sets up Axios defaults for CSRF token handling.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
