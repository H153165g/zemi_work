import { useEffect, useState } from "react";
import * as d3 from "d3";
import animeData from "/data/anime.json";
import videoData from "/data/video.json";

function App() {
  const [width, setWidth] = useState(1750);
  const [height, setHeight] = useState(animeData.length * 20 + 20);
  const [select, setSelect] = useState("viewCount");
  const [sortData, setSort] = useState([]);
  const [draw, setDraw] = useState(true);
  const [anime, setAnime] = useState("");

  useEffect(() => {
    let updatedAnimeData = animeData.map((anime) => ({
      ...anime,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      videoCount: 0,
      videodate: {}
    }));

    videoData["videos"].forEach(video => {
      const anime = updatedAnimeData.find(anime => anime.name === video["animename"]);
      if (anime) {
        anime.viewCount += Number(video["videos_details"]["viewCount"]);
        anime.likeCount += Number(video["videos_details"]["likeCount"]);
        anime.commentCount += Number(video["videos_details"]["commentCount"]);
        anime.videoCount += 1;
        const videodateT = video["videos_details"]["publishedAt"].split("T");
        const videomonth = videodateT[0].split("-");
        let videoyear = videomonth[0] + "-";

        if (4 <= videomonth[1] && videomonth[1] <= 6) {
          videoyear += "春";
        } else if (7 <= videomonth[1] && videomonth[1] <= 9) {
          videoyear += "夏";
        } else if (10 <= videomonth[1] && videomonth[1] <= 12) {
          videoyear += "秋";
        } else {
          videoyear += "冬";
        }

        // videodateの初期化
        if (!anime["videodate"][videoyear]) {
          anime["videodate"][videoyear] = {
            videocount: 0,
            viewcount: 0,
            likecount: 0,
            comentcount: 0
          };
        }

        anime["videodate"][videoyear]["videocount"] += 1;
        anime["videodate"][videoyear]["viewcount"] += Number(video["videos_details"]["viewCount"]);
        anime["videodate"][videoyear]["likecount"] += Number(video["videos_details"]["likeCount"]);
        anime["videodate"][videoyear]["comentcount"] += Number(video["videos_details"]["commentCount"]);
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
    .range([0, width - 500])
    .nice();

  const g = (item) => {

    setAnime(item);
    setDraw(false);
  };
  
  const [yearselect, setYS] = useState("2024-春");
  const [videorank,setvideo]=useState("ビリ")
  const [viewrank,setview]=useState("ビリ")
  const [likerank,setlike]=useState("ビリ")
  const [commentrank,setcomment]=useState("ビリ")
  useEffect(() => {
    const animedata = (sortData.filter((an) => an["videodate"][yearselect]!=null));

    const animerankvideo = animedata.slice().sort((a, b) => b["videodate"][yearselect]["videocount"] - a["videodate"][yearselect]["videocount"]);
    const animerankview = animedata.slice().sort((a, b) => b["videodate"][yearselect]["viewcount"] - a["videodate"][yearselect]["viewcount"]);
    const animesort = animedata.slice().sort((a, b) => b["videodate"][yearselect]["likecount"] - a["videodate"][yearselect]["likecount"]);
    const animerankcomment = animedata.slice().sort((a, b) => b["videodate"][yearselect]["comentcount"] - a["videodate"][yearselect]["comentcount"]);

    animerankvideo.map((animes,i)=>{
      if(animes["name"]==anime){
        let a="第"
        a+=String(i+1)
        a+="位"
        setvideo(a)
      }
    
      if(animerankview[i]["name"]==anime){
        let a="第"
        a+=String(i+1)
        a+="位"
        setview(a)
      }
    
      if(animesort[i]["name"]==anime){
        let a="第"
        a+=String(i+1)
        a+="位"
        setlike(a)
      }
    
      if(animerankcomment[i]["name"]==anime){
        let a="第"
        a+=String(i+1)
        a+="位"
        setcomment(a)
      }
    })
  }, [yearselect]);

  const draws = () => {
 
    return (
      <div>
        <h1>{anime}</h1>
        <div>
        
          <h2>{yearselect}</h2></div>
        
        
        <div>
          <text>動画の総数　{videorank}</text>
          </div>
          <div>
          <text>動画視聴回数の総数　{viewrank}</text>
          </div>
          <text>いいねの総数　{likerank}</text>
          <div>
          <text>コメントの総数　{commentrank}</text>
          </div>
        </div>
    
    );
  };

  if (draw) {
    return (
      <div>
        <h1>Anime and Video Data</h1>
        <div>
          <select onChange={(e) => setSelect(e.target.value)}>
            <option value="viewCount">View Count</option>
            <option value="likeCount">Like Count</option>
            <option value="commentCount">Comment Count</option>
            <option value="videoCount">Video Count</option>
          </select>
        </div>
        <svg width={width} height={height}>
          {sortData.map((item, i) => (
            <g key={i} transform={`translate(0, ${20 * i + 20})`} onClick={(e) => g(item["name"])}>
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
                {item["name"]}:{item[select]}回
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  } else {
    return (
      <div>
        {draws()}
      </div>
    );
  }
}

export default App;
