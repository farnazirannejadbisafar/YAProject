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
                    middle: '=',
                    maxFollower: '=',
                    minFollower: '=',
                    edit: '='
                },
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        try {
                            // drawDandelion(scope.acquaintances, scope.bridges, scope.colors,[]);
                            // drawConnections(scope.acquaintances, scope.bridges, scope.middle, scope.middleUser)
                            drawConnectionsPage(scope.acquaintances, scope.bridges, scope.middle, scope.middleUser,
                                scope.maxFollower, scope.minFollower, scope.edit)
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }, true);

                    function drawConnectionsPage(acquaintances, bridges, middle, middleUser, maxFollower, minFollower, edit) {
                        if (acquaintances !== undefined) {

                            var div_mid_fol = document.getElementById('middle-follower');
                            var div_mid_fol_edit = document.getElementById('middle-follower-edit');

                            if (edit) {
                                div_mid_fol_edit.style.display = "block";
                                div_mid_fol.style.display = "none";
                            } else {
                                div_mid_fol_edit.style.display = "none";
                                div_mid_fol.style.display = "block";
                            }

                            document.getElementById("mu-name").innerHTML = middleUser.name;
                            document.getElementById("mu-screen-name").innerHTML = "@" + middleUser.screen_name;

                            document.getElementById("mu-edit-name").innerHTML = middleUser.name;
                            document.getElementById("mu-edit-screen-name").innerHTML = "@" + middleUser.screen_name;
                            document.getElementById("mu-edit-followers").innerHTML = "Follower #: " + middleUser.followers_count;

                            if (middleUser.profile_image_url_https !== undefined) {
                                document.getElementById("mu-profile-pic").src = middleUser.profile_image_url_https;
                                document.getElementById("mu-edit-profile-pic").src = middleUser.profile_image_url_https;
                            }

                            // semi circle start
                            // var inYourArea2 = d3.select('#semi-circle');
                            // var insideSVG2 = inYourArea2.select("svg");
                            // insideSVG2.remove();
                            // var sc_width = document.getElementById('semi-circle').clientWidth;
                            // var sc_height = document.getElementById('semi-circle').clientHeight;
                            //
                            // var svg_semi_cirlce = d3.select("#semi-circle")
                            //     .append("svg")
                            //     .attr("width", sc_width)
                            //     .attr("height", sc_height)
                            //     .append("g")
                            //     .attr("transform", "translate(" + sc_width/2 + "," + 0 + ")");

                            // var arc = d3.arc()
                            //     .innerRadius(50)
                            //     .outerRadius(55)
                            //     .startAngle(0.5 * Math.PI)
                            //     .endAngle(1.5*Math.PI);
                            //
                            // svg_semi_cirlce.append("path")
                            //     .attr("class", "arc")
                            //     .attr("d", arc);

                            // semi circle end

                            // scatter plot start
                            var inYourArea = d3.select('#all-followers-scatterplot');
                            var insideSVG = inYourArea.select("svg");
                            insideSVG.remove();

                            var width_all_followers = document.getElementById('all-followers-scatterplot').clientWidth,
                                height_all_followers = document.getElementById('all-followers-scatterplot').clientHeight;

                            var color = d3.scaleLinear().domain([0,bridges.length])
                                .range(['#bae4dd', '#547e77']);

                            var svg_all_followers = d3.select('#all-followers-scatterplot').append("svg");

                            var color_list = [];
                            for(var i = 0; i < bridges.length; i++){
                                color_list[i] = color(i);
                            }

                            var eachSqWidth = width_all_followers/14;

                            var acquaintances_all_followers = acquaintances.reduce(function (r, a, i) {
                                if(i === 0){
                                    r[i] = [22, height_all_followers/2, bridges[i], color_list[i]];
                                }
                                else{
                                    r[i] = [eachSqWidth*i + 22, height_all_followers/2, bridges[i], color_list[i]];
                                }

                                return r;
                            }, []);

                            // set the ranges
                            var x_left = d3.scaleLinear().range([0, width_all_followers]);
                            var y_left = d3.scaleLinear().range([height_all_followers, 0]);

                            svg_all_followers.attr("width", width_all_followers)
                                .attr("height", height_all_followers)
                                .append("g")
                                .attr("transform",
                                    "translate(0,0)");

                            // Scale the range of the data
                            x_left.domain([0, width_all_followers]);
                            y_left.domain([0, height_all_followers]);

                            // Add the scatterplot
                            svg_all_followers.selectAll("dot")
                                .data(acquaintances_all_followers)
                                .enter().append("circle")
                                .attr('id', function(d){ return 'name' + d[2]; })
                                .style("fill", function(d, i) {
                                    if(i === middle){
                                        return "red";
                                    }
                                    else if(d[2] <= maxFollower && d[2] >= minFollower){
                                        return "green";
                                    }
                                    return d[3]
                                })
                                .attr("r", 10)
                                .attr("cx", function (d) {
                                    return x_left(d[0]);
                                })
                                .attr("cy", function (d) {
                                    return y_left(d[1]);
                                });
                        }
                    }

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

                            var left_width = document.getElementById('left-followers').clientWidth,
                                left_height = document.getElementById('left-followers').clientHeight,
                                right_width = document.getElementById('right-followers').clientWidth,
                                right_height = document.getElementById('right-followers').clientHeight;

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
                                if(i === 0){
                                    r[i] = [left_width/2, left_height-12, left_b[i], left_color[i]];
                                }
                                else{
                                    r[i] = [left_width/2, left_height/(i + 1), left_b[i], left_color[i]];
                                }

                                return r;
                            }, []);

                            var right_bridges = right_acquaintances.reduce(function (r, a, i) {
                                if(i === 0){
                                    r[i] = [right_width / 2, right_height-12, right_b[i], right_color[i]];
                                }
                                else {
                                    r[i] = [right_width / 2, right_height / (i + 1), right_b[i], right_color[i]];
                                }
                                return r;
                            }, []);

                            left_bridges.slice(0, left_bridges.length - 2);
                            right_bridges.slice(0, right_bridges.length - 2);

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
                            x_left.domain([0, left_width]);
                            y_left.domain([0, left_height]);

                            x_right.domain([0, right_width]);
                            y_right.domain([0, right_height]);

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

                            var area1 = d3.select('#follower-slider');
                            var insideSvg1 = area1.select("svg");
                            insideSvg1.remove();

                            var fs = document.getElementById('follower-slider');
                            while (fs.firstChild) {
                                fs.removeChild(fs.firstChild);
                            }

                            var slider_height = document.getElementById('follower-slider').clientHeight,
                                slider_width = document.getElementById('follower-slider').clientWidth;

                            var slider_svg = d3.select('#follower-slider').append("svg")
                                .attr('width', slider_width)
                                .attr('height', slider_height)
                                .attr("class", "slider")
                                .attr("transform", "translate(2,2)");

                            var slider_x = d3.scaleLinear()
                                .domain([0, 10])
                                .range([0, slider_width])
                                .clamp(true);

                            var xMin = slider_x(0),
                                xMax = slider_x(10);

                            slider_svg.append("line")
                                .attr("class", "track")
                                .attr("x1", 10+slider_x.range()[0])
                                .attr("x2", 10+slider_x.range()[1]);

                            var selRange = slider_svg.append("line")
                                .attr("class", "sel-range")
                                .attr("x1", 10+slider_x(bridges[0]))
                                .attr("x2", 10+slider_x(bridges[bridges.length - 1]));

                            slider_svg.insert("g", ".track-overlay")
                                .attr("class", "ticks")
                                .attr("transform", "translate(2,2)")
                                .selectAll("text")
                                .data(slider_x.ticks(10))
                                .enter().append("text")
                                .attr("x", slider_x)
                                .attr("text-anchor", "middle")
                                .style("font-weight", "bold")
                                .text(function(d) { return d; });

                            var handle = slider_svg.selectAll("rect")
                                .data([0, 1])
                                .enter().append("rect", ".track-overlay")
                                .attr("class", "handle")
                                .attr("y", -8)
                                .attr("x", function(d) { return slider_x(bridges[d]); })
                                .attr("rx", 3)
                                .attr("height", 16)
                                .attr("width", 20)
                                .call(
                                    d3.drag()
                                        .on("start", startDrag)
                                        .on("drag", sliderdrag)
                                        .on("end", endDrag)
                                );

                            function startDrag() {
                                d3.select(this).raise().classed("active", true);
                            }

                            function sliderdrag(d){
                                var x1=d3.event.x;
                                if(x1>xMax){
                                    x1=xMax
                                }else if(x1<xMin){
                                    x1=xMin
                                }
                                d3.select(this).attr("x", x1);
                                var x2=x(bridges[d==0?1:0]);
                                selRange
                                    .attr("x1", 10+x1)
                                    .attr("x2", 10+x2)
                            }

                            function endDrag(d){
                                var v=Math.round(x.invert(d3.event.x));
                                var elem=d3.select(this);
                                bridges[d] = v;
                                var v1=Math.min(bridges[0], bridges[bridges.length - 1]),
                                    v2=Math.max(bridges[0], bridges[bridges.length - 1]);
                                elem.classed("active", false)
                                    .attr("x", x(v));
                                selRange
                                    .attr("x1", 10+x(v1))
                                    .attr("x2", 10+x(v2));

                                for(var i = 0; i < bridges.length; i++) {
                                    if(bridges[i] >= v1 && bridges[i] <= v2){
                                        d3.selectAll('#name' + bridges[i])
                                            .transition()
                                            .attr("r", 20);
                                    }
                                    else{
                                        d3.selectAll('#name' + bridges[i])
                                            .transition()
                                            .attr("r", 10);
                                    }
                                }
                            }

                            //     var follower_slider = createD3RangeSlider(bridges[0],bridges[bridges.length - 1],"#follower-slider");
                            //
                            //     follower_slider.onChange(changeRed);
                            //
                            //     function changeRed(h) {
                            //         document.getElementById('range-label').innerText = h.begin + "-" + h.end;
                            //
                            //         for(var i = 0; i < bridges.length; i++) {
                            //            if(bridges[i] >= h.begin && bridges[i] <= h.end){
                            //                d3.selectAll('#name' + bridges[i])
                            //                    .transition()
                            //                    .attr("r", 20);
                            //            }
                            //            else{
                            //                d3.selectAll('#name' + bridges[i])
                            //                    .transition()
                            //                    .attr("r", 10);
                            //            }
                            //         }
                            //     }
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
        $scope.allfollowers = 1;
        $scope.allActive = undefined;
        $scope.allinteractive = undefined;

        $scope.middle = 0;
        $scope.middleUser = {};

        $scope.middleActive = 0;
        $scope.middleActiveUser = {};

        $scope.middleInteractive = 0;
        $scope.middleInteractiveUser = {};

        $scope.maxFollower = 0;
        $scope.mminFollower = 0;

        $scope.pagename = 'All Followers';

        $scope.editMiddleFollower = 0;

        $scope.disabledFollowers = [];

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

        $scope.onSwipeLeftAllFollowers = function (ev) {
            if ($scope.middle < $scope.len){
                $scope.middle = $scope.middle + 1;
                filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                    .then(displayMiddleUser, filterError);
            }
        };

        $scope.onSwipeRightAllFollowers = function (ev) {
            if ($scope.middle > 0){
                $scope.middle = $scope.middle - 1;
                filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                    .then(displayMiddleUser, filterError);
            }
        };

        $scope.onSwipeLeftAllActive = function (ev, target) {
            if ($scope.middleActive < $scope.lenActive){
                $scope.middleActive = $scope.middleActive + 1;
                filterService.getMiddleActive($scope.userId, $scope.middleActive, $scope.token)
                    .then(displayMiddleActive, filterError);
            }
        };

        $scope.onSwipeRightAllActive = function (ev, target) {
            if ($scope.middleActive > 0){
                $scope.middleActive = $scope.middleActive - 1;
                filterService.getMiddleActive($scope.userId, $scope.middleActive, $scope.token)
                    .then(displayMiddleActive, filterError);
            }
        };

        $scope.onSwipeLeftAllInteractive = function (ev, target) {
            if ($scope.middleInteractive < $scope.lenInteractive){
                $scope.middleActive = $scope.middleActive + 1;
                filterService.getMiddleInteractive($scope.userId, $scope.middleActive, $scope.token)
                    .then(displayMiddleInteractive, filterError);
            }
        };

        $scope.onSwipeRightAllInteractive = function (ev, target) {
            if ($scope.middleInteractive > 0){
                $scope.middleInteractive = $scope.middleInteractive - 1;
                filterService.getMiddleInteractive($scope.userId, $scope.middleInteractive, $scope.token)
                    .then(displayMiddleInteractive, filterError);
            }
        };

        $scope.onLeftBtnAllFollowers = function (ev) {
            $scope.allActive = 1;
            $scope.allfollowers = undefined;
            $scope.allinteractive = undefined;
            $scope.pagename = 'All Active';
        };

        $scope.onRightBtnAllFollowers = function (ev) {
            $scope.allActive = undefined;
            $scope.allfollowers = undefined;
            $scope.allinteractive = 1;
            $scope.pagename = 'All Interactive';
        };

        $scope.onLeftBtnAllActive = function (ev, target) {
            $scope.allActive = undefined;
            $scope.allfollowers = undefined;
            $scope.allinteractive = 1;
            $scope.pagename = 'All Interactive';
        };

        $scope.onRightBtnAllActive = function (ev, target) {
            $scope.allActive = undefined;
            $scope.allfollowers = 1;
            $scope.allinteractive = undefined;
            $scope.pagename = 'All Followers';
        };

        $scope.onLeftBtnAllActive = function (ev, target) {
            $scope.allActive = undefined;
            $scope.allfollowers = undefined;
            $scope.allinteractive = 1;
            $scope.pagename = 'All Interactive';
        };

        $scope.onRightBtnAllActive = function (ev, target) {
            $scope.allActive = undefined;
            $scope.allfollowers = 1;
            $scope.allinteractive = undefined;
            $scope.pagename = 'All Followers';
        };

        $scope.onLeftBtnAllInteractive = function (ev, target) {
            $scope.allActive = undefined;
            $scope.allfollowers = 1;
            $scope.allinteractive = undefined;
            $scope.pagename = 'All Followers';
        };

        $scope.onRightBtnAllInteractive = function (ev, target) {
            $scope.allActive = 1;
            $scope.allfollowers = undefined;
            $scope.allinteractive = undefined;
            $scope.pagename = 'All Active';
        };

        $scope.onFollowerImageClick = function () {
            if(!$scope.editMiddleFollower){
                $scope.editMiddleFollower = 1;
            }
        };

        $scope.addFollower = function () {
            var len = $scope.bridgesAllFollowers.length;
            var x_pos = 0;
            var y_pos = 76;
            for(var i = 0; i < len; i++){
                if($scope.bridgesAllFollowers[i] >= $scope.minFollower
                    && $scope.bridgesAllFollowers[i] <= $scope.maxFollower){
                    $scope.disabledFollowers.push($scope.allfollowers[i])
                    var bsc = document.getElementById('semi-circle');
                    var dot = document.createElement('span');
                    dot.id = "new" + $scope.bridgesAllFollowers[i];
                    dot.classList.add("grey-dot");
                    // dot.style.webkitTransform = "rotate(-2deg)";
                    dot.style.left = x_pos+'px';
                    dot.style.top = y_pos+'px';
                    bsc.appendChild(dot);
                    x_pos = x_pos + 15;
                    y_pos = y_pos + 15;
                }
            }
        };

        $scope.closeEdit = function () {
            if($scope.editMiddleFollower){
                $scope.editMiddleFollower = 0;
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

            filterService.getMiddleFollower($scope.userId, $scope.middle, $scope.token)
                .then(displayMiddleUser, filterError);

        }

        function displayMiddleUser(followerArrray) {
            $scope.middleUser = followerArrray.userdetails;
            $scope.maxFollower = $scope.middleUser.followers_count;
            $scope.minFollower = $scope.middleUser.followers_count;
        }

        function displayAllActive(followerArrray) {
            $scope.acquaintancesAllFollowers = followerArrray.screennames;
            $scope.bridgesAllFollowers = followerArrray.followerlength;
            $scope.allActive = followerArrray.screennames.length
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