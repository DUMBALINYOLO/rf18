import { fabric } from "fabric";
import SVGIcon from "./aws-brands.svg";

export const loadSVG = () => {
  const output = document.createElement("canvas");
  output.id = "canvas";

  const canvas = new fabric.Canvas(output);
  fabric.loadSVGFromURL(SVGIcon, function (objects, options) {
    var svgData = fabric.util.groupSVGElements(objects, options);
    svgData.scaleToWidth(50);
    svgData.scaleToHeight(50);
    canvas.add(svgData);
    //canvas.renderAll();
    //return canvas.getContext();
  });
  return canvas.getContext();
};

// export const load = () => {
//   const output = document.createElement("canvas");
//   output.id = "canvas";
//   let canvas = new fabric.Canvas(output);
//   return new Promise((resolve) => {
//     fabric.loadSVGFromURL(SVGIcon, function (objects, options) {
//       var svgData = fabric.util.groupSVGElements(objects, options);
//       svgData.scaleToWidth(50);
//       svgData.scaleToHeight(50);
//       canvas = canvas.add(svgData);
//       canvas = canvas.renderAll();
//       resolve(canvas.getContext());
//     });
//   });
// };

export const draw = (ctx, x, y) => {
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(this, x - 8, y - 8, 16, 16);
  };
  img.src = SVGIcon;
};
