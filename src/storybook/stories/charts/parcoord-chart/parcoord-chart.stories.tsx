import type {Meta, StoryObj} from '@storybook/html';
import {ParcoordChartUserArgs} from "../../../../ts";
import parcoordChartCSS from './parcoord-chart.css?inline'
import {rawCode} from "../../util/raw-code";
import {SoldCarsGermanyData} from '../../util/data'
import {renderParcoordChart} from "../../util/render/render-parcoord-chart";

const meta = {
  title: 'Charts/Parallel Coordinates Chart',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) }
    }
  },
  render: renderParcoordChart
} satisfies Meta<ParcoordChartUserArgs>;

const { getTopMakesData } = SoldCarsGermanyData
const {horsePower, prices, mileages, makes, fuel} = getTopMakesData(5)

type Story = StoryObj<ParcoordChartUserArgs>;

export const Primary: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      dimensions: [
        {
          scaledValues: { values: horsePower},
          zoom: {
            in: 10,
            out: 1
          },
          axis: {
            title: "Horsepower",
            subTitle: "[PS]"
          }
        },
        {
          scaledValues: {
            values: prices
          },
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Price",
            subTitle: "[EU]"
          }
        },
        {
          scaledValues: { values: mileages},
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Mileage",
            subTitle: "[km]"
          }
        },
        {
          scaledValues: { values: fuel},
          axis: {
            title: "Fuel",
          }
        },
      ],
      categories: {
        values: makes,
        title: 'Makes'
      },
      flipped: {
        mapping: {0: true, 3: false},
        dependentOn: 'width'
      }
    },
    breakPoints: {
      width: {
        values: [20, 30, 70],
        unit: 'rem'
      }
    },
    title: 'Car data'
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: parcoordChartCSS },
    }
  }
}

export default meta;
