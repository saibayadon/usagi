// Global Styles
import '@/css/app.css';

// Style imports.
import styles from '@/css/app.module.css';

// Log class names.
document.querySelector('#root').className = styles.module;
document.querySelector('#root').innerHTML = '<b>Vanilla</b>';

console.log('Loaded');
