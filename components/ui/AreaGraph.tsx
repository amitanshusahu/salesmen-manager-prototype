import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const AreaGraph = () => {
  const lineData = [{ value: 6 }, { value: 4 }, { value: 4 }, { value: 5 }, { value: 5 }, { value: 7 }, { value: 7 }, { value: 9 }];

  const lineData2 = [{ value: 2 }, { value: 7 }, { value: 7 }, { value: 4 }, { value: 3 }, { value: 4 }, { value: 4 }, { value: 3 }];

  return (

    <View style={{ marginTop: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", overflow: 'hidden', gap: 30 }}>



      <LineChart
        areaChart
        curved
        data={lineData}
        data2={lineData2}
        spacing={44}
        initialSpacing={0}
        adjustToWidth
        hideRules
        color1="pink"
        color2="lightgreen"
        textColor1="green"
        hideDataPoints
        dataPointsColor1="blue"
        dataPointsColor2="red"
        startFillColor1="pink"
        startFillColor2="lightgreen"
        startOpacity={1}
        xAxisColor="#ddd"
        yAxisColor={"#ddd"}
        yAxisTextStyle={{ color: "#aaa" }}
        endOpacity={0.3}
      />

      <LineChart
        areaChart
        curved
        data={lineData}
        spacing={44}
        initialSpacing={0}
        adjustToWidth
        hideRules
        color1="skyblue"
        color2="lightgreen"
        textColor1="green"
        hideDataPoints
        dataPointsColor1="blue"
        dataPointsColor2="red"
        startFillColor1="skyblue"
        startFillColor2="lightgreen"
        startOpacity={1}
        xAxisColor="#dddd"
        yAxisColor={"#ddd"}
        yAxisTextStyle={{ color: "#aaa" }}
        endOpacity={0.3}
      />

    </View>

  );
};


export default AreaGraph;
