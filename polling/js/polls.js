var original = [
    {"pid": "reds", "naam": "Reds", "score": 31.9, "cumul": 31.9,"color": "#d83a1f"},
    {"pid": "purs", "naam": "Purples", "score": 20.5, "cumul": 52.4,"color": "#763977"},
    {"pid": "ble", "naam": "Blues", "score": 14.2, "cumul": 66.6, "color": "#0077b2"},
    {"pid": "gre", "naam": "Greens", "score": 14, "cumul": 80.6, "color": "#66ae3d"},
    {"pid": "amb", "naam": "Yellows", "score": 8.7, "cumul": 89.3,"color": "#ffcb04"},
    {"pid": "bru", "naam": "Browns", "score": 5.9, "cumul": 95.2, "color": "#dd8527"},
    {"pid": "bgr", "naam": "Extremes", "score": 2.5, "cumul": 97.7, "color": "#0f3468"},
    {"pid": "gre", "naam": "Other", "score": 2.3, "cumul": 100, "color": "#6d6e70"},
];

// var withCount = original.map(function(p) {
//   return _.extend({}, p, { count: _.random(0, 1000) });
// });
// var totalCount = _.sumBy(withCount, 'count');
// var withScore = withCount.map(function(p, index) {
//   return _.extend({}, p, {
//     score: Math.round(100 * p.count / totalCount)
//   });
// });
// var partijen = withScore.map(function(p, index) {
//   var cumul = _.sumBy(withScore.slice(0, index), 'score');
//   return _.extend({}, p, {
//     cumul: cumul
//   });
// });
var partijen = original;


var width = document.getElementById("vis").clientWidth;
var height = document.getElementById("vis").clientHeight;
var textposition = height - 90;
var svg = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height);

var finale = d3.select("#finale")
                //.style("width", width/2 + "px")
                .style("height", height + "px");

  var partijscores = [0,0,0,0,0,0,0,0];
  var diffperc = [0,0,0,0,0,0,0,0];
  var electionscores = partijen.map(function(party) {return party.score; });
  
  var xScale = d3.scale.linear().domain([0,100]).range([0,width]);

  var countertext = svg.append("text")
    .attr("x", width*0.75)
    .attr("y", height/4 + 50)
    .attr("id", "countertext")
    .text("0")
    .style("fill", "#ccc")
    .style("font-size", 72)
    .style("opacity", 1)
    .style("visibility", "hidden");

    //Initialize function for the circles
    function circlesinit(number,color,pid,cumul,score) {
    var data = [];
    var i;
      for (i = 0; i < number; i ++) {
        var datum = {};
        datum.color = color;
        datum.cumul = cumul;
        datum.score = score;
        data.push(datum);
      };

      var circle = svg.selectAll("circle.party")
        .data(data)
        .enter()
        .append("circle")
        .attr("r",0)
          .attr("cy", function (d) {return height*Math.random();})
      .attr("cx", function (d) {return width *Math.random();})
          .style("fill", "#ccc")
      .style("opacity", 1)
      .attr("class", pid);
    circle.transition()
      .delay(function(d,i) {return i*10 })
      .duration(2000)
      .attr("r", function(d) { return 2 + Math.random()*10; });
      };

  //Call the initialize function for the circles
  for (j = 0; j < partijen.length ; j++) {
    circlesinit(partijen[j].score*10, partijen[j].color, partijen[j].id, partijen[j].cumul, partijen[j].score);
  }
    
    var stepcount = d3.selectAll(".step").size() - 1;
    //progressbar
    var progress = d3.select("#left").append("div")
        .style("height", 0 + "px")
        .attr("id", "progress");

    //navigation of the steps
    var activestep = 0;
    //all text starts at the bottom
    d3.selectAll(".step, #finale").style("top", (2*textposition) + "px");
    
    //make first step visible and put on top, second step peaks at the bottom
    var header = d3.select("#step0").style("visibility", "visible").style("top", "0px");
    var nextstep = d3.select("#step1").style("visibility", "visible").style("opacity", 0.2).style("top", textposition + "px");
    
    d3.selectAll("button.next").on("click", function() {
        var currstep = "#step" + activestep;
        var nextstep = "#step" + (activestep + 1);
        var secnextstep = "#step" + (activestep + 2);
        
        ga('send', 'event', {
            'eventCategory': 'next',
            'eventAction': nextstep
        });
        
        d3.select(currstep).transition().duration(2000).style("top", -textposition + "px").style("opacity", 0);
        d3.select(nextstep).style("visibility", "visible").transition().duration(2000).style("top", "0px").style("opacity", 1);
        // d3.select(nextstep).selectAll('.feedback').style('opacity', 0);
        //show teaser if there is enough space
        var stepheight = d3.select(nextstep).node().getBoundingClientRect().height;

        if (height - stepheight > 100) {
            d3.select(secnextstep).transition().duration(2000)
                .style("visibility", "visible")
                .style("opacity", 0.2)
                .style("top", textposition + "px");
        }
        
        activestep = activestep + 1;
        d3.select("#progress").transition().duration(2000).style("height", (activestep)*height/stepcount + "px");
    });

    d3.selectAll("button.final").on("click", function() {
        var laststep = "#step" + stepcount;
        d3.select(laststep).transition().duration(2000).style("top", -textposition + "px").style("opacity", 0);
        finale.transition().duration(2000).style("top", "0px");
    });
    
  d3.select("button#showcolor").on("click", function() {
    d3.select('#showcolor').text('Pretending...');
    fadeToDisabled('#showcolor');

    var circles = d3.selectAll("circle");
    d3.selectAll("circle").transition()
      .duration(2000)
      .style("fill", function (d) {return d.color; });
    d3.selectAll(".feedback1").transition().delay(2000).duration(1000).style("opacity", 1);
  });

  function fadeToDisabled(selector) {
    d3.selectAll(selector).transition().duration(1000).style("opacity", 0.1);
  }
  function fadeColor() {
    d3.selectAll("circle").transition()
      .duration(2000)
      .style("fill", '#ccc');
  }

  function doSort() {
    var sep = 10;
    var circles = d3.selectAll("circle").transition()
      .duration(2000)
      .delay(function(d,i) {return i*2 })
      .attr("cx", function(d) {return xScale(d.cumul - Math.random()*(d.score)) ; });
    d3.selectAll(".feedback2").transition().delay(4000).duration(1000).style("opacity", 1);
  }
  d3.select("button#sort").on("click", doSort);

  function doLineup() {
    var circles = d3.selectAll("circle").transition()
      .duration(2000)
      .delay(function(d,i) {return i*2 })
      .attr("cy", height*0.8)
      .attr("r", 4)
    barchart();
    d3.selectAll(".feedback3").transition().delay(3000).duration(1000).style("opacity", 1);
  }
  d3.select("button#lineup").on("click", doLineup);
  
  d3.select("button#reveal").on("click", function() {
    doLineup();
    d3.selectAll('#firstpoll').duration(1000).style('opacity', 0.1);
  });

  function again() {
    doMoveUp();
  }

    function doMoveUp() {
        var circles = d3.selectAll("circle").transition()
            .duration(2000)
            .attr("cy", function(d) {return height*0.2*Math.random(); })
            .attr("cx", function(d) {return width*Math.random(); })
            .attr("r", function(d) { return 2 + Math.random()*10; })
            .style("fill", "#ccc")
            .style("opacity", 0.5);
        d3.selectAll("rect.election").transition().duration(2000).attr("y", 0.9*height);
        d3.selectAll("text.electionresult").transition().duration(2000).attr("y", 0.9*height + 40);
        d3.selectAll("text.partyname").transition().duration(2000).attr("y", 0.9*height).style("opacity", 0);
        d3.selectAll(".feedback4").transition().delay(2000).duration(1000).style("opacity", 1);
    }
    d3.select("button#moveup").on("click", doMoveUp);

    d3.select("button#firstpoll").on("click", function() {
        doMoveUp();
        choice(1,false);
        var currcount = d3.select("#countertext").text();
        if ( currcount == 1) {
            d3.select("button#lazybutton1").transition().delay(1000).duration(2000).style("opacity", 1);
        }
    });

  function barchart() {
    var rects = svg.selectAll("rect.election")
      .data(partijen)
      .enter()
      .append("rect")
      .attr("class", "election")
      .attr("x", function(d) { return xScale(d.cumul - d.score);})
      .attr("y", height*0.8-10)
      .attr("height", 20)
      .attr("width", function(d) { return xScale(d.score); })
      .style("fill", function(d) { return d.color; })
      .style("opacity", 0);
    rects.transition().delay(function(d,i) {return i*500 ; }).duration(2000).style("opacity", 1);

    var electionresults = svg.selectAll("text.electionresult")
        .data(partijen.slice(0,7))
        .enter()
        .append("text")
        .attr("x", function(d,i) {return xScale(d.cumul - d.score/2); })
        .attr("y", height*0.8 - 15)
        .style("fill", function(d) { return d.color; })
        .style("font-size", 16)
        .style("opacity", 0)
        .text(function(d) {return d.score ;})
        .attr("id", function(d,i) {return "aantal" + i; })
        .attr("class", "electionresult")
        .attr("text-anchor", "middle");
    electionresults.transition().delay(function(d,i) {return i*500 ; }).duration(1000).style("opacity", 0.8);

    //party names
      var partynames = svg.selectAll("text.partyname")
        .data(partijen.slice(0,5))
        .enter()
        .append("text")
        .attr("x", function(d,i) {return xScale(d.cumul - d.score/2); })
        .attr("y", height*0.8 + 40)
        .style("fill", function(d) { return d.color; })
        .style("font-size", 16)
        .style("opacity", 0)
        .text(function(d) {return d.naam ;})
        //.attr("id", function(d,i) {return "aantal" + i; })
        .attr("class", "partyname")
        .attr("text-anchor", "middle");
    partynames.transition().delay(function(d,i) {return i*500 ; }).duration(1000).style("opacity", 0.8);
  }

    //initialize elements for containing the poll results
    svg.selectAll("rect.poll")
      .data(partijen)
      .enter()
      .append("rect")
      .attr("class", "poll")
      .attr("x", 0)
      .attr("y", height*0.9 - 40)
      .attr("height", 20)
      .attr("width", 0)
      .style("fill", function(d) { return d.color; });

    svg.selectAll("text.polltext")
      .data(partijen)
      .enter()
      .append("text")
      .attr("class", "polltext")
      .attr("text-anchor", "middle")
      .style("font-size", 16)
      .attr("x", 0)
      .attr("y", height*0.9 - 60)
      .style("fill", function(d) { return d.color; })
      .style("opacity", 0)
      .text("");

    //difference bar chart
    svg.selectAll("rect.diff")
      .data(partijen)
      .enter()
      .append("rect")
      .attr("class", "diff")
      .attr("x", width/2)
      .attr("y", function(d,i) {return i*24 + height/4; })
      .attr("height", 20)
      .attr("width", 0)
      .style("opacity", 0)
      .style("fill", function(d) { return d.color; });

    svg.selectAll("text.difftext")
      .data(partijen)
      .enter()
      .append("text")
      .attr("class", "difftext")
      .attr("text-anchor", "middle")
      .style("font-size", 16)
      .attr("x", 0)
      .attr("y", function(d,i) { return i*24 + height/4 + 16})
      .style("fill", function(d) { return d.color; })
      .style("opacity", 0)
      .text("");

      //grid of difference bar charts
    for ( x = 0; x < 4; x++) {
      for (y = 0; y < 2; y++) {
    svg.selectAll("rect.diffgrid")
      .data(partijen)
      .enter()
      .append("rect")
      .attr("class", "gridbar diff" + x + y)
      .attr("x", 80 + x * width/4)
      .attr("y", function(d,i) {return 100 + i*24 + 300*y; })
      .attr("height", 20)
      .attr("width", 0)
      .style("opacity", 1)
      .style("fill", function(d) { return d.color; });

    svg.selectAll("text.diffgrid")
      .data(partijen)
      .enter()
      .append("text")
      .attr("class", "difftext" + x + y)
      .attr("text-anchor", "middle")
      .style("font-size", 18)
      .attr("x", 0)
      .attr("y", function(d,i) { return 100 + i*24 + 300*y + 15})
      .style("fill", function(d) { return d.color; })
      .style("opacity", 0)
      .text("0");
      }
    }

  var bisect = d3.bisector(function(d) {return d.cumul; }).left;

  var totalcount = 0;
  function choice(numbers, fillup) {
        var currentcount = d3.select("#countertext").text();
        ga('send', 'event', {
            'eventCategory': 'poll',
            'eventAction': numbers,
            'eventLabel': fillup,
            'eventValue': currentcount
        });
    var currentcount = d3.select("#countertext").text();
        var toadd;
        if (fillup == true) {
            toadd = numbers - currentcount;
        }
        else {
            toadd = numbers;
        }
        
        var rate;
        if (toadd < 5 ) { rate = 2000; }
        else if (toadd < 10) { rate = 200 }
        else if (toadd < 100) { rate = 50 }
        else { rate = 10; }

    var bisect = d3.bisector(function(d) {return d.cumul; }).left;

    //random datagenarator
    var randdata = [];
    for (i = 0; i < toadd ; i++) {
      var partijindex = bisect(partijen, Math.random()*100);
        var datum = {};
        datum.color = partijen[partijindex].color;
        datum.cumul = partijen[partijindex].cumul;
        datum.score = partijen[partijindex].score;
        datum.partijind = partijindex;
        randdata.push(datum);
      };

      svg.selectAll("circle.new")
        .data(randdata)
        .enter()
        .append("circle")
        .attr("class", "new")
        .attr("r",0)
        .attr("cx", function() { return width*Math.random(); })
        .attr("cy", function() { return height*0.2*Math.random(); })
        .style("fill", function(d) {return d.color; })
        .style("opacity", 1)
        .call(interpoly, 1500, function(d,i) { return i*rate})
      .call(interpolx, 1500, function(d,i) { return i*rate})
      .call(interpolr, 1500, function(d,i) { return i*rate});
  };

  //animation functions
  function update(partyindex) {
    //update counter
    totalcount = totalcount + 1;

    d3.select("#countertext").style("visibility", "visible");
    d3.select("#countertext").text(totalcount);

    //update poll scores
    partijscores[partyindex.partijind] = partijscores[partyindex.partijind] + 1;
    scoresperc = partijscores.map(function(score) {return Math.round(score/totalcount*1000)/10 ; });
    
    diffperc.forEach(function(element, index, array) {
      diffperc[index] = scoresperc[index] - electionscores[index];
    });

    if (totalcount > 9) {
      d3.selectAll(".feedback5").transition().duration(500).style("opacity", 1);
    }

    if (totalcount > 99) {
      d3.selectAll(".feedback7").transition().duration(500).style("opacity", 1);
    }

    if (totalcount > 999) {
      var absdiff = diffperc.map(Math.abs);
      var max = d3.max(absdiff);
      var partymax = partijen[absdiff.indexOf(max)].naam;
      var partycolor = partijen[absdiff.indexOf(max)].color;
      d3.select("#diffmax").text(Math.round(max*10)/10 + " %").style("color", partycolor);
      d3.select("#partijmax").text(partymax).style("color", partycolor);
      d3.selectAll(".feedback8").transition().duration(500).style("opacity", 1);
    }

    //update diff barchart
    d3.selectAll("rect.diff")
      .data(diffperc).transition().duration(50)
      .attr("x", function(d,i) {
          if (d < 0) {
            return width/2 - Math.abs(xScale(d));
          }
          else { return width/2;}
        })
      .attr("width", function(d) {return Math.abs(xScale(d)); });

    //update difftext
    d3.selectAll(".difftext")
      .data(diffperc).transition().duration(200)
      .attr("x", function(d,i) {
          if(d > 0) {
            return width/2 + xScale(d) + 2;
          }
          else {return width/2 + xScale(d) - 2; }
        })
      .attr("text-anchor", function(d) { 
        if (d > 0) {
          return "start" ;
        }
        else {
        return "end" ; 
        }
      })
      .text(function(d,i) { 
        if (d > 0) {
          return "+" + Math.round(d*10,1)/10 ;
        }
        else {
        return Math.round(d*10,1)/10 ; 
        }
      });

    //update poll barchart
    d3.selectAll("rect.poll")
      .data(scoresperc).transition().duration(200)
      .attr("x", function(d,i) { 
        if (i > 0) {
          return xScale(scoresperc.slice(0,i).reduce(function(previousValue, currentValue, index, array) {
              return previousValue + currentValue;
          })
        )}
      })
      .attr("width", function(d) {return xScale(d); });

    //update poll results
    d3.selectAll(".polltext")
      .data(scoresperc).transition().duration(200)
      .attr("x", function(d,i) {
        if (i > 0) {
          return xScale(scoresperc.slice(0,i).reduce(function(previousValue, currentValue, index, array) {
              return previousValue + currentValue;
            }) + d/2
          )}
        else { return xScale(d/2); }
        })
      .text(function(d,i) { return d ; })
      .style("opacity", function(d) {
        if (d > 0) { return 0.8; }
        else { return 0; }
      });
  }

  function showdiff() {
    d3.selectAll("rect.diff, .difftext, .feedback6").transition().duration(2000).style("opacity", 1);
  }

  function reset() {
    partijscores = [0,0,0,0,0,0,0,0];
    diffperc = [0,0,0,0,0,0,0,0];
    totalcount = 0;

    d3.select("#countertext").text("");
    d3.selectAll("rect.diff, rect.election").transition().duration(1000).attr("width",0);
    d3.selectAll("text.difftext, text.partyname, text.electionresult").text("");
    d3.selectAll("rect.poll").transition().duration(1000).attr("width",0);
    d3.selectAll("text.polltext").text("");
    d3.selectAll("circle").transition()
      .duration(2000)
      .attr("cy", function (d) {return height*Math.random();})
      .attr("cx", function (d) {return width *Math.random();})
      .style("opacity", 0.2);
  }

  var pollindex = 0;
    var completedpolls = 0;
  d3.selectAll(".pollgenerator").on("click", function() {generatepoll(pollindex); });

  function generatepoll(pollind) {
    if (pollindex == 0) {
      reset();
    }

    var xind,
      yind;
    if (pollind < 4 ) {
      xind = pollind;
      yind = 0;
    }
    else {
      xind = pollind - 4; 
      yind = 1;
    }
    pollindex = pollindex + 1;

    var polldata = [0,0,0,0,0,0,0,0];
    var pollperc = [0,0,0,0,0,0,0,0];
    var polldiff = [0,0,0,0,0,0,0,0];
    var pollcounter = 0;
    var rectsel = "rect.diff" + xind + yind;
    var textsel = ".difftext" + xind + yind;

    var anim = setInterval(function() { 
            animatepoll(1000);
        },1);

    function animatepoll(pollsize) {
      if (pollcounter == pollsize) {
                clearInterval(anim);
                completedpolls = completedpolls + 1;
                if (completedpolls == 8) {
               d3.selectAll(".feedback10").transition().duration(1000).style("opacity", 1);
            }
            }
      pollcounter = pollcounter + 1;
      //random number, bisect to partyindex
      var partijindex = bisect(partijen, Math.random()*100);

      //add to polldata
      polldata[partijindex] = polldata[partijindex] + 1;
      
      //calculate difference with electionresult
      pollperc = polldata.map(function(score) {return Math.round(score/pollcounter*1000)/10 ; });
      pollperc.forEach(function(element, index, array) {
        pollperc[index] = Math.round((pollperc[index] - electionscores[index])*100)/100;
      });
      d3.selectAll(rectsel)
          .data(pollperc).transition().duration(20)
          .attr("width", function(d) {return xScale(Math.abs(d)); } )
          .attr("x", function(d,i) {
            if (d < 0) {
              return 80  + xind*(width/4) - Math.abs(xScale(d));
            }
            else { return 80 + xind*(width/4) ;}
          });
      d3.selectAll(textsel)
        .data(pollperc).transition().duration(20)
        .attr("x", function(d,i) {
          if(d > 0) {
            return 80 + xind*(width/4) + xScale(d) + 2;
          }
          else {return 80 + xind*(width/4) + xScale(d) - 2; }
        })
        .attr("text-anchor", function(d) { 
          if (d > 0) {
            return "start" ;
            }
          else {
            return "end" ; 
            }
          })
        .text(function(d,i) { 
          if (d > 0) {
            return "+" + Math.round(d*10,1)/10 ;
          }
          else {
          return Math.round(d*10,1)/10 ; 
          }
        })
        .style("opacity", function(d) {
          if (pollcounter > 100) {
            return 1;
          }
          else {
            return 0;
          }
        });
      }
    }

  function sortbars(){
    var griddata = d3.selectAll(".gridbar").data();
    var zeroes = griddata.filter(function(value) { return value == 0 }).length;
    var twos = griddata.filter(function(value) { return value > 2 || value < - 2 }).length;
        
    var max = d3.max(griddata.map(Math.abs));
    d3.select("#zeroes").text(zeroes);
    d3.select("#twos").text(twos);
    d3.select("#maxdev").text(max);

    d3.selectAll(".feedback11").transition().delay(2000).duration(1000).style("opacity", 1);

    for ( x = 0; x < 4; x++) {
      for (y = 0; y < 2; y++) {
        //Move the bars
        d3.selectAll(".diff" + x + y)
          .transition()
          .duration(2000)
          .attr("x", function(d,i) {
            if (i < 4) {
              if (d > 0) {
                return 80 + (width/4)*i;
              }
              else {
                return 80 + (width/4)*i - xScale(Math.abs(d));
              }
            }
            else {
              if (d > 0) {
                return 80 + (width/4)*(i - 4);
              }
              else {
                return 80 + (width/4)*(i - 4) - xScale(Math.abs(d));
              }
            }
          })
          .attr("y", function(d,i) {
            //bovenste bars van bovenste rij
            if (i < 4 && y < 1) {
              return 100 + 24*x; 
            }
            //onderste bars van bovenste rij
            else if (i > 3 && y < 1) {
              return 100 + 24*x + 300;
            }
            //bovenste bars van onderste rij
            else if (i < 4 && y > 0 ) {
              return 100 + 24*(x + 4);
            }
            //onderste bars van onderste rij
            else {
              return 100 + 24*(x + 4) + 300;
            }
          });

          //Move the text
          d3.selectAll(".difftext" + x + y)
          .transition()
          .duration(2000)
          .attr("x", function(d,i) {
            if (i < 4) {
              if (d > 0) {
                return 80 + (width/4)*i + xScale(d) + 2;
              }
              else {
                return 80 + (width/4)*i - xScale(Math.abs(d)) - 2;
              }
            }
            else {
              if (d > 0) {
                return 80 + (width/4)*(i - 4) + xScale(d) + 2;
              }
              else {
                return 80 + (width/4)*(i - 4) - xScale(Math.abs(d)) - 2;
              }
            }
          })
          .attr("y", function(d,i) {
            //bovenste bars van bovenste rij
            if (i < 4 && y < 1) {
              return 100 + 24*x + 15; 
            }
            //onderste bars van bovenste rij
            else if (i > 3 && y < 1) {
              return 100 + 24*x + 300 + 15;
            }
            //bovenste bars van onderste rij
            else if (i < 4 && y > 0 ) {
              return 100 + 24*(x + 4) + 15;
            }
            //onderste bars van onderste rij
            else {
              return 100 + 24*(x + 4) + 300 + 15;
            }
          });
      }
    }
  }
  

  function interpolx(circle, duration, delay) {
      circle.transition("interpolx")
    .ease("sin")
    .delay(delay)
        .duration(duration)
        .each("end", update)
        .attrTween("cx", function tween(d, i, a) {
          return d3.interpolate(a, xScale(d.cumul - d.score*Math.random()));
          })
        .remove();
   }
    
    function interpoly(circle, duration, delay) {
      circle.transition("interpoly")
    .ease("back")
    .delay(delay)
        .duration(duration)
        .attrTween("cy", function tween(d, i, a) {
          return d3.interpolate(a, height*0.8 + 30);
          })
  }

   function interpolr(circle, duration, delay) {
      circle.transition("interpolr")
    .delay(delay)
        .duration(duration)
        .attrTween("r", function tween(d, i, a) {
          return d3.interpolate(a, 10);
          })
  }