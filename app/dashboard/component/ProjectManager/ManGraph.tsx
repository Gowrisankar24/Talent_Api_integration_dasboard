"use client"
import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var totalVisitors = 829500;

var visitorsDrilldownedChartOptions = {
    animationEnabled: true,
    theme: "light2",
    axisY: {
        gridThickness: 0,
        includeZero: false,
        lineThickness: 1
    },
    data: []
};

var newVSReturningVisitorsOptions = {
    animationEnabled: true,
    theme: "light2",
    height: 300, // Set the height here
    title: {
        text: ""
    },
    subtitles: [{
        text: "",
        backgroundColor: "#2eacd1",
        fontSize: 16,
        fontColor: "white",
        padding: 5
    }],
    legend: {
        fontFamily: "calibri",
        fontSize: 14,
        itemTextFormatter: function (e) {
            return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / totalVisitors * 100) + "%";
        }
    },
    data: []
};

class ManGraph extends Component {
    constructor() {
        super();
        this.state = {
            options: {}
        };
        this.visitorsChartDrilldownHandler = this.visitorsChartDrilldownHandler.bind(this);
    }

    visitorsChartDrilldownHandler(e) {
        var chart = this.chart;
        chart.options = visitorsDrilldownedChartOptions;
        chart.options.data = this.state.options[e.dataPoint.name];
        chart.options.title = { text: e.dataPoint.name }
        chart.render();
    }

    componentDidMount() {
        var chart = this.chart;
        chart.options = newVSReturningVisitorsOptions;
        chart.options.data = this.state.options["New vs Returning Visitors"];
        chart.render();
    }

    render() {
        this.state.options = {
            "New vs Returning Visitors": [{
                click: this.visitorsChartDrilldownHandler,
                cursor: "pointer",
                explodeOnClick: false,
                innerRadius: "75%",
                legendMarkerType: "square",
                name: "New vs Returning Visitors",
                radius: "100%",
                showInLegend: true,
                startAngle: 90,
                type: "doughnut",
                dataPoints: [
                    { y: 522460, name: "Men", color: "#E7823A" },
                    { y: 307040, name: "Women", color: "#546BC1" }
                ]
            }],
            "New Visitors": [{
                color: "#E7823A",
                name: "New Visitors",
                type: "column",
                dataPoints: [
                    { x: new Date("1 Jan 2017"), y: 37000 },
                    { x: new Date("1 Feb 2017"), y: 39960 },
                    { x: new Date("1 Mar 2017"), y: 41160 },
                    { x: new Date("1 Apr 2017"), y: 42240 },
                    { x: new Date("1 May 2017"), y: 42200 },
                    { x: new Date("1 Jun 2017"), y: 43600 },
                    { x: new Date("1 Jul 2017"), y: 45560 },
                    { x: new Date("1 Aug 2017"), y: 47280 },
                    { x: new Date("1 Sep 2017"), y: 48800 },
                    { x: new Date("1 Oct 2017"), y: 52720 },
                    { x: new Date("1 Nov 2017"), y: 56840 },
                    { x: new Date("1 Dec 2017"), y: 58400 }
                ]
            }],
            "Returning Visitors": [{
                color: "#546BC1",
                name: "Returning Visitors",
                type: "column",
                dataPoints: [
                    { x: new Date("1 Jan 2017"), y: 19000 },
                    { x: new Date("1 Feb 2017"), y: 21040 },
                    { x: new Date("1 Mar 2017"), y: 21840 },
                    { x: new Date("1 Apr 2017"), y: 22760 },
                    { x: new Date("1 May 2017"), y: 24800 },
                    { x: new Date("1 Jun 2017"), y: 24400 },
                    { x: new Date("1 Jul 2017"), y: 25440 },
                    { x: new Date("1 Aug 2017"), y: 27720 },
                    { x: new Date("1 Sep 2017"), y: 27200 },
                    { x: new Date("1 Oct 2017"), y: 29280 },
                    { x: new Date("1 Nov 2017"), y: 31160 },
                    { x: new Date("1 Dec 2017"), y: 32400 }
                ]
            }]
        };

        return (
            <>
                <div className="flex justify-center align-items-center" style={{ width: '100%', height: '100%' }}>
                    <CanvasJSChart options={this.state.options}
                        onRef={ref => this.chart = ref}
                        center={{ text: `${Math.round(this.state.options["New vs Returning Visitors"][0].dataPoints[0].y / totalVisitors * 100)}%`, verticalAlign: "center" }}
                    />
                </div>
            </>
        );
    }
}

export default ManGraph;
