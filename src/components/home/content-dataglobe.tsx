import NmGlobe from '@/components/nm-globe'

/**
 * name latitude & longitude
 * https://github.com/eesur/name-codes-lat-long/blob/master/name-codes-lat-long-alpha3.json
 */

let markers = [
  { name: 'United Kingdom', location: [54, -2], size: 0.05 },
  { name: 'Netherlands', location: [52.5, 5.75], size: 0.07 },
  { name: 'Hong Kong', location: [22.25, 114.1667], size: 0.05 },
  { name: 'China', location: [35, 105], size: 0.04 },
  { name: 'Taiwan, Province of China', location: [23.5, 121], size: 0.09 },
  { name: 'Japan', location: [36, 138], size: 0.089 },
  { name: 'Singapore', location: [1.3667, 103.8], size: 0.1 },
  { name: 'United States', location: [38, -97], size: 0.088 },
  { name: 'France', location: [46, 2], size: 0.07 },
  { name: 'Burkina Faso', location: [54, -2], size: 0.03 },
  { country: 'Vietnam', location: [16, 106], size: 0.03 },
  { name: 'Australia', location: [-27, 133], size: 0.06 },
  { name: "Korea, Democratic People's Republic of", location: [40, 127], size: 0.06 },
  { name: 'Christmas Island', location: [-10.5, 105.6667], size: 0.04 },
  { name: 'Colombia', location: [4, -72], size: 0.04 },
  { name: 'Comoros', location: [-12.1667, 44.25], size: 0.03 },
  { name: 'Croatia', location: [45.1667, 15.5], size: 0.02 },
  { name: 'Cuba', location: [21.5, -80], size: 0.01 },
  { name: 'Denmark', location: [56, 10], size: 0.02 },
  { name: 'Iceland', location: [65, -18], size: 0.01 },
  { name: 'India', location: [20, 77], size: 0.05 },
  { name: 'Indonesia', location: [-5, 120], size: 0.06 },
  { name: 'Belarus', location: [53, -8], size: 0.03 },
  { name: 'Canada', location: [60, -95], size: 0.13 },
  { name: 'Germany', location: [51, 9], size: 0.09 },
  { name: 'Russian Federation', location: [60, 100], size: 0.06 },
  { name: 'Nigeria', location: [10, 8], size: 0.02 },
  { name: "Korea, Democratic People's Republic of", location: [40, 127], size: 0.02 },
  { name: 'Korea, Republic of', location: [410, 37], size: 0.02 },
  { name: 'Turkey', location: [39, 35], size: 0.01 },
  { name: 'Philippines', location: [13, 122], size: 0.02 },
  { name: 'Pakistan', location: [30, 70], size: 0.02 },
  { name: 'Malaysia', location: [2.5, 112.5], size: 0.01 },
  { name: 'Brazil', location: [-10, -55], size: 0.02 },
  { name: 'United Arab Emirates', location: [24, 54], size: 0.01 },
  { name: 'Thailand', location: [15, 100], size: 0.01 },
  { name: 'Bangladesh', location: [24, 90], size: 0.01 },
  { name: 'Spain', location: [40, -4], size: 0.01 },
  { name: 'Luxembourg', location: [49.75, 6.1667], size: 0.01 },
  { name: 'Italy', location: [42.8333, 12.8333], size: 0.02 },
  { name: 'Belarus', location: [53, 28], size: 0.02 },
  { name: 'Czech Republic', location: [49.75, 15.5], size: 0.01 },
  { name: 'Algeria', location: [28, 3], size: 0.01 },
  { name: 'Estonia', location: [59, 26], size: 0.01 },
  { name: 'Austria', location: [47.3333, 13.3333], size: 0.02 },
  { name: 'Georgia', location: [42, 43.5], size: 0.03 },
  { name: 'Chile', location: [-30, -71], size: 0.02 },
  { name: 'Romania', location: [46, 25], size: 0.01 },
  { name: 'Argentina', location: [-34, -64], size: 0.01 },
  { name: 'Switzerland', location: [47, 8], size: 0.02 },
  { name: 'New Zealand', location: [-41, 174], size: 0.01 },
  { name: 'Morocco', location: [32, -5], size: 0.01 },
  { name: 'Greece', location: [39, 22], size: 0.01 },
  { name: 'Armenia', location: [40, 45], size: 0.01 },
  { name: 'Oman', location: [21, 57], size: 0.01 },
  { name: 'Cambodia', location: [13, 105], size: 0.01 },
  { name: 'South Africa', location: [-29, 24], size: 0.01 },
  { name: 'Ireland', location: [53, -8], size: 0.01 },
]

const ContentDataGlobe = () => {
  return <NmGlobe markers={markers} />
}

export default ContentDataGlobe
