import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

const fs = require("fs");
const dot = fs.readFileSync("./src/data/graph.dot", "UTF-8");

const viz = new Viz({ Module, render });

export const getJSONObject = async () => {
  const graph = { nodes: [], links: [] };
  const json = await viz.renderJSONObject(dot);
  // console.log(json);

  const nodes = json.objects
    .filter((node) => node.name !== "root")
    .map((node) => {
      const name = node.name.replace("[root] ", "");
      return {
        id: node._gvid,
        name,
        shape: name === "root" ? "text" : node.shape || "circle"
      };
    });
  // console.log(nodes);
  graph.nodes = nodes;

  const links = json.edges.map((link) => {
    return {
      source: link.tail,
      target: link.head
    };
  });
  // console.log(links);
  graph.links = links;

  console.log(graph);
  return graph;
};
