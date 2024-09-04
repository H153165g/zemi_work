import { useEffect, useState } from "react";
import * as d3 from "d3";
import animeData from "/data/anime.json";
import videoData from "/data/video.json";
import "/styles.css";
import { useNavigate } from "react-router-dom";

function detail() {
  let navigate = useNavigate();
  const [select, setSelect] = useState("viewCount");
  const [sortData, setSort] = useState([]);
  const [draw, setDraw] = useState(0);
  const [anime, setAnime] = useState("");
  const [animedata, setadata] = useState([]);
  const [width, setWidth] = useState(1750);
  const [height, setHeight] = useState();
  const [yearsnext, setyear] = useState("2006-春");
  const [year, setYear] = useState("-");
  const [seasons, setseason] = useState("-");
  const [yearsanime, setya] = useState("");
  const [countdata, setCount] = useState({});
  const [years, setyears] = useState([]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const [c, setC] = useState(0);
  const [All, setall] = useState(sortData);

  useEffect(() => {
    let yearcount = [];
    for (let i = 2006; i < 2025; i++) {
      for (let j = 1; j <= 4; j++) {
        let kisetu = "";
        if (j == 1) {
          kisetu = "春";
        } else if (j == 2) {
          kisetu = "夏";
        } else if (j == 3) {
          kisetu = "秋";
        } else {
          kisetu = "冬";
        }
        yearcount.push(i + "-" + kisetu);
      }
    }
    setyears(yearcount);

    let i = 0;
    let animedatas = [];

    while (
      videoData["videos"][videoData["videos"].length - 1]["animename"] !=
      animeData[i]["name"]
    ) {
      animedatas.push({
        name: animeData[i]["name"],
        shortname: animeData[i]["shortname"][0],
        year: animeData[i]["year"],
        n: animeData[i]["n"],
      });
      i++;
    }
    let updatedAnimeData = animedatas.map((item, i) => ({
      name: item["name"],
      shortname: item["shortname"],
      year: item["year"],
      n: item["n"],
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      videoCount: 0,
      videodate: {},
      color: color(i),
    }));
    updatedAnimeData.map((item) => {
      yearcount.map((it) => {
        item["videodate"][it] = {
          viewcount: 0,
          likecount: 0,
          comentcount: 0,
          videocount: 0,
        };
      });
    });

    setadata(animedatas);
    setHeight(animedatas.length * 20 + 20);

    videoData["videos"].forEach((video) => {
      const anime = updatedAnimeData.find(
        (anime) => anime.name === video["animename"]
      );
      if (anime) {
        const videodateT = video["videos_details"]["publishedAt"].split("T");
        const videomonth = videodateT[0].split("-");
        let videoyear = videomonth[0] + "-";

        if (3 <= videomonth[1] && videomonth[1] < 6) {
          videoyear += "春";
        } else if (6 <= videomonth[1] && videomonth[1] < 9) {
          videoyear += "夏";
        } else if (9 <= videomonth[1] && videomonth[1] < 12) {
          videoyear += "秋";
        } else if (12 == videomonth[1]) {
          videoyear += "冬";
        } else {
          videoyear = String(Number(videomonth[0]) - 1) + "-冬";
        }

        anime["videodate"][videoyear]["videocount"] += 1;
        anime["videodate"][videoyear]["viewcount"] += Number(
          video["videos_details"]["viewCount"]
        );
        anime["videodate"][videoyear]["likecount"] += Number(
          video["videos_details"]["likeCount"]
        );
        anime["videodate"][videoyear]["comentcount"] += Number(
          video["videos_details"]["commentCount"]
        );
      }
    });

    updatedAnimeData.map((item) => {
      item["commentCount"] = item["videodate"][yearsnext]["comentcount"];
      item["likeCount"] = item["videodate"][yearsnext]["likecount"];
      item["videoCount"] = item["videodate"][yearsnext]["videocount"];
      item["viewCount"] = item["videodate"][yearsnext]["viewcount"];
    });
    setSort(updatedAnimeData);
    setall(updatedAnimeData);
  }, []);

  useEffect(() => {
    setSort((prevSortData) =>
      [...prevSortData].sort((a, b) => b[select] - a[select])
    );
  }, [c, select]);

  const xmax = sortData.length > 0 ? sortData[0][select] : 0;
  const xScale = d3
    .scaleLinear()
    .domain([0, (Math.floor(xmax / 100) + 1) * 100])
    .range([0, width - 500 - 180])
    .nice();

  /*   const xAxisScale = d3
    .scaleLinear()
    .domain([0,])
    .range([0, width - 350])
    .nice() */

  const g = (item) => {
    navigate(`/title?name=${encodeURIComponent(item)}`);
  };
  const Y = () => {
    let yearr = [];
    for (let i = 2014; i < 2017; i++) {
      yearr.push(i);
    }
    return yearr.map((item, index) => (
      <option value={item} key={index}>
        {item}年
      </option>
    ));
  };
  const Season = (g) => {
    let updateAnime = sortData;
    let counttt = g
      ? years.findIndex((item) => item == yearsnext) + 1
      : years.findIndex((item) => item == yearsnext) - 1;
    updateAnime.map((item) => {
      if (g) {
        if (counttt < years.length) {
          item["videoCount"] += item["videodate"][years[counttt]]["videocount"];
          item["likeCount"] += item["videodate"][years[counttt]]["likecount"];
          item["viewCount"] += item["videodate"][years[counttt]]["viewcount"];
          item["commentCount"] +=
            item["videodate"][years[counttt]]["comentcount"];
        }
      } else {
        if (counttt >= 0) {
          item["videoCount"] -=
            item["videodate"][years[counttt + 1]]["videocount"];
          item["likeCount"] -=
            item["videodate"][years[counttt + 1]]["likecount"];
          item["viewCount"] -=
            item["videodate"][years[counttt + 1]]["viewcount"];
          item["commentCount"] -=
            item["videodate"][years[counttt + 1]]["comentcount"];
        }
      }
    });
    if (counttt == years.length) {
      counttt -= 1;
    } else if (counttt == -1) {
      counttt += 1;
    }
    setC(c + 1);
    setyear(years[counttt]);
  };

  let data = sortData.filter((a) => {
    if (year != "-" && seasons != "-") {
      return a["year"] == year && a["n"] == seasons;
    } else if (year != "-") {
      return a["year"] == year;
    } else if (seasons != "-") {
      return a["n"] == seasons;
    } else {
      return a;
    }
  });

  return (
    <div style={{ position: "relative" }}>
      <h1>Youtubeにおけるアニメの話題性の推移</h1>
      <div className="Box">
        <button onClick={(e) => Season(false)}>前</button>
        <div className="sel">
          <h3>{yearsnext} 時点</h3>
          <select
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 15px",
            }}
            onChange={(e) => setSelect(e.target.value)}
          >
            <option value="viewCount">総視聴回数</option>
            <option value="likeCount">総いいね数</option>
            <option value="commentCount">総コメント数</option>
            <option value="videoCount">総動画数</option>
          </select>
        </div>
        <button onClick={(e) => Season(true)}>後</button>
      </div>

      <div>
        <h3>放送時期</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label htmlFor="tosi">年度</label>
          <select name="tosi" onChange={(e) => setYear(e.target.value)}>
            <option value="-">全年度</option>
            {Y()}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label htmlFor="kisetu">季節</label>
          <select name="kisetu" onChange={(e) => setseason(e.target.value)}>
            <option value="-">全期</option>
            <option value={1}>春季</option>
            <option value={2}>夏季</option>
            <option value={3}>秋季</option>
            <option value={4}>冬季</option>
          </select>
        </div>
      </div>
      <div style={{ height: "600px", overflowY: "scroll" }}>
        <svg width={width - 300} height={(data.length + 1) * 30}>
          {xScale.ticks().map((item, index) => (
            <g key={index}>
              <line
                x1={xScale(item) + 180}
                x2={xScale(item) + 180}
                y1={30}
                y2={(data.length + 1) * 30}
                stroke="grey"
              ></line>
              <text
                textAnchor="middle"
                x={xScale(item) + 180}
                y="20"
                fontSize="12"
                fill="black"
                strokeWidth="0"
              >
                {item}
              </text>
            </g>
          ))}
          {/* <line
          x1="180"
          y1="0"
          x2="180"
          y2={(data.length + 1) * 30}
          stroke="black"
        ></line> */}
          <line x1="0" y1="40" x2={width - 300} y2="40" stroke="black"></line>
          {/* <line
          x1={180 + (width - 355 - 180) / 5}
          y1="30"
          x2={180 + (width - 355 - 180) / 5}
          y2={(data.length + 1) * 30}
          stroke="grey"
        ></line>
        <text
          textAnchor="middle"
          x={180 + (width - 355 - 180) / 5}
          y="20"
          fontSize="12"
          fill="black"
          strokeWidth="0"
        >
          {((Math.floor(xmax / 100) + 1) * 100) / 5}
        </text>
        <line
          x1={180 + ((width - 355 - 180) / 5) * 2}
          y1="30"
          x2={180 + ((width - 355 - 180) / 5) * 2}
          y2={(data.length + 1) * 30}
          stroke="grey"
        ></line>
        <text
          textAnchor="middle"
          x={180 + ((width - 355 - 180) / 5) * 2}
          y="20"
          fontSize="12"
          fill="black"
          strokeWidth="0"
        >
          {(((Math.floor(xmax / 100) + 1) * 100) / 5) * 2}
        </text>
        <line
          x1={180 + ((width - 355 - 180) / 5) * 3}
          y1="30"
          x2={180 + ((width - 355 - 180) / 5) * 3}
          y2={(data.length + 1) * 30}
          stroke="grey"
        ></line>
        <text
          textAnchor="middle"
          x={180 + ((width - 355 - 180) / 5) * 3}
          y="20"
          fontSize="12"
          fill="black"
          strokeWidth="0"
        >
          {(((Math.floor(xmax / 100) + 1) * 100) / 5) * 3}
        </text>
        <line
          x1={180 + ((width - 355 - 180) / 5) * 4}
          y1="30"
          x2={180 + ((width - 355 - 180) / 5) * 4}
          y2={(data.length + 1) * 30}
          stroke="grey"
        ></line>
        <text
          textAnchor="middle"
          x={180 + ((width - 355 - 180) / 5) * 4}
          y="20"
          fontSize="12"
          fill="black"
          strokeWidth="0"
        >
          {(((Math.floor(xmax / 100) + 1) * 100) / 5) * 4}
        </text>
        <line
          x1={180 + (width - 355 - 180)}
          y1="30"
          x2={180 + (width - 355 - 180)}
          y2={(data.length + 1) * 30}
          stroke="grey"
        ></line>
        <text
          textAnchor="middle"
          x={180 + (width - 355 - 180)}
          y="20"
          fontSize="12"
          fill="black"
          strokeWidth="0"
        >
          {(Math.floor(xmax / 100) + 1) * 100}
        </text> */}
          {data.map((item, i) => (
            <g
              style={{ cursor: "pointer" }}
              key={i}
              transform={`translate(0, ${30 * (i + 1) + 20})`}
              transition="margin-right 4s"
              onClick={(e) => g(item["name"])}
            >
              <rect
                x="180"
                y="0"
                width={xScale(item[select])}
                height="20"
                fill={item["color"]}
                stroke="black"
              />
              <text
                textAnchor="end"
                x="170"
                y="15"
                fontSize="12"
                fill="black"
                strokeWidth="0"
              >
                {Array.from(
                  item["shortname"] == "" ? item["name"] : item["shortname"]
                ).map((n, index) => {
                  if (index < 12) {
                    return n;
                  }
                })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default detail;
