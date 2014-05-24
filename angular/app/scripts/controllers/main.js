'use strict';

var fft = angular.module('angularApp');

fft.controller('MainController', function ($scope, $http, BackendService) {

    $http.defaults.useXDomain = true;

    $scope.input = {
        componentSignals: 2,
        diversity: 2
    };

    $scope.incrementNumberOfComponentSignals = function() {
        $scope.input.componentSignals++;
    };

    $scope.decrementNumberOfComponentSignals = function() {
        $scope.input.componentSignals--;
    };

    $scope.incrementDiversity = function() {
        $scope.input.diversity++;
    };

    $scope.decrementDiversity = function() {
        $scope.input.diversity--;
    };


    $scope.compute = function() {
        BackendService.get({components: $scope.input.componentSignals, diversity: $scope.input.diversity}, function (successResult) {
            $scope.data = successResult;
            var dataSource = function() {
                return generateFirstGraphInputData($scope.data.args, $scope.data.signal, $scope.data['decoded']);
            };

            drawGraph('decoded', 'time[s]', 'amplitude', dataSource);

            var encodedSignalDataSource = function() {
                return generateSecondGraphInputData($scope.data.frequency, $scope.data['encoded']);
            };
            drawGraph('encoded', 'frequency[Hz]', 'amplitude', encodedSignalDataSource);
        });
    };

    $scope.compute();

    /*
     *  graph constructing
     */
    var drawGraph = function (htmlId, xLabel, yLabel, dataSource) {
        nv.addGraph(function () {
            var chart = nv.models.lineChart()
                    .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                    .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                    .transitionDuration(350)  //how fast do you want the lines to transition?
                    .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                    .showYAxis(true)        //Show the y-axis
                    .showXAxis(true)        //Show the x-axis
//                    .yDomain([-1, 1])
                ;

            chart.xAxis     //Chart x-axis settings
                .axisLabel(xLabel)
                .tickFormat(d3.format(',r'));

            chart.yAxis     //Chart y-axis settings
                .axisLabel(yLabel)
                .tickFormat(d3.format('.02f'));

            /* Done setting the chart up? Time to render it!*/
            var myData = dataSource();   //You need data...

            d3.select('#' + htmlId)    //Select the <svg> element you want to render the chart in.
                .datum(myData)         //Populate the <svg> element with chart data...
                .call(chart);          //Finally, render the chart!

            //Update the chart when window resizes.
            nv.utils.windowResize(function () {
                chart.update()
            });
            return chart;
        });
    };

    function generateSecondGraphInputData(args, values) {
        var baseFunction = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < args.length; i += 1) {
            baseFunction.push({x: args[i].value, y: values[i].value * 1000000000000});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: baseFunction,
                key: 'encoded signal',
                color: '#000000'
            }
        ];
    }

    function generateFirstGraphInputData(args, valuesOne, valuesTwo) {
        var seriesOne = [];
        var seriesTwo = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < args.length; i += 1) {
            seriesOne.push({x: args[i].value, y: valuesOne[i].value});
            seriesTwo.push({x: args[i].value, y: valuesTwo[i].value});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: seriesOne,
                key: 'signal',
                color: '#FF0000'
            },
            {
                values: seriesTwo,
                key: 'decoded signal',
                color: '#0088CC'
            },
        ];
    }

});
