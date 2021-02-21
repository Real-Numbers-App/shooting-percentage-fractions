import React from "react";
import * as d3 from "d3";

export const Clock = () => {

  let now;

  d3.interval(() => {
    now = d3.now();
  }, 1000)

  // const 
  return (
    <svg width="240" height="240" viewBox="50 50 500 500" style={{maxWidth:'100%', height: 'auto'}}>
      <g transform="translate(300,300)">
        <circle id="face" r="225" strokeWidth="20" fill="none" stroke="lightgray"/>
        {d3.range(12).map(i => (
          <g id="tick-major" transform={`rotate(${i * 30})`}>
            <line y1="-203" y2="-153" stroke="black" strokeWidth="14" />
          </g>
        )).join("")}
        {d3.range(60).map(i => i % 5 ? (
          <g id="tick-minor" transform={`rotate(${i * 6})`}>
            <line y1="-203" y2="-188" stroke="black" strokeWidth="4" />
          </g>
          ) : ``).join("")}
        <g id="hand-hours" transform={`rotate(${(now - d3.timeDay(now)) / 864e5 * 720})`}>
          <path d="M-13,47h26l-3,-186h-17z" />
        </g>
        <g id="hand-minutes" transform={`rotate(${(now - d3.timeHour(now)) / 36e5 * 360})`}>
          <path d="M-13,47h26l-3,-240h-17z" />
        </g>
        <g id="hand-seconds" transform={`rotate(${(now - d3.timeMinute(now)) / 6e4 * 360})`}>
          <line y1="65" y2="-138" stroke="red" strokeWidth="4" />
          <circle cy="-138" r="16" fill="red" />
          <circle r="7.5" fill="red" />
          <circle r="4.5" fill="none" stroke="brown" />
        </g>
      </g>
    </svg>
  )
}

