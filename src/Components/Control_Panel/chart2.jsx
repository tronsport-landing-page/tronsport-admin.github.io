import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./Chart.css";
function Chart2(){
    const data = [
        {
          name: 'D1',
          Tron_chart: 9,
        },
        {
          name: 'D2',
          Tron_chart: 5,
        },
        {
          name: 'D3',
          Tron_chart: 7,
        },
        {
          name: 'D4',
          Tron_chart: 9,
        },
        {
          name: 'D5',
          Tron_chart: 5,
        },
        {
          name: 'D6',
          Tron_chart: 11,
        },
        {
          name: 'D7',
          Tron_chart: 3,
        },
        {
            name: 'D8',
            Tron_chart: 3,
        },
        {
            name: 'D9',
            Tron_chart: 14,
        },
        {
            name: 'D10',
            Tron_chart: 15,
        },
        {
            name: 'D11',
            Tron_chart: 17,
        },
        {
            name: 'D12',
            Tron_chart: 15,
        },
        {
            name: 'D13',
            Tron_chart: 2,
        },
      ];
    return(
        <div className="chartclass">
        <ResponsiveContainer >
        <LineChart className="line"
          
          data={data}
        >
          <CartesianGrid horizontal="true" vertical="true"/>
          <XAxis dataKey="name" />
          <YAxis startOffset={2} tickCount={10} start/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Tron_chart" stroke="blue" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      </div>

    )
}

export default Chart2;