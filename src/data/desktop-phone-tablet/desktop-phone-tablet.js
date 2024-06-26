export const years = [
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
];
export const desktop = [
  98.98, 97.06, 93.91, 87.96, 79.18, 66.57, 59.17, 51.37, 43.75, 45.11, 46.04, 45.64,
];
export const desktopCategory = new Array(desktop.length).fill('Desktop')

export const phone = [
  1.02, 2.94, 6.09, 10.74, 16.24, 27.14, 35.1, 43.59, 51.56, 50.88, 50.39, 51.61,
];
export const phoneCategory = new Array(desktop.length).fill('Smartphone')

export const tablet = [0, 0, 0, 1.31, 4.59, 6.29, 5.73, 5.04, 4.69, 4.02, 3.57, 2.75];
export const tabletCategory = new Array(desktop.length).fill('Tablet')

export const platforms = ['Desktop', 'Smartphone', 'Tablet'];

export default {
  years,
  desktop,
  phone,
  tablet,
  platforms,
};
