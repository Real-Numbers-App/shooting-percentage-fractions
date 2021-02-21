import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { data } from "../data/mock";

export const DragAndDrop = () => {
  const [playerData, setPlayerData] = useState();
  const [level, setLevel] = useState(1);
  const [currentRef, setCurrentRef] = useState();
  const ref = useRef();
  const [circleCoordinates, setCircleCoordinates] = useState();

  const [solutionArray, setSolutionArray] = useState([]);

  let tempSolutionArray = [];

  useEffect(() => {
    console.log(circleCoordinates)
  }, [circleCoordinates])
  
  useEffect(() => {
    setCurrentRef(ref.current);
  }, [ref]);

  const width = 1200;
  const height = 1200;
  const r = 30;
  const X = 100;
  const Y = 100;
  const rectSize = 300;
  const arc = d3.arc();

  useEffect(() => {
    const playersStatArray = data.stats.away.players.concat(data.stats.home.players);
    const topPlayerStatArray = playersStatArray.filter(item => item.playerStats[0].fieldGoals.fgAtt > 5);

    const groupPlayersByShootingPercentage = () => topPlayerStatArray.map(d => {
      const shootingPercentage = d.playerStats[0].fieldGoals.fgMade / d.playerStats[0].fieldGoals.fgAtt;
      if (shootingPercentage < 0.25) {
        return 1
      }
      if (shootingPercentage >= 0.25 && shootingPercentage < 0.5) {
        return 2
      }
      if (shootingPercentage >= 0.50 && shootingPercentage < 0.75) {
        return 3
      }
      if (shootingPercentage >= 0.75 && shootingPercentage <= 1) {
        return 4
      }
    })

    const arrayPlayers = topPlayerStatArray.map((d, i) => {
      return {
        player: d,
        circlePosition: {id: 1, x:X - r + (i * (r * 3)), y: (Y - r)},
        group: groupPlayersByShootingPercentage()[i],
        shootingPercentage: d.playerStats[0].fieldGoals.fgMade / d.playerStats[0].fieldGoals.fgAtt
      }
    })
    setPlayerData(arrayPlayers)
  }, [])

  const svg = d3.select(currentRef);
  svg.attr("viewBox", [0, 0, width*1.5 , height*1.5 ]);
  
  const drag = d3.drag()
    .on("start", startDragging)
    .on("drag", dragCircle)
    .on("end", endDragging);

  const rectGroup = svg.selectAll("rect")
    .data([0])
    .enter()
    .append("g")
    .classed('rect-group', true)
    .attr("opacity", 1)

  const rect = rectGroup.append("rect")
    .attr("x", 600)
    .attr("y", 200)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("rx", 6)
    .attr("class", "rect");

  const rect2 = rectGroup.append("rect")
    .attr("x", 600 + rectSize + 10)
    .attr("y", 200)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("rx", 6)
    .attr("class", "rect2");

  const rect3 = rectGroup.append("rect")
    .attr("x", 600)
    .attr("y", 200 + rectSize + 10)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("rx", 6)
    .attr("class", "rect3");

  const rect4 = rectGroup.append("rect")
    .attr("x", 600 + rectSize + 10)
    .attr("y", 200 + rectSize + 10)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("rx", 6)
    .attr("class", "rect4");

  rectGroup.append("text")
    .text(d => `x < 25%` )
    .attr("x", 600 + 10)
    .attr("y", 222)
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("class", "rect-text");

  rectGroup.append("text")
    .text(d => `25% <= x < 50%` )
    .attr("x", 910 + 10)
    .attr("y", 222)
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("class", "rect-text");

  rectGroup.append("text")
    .text(d => `50% <= x < 75%` )
    .attr("x", 600 + 10)
    .attr("y", 532)
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("class", "rect-text");

  rectGroup.append("text")
    .text(d => `x >= 75%` )
    .attr("x", 910 + 10)
    .attr("y", 532)
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("class", "rect-text");

  function updateRect(element, isDropTarget) {
    return d3.select(`.${element}`).classed("dropTarget", isDropTarget)
  }

  // Append Data
  const playerCircle = svg.selectAll("circle")
    .data(playerData)
      .enter()

  const circleGroup = playerCircle.append("g")
    .attr("class", "player")
    .attr("transform", d => `translate(${d.circlePosition.x + 250},${d.circlePosition.y})`)
    .call(drag);

  // Update drag logic
  useEffect(() => {
    svg.selectAll('.player').call(drag);
  }, [level])

  circleGroup
    .append("circle")
    .attr("r", r)
    .attr("fill", (_, i) => d3.interpolateWarm(i * 0.1 + 0.2))

  circleGroup.append("path")
    .attr("d", arc({
      innerRadius: r + 10,
      outerRadius: r + 15,
      startAngle: Math.PI + 2.09,
      endAngle: -Math.PI
    }))
    .attr("id", "textArc")
    .attr("fill", "none")
    .attr('stroke', "none")

  circleGroup.append("text")
    .attr("dx", Math.PI * r)
    .attr("font-size", "14px")
    .attr("fill", "white")
    .attr('text-anchor', 'middle')
    .append("textPath")
    .attr('href', '#textArc')
    .style("letter-spacing", 2)
    .text(d => `${d.player.player.firstName} ${d.player.player.lastName}`)
  
  circleGroup.append("text")
    .attr("dx", Math.PI * r)
    .attr("font-size", "14px")
    .attr("fill", "white")
    .attr('text-anchor', 'middle')
    .append("textPath")
    .attr('href', '#textArc')
    .style("letter-spacing", 2)
    .text(d => `${d.player.player.firstName} ${d.player.player.lastName}`)

  circleGroup.append("text")
    .attr("x", 0)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font-size", 20)
    .text(d => `${d.player.playerStats[0].fieldGoals.fgMade}/${d.player.playerStats[0].fieldGoals.fgAtt}`);

  function dragCircle(event) {
    const [x, y] = d3.pointer(event, svg.node());
    
    d3.select(this)
      .attr("transform", `translate(${x},${y})`);

    if (level === 1) {
      if (overDragTarget(rect, x, y)) {
        updateRect('rect', overDragTarget(rect, x, y));
        updateRect('rect2', false);
        updateRect('rect3', false);
        updateRect('rect4', false);
      }
      if (overDragTarget(rect2, x, y)) {
        updateRect('rect2', overDragTarget(rect2, x, y));
        updateRect('rect', false);
        updateRect('rect3', false);
        updateRect('rect4', false);
      }
      if (overDragTarget(rect3, x, y)) {
        updateRect('rect3', overDragTarget(rect3, x, y));
        updateRect('rect2', false);
        updateRect('rect', false);
        updateRect('rect4', false);
      }
      if (overDragTarget(rect4, x, y)) {
        updateRect('rect4', overDragTarget(rect4, x, y));
        updateRect('rect2', false);
        updateRect('rect3', false);
        updateRect('rect', false);
      }
      if (!overDragTarget(rect, x, y) && !overDragTarget(rect2, x, y) && !overDragTarget(rect3, x, y) && !overDragTarget(rect4, x, y)) {
        updateRect('rect', false);
        updateRect('rect2', false);
        updateRect('rect3', false);
        updateRect('rect4', false);
      }
    }

    if (level === 2) {
      // check if the position contains any circle bounds from the array
      // if yes, return that value
      // The value isn't enough, we need that specific element (emptyCircles)
      const circlePosition = getEmptyCirclePositionArray().filter(item => containsInCircle(item, {x:x, y:y}))[0]
      console.log(circlePosition)
      updateRect('empty-circle', true);

    }
  }

  function overDragTarget(rect, x, y) {
    const rectBounds = rect.node().getBBox();
    return contains(rectBounds, ({x:x, y:y}));
  }

  function overCircleTarget(circle, x,y) {
    const circleBounds = circle.node().getBBox(); // need circle group elements
    return containsInCircle(circleBounds, {x:x, y:y})
  }
  
  function startDragging(event) {
    const isDragging = true;
    d3.select(this)
      .classed("dragging", isDragging)
      .raise(); // SVG elements don't have a z-index so bring the circle to the top
  }
  
  function endDragging(event) {
    const [x, y] = d3.pointer(event, svg.node());
    const isDragging = false
    const circleGroup = d3.select(this)
      .classed("dragging", isDragging);

    const formatData = (min, max) => {
      const data = d3.select(this).data()[0];
      return {
        playerName: `${data.player.player.firstName} ${data.player.player.lastName}`,
        shootingPercentage: data.player.playerStats[0].fieldGoals.fgPct,
        correct: data.player.playerStats[0].fieldGoals.fgPct >= min && data.player.playerStats[0].fieldGoals.fgPct < max
      }
    }

    if (level === 1) {
      updateRect('rect3', false);
      updateRect('rect2', false);
      updateRect('rect', false);
      updateRect('rect4', false);

      console.log(tempSolutionArray)

      // If the circle is in a rectangle, push that value to a solution array
      if (overDragTarget(rect, x, y)) {    
        // This logic below is crazy. We shoudn't need to hold a temp value;
        const checkForCorrectAnswer = (min, max) => {
          if (tempSolutionArray.filter(item => item.playerName === formatData().playerName).length == 0) {
            tempSolutionArray.push(formatData(min,max));
          } else {
            const newArray = tempSolutionArray.map(item => {
              if (item.playerName == formatData(min,max).playerName) {
                return {
                  ...item,
                  correct: d3.select(this).data()[0].player.playerStats[0].fieldGoals.fgPct >= min && d3.select(this).data()[0].player.playerStats[0].fieldGoals.fgPct < max
                }
              } else {
                return item;
              }
            })
            tempSolutionArray = newArray;
          }
          setSolutionArray(tempSolutionArray)
        }

        if (overDragTarget(rect, x, y)) {
          checkForCorrectAnswer(0, 25)
        }
      }

      if (overDragTarget(rect2, x, y)) {    
        // This logic below is crazy. We shoudn't need to hold a temp value;
        const checkForCorrectAnswer = (min, max) => {
          if (tempSolutionArray.filter(item => item.playerName === formatData().playerName).length == 0) {
            tempSolutionArray.push(formatData(min,max));
          } else {
            const newArray = tempSolutionArray.map(item => {
              if (item.playerName == formatData(min,max).playerName) {
                return {
                  ...item,
                  correct: d3.select(this).data()[0].player.playerStats[0].fieldGoals.fgPct >= min && d3.select(this).data()[0].player.playerStats[0].fieldGoals.fgPct < max
                }
              } else {
                return item;
              }
            })
            tempSolutionArray = newArray;
          }
          setSolutionArray(tempSolutionArray)
        }

        if (overDragTarget(rect2, x, y)) {
          checkForCorrectAnswer(25, 50)
        }
      }
    }

    circleGroup.select("circle")
      .transition()
      .attr("r", r * 1.1)
      .transition()
      .attr("r", r);
  }

  function contains(rect, point) {
    return (
      point.x >= rect.x &&
      point.y >= rect.y &&
      point.x <= rect.x + rect.width &&
      point.y <= rect.y + rect.height
    );
  }

  // Part 2
  // Scale the range of the data

  function containsInCircle(circle, point) {
    return (
      point.x >= circle.x - r &&
      point.y >= circle.y - r &&
      point.x <= circle.x + r &&
      point.y <= circle.y + r
    );
  }

  const x = d3.scaleLinear().range([0, 1600]);
  x.domain([25, 50])

  function getEmptyCirclePositionArray() {
    let values = []
    return playerData.map(item => {
      const count = values.filter(x => x === item.shootingPercentage).length;
      values.push(item.shootingPercentage)
      return {x:x(item.shootingPercentage * 100) + 100, y:300 - count * 90}
    })
  }

  // Screen 2
  const organizeCirclesPt2 = () => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;

    // Remove rects
    svg.selectAll('.rect-group').transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .style("opacity", 0)

     // Remove text
    svg.selectAll('.rect-text').transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .style("opacity", 0)

    // Move players
    svg.selectAll(".player")
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("transform", (d, i) => {
        if (d.group === 1) {
          count1 = count1 + 1
          return `translate(${count1 * 100}, 100)`
        }
        if (d.group === 2) {
          count2 = count2 + 1
          return `translate(${count2 * 100}, 450)`
        }
        if (d.group === 3) {
          count3 = count3 + 1
          return `translate(${count3 * 100}, 700)`
        }
        if (d.group === 4) {
          count4 = count4 + 1
          return `translate(${count4 * 100}, 1000)`
        }
      })

      // Draw new Axis
      const numberLine = svg
        .append("g")
        .attr("class","number-line")
        .style("opacity", 0);

      numberLine
        .transition()
        .delay(2000)
        .duration(1000)
        .style("opacity", 1);

      const axis = numberLine.append("g").attr("class", "axis")

      // add the X Axis
      axis
        .append("g")
        .style("color", "#222")
        .attr("transform", "translate(100," + 350 + ")")
        .call(d3.axisBottom(x).ticks(25));

      const emptyCircles = axis.selectAll(".empty-circle")
        .data(playerData.filter(item => item.group === 2))
          .enter()

      let values = [];

      // Add empty circle on the numberline
      emptyCircles.append("circle")
        .attr("r", r)
        .attr("class", "empty-circle")
        .attr("transform", (d, i) => {
          const count = values.filter(x => x === d.shootingPercentage).length;
          values.push(d.shootingPercentage);
          return `translate(${x(d.shootingPercentage * 100) + 100}, ${300 - count * 90})`
        })
        .style("stroke", "white")
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("opacity", 0)

      emptyCircles.selectAll(".empty-circle")
        .transition()
        .delay((d, i) => 2800 + (i * 50))
        .duration(1000)
        .style("opacity", 1)
  }

  return (
    <div>
      <button onClick={() => {
        console.log(solutionArray)
        // setLevel(prev => prev + 1);
        // organizeCirclesPt2();
      }}>go to next</button>
      <svg ref={ref} />
    </div>
  );
};

