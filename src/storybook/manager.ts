import {addons} from '@storybook/manager-api';
import {create} from '@storybook/theming';


const customTheme = create({
  base: 'light',
  brandTitle: 'RespVis',
  brandUrl: 'https://github.com/tugraz-isds/respvis',
  brandImage: '/assets/png/respvis-logo-light.png', // Relative path to your logo
});

addons.setConfig({
  theme: customTheme
});
