import ReactECharts from "echarts-for-react";

export function OverallTaxPayStatusReview() {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 2,
          borderColor: "#fff",
          borderWidth: 1,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1907, name: "Active" },
          { value: 738, name: "Overdue" },
          { value: 381, name: "Suspended Business" },
          { value: 229, name: "Out of Operation" },
        ],
      },
    ],
  };

  return (
    <>
      <div className="chart__wrapper   flex items-center gap-4 p-4 justify-between space-y-8">
        <div className="left__x flex gap-6 ">
          <div className="lga__report bg-emerald-50 p-8 rounded">
            <table className="table-auto ">
              <thead>
                <tr>
                  <th className="pb-4">Tax Area by LGA</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="space-y-4 ">
                <tr>
                  <td>Ringim</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Taura</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>Garki</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Babura</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Roni</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>Dutse</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="lga__report bg-slate-50 min-h-96 p-8 rounded ">
            <table className="table-auto ">
              <thead>
                <tr>
                  <th className="pb-4">Tax Area by LGA</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className=" gap-8 ">
                <tr className=" ">
                  <td>Ringim</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Taura</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>Garki</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Babura</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Roni</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>Dutse</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart__section  flex items-center flex-col ">
          <p className="text-2xl font-bold">Overall Tax Pay Status Review</p>
          <ReactECharts
            option={option}
            style={{
              height: "440px",
              width: "440px",
              display: "flex",
              background: "#fff",
            }}
            className=" "
          />
        </div>
      </div>
    </>
  );
}
