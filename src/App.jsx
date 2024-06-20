import { useEffect, useState } from "react";
import * as d3 from "d3";
import animeData from "/data/anime.json";
import videoData from "/data/video.json";

function App() {
  const [width, setWidth] = useState(1500);
  const [height, setHeight] = useState(animeData.length * 20+20);
  const [select, setSelect] = useState("viewCount");
  const [sortData, setSort] = useState([]);

  useEffect(() => {
    let updatedAnimeData = animeData.map(anime => ({
      ...anime,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0
    }));

    videoData["videos"].forEach(video => {
      const anime = updatedAnimeData.find(anime => anime.name === video["animename"]);
      if (anime) {
        anime.viewCount += Number(video["videos_details"]["viewCount"]);
        anime.likeCount += Number(video["videos_details"]["likeCount"]);
        anime.commentCount += Number(video["videos_details"]["commentCount"]);
      }
    });

    setSort(updatedAnimeData);
  }, []);

  useEffect(() => {
    setSort(prevSortData => [...prevSortData].sort((a, b) => b[select] - a[select]));
  }, [select]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const xmax = sortData.length > 0 ? sortData[0][select] : 0;
  const xScale = d3.scaleLinear()
    .domain([0, (Math.floor(xmax / 100) + 1) * 100])
    .range([0, 1000])
    .nice();

  return (
    <div>
      <h1>Anime and Video Data</h1>
      <div>
      <select onChange={(e) => setSelect(e.target.value)}>
        <option value="viewCount">View Count</option>
        <option value="likeCount">Like Count</option>
        <option value="commentCount">Comment Count</option>
      </select>
      </div>
      <svg width={width} height={height}>
        {sortData.map((item, i) => (
          <g key={i} transform={`translate(0, ${20 * i +20})`}>
            <rect
              x="0"
              y="0"
              width={xScale(item[select])}
              height="20"
              fill={color(i)}
            />
            <text
              x={xScale(item[select]) + 5}
              y="15"
              fontSize="12"
              fill="black"
              strokeWidth="0"
            >
              {item["name"]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default App;
