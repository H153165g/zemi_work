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
            trendcount:0,
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

  const [yearselect, setYS] = useState("2023-冬");
  const [videorank, setvideo] = useState("ビリ")
  const [viewrank, setview] = useState("ビリ")
  const [likerank, setlike] = useState("ビリ")
  const [commentrank, setcomment] = useState("ビリ")
  const [selectanime, setAn] = useState()
  const [selectcount, setselectC] = useState("videocount")
  useEffect(() => {
    const animedata = (sortData.filter((an) => an["videodate"][yearselect] != null));

    const animerankvideo = animedata.slice().sort((a, b) => b["videodate"][yearselect]["videocount"] - a["videodate"][yearselect]["videocount"]);
    const animerankview = animedata.slice().sort((a, b) => b["videodate"][yearselect]["viewcount"]/b["videodate"][yearselect]["videocount"] - a["videodate"][yearselect]["viewcount"]/a["videodate"][yearselect]["videocount"]);
    const animesort = animedata.slice().sort((a, b) => b["videodate"][yearselect]["likecount"]/b["videodate"][yearselect]["videocount"] - a["videodate"][yearselect]["likecount"]/a["videodate"][yearselect]["videocount"]);
    const animerankcomment = animedata.slice().sort((a, b) => b["videodate"][yearselect]["comentcount"]/b["videodate"][yearselect]["videocount"] - a["videodate"][yearselect]["comentcount"]/a["videodate"][yearselect]["videocount"]);
    setAn(sortData.filter((an) => an["name"] == anime)[0])

    let countvideo = 0
    let countview = 0
    let countlike = 0
    let countcomment = 0

    animerankvideo.map((animes, i) => {
      if (animes["name"] == anime) {
        let a = "第"
        a += String(i + 1)
        a += "位"
        setvideo(a)
        countvideo += 1
      }

      if (animerankview[i]["name"] == anime) {
        let a = "第"
        a += String(i + 1)
        a += "位"
        setview(a)
        countview += 1
      }

      if (animesort[i]["name"] == anime) {
        let a = "第"
        a += String(i + 1)
        a += "位"
        setlike(a)
        countlike += 1
      }

      if (animerankcomment[i]["name"] == anime) {
        let a = "第"
        a += String(i + 1)
        a += "位"
        setcomment(a)
        countcomment += 1
      }
    })
    if (countvideo == 0) {
      setvideo("ビリ")
    }
    if (countview == 0) {
      setview("ビリ")
    }
    if (countlike == 0) {
      setlike("ビリ")
    }
    if (countcomment == 0) {
      setcomment("ビリ")
    }

  }, [sortData, yearselect, anime]);
  function clickyear(item) {

    setYS(item)

  }
  const ranks=(rank)=>{
    let r=""
    rank.map((item)=>{
      if(item!="第" && item!="位"){
        r+=item
      }
    })
    return Number(r)
  }

  const maketriangle = (videoranks, viewranks, likeranks, commentranks) => {
    const p = 2
    const wid = 80 * p
    const hei = 80 * p

    const videorank=ranks([...videoranks])
    const viewrank=ranks([...viewranks])
    const likerank=ranks([...likeranks])
    const commentrank=ranks([...commentranks])

    


    const xScale = d3.scaleLinear()
      .domain([0, 30])
      .range([0, wid / 2])
      .nice();


    const yScale = d3.scaleLinear()
      .domain([0, 30])
      .range([0, hei / 2])
      .nice();


    const path1 = d3.path();
    path1.moveTo(wid / 2, 0);
    path1.lineTo(0, hei / 2);
    path1.lineTo(wid / 2, hei);
    path1.lineTo(wid, hei / 2)
    path1.closePath();
    console.log(anime)


    const path2 = d3.path();
    path2.moveTo(wid / 2, yScale(videorank-1));
    path2.lineTo(xScale(viewrank-1), hei / 2);
    path2.lineTo(wid / 2, hei-yScale(likerank-1));
    path2.lineTo(wid-xScale(commentrank-1), hei / 2)
    path2.closePath();


    return (
      <svg width={wid} height={hei}>
        <path d={path1.toString()} fill="none" stroke="black" />
        <path d={path2.toString()} fill="blue" stroke="blue" />
        <line
          x1={0}
          y1={hei/2}
          x2={wid}
          y2={hei/2}
          stroke="black"
        />
        <line
          x1={wid/2}
          y1={0}
          x2={wid/2}
          y2={hei}
          stroke="black"
        />

      </svg>
    )

  }
  const selectcounts=(item,yScale)=>{
    let cyValue=0
    if(selectcount=="videocount"){
      cyValue = item != null ? 500 - yScale(item[selectcount]) : 500 - yScale(0);
    } else {
      cyValue = item != null ? 500 - yScale(item[selectcount]/item["videocount"]) : 500 - yScale(0);
    
    }
    return cyValue;

  }

  const makeTxt = () => {
    if (selectanime != undefined) {
      let count = 0;
      let a = [];
      let start = String(selectanime["year"]) + "-";
      let as = "";
      for (let i = 2013; i < 2024; i++) {
        for (let j = 1; j < 5; j++) {
          count += 1;
          if (j == 1) {
            as = "春";
          } else if (j == 2) {
            as = "夏";
          } else if (j == 3) {
            as = "秋";
          } else {
            as = "冬";
          }
          if (i == selectanime["year"] && j == selectanime["n"]) {
            start += as;
          }
          a.push(String(i) + "-" + as);
        }
      }
      let ymax = 0;
      a.forEach((item, index) => {
        if (selectanime["videodate"][item] != null) {
          if (selectanime["videodate"][item][selectcount] > ymax) {
            ymax = selectanime["videodate"][item][selectcount];
          }
        }
      });
      console.log(ymax)

      const yScale = d3.scaleLinear()
        .domain([0, (Math.floor(ymax / 100) + 1) * 100])
        .range([0, 500])
        .nice();


      return (

        <svg width={50 + a.length * 50} height={550}>
          <text x={0} y={15} onClick={() => clickyear(start)}>放送開始日:{start}</text>
          {a.map((item, index) => {
            const cyValue=selectcounts(selectanime["videodate"][item],yScale)
            

            return (
              <g key={item} onClick={() => clickyear(item)}>
                <text x={30 * index + 50 - 5} y="510" fontSize="10" strokeWidth="0" fill={start !== item ? "black" : "red"}>
                  {item.split("-")[1]}
                </text>
                {index < a.length - 1 && (
                  <line
                    x1={30 * index + 50}
                    y1={cyValue}
                    x2={30 * (index + 1) + 50}
                    y2={selectcounts(selectanime["videodate"][a[index + 1]],yScale)}
                    stroke="black"
                  />
                )}
                <circle cx={30 * index + 50} cy={cyValue} r={5} fill={item == yearselect ? "red" : "black"} />
              </g>
            );
          })}
        </svg>

      );
    }
    return null;
  };



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
        <div>
          <select onChange={(e) => setselectC(e.target.value)}>
            <option value="videocount">Video Count</option>
            <option value="viewcount">View Count</option>
            <option value="likecount">Like Count</option>
            <option value="comentcount">Comment Count</option>
          </select>
        </div>
        <div>
          {maketriangle(videorank, viewrank, likerank, commentrank)}
        </div>
        <div>

          {makeTxt()}
        </div>


        <div>
          <button onClick={() => setDraw(true)}>戻る</button>
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
            <g key={i} transform={`translate(0, ${20 * i + 20})`} transition="margin-right 4s" onClick={(e) => g(item["name"])}>
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
                {item["name"]}:{item[select]}{select !== "videoCount" ? "回" : "個"}
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
