(function (app) {
    angular
        .module("Yempo", ['ngRoute', 'ngMaterial', 'ngMessages'])
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController)
        .controller("ReachController", ReachController)
        .controller("FeedController", FeedController)
        .controller("FilterController", FilterController)
        .directive('fileModel', ['$parse', function ($parse) {
            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.fileModel);
                element.on('change', function (event) {
                    onChange(scope, {$files: event.target.files});
                });
            };
            return {
                link: fn_link
            }
        }])
        .directive('mostFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors, friends) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var acquaintancesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("red"));

                        var acquaintancesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        var bridgesPetals = canvas.selectAll("circles")
                            .data(bridges)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "gray");

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(bridges)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");
                    }
                }
            }
        })
        .directive('leastFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors, friends) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var acquaintancesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("deepskyblue"));

                        var acquaintancesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        var bridgesPetals = canvas.selectAll("circles")
                            .data(bridges)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "gray");

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(bridges)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");
                    }
                }
            }
        })
        .directive('gatewayFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors, friends) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var bridgesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("royalblue"));

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");

                        //        var bridgesPetals = canvas.selectAll("circles")
                        //            .data(bridges)
                        //            .enter()
                        //            .append("circle")
                        //            .attr("cx", function (d, i) {
                        //                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
//
                        //            })
                        //            .attr("cy", function (d, i) {
                        //                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //            })
                        //            .attr("r", rValue)
                        //            .style("fill", "gray");
//
                        //        var bridgesPetalsText = canvas.selectAll("circles")
                        //            .data(bridges)
                        //            .enter()
                        //            .append("text")
                        //            .text(function (d) {
                        //                return d;
                        //            })
                        //            .attr("x", function (d, i) {
                        //                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //            })
                        //            .attr("y", function (d, i) {
                        //                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //            })
                        //            .style("fill", "black");
                    }
                }
            }
        })
        .directive('mostactiveFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors, friends) {
                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();
                        mycolor = d3.rgb("#f8f9fa");

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var bridgesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("orange"));

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        //    var bridgesPetals = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("circle")
                        //        .attr("cx", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //
                        //        })
                        //        .attr("cy", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("r", rValue)
                        //        .style("fill", mycolor);

                        //    var bridgesPetalsText = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("text")
                        //        .text(function (d) {
                        //            return d;
                        //        })
                        //        .attr("x", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("y", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .style("fill", mycolor);
                    }
                }
            }
        })
        .directive('leastactiveFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);


                    function drawDandelion(acquaintances, bridges, colors, friends) {
                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var bridgesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("crimson"));

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        //    var bridgesPetals = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("circle")
                        //        .attr("cx", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
//
                        //        })
                        //        .attr("cy", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("r", rValue)
                        //        .style("fill", "gray");
//
                        //    var bridgesPetalsText = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("text")
                        //        .text(function (d) {
                        //            return d;
                        //        })
                        //        .attr("x", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("y", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .style("fill", "black");
                    }
                }
            }
        })
        .directive('mostinteractiveFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintancesinyourarea: '=',
                    bridgesinyourarea: '=',
                    colorsinyourarea: '=',
                    acquaintances: '=',
                    bridges: '=',
                    colors: '='
                },
                link: function (scope, element, attrs) {

                    function toggleColor(color) {
                        var currentColor = color;
                        return function () {
                            var col = d3.select(this).style('fill').toString();
                            var colStr = d3.rgb(col).toString();
                            var magenta = d3.rgb("magenta").toString();

                            if (colStr != magenta) {
                                var selectedData = d3.select(this).data();
                                if (scope.acquaintancesinyourarea.indexOf(selectedData[0]) == -1) {
                                    scope.acquaintancesinyourarea.push(selectedData[0]);
                                    scope.colorsinyourarea.push(color);
                                    var i = scope.acquaintances.indexOf(selectedData[0]);
                                    scope.colors[i] = "magenta";
                                    currentColor = "magenta";
                                    return d3.select(this).style("fill", currentColor);
                                }
                            } else {
                                var selectedData = d3.select(this).data();
                                var i = scope.acquaintancesinyourarea.indexOf(selectedData[0]);
                                if (i != -1) {
                                    scope.acquaintancesinyourarea.splice(i, 1);
                                    scope.colorsinyourarea.splice(i, 1);
                                    scope.colors[scope.acquaintances.indexOf(selectedData[0])] = color;
                                }
                                return d3.select(this).style("fill", color);
                            }
                        }
                    };

                    scope.$watch(function () {
                        try {
                            drawDandelion(scope.acquaintances, scope.bridges, scope.colors, []);
                        }
                        catch (err) {
                        }
                    }, true);


                    function drawDandelion(acquaintances, bridges, colors, friends) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var bridgesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            })
                            .on('click', toggleColor("gold"));

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        //    var bridgesPetals = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("circle")
                        //        .attr("cx", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
//
                        //        })
                        //        .attr("cy", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("r", rValue)
                        //        .style("fill", "gray");
//
                        //    var bridgesPetalsText = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("text")
                        //        .text(function (d) {
                        //            return d;
                        //        })
                        //        .attr("x", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("y", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .style("fill", "black");
                    }
                }
            }
        })
        .directive('messageFollowers', function () {

            return {
                restrict: 'E',
                replace: true,
                terminal: true,
                scope: {
                    colors: '=',
                    acquaintances: '=',
                    bridges: '=',
                    sendmessage: '='
                },
                link: function (scope, element, attrs) {

                    scope.$watch(function () {
                        drawDandelion(scope.acquaintances, [], scope.colors);
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var friends = [];
                        var angle = 360 / (acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;

                        var friendsLines = canvas.selectAll("lines")
                            .data(friends)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var bridgeDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", myCx)
                            .attr("y2", myCy)
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
                            .data(bridges)
                            .enter()
                            .append("line")
                            .attr("x1", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y1", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("x2", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y2", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("stroke-dasharray", "5 5")
                            .attr("stroke", "black");

                        var circle = canvas.append("circle")
                            .attr("cx", myCx)
                            .attr("cy", myCy)
                            .attr("r", rValue)
                            .style("fill", "black");

                        canvas.append("text")
                            .text("you")
                            .attr("x", myCx - 15)
                            .attr("y", myCy)
                            .style('fill', 'white');

                        var friendsPetals = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("r", rValue)
                            .style("fill", "red");

                        var friendsPetalsText = canvas.selectAll("circles")
                            .data(friends)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
                            })
                            .style("fill", "black");

                        var bridgesPetals = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

                            })
                            .attr("cy", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("r", rValue)
                            .style("fill", function (d, i) {
                                return colors[i];
                            });

                        var bridgesPetalsText = canvas.selectAll("circles")
                            .data(acquaintances)
                            .enter()
                            .append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", function (d, i) {
                                return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .attr("y", function (d, i) {
                                return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
                            })
                            .style("fill", "black");


                        //    var bridgesPetals = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("circle")
                        //        .attr("cx", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
//
                        //        })
                        //        .attr("cy", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("r", rValue)
                        //        .style("fill", "gray");
//
                        //    var bridgesPetalsText = canvas.selectAll("circles")
                        //        .data(bridges)
                        //        .enter()
                        //        .append("text")
                        //        .text(function (d) {
                        //            return d;
                        //        })
                        //        .attr("x", function (d, i) {
                        //            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .attr("y", function (d, i) {
                        //            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
                        //        })
                        //        .style("fill", "black");
                    }
                }
            }
        })
        .directive('allFollowers', function () {

            return {
                restrict: 'E',
                terminal: true,
                scope: {
                    acquaintances: '=',
                    bridges: '=',
                    middleUser: '=',
                    middle: '='
                },
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        try {
                            // drawDandelion(scope.acquaintances, scope.bridges, scope.colors,[]);
                            drawConnections(scope.acquaintances, scope.bridges, scope.middle, scope.middleUser)
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }, true);

                    function drawDandelion(acquaintances, bridges, colors, friends) {

                        var inYourArea = d3.select(element[0]);
                        var insideSVG = inYourArea.select("svg");
                        insideSVG.remove();

                        var angle = 360 / (friends.length + acquaintances.length);

                        var canvas = d3.select(element[0])
                            .append("svg")
                            .attr("width", 360)
                            .attr("height", 460);//change to dynamic

                        var myCx = 360 / 2;
                        var myCy = 460 / 2;
                        var rValue = 20;

                        var rValue1 = 75;
                        var rValue2 = 150;
                    }

                    function drawConnections(acquaintances, bridges, middle, middleUser) {

                        if (acquaintances !== undefined) {
                            document.getElementById("mu-name").innerHTML = middleUser.name;
                            document.getElementById("mu-follower-count").innerHTML = "#Followers " + middleUser.followers_count;
                            document.getElementById("mu-screen-name").innerHTML = "@" + middleUser.screen_name;

                            if (middleUser !== undefined && middleUser.profile_image_url_https !== undefined) {
                                document.getElementById("mu-profile-pic").src = middleUser.profile_image_url_https;
                            }

                            // Feel free to change or delete any of the code you see in this editor!
                            var inYourArea2 = d3.select('#semi-circle');
                            var insideSVG2 = inYourArea2.select("svg");
                            insideSVG2.remove();

                            var sc_width = document.getElementById('semi-circle').clientWidth;
                            var sc_height = document.getElementById('semi-circle').clientHeight;

                            var svg_semi_cirlce = d3.select("#semi-circle")
                                .append("svg")
                                .attr("width", sc_width)
                                .attr("height", sc_height)
                                .append("g")
                                .attr("transform", "translate(" + sc_width/2 + "," + 0 + ")");

                            var arc = d3.arc()
                                .innerRadius(50)
                                .outerRadius(55)
                                .startAngle(0.5 * Math.PI)
                                .endAngle(1.5*Math.PI);

                            svg_semi_cirlce.append("path")
                                .attr("class", "arc")
                                .attr("d", arc);


                            var inYourArea = d3.select('#left-followers');
                            var insideSVG = inYourArea.select("svg");
                            insideSVG.remove();

                            inYourArea = d3.select('#right-followers');
                            insideSVG = inYourArea.select("svg");
                            insideSVG.remove();

                            var color = d3.scaleLinear().domain([0,bridges.length])
                                .range(['#bae4dd', '#547e77']);

                            var svg_left = d3.select('#left-followers').append("svg");
                            var svg_right = d3.select('#right-followers').append("svg");

                            var left_acquaintances = acquaintances.slice(0, middle);
                            var right_acquaintances = acquaintances.slice(middle + 1, acquaintances.length);

                            var left_b = bridges.slice(0, middle);
                            var right_b = bridges.slice(middle + 1, bridges.length);

                            var left_color = [];
                            for(var i = 0; i < middle; i++){
                                left_color[i] = color(i);
                            }

                            var right_color = [];
                            i = 0;
                            for(var j = middle+1; j < bridges.length; j++){
                                right_color[i] = color(j);
                                i++;
                            }

                            var left_bridges = left_acquaintances.reduce(function (r, a, i) {
                                r[i] = [4, (i * 3) + 1, left_b[i], left_color[i]];
                                return r;
                            }, []);

                            var right_bridges = right_acquaintances.reduce(function (r, a, i) {
                                r[i] = [4, (i * 3) + 1, right_b[i], right_color[i]];
                                return r;
                            }, []);

                            left_bridges.slice(0, left_bridges.length - 2);
                            right_bridges.slice(0, right_bridges.length - 2);

                            var left_width = document.getElementById('left-followers').clientWidth,
                                left_height = document.getElementById('left-followers').clientHeight,
                                right_width = document.getElementById('right-followers').clientWidth,
                                right_height = document.getElementById('right-followers').clientHeight;

                            // set the ranges
                            var x_left = d3.scaleLinear().range([0, left_width]);
                            var y_left = d3.scaleLinear().range([left_height, 0]);

                            var x_right = d3.scaleLinear().range([0, right_width]);
                            var y_right = d3.scaleLinear().range([right_height, 0]);

                            // append the svg obgect to the body of the page
                            // appends a 'group' element to 'svg'
                            // moves the 'group' element to the top left margin
                            svg_left.attr("width", left_width)
                                .attr("height", left_height)
                                .append("g")
                                .attr("transform",
                                    "translate(0,0)");

                            svg_right.attr("width", right_width)
                                .attr("height", right_height)
                                .append("g")
                                .attr("transform",
                                    "translate(0,0)");


                            // Scale the range of the data
                            x_left.domain([0, d3.max(left_bridges, function (d) {
                                return d[0];
                            })]);
                            y_left.domain([0, d3.max(left_bridges, function (d) {
                                return d[1];
                            })]);

                            x_right.domain([0, d3.max(right_bridges, function (d) {
                                return d[0];
                            })]);
                            y_right.domain([0, d3.max(right_bridges, function (d) {
                                return d[1];
                            })]);

                            // Add the scatterplot
                            svg_left.selectAll("dot")
                                .data(left_bridges)
                                .enter().append("circle")
                                .attr('id', function(d){ return 'name' + d[2]; })
                                .style("fill", function(d) { return d[3]})
                                .attr("r", 10)
                                .attr("cx", function (d) {
                                    return x_left(d[0]);
                                })
                                .attr("cy", function (d) {
                                    return y_left(d[1]);
                                });

                            svg_right.selectAll("dot")
                                .data(right_bridges)
                                .enter().append("circle")
                                .attr('id', function(d){ return 'name' + d[2]; })
                                .style("fill", function(d) { return d[3]})
                                .attr("r", 10)
                                .attr("cx", function (d) {
                                    return x_right(d[0]);
                                })
                                .attr("cy", function (d) {
                                    return y_right(d[1]);
                                });

                            //slider start

                            // var slider_width = document.getElementById('follower-slider').clientWidth;
                            // var slider_height = document.getElementById('follower-slider').clientHeight;

                            // var sliderScale = d3.scaleLinear()
                            //     .domain([bridges[bridges.length - 1], bridges[0]]) //
                            //     .range([0, slider_width-20]) //
                            //     .clamp(true);

                            var area1 = d3.select('#follower-slider');
                            var insideSvg1 = area1.select("svg");
                            insideSvg1.remove();

                                alert("left_bridges[0] = " + left_bridges[0] + "\n right_bridges[right_bridges.length - 1] = " + right_bridges[right_bridges.length - 1])
                            var follower_slider = createD3RangeSlider(left_bridges[0],
                                                                      right_bridges[right_bridges.length - 1],"#follower-slider");

                            follower_slider.onChange(changeRed);

                            // var follower_slider = d3.select('#follower-slider').append('svg')
                            //     .attr('width', slider_width)
                            //     .attr('height', slider_height);
                            //
                            // var slider = follower_slider.append("g")
                            //     .attr("class", "slider")
                            //     .attr("transform", "translate(15,15)");

                            // slider.append("line")
                            //     .attr("class", "track")
                            //     .attr("x1", sliderScale.range()[0])
                            //     .attr("x2", sliderScale.range()[1])
                            //     .select(function () {
                            //         return this.parentNode;
                            //     })
                            //     .append("line")
                            //     .attr("x1", sliderScale.range()[0])
                            //     .attr("x2", sliderScale.range()[1])
                            //     .attr("class", "track-inset")
                            //     .select(function () {
                            //         return this.parentNode;
                            //     })
                            //     .append("line")
                            //     .attr("x1", sliderScale.range()[0])
                            //     .attr("x2", sliderScale.range()[1])
                            //     .attr("class", "track-overlay")
                            //     .call(d3.drag()
                            //         .on("start.interrupt", function () {
                            //             slider.interrupt();
                            //         })
                            //         .on("start drag", function () {
                            //             changeRed(sliderScale.invert(d3.event.x));
                            //         }));

                            // var handle = slider.insert("circle", ".track-overlay")
                            //     .attr("class", "handle")
                            //     .attr("r", 8);

                            function changeRed(h) {
                                alert(JSON.stringify(h));
                                document.getElementById('follower-slider').innerText = h.begin + "-" + h.end;
                                // handle.attr("cx", sliderScale(h));
                                var val = 0;
                                var min = Number.MAX_VALUE;

                                for(var j = 0; j < bridges.length; j++) {
                                    d3.selectAll('#name' + bridges[j])
                                        .transition()
                                        .attr("r", 10);
                                }
                                for(var i = 0; i < bridges.length; i++) {
                                    if (Math.abs(val - bridges[i]) < min){
                                        min = Math.abs(val - bridges[i]);
                                        val = bridges[i];
                                    }
                                }
                                d3.selectAll('#name' + val)
                                    .transition().duration(1000)
                                    .attr("r", 20);
                            }
                        }

                        // slider end
                    }
                }
            }
        })
        .config(AppConfig);

    function LoginController($scope, userService, $location, $anchorScroll) {
        $scope.login = login;

        function login(user) {
            $scope.error = null;
            var user = {
                email: user.username,
                password: user.password
            }
            userService.findUserByCredentials(user)
                .then(function (userResponse) {
                    if (userResponse.message === "Login successful") {
                        $location.url('/user/' + userResponse._id + '/' + userResponse.token);
                    }
                    else {
                        if (userResponse) {
                            $scope.error = userResponse;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        $anchorScroll('top');
                    }
                })
        }
    }

    function RegisterController($location, userService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.register = register;

        function register(user) {
            $scope.error = null;
            var user = {
                email: user.username,
                password: user.password,
                verifypassword: user.verifypassword,
                registrationkey: user.registrationkey,
                name: user.name,
                screenname: user.screenname
            };
            if (user.password !== user.verifypassword) {
                $scope.error = {
                    "message": " Passwords does not match "
                };
                $anchorScroll('top');
            }
            else {
                userService.createUser(user)
                    .then(function (userResponse) {
                        if (userResponse.message === "User already registered.") {
                            $scope.error = userResponse;
                        } else if (userResponse.message !== "Incorrect Registration Key") {
                            $location.url('/');
                        } else {
                            if (userResponse) {
                                $scope.error = userResponse;
                            }
                            else {
                                $scope.error = " Oops! Something went wrong. Please try again later ";
                            }
                            $anchorScroll('top');
                        }
                    })
            }
        }
    }

    function ProfileController($location, userService, $routeParams, $anchorScroll, $route, $scope) {

        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;
        $scope.twitterLogin = '/login/twitter';
        $scope.displayUser = displayUser;
        $scope.profileError = profileError;
        $scope.openReach = openReach;
        $scope.openFeed = openFeed;
        $scope.openFilters = openFilters;
        $scope.openFilters_new = openFilters_new;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.connectTwitter = connectTwitter;

        function init() {
            userService.findUserProfile($scope.userId)
                .then(displayUser, profileError);
        }

        init();

        function displayUser(user) {
            $scope.currentUser = user;
            $scope.connected = user.connected;
        }

        function connectTwitter() {
            userService.connectTwitter($scope.userId);
        }

        function profileError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openReach() {
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed() {
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters() {
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters_new() {
            $location.url('/filternew/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu() {
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu() {
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }
    }

    function ReachController($location, userService, postService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;

        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.openProfile = openProfile;
        $scope.openFeed = openFeed;
        $scope.openFilters = openFilters;

        function init() {
            postService.getLikesByUserId($scope.userId, $scope.token)
                .then(displayReachLikes, reachError);
            postService.getCommentsByUserId($scope.userId, $scope.token)
                .then(displayReachComments, reachError);
            postService.getSharesByUserId($scope.userId, $scope.token)
                .then(displayReachShares, reachError);
        }

        init();

        function displayReachLikes(likes) {
            $scope.likes = likes;
        }

        function displayReachComments(comments) {
            $scope.comments = comments;
        }

        function displayReachShares(shares) {
            $scope.shares = shares;
        }

        function reachError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openProfile() {
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed() {
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters() {
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu() {
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu() {
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }

    }

    function FeedController($location, userService, postService, $routeParams, $anchorScroll, $route, $scope, $mdToast) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;
        $scope.mediaid = 'null';

        var formData = new FormData();
        $scope.myFiles = function ($files) {
            formData.append('image', $files[0]);
            $scope.form = "defined";
        }

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function () {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;

            last = angular.extend({}, current);
        }

        $scope.showSimpleToast = showSimpleToast;

        function showSimpleToast() {
            $mdToast.show(
                $mdToast.simple()
                    .content($scope.error)
                    .position($scope.getToastPosition())
                    .hideDelay(750)
            );
        };
        $scope.displayFeed = displayFeed;
        $scope.feedError = feedError;
        $scope.displayUser = displayUser;
        $scope.profileError = profileError;
        $scope.openReach = openReach;
        $scope.openProfile = openProfile;
        $scope.openFilters = openFilters;
        $scope.createPost = createPost;
        $scope.getFeed = getFeed;
        $scope.favoritePost = favoritePost;
        $scope.clapPost = clapPost;
        $scope.retweetPost = retweetPost;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.openWritePost = openWritePost;
        $scope.closeWritePost = closeWritePost;
        $scope.typing = typing;
        $scope.enlarge = enlarge;
        $scope.searchPost = searchPost;
        $scope.selectSort = selectSort;

        function init() {
            postService.getFeed($scope.userId, $scope.token)
                .then(displayFeed, feedError);
            userService.findUserById($scope.userId, $scope.token)
                .then(displayUser, profileError);
            $scope.selectsort = "sort";
            $scope.postit = "create";
            $scope.form = undefined;
        }

        init();

        function searchPost() {
            console.log("inside searchPost");
            if ($scope.search !== "") {
                postService.getFeed($scope.userId, $scope.token)
                    .then(feed => {
                    var feedList = feed.posts;
                var filteredFeed = [];
                for (var i = 0; i < feedList.length; i++) {
                    if (feedList[i].text.toLowerCase().includes($scope.search.toLowerCase())
                        || feedList[i].username.toLowerCase().includes($scope.search.toLowerCase())) {
                        filteredFeed.push(feedList[i]);
                    }
                }
                if ($scope.search) {
                    $scope.currentFeed = filteredFeed;
                } else {
                    init();
                }
            })
                ;
            } else {
                postService.getFeed($scope.userId, $scope.token)
                    .then(feed => {
                    $scope.currentFeed = feed.posts;
            })
                ;
            }
        }

        function selectSort() {
            var actualFeed = $scope.currentFeed;
            if ($scope.selectsort == "favorites") {
                actualFeed.sort(sortfavorites);
                $scope.currentFeed = actualFeed;
            }
            if ($scope.selectsort == "retweets") {
                actualFeed.sort(sortretweets);
                $scope.currentFeed = actualFeed;
            }
            if ($scope.selectsort == "claps") {
                actualFeed.sort(sortclaps);
                $scope.currentFeed = actualFeed;
            }
        }

        function sortfavorites(a, b) {
            return (b.favorites - a.favorites)
        }

        function sortretweets(a, b) {
            return (b.retweets - a.retweets)
        }

        function sortclaps(a, b) {
            return (b.claps - a.claps)
        }

        function displayFeed(feed) {
            $scope.currentFeed = feed.posts;
        }

        function feedError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function displayUser(user) {
            $scope.currentUser = user;
        }

        function profileError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openReach() {
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openProfile() {
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function enlarge(id) {
            if (document.getElementById(id).style.height != 'auto') {
                document.getElementById(id).style.height = 'auto';
            } else {
                document.getElementById(id).style.height = '12vw';
            }
        }

        function openFilters() {
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function createPost(newpost) {
            $scope.error = null;
            console.log("$scope.postit is ", $scope.postit);
            console.log("$scope.form is ", $scope.form);
            if ($scope.postit != undefined) {
                $scope.postit = undefined;
                if ($scope.form != undefined) {
                    postService.createImage(formData, $scope.userId, $scope.token)
                        .then(function (postResponse) {
                            if (postResponse) {
                                var post = {
                                    text: newpost.text,
                                    media: postResponse.media
                                };
                                postService.createPost(post, $scope.userId, $scope.token)
                                    .then(function (postResponse) {
                                        if (postResponse) {
                                            $scope.error = postResponse.message;
                                            showSimpleToast();
                                            newpost.text = "";
                                            closeWritePost();
                                            init();
                                        }
                                        else {
                                            $scope.error = " Oops! Something went wrong. Please try again later ";
                                            showSimpleToast();
                                            init();
                                        }
                                    });
                            }
                            else {
                                var post = {
                                    text: newpost.text,
                                    media: $scope.mediaid
                                };
                                postService.createPost(post, $scope.userId, $scope.token)
                                    .then(function (postResponse) {
                                        if (postResponse) {
                                            $scope.error = postResponse.message;
                                            showSimpleToast();
                                            newpost.text = "";
                                            closeWritePost();
                                            init();
                                        }
                                        else {
                                            $scope.error = " Oops! Something went wrong. Please try again later ";
                                            showSimpleToast();
                                            init();
                                        }
                                    });
                            }
                        });
                } else {
                    var post = {
                        text: newpost.text,
                        media: $scope.mediaid
                    };
                    postService.createPost(post, $scope.userId, $scope.token)
                        .then(function (postResponse) {
                            if (postResponse) {
                                $scope.error = postResponse.message;
                                showSimpleToast();
                                newpost.text = "";
                                closeWritePost();
                                init();
                            }
                            else {
                                $scope.error = " Oops! Something went wrong. Please try again later ";
                                showSimpleToast();
                                init();
                            }
                        });
                }

            }
        }


        function typing() {
            $scope.createPost = "defined";
        }

        function getFeed() {
            $scope.error = null;

            postService.getFeed($scope.userId, $scope.token)
                .then(function (posts) {
                    if (posts) {
                        $scope.posts = posts.posts;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                        showSimpleToast();
                    }
                    init();
                })
        }

        function favoritePost(postId, favorited) {
            $scope.error = null;

            if (favorited) {
                postService.unfavoritePostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                            showSimpleToast();
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                            showSimpleToast();
                        }
                        init();
                    })
            } else {
                postService.favoritePostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                            showSimpleToast();
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                            showSimpleToast();
                        }
                        init();
                    })
            }
        }

        function clapPost(postId, clapped) {
            $scope.error = null;
            if (clapped) {
                postService.unclapPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            } else {
                postService.clapPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }
        }

        function retweetPost(postId, retweeted) {
            $scope.error = null;

            if (retweeted) {
                postService.unretweetPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            } else {
                postService.retweetPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }
        }

        function openSlideMenu() {
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu() {
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }

        function openWritePost() {
            document.getElementById("textpost").style.width = '78vw';
            document.getElementById('textpost').style.height = '20vw';
            document.getElementById('writepost').style.height = '76vw';
            document.getElementById('closepost').style.visibility = 'visible';
            document.getElementById('blackline').style.visibility = 'visible';
            document.getElementById('fbicon').style.visibility = 'visible';
            document.getElementById('twiticon').style.visibility = 'visible';
            document.getElementById('facecheck').style.visibility = 'visible';
            document.getElementById('twitcheck').style.visibility = 'visible';
            document.getElementById('sharebt').style.visibility = 'visible';
            document.getElementById('shpost').style.visibility = 'visible';
        }

        function closeWritePost() {
            document.getElementById("textpost").style.width = '78vw';
            document.getElementById('textpost').style.height = '10vw';
            document.getElementById('writepost').style.height = '28vw';
            document.getElementById('closepost').style.visibility = 'hidden';
            document.getElementById('blackline').style.visibility = 'hidden';
            document.getElementById('fbicon').style.visibility = 'hidden';
            document.getElementById('twiticon').style.visibility = 'hidden';
            document.getElementById('facecheck').style.visibility = 'hidden';
            document.getElementById('twitcheck').style.visibility = 'hidden';
            document.getElementById('sharebt').style.visibility = 'hidden';
            document.getElementById('shpost').style.visibility = 'hidden';
        }

    }

    function FilterController($location, userService, postService, filterService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;

        // to be used to send messages to selected acquaintances
        $scope.acquaintancesInYourArea = [];
        $scope.colorsInYourArea = [];

        $scope.plus = 1;
        $scope.plusdesc = "Select a petal to add a person to your dandelion";
        $scope.dandelion = undefined;

        $scope.sendmessage = "";
        $scope.sendnewmessage = "";
        $scope.messagelength = 280;

        // display most followers
        $scope.mostfollowers = 1;
        $scope.allfollowers = undefined;

        $scope.middle = 0;
        $scope.middleUser = {};

        $scope.xyz = 'xyz';

        $scope.displayMostFollowers = displayMostFollowers;
        $scope.displayLeastFollowers = displayLeastFollowers;
        $scope.displayGatewayFollowers = displayGatewayFollowers;
        $scope.displayMostActiveFollowers = displayMostActiveFollowers;
        $scope.displayLeastActiveFollowers = displayLeastActiveFollowers;
        $scope.displayMostInteractiveFollowers = displayMostInteractiveFollowers;
        $scope.displayAllFollowers = displayAllFollowers;
        $scope.displayAllActive = displayAllActive;
        $scope.displayMiddleUser = displayMiddleUser;
        $scope.filterError = filterError;
        $scope.openReach = openReach;
        $scope.openFeed = openFeed;
        $scope.openProfile = openProfile;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.clicked = clicked;
        $scope.onSelectAdd = onSelectAdd;

        $scope.onSwipeLeftMostFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = 1;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;

        };

        $scope.onSwipeRightMostFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = 1;

        };

        $scope.onSwipeLeftLeastFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = 1;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };


        $scope.onSwipeRightLeastFollowers = function (ev, target) {
            $scope.mostfollowers = 1;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftGatewayFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = 1;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeRightGatewayFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = 1;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftMostActiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = 1;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeRightMostActiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = 1;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftLeastActiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = 1;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeRightLeastActiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = 1;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftMostInteractiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = 1;
        };

        $scope.onSelectMessage = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = 1;
        };

        $scope.onSwipeRightMostInteractiveFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = 1;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftMessageFollowers = function (ev, target) {
            $scope.mostfollowers = 1;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeRightMessageFollowers = function (ev, target) {
            $scope.mostfollowers = undefined;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = 1;
            $scope.messagefollowers = undefined;
        };

        $scope.onSwipeLeftAllFollowers = function (ev, target) {
            if ($scope.middle < $scope.len){
                $scope.middle = $scope.middle + 1;
                filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                    .then(displayMiddleUser, filterError);
            }
        };

        $scope.onSwipeRightAllFollowers = function (ev, target) {
            if ($scope.middle > 0){
                $scope.middle = $scope.middle - 1;
                filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                    .then(displayMiddleUser, filterError);
            }

        };

        function init() {
            filterService.getMostFollowers($scope.userId, $scope.token)
                .then(displayMostFollowers, filterError);
            filterService.getLeastFollowers($scope.userId, $scope.token)
                .then(displayLeastFollowers, filterError);
            filterService.getGatewayFollowers($scope.userId, $scope.token)
                .then(displayGatewayFollowers, filterError);
            filterService.getMostActiveFollowers($scope.userId, $scope.token)
                .then(displayMostActiveFollowers, filterError);
            filterService.getLeastActiveFollowers($scope.userId, $scope.token)
                .then(displayLeastActiveFollowers, filterError);
            filterService.getMostInteractiveFollowers($scope.userId, $scope.token)
                .then(displayMostInteractiveFollowers, filterError);
            filterService.getAllFollowers($scope.userId, $scope.token)
                .then(displayAllFollowers, filterError);
        }

        init();

        function clicked() {
            var tags = "@" + $scope.acquaintancesInYourArea.join(" @") + " ";
            $scope.sendmessage = tags;
        }

        function onSelectAdd() {
            $scope.plus = undefined;
            $scope.plusdesc = "Go see your created dandelion";
            $scope.dandelion = 1;
            init();
        }

        $scope.backtofilter = function () {
            $scope.mostfollowers = 1;
            $scope.allfollowers = 1;
            $scope.leastfollowers = undefined;
            $scope.gatewayfollowers = undefined;
            $scope.mostactivefollowers = undefined;
            $scope.leastactivefollowers = undefined;
            $scope.mostinteractivefollowers = undefined;
            $scope.messagefollowers = undefined;
        };

        $scope.sendMessage = function () {
            var post = {
                text: $scope.sendmessage + $scope.sendnewmessage
            }
            postService.createPost(post, $scope.userId, $scope.token)
                .then(function (postResponse) {
                    if (postResponse) {
                        $scope.error = postResponse.message;
                        console.log($scope.error);
                        $scope.sendnewmessage = "";
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                        console.log($scope.error);
                    }
                    init();
                });
        }

        function displayMostFollowers(followerArrray) {
            $scope.acquaintancesMostFollowers = followerArrray.screennames;
            $scope.bridgesMostFollowers = followerArrray.followerlength;
            if ($scope.colorsMostFollowers === undefined) {
                $scope.colorsMostFollowers = Array.from(new Array(5), () => "red"
            )
                ;
            }
        }

        function displayLeastFollowers(followerArrray) {
            $scope.acquaintancesLeastFollowers = followerArrray.screennames;
            $scope.bridgesLeastFollowers = followerArrray.followerlength;
            if ($scope.colorsLeastFollowers === undefined) {
                $scope.colorsLeastFollowers = Array.from(new Array(5), () => "deepskyblue"
            )
                ;
            }
        }

        function displayGatewayFollowers(followerArrray) {
            $scope.acquaintancesGatewayFollowers = followerArrray.screennames;
            $scope.bridgesGatewayFollowers = followerArrray.followerlength;
            if ($scope.colorsGatewayFollowers === undefined) {
                $scope.colorsGatewayFollowers = Array.from(new Array(5), () => "royalblue"
            )
                ;
            }
        }

        function displayMostActiveFollowers(followerArrray) {
            $scope.acquaintancesMostactiveFollowers = followerArrray.screennames;
            $scope.bridgesMostactiveFollowers = followerArrray.followerlength;
            if ($scope.colorsMostactiveFollowers === undefined) {
                $scope.colorsMostactiveFollowers = Array.from(new Array(5), () => "orange"
            )
                ;
            }
        }

        function displayLeastActiveFollowers(followerArrray) {
            $scope.acquaintancesLeastactiveFollowers = followerArrray.screennames;
            $scope.bridgesLeastactiveFollowers = followerArrray.followerlength;
            if ($scope.colorsLeastactiveFollowers === undefined) {
                $scope.colorsLeastactiveFollowers = Array.from(new Array(5), () => "crimson"
            )
                ;
            }
        }

        function displayMostInteractiveFollowers(followerArrray) {
            $scope.acquaintancesMostInteractiveFollowers = followerArrray.screennames;
            $scope.bridgesMostInteractiveFollowers = followerArrray.followerlength;
            if ($scope.colorsMostInteractiveFollowers === undefined) {
                $scope.colorsMostInteractiveFollowers = Array.from(new Array(5), () => "gold"
            )
                ;
            }
        }

        function displayAllFollowers(followerArrray) {
            $scope.acquaintancesAllFollowers = followerArrray.screennames;
            $scope.bridgesAllFollowers = followerArrray.followerlength;
            $scope.allfollowers = followerArrray.screennames.length;

            $scope.len = $scope.acquaintancesAllFollowers.length;
            $scope.middle = 0;

            if ($scope.len % 2 === 0){
                $scope.middle = Math.floor(($scope.len - 1) / 2);
            }
            else{
                $scope.middle = Math.round(($scope.len - 1) / 2);
            }

            filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                .then(displayMiddleUser, filterError);

        }

        function displayMiddleUser(followerArrray) {
            $scope.middleUser = followerArrray.userdetails;
        }

        function displayAllActive(followerArrray) {
            $scope.acquaintancesAllFollowers = followerArrray.screennames;
            $scope.bridgesAllFollowers = followerArrray.followerlength;
            $scope.allfollowers = followerArrray.screennames.length
        }

        function filterError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openProfile() {
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function openReach() {
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed() {
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu() {
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu() {
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }

    }


    function AppConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'login.html'
            })
            .when('/user/:userId/:token', {
                templateUrl: 'profile.html'
            })
            .when('/register', {
                templateUrl: 'register.html'
            })
            .when('/filter/:userId/:token', {
                templateUrl: 'filters.html'
            })
            .when('/reach/:userId/:token', {
                templateUrl: 'myreach.html'
            })
            .when('/feed/:userId/:token', {
                templateUrl: 'feed.html'
            })
            .when('/filternew/:userId/:token', {
                templateUrl: 'filters_new.html'
            })
    }

})();