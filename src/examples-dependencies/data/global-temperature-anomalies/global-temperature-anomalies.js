// Global Land December Temperature Anomalies
// Units: Degrees Celsius
// Base Period: 1901-2000
// Missing: -999
// Date,Anomaly

export const months = [
  "1850-01",
  "1850-02",
  "1850-03",
  "1850-04",
  "1850-05",
  "1850-06",
  "1850-07",
  "1850-08",
  "1850-09",
  "1850-10",
  "1850-11",
  "1850-12",
  "2023-01",
  "2023-02",
  "2023-03",
  "2023-04",
  "2023-05",
  "2023-06",
  "2023-07",
  "2023-08",
  "2023-09",
  "2023-10",
  "2023-11",
  "2023-12"
]

export const anomalies = [
  -1.30,
  -0.57,
  -0.50,
  -1.00,
  -0.84,
  -0.35,
  -0.08,
  0.10,
  -0.25,
  -1.04,
  -0.66,
  -0.16,
  1.41,
  1.81,
  2.17,
  1.28,
  1.23,
  1.39,
  1.59,
  1.79,
  2.27,
  2.23,
  2.38,
  2.24
]

export const years = ['1850', '2023']

export const anomalies_1885 = anomalies.slice(0, 12).reduce((anomaly, sum) => anomaly + sum, 0) / 12
export const anomalies_2023 = anomalies.slice(12, 24).reduce((anomaly, sum) => anomaly + sum, 0) / 12
