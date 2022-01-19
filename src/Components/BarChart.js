import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart({ data, axis }) {
  let arr = [];

  data.map((value, index) => {
    if (arr.length > 0) {
      let flag = false;
      arr.map((val) => {
        if (val.product__id === value.ProductID) {
          flag = true;
          val.order__qty = val.order__qty + value.OrderQty;
        }
        return;
      });

      if (!flag) {
        arr = [
          ...arr,
          { product__id: value.ProductID, order__qty: value.OrderQty },
        ];
      }
    } else {
      arr = [
        ...arr,
        { product__id: value.ProductID, order__qty: value.OrderQty },
      ];
    }
    return;
  });

  arr.sort();
  console.log("arr", arr);

  const options = {
    indexAxis: axis === 1 ? "x" : "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart is in between product__id (Base) and order__qty",
      },
    },
  };

  const dataR = {
    labels: arr.map((val) => val.product__id),
    datasets: [
      {
        label: "Dataset 1",
        data: arr.map((item) => item.order__qty),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        xAxisID: "product__id",
        yAxisID: "order__qty",
      },
    ],
  };
  return <Bar options={options} data={dataR} />;
}
