import { useEffect, useState } from "react";
import * as d3 from "d3";
import animeData from "/data/anime.json";
import videoData from "/data/video.json";
import "/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
function detail() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const itemName = query.get("name");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [select, setSelect] = useState("viewCount");
  const [sortData, setSort] = useState([]);
  const [draw, setDraw] = useState(0);
  const [anime, setAnime] = useState(itemName);
  const [animedata, setadata] = useState([]);
  const [width, setWidth] = useState(1750);
  const [height, setHeight] = useState();
  const [years, setyears] = useState([]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const [states, setstate] = useState([
    "videocount",
    "viewcount",
    "likecount",
    "comentcount",
  ]);
  const name = {
    videocount: "動画",
    viewcount: "視聴回数",
    likecount: "いいね",
    comentcount: "コメント",
  };
  const statescolor = {
    videocount: "blue",
    viewcount: "orange",
    likecount: "green",
    comentcount: "red",
  };
  let Navigate = useNavigate();
  const handleMouseMove = (e) => {
    // SVG要素内の座標を取得
    const svg = e.target;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    setMousePosition({ x: cursorPoint.x, y: cursorPoint.y });
    Math.round((mousePosition["x"] - 22) / 18);

    clickyear(
      Math.round((cursorPoint.x - 22 - 60) / 18) - 1 >= 0
        ? years[Math.round((cursorPoint.x - 22 - 60) / 18)]
        : years[0]
    );
    console.log(Math.round((cursorPoint.x - 22) / 18));
  };
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
        year: animeData[i]["year"],
        n: animeData[i]["n"],
      });
      i++;
    }
    let updatedAnimeData = animedatas.map((item, i) => ({
      name: item["name"],
      year: item["year"],
      n: item["n"],
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      videoCount: 0,
      videodate: {},
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
    setSort(updatedAnimeData);
  }, []);

  const xmax = sortData.length > 0 ? sortData[0][select] : 0;

  const [yearselect, setYS] = useState("2023-冬");
  const [videorank, setvideo] = useState("ビリ");
  const [viewrank, setview] = useState("ビリ");
  const [likerank, setlike] = useState("ビリ");
  const [commentrank, setcomment] = useState("ビリ");
  const [selectanime, setAn] = useState(itemName);
  const [selectcount, setselectC] = useState("videocount");
  let kurai = "";
  if (states.length != 1) {
    kurai = "";
  }
  useEffect(() => {
    const animedata = sortData.filter(
      (an) => an["videodate"][yearselect] != null
    );

    const animerankvideo = animedata
      .slice()
      .sort(
        (a, b) =>
          b["videodate"][yearselect]["videocount"] -
          a["videodate"][yearselect]["videocount"]
      );
    const animerankview = animedata
      .slice()
      .sort(
        (a, b) =>
          b["videodate"][yearselect]["viewcount"] -
          a["videodate"][yearselect]["viewcount"]
      );
    const animesort = animedata
      .slice()
      .sort(
        (a, b) =>
          b["videodate"][yearselect]["likecount"] -
          a["videodate"][yearselect]["likecount"]
      );
    const animerankcomment = animedata
      .slice()
      .sort(
        (a, b) =>
          b["videodate"][yearselect]["comentcount"] -
          a["videodate"][yearselect]["comentcount"]
      );
    setAn(sortData.filter((an) => an["name"] == anime)[0]);

    let countvideo = 0;
    let countview = 0;
    let countlike = 0;
    let countcomment = 0;

    animerankvideo.map((animes, i) => {
      if (animes["name"] == anime) {
        const a = String(i + 1);

        setvideo(a);
        countvideo += 1;
      }

      if (animerankview[i]["name"] == anime) {
        const a = String(i + 1);
        setview(a);
        countview += 1;
      }

      if (animesort[i]["name"] == anime) {
        const a = String(i + 1);
        setlike(a);
        countlike += 1;
      }

      if (animerankcomment[i]["name"] == anime) {
        const a = String(i + 1);

        setcomment(a);
        countcomment += 1;
      }
    });
    if (countvideo == 0) {
      setvideo("ビリ");
    }
    if (countview == 0) {
      setview("ビリ");
    }
    if (countlike == 0) {
      setlike("ビリ");
    }
    if (countcomment == 0) {
      setcomment("ビリ");
    }
  }, [sortData, yearselect, anime]);

  function clickyear(item) {
    console.log(item);
    setYS(item);
  }

  const selectcounts = (item, yScale, itema) => {
    let cyValue = 0;
    if (itema == "videocount") {
      cyValue = item != null ? 500 - yScale(item[itema]) : 500 - yScale(0);
    } else {
      cyValue = item != null ? 500 - yScale(item[itema]) : 500 - yScale(0);
    }
    return cyValue;
  };

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

      let ymax = {
        videocount: 0,
        viewcount: 0,
        likecount: 0,
        comentcount: 0,
      };
      states.forEach((itema) => {
        years.forEach((item) => {
          if (selectanime["videodate"][item] != null) {
            if (selectanime["videodate"][item][itema] > ymax[itema]) {
              ymax[itema] = selectanime["videodate"][item][itema];
            }
          }
        });
      });

      const yScales = {};
      states.forEach((itema) => {
        yScales[itema] = d3
          .scaleLinear()
          .domain([0, (Math.floor(ymax[itema] / 100) + 1) * 100])
          .range([0, 500 - 30])
          .nice();
      });

      return (
        <svg
          width={a.length * 40 - 300}
          height={540}
          onMouseMove={handleMouseMove}
        >
          <line x1="70" x2="70" y1="20" y2="500" stroke="black"></line>
          <line
            x1="70"
            x2={a.length * 40 - 300}
            y1="500"
            y2="500"
            stroke="black"
          ></line>
          <text
            x={years.findIndex((item) => item == start) * 18 + 50}
            y={15}
            onClick={() => clickyear(start)}
            stroke="red"
            strokeWidth={1}
          >
            放送開始日
          </text>
          <line
            x1={years.findIndex((item) => item == start) * 18 + 22 + 60}
            y1={20}
            x2={years.findIndex((item) => item == start) * 18 + 22 + 60}
            y2={510}
            stroke="red"
            stroke-dasharray="2 3"
          />

          <line
            x1={Math.round((mousePosition["x"] - 22 - 60) / 18) * 18 + 22 + 60}
            y1={20}
            x2={Math.round((mousePosition["x"] - 22 - 60) / 18) * 18 + 22 + 60}
            y2={510}
            stroke="gray"
            stroke-dasharray="2 4"
          />
          {states.length == 1 &&
            yScales[states[0]].ticks().map((item, index) => {
              let count = 1;
              if (states[0] == "viewcount" || states[0] == "likecount") {
                count *= 10000;
                kurai = "(万)";
              } else if (states[0] == "comentcount") {
                count *= 100;
                kurai = "(百)";
              }
              return (
                <g key={index}>
                  <line
                    x1={10 + 60}
                    x2={20 + 60}
                    y1={500 - yScales[states[0]](item)}
                    y2={500 - yScales[states[0]](item)}
                    stroke="grey"
                  ></line>
                  <text
                    textAnchor="end"
                    x="65"
                    y={500 - yScales[states[0]](item) + 5}
                    fontSize="12"
                    fill="black"
                    strokeWidth="0"
                  >
                    {item / count}
                  </text>
                </g>
              );
            })}

          {years.map((item, index) => {
            return (
              <g key={index}>
                <text
                  x={18 * index + 15 + 60}
                  y="520"
                  fontSize="10"
                  strokeWidth="0"
                  fill={start !== item ? "black" : "red"}
                >
                  <title>{item}</title>
                  {item.split("-")[1]}
                </text>

                {states.map((itema, inddd) => {
                  // console.log(states);
                  const cyValue = selectcounts(
                    selectanime["videodate"][item],
                    yScales[itema],
                    itema
                  );

                  // console.log(item, yearselect);

                  return (
                    <>
                      {index < years.length - 1 && (
                        <line
                          x1={18 * index + 22 + 60}
                          y1={cyValue}
                          x2={18 * (index + 1) + 22 + 60}
                          y2={selectcounts(
                            selectanime["videodate"][years[index + 1]],
                            yScales[itema],
                            itema
                          )}
                          stroke={statescolor[itema]}
                        />
                      )}

                      <circle
                        cx={18 * index + 22 + 60}
                        cy={cyValue}
                        r={item === yearselect ? 8 : 5}
                        fill={statescolor[itema]}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          setstate([itema]);
                        }}
                      >
                        <title>
                          {selectanime["videodate"][item] === undefined
                            ? 0
                            : selectanime["videodate"][item][itema]}
                        </title>
                      </circle>
                    </>
                  );
                })}
              </g>
            );
          })}

          {years.findIndex((item) => yearselect == item) < 68 ? (
            <>
              <rect
                x={mousePosition["x"] + 10}
                y={mousePosition["y"]}
                width={"150"}
                height="130"
                fill="white"
                stroke="black"
                rx="15"
              />
              <text
                x={mousePosition["x"] + 10 + 10}
                y={mousePosition["y"] + 30}
              >
                {years[Math.round((mousePosition["x"] - 22 - 60) / 18)]}
              </text>
            </>
          ) : (
            <>
              <rect
                x={mousePosition["x"] - 150}
                y={mousePosition["y"]}
                width={"150"}
                height="130"
                fill="white"
                stroke="black"
                rx="15"
              />
              <text
                x={mousePosition["x"] + 10 + 10 - 150}
                y={mousePosition["y"] + 30}
              >
                {years[Math.round((mousePosition["x"] - 22 - 60) / 18)]}
              </text>
            </>
          )}

          <text x={87} y={540}>
            2006年
          </text>
          <text x={width - 370} y={540}>
            2024年
          </text>
          <text x={10} y={20}>
            {kurai}
          </text>
          {states.map((itema, index) => {
            if (Math.round((mousePosition["x"] - 22 - 60) / 18) <= -1) {
              return;
            }

            const cyValue = selectcounts(
              selectanime["videodate"][
                years[Math.round((mousePosition["x"] - 22 - 60) / 18)]
              ],
              yScales[itema],
              itema
            );
            console.log(Math.round((mousePosition["x"] - 22 - 60) / 18));
            return years.findIndex((item) => yearselect == item) < 68 ? (
              <text
                x={mousePosition["x"] + 10 + 10}
                y={mousePosition["y"] + index * 20 + 50}
              >
                {name[itema]} :
                {(mousePosition["x"] - 22 - 60) / 18 >= 0 &&
                (mousePosition["x"] - 22 - 60) / 18 < years.length - 1
                  ? selectanime["videodate"][
                      years[Math.round((mousePosition["x"] - 22 - 60) / 18)]
                    ][itema]
                  : selectanime["videodate"][years[0]][itema]}
              </text>
            ) : (
              <text
                x={mousePosition["x"] + 10 + 10 - 150}
                y={mousePosition["y"] + index * 20 + 50}
              >
                {name[itema]} :
                {(mousePosition["x"] - 22 - 60) / 18 >= 0 &&
                (mousePosition["x"] - 22 - 60) / 18 < years.length - 1
                  ? selectanime["videodate"][
                      years[Math.round((mousePosition["x"] - 22 - 60) / 18)]
                    ][itema]
                  : selectanime["videodate"][years[0]][itema]}
              </text>
            );
          })}
        </svg>
      );
    }
    return null;
  };

  const Bool = (name) => {
    setstate((prevStates) => {
      if (prevStates.includes(name)) {
        return prevStates.filter((state) => state !== name);
      } else {
        return [...prevStates, name];
      }
    });
  };

  const draws = () => {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            style={{
              color: "transparent",
              backgroundColor: "transparent",
              cursor: "default",
            }}
            onClick={() => Navigate(-1)}
          >
            {"<"} 戻る
          </button>

          <h1 style={{}}>{anime}</h1>
          <button
            style={{
              color: "transparent",
              backgroundColor: "transparent",
              cursor: "default",
            }}
          >
            {"<"} 戻る
          </button>
        </div>
        <div style={{ justifyContent: "center" }}>
          <h1>{yearselect}時点の増加量</h1>
        </div>
        <div className="container">
          <div className="ranking">
            <div className="parent-container">
              <div className="triangle-container">
                <h3
                  style={
                    states.findIndex((A) => A == "videocount") != -1
                      ? {
                          color: statescolor["videocount"],
                          cursor: "pointer",
                        }
                      : { color: "black", cursor: "pointer" }
                  }
                  onClick={(e) => Bool("videocount")}
                >
                  動画 <br />第{videorank}位
                </h3>
                <h3
                  style={
                    states.findIndex((A) => A == "viewcount") != -1
                      ? {
                          color: statescolor["viewcount"],
                          cursor: "pointer",
                        }
                      : { color: "black", cursor: "pointer" }
                  }
                  onClick={(e) => Bool("viewcount")}
                >
                  視聴回数 <br />第{viewrank}位
                </h3>
                <h3
                  style={
                    states.findIndex((A) => A == "likecount") != -1
                      ? {
                          color: statescolor["likecount"],
                          cursor: "pointer",
                        }
                      : { color: "black", cursor: "pointer" }
                  }
                  onClick={(e) => Bool("likecount")}
                >
                  いいね <br />第{likerank}位
                </h3>
                <h3
                  style={
                    states.findIndex((A) => A == "comentcount") != -1
                      ? {
                          color: statescolor["comentcount"],
                          cursor: "pointer",
                        }
                      : { color: "black", cursor: "pointer" }
                  }
                  onClick={(e) => Bool("comentcount")}
                >
                  コメント <br />第{commentrank}位
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div>{makeTxt()}</div>
        {states.length != 4 && (
          <button
            style={{ position: "fixed", bottom: "200px", right: "100px" }}
            onClick={() => {
              setstate(["videocount", "viewcount", "likecount", "comentcount"]);
            }}
          >
            リセット
          </button>
        )}
        <img
          src="cancel.png"
          onClick={() => Navigate(-1)}
          style={{
            cursor: "pointer",
            position: "fixed",
            top: "10px",
            right: "10px",
          }}
        />
      </div>
    );
  };
  return <div>{draws()}</div>;
}

export default detail;
