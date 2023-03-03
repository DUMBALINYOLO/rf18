import React, { useRef, useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ImageIcon from "@material-ui/icons/Image";
import CenterFocusWeakIcon from "@material-ui/icons/CenterFocusWeak";
//import data from "./data/data.json";
import { getJSONObject } from "./parse";
import { draw } from "./loadSVG";
import "./style.css";

export default function App() {
  const fgRef = useRef();
  const [data, setData] = useState({ nodes: [], links: [] });
  const [zoomSize, setZoomSize] = useState(3);

  useEffect(() => {
    const getData = async () => {
      const json = await getJSONObject();
      setData(json);
    };
    getData();
    fgRef.current.zoom(zoomSize);
    fgRef.current.d3Force("charge").strength(-170);
  }, [zoomSize]);

  const nodePaint = ({ id, name, shape, x, y }, color, ctx) => {
    ctx.fillStyle = color;
    switch (shape) {
      case "box":
        ctx.fillRect(x - 6, y - 4, 12, 8);
        break;
      case "diamond":
        // triangle
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.fill();
        break;
      case "text":
        ctx.font = "14px Sans-Serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, x, y);
        break;
      default:
        // circle
        if (
          name === 'provider["registry.terraform.io/hashicorp/aws"] (close)'
        ) {
          //draw(ctx, x, y);
          //return;
        }
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        break;
    }
  };

  const getColor = (n) =>
    "#" + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, "0");

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" style={{ marginRight: "5vw" }}>
            Menu
          </Typography>
          <IconButton
            onClick={() => {
              setZoomSize(zoomSize + 1);
              fgRef.current.zoom(zoomSize + 1);
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setZoomSize(zoomSize - 1);
              fgRef.current.zoom(zoomSize - 1);
            }}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              fgRef.current.zoomToFit(0, 100);
            }}
          >
            <CenterFocusWeakIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              const canvas = document.getElementsByTagName("canvas");
              const dataURL = canvas[0].toDataURL("image/png");
              const myImage = document.getElementById("myImage");
              myImage.src = dataURL;
            }}
          >
            <ImageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ForceGraph2D
        graphData={data}
        nodeLabel="name"
        nodeCanvasObject={(node, ctx) =>
          nodePaint(node, getColor(node.id), ctx)
        }
        nodePointerAreaPaint={nodePaint}
        backgroundColor="#eee"
        dagMode="td"
        dagLevelDistance={40}
        // nodeRelSize={100}
        nodeVal={(node) => {
          return node.size;
        }}
        ref={fgRef}
        // cooldownTicks={100}
        //onEngineStop={() => fgRef.current.zoomToFit(400)}
        enableZoomInteraction={false}
      />
      <div style={{ border: "1px solid #ddd" }}>
        <img id="myImage" alt="ExportToImage" />
      </div>
    </React.Fragment>
  );
}
