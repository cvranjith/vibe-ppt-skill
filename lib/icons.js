"use strict";

// ============================================================
// Icon rendering utilities
// Converts react-icons components → base64 PNG for PptxGenJS
// ============================================================

const React          = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp          = require("sharp");

/**
 * Render a react-icons component to an SVG string.
 * color must be a CSS color string (e.g. "#FFFFFF" — note: # IS required here for CSS).
 */
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

/**
 * Convert a react-icons component to a base64 PNG data URI.
 * The returned string is ready for slide.addImage({ data: ... }).
 *
 * @param {Function} IconComponent - e.g. FaRocket from react-icons/fa
 * @param {string}   color         - CSS color WITH # prefix: "#FFFFFF" or "#C74634"
 * @param {number}   size          - rasterization size in px (default 256, use 512 for large icons)
 * @returns {Promise<string>}       "image/png;base64,..."
 */
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg       = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

/**
 * Pre-render multiple icons in parallel. Call this ONCE at the start of your script.
 *
 * @param {Object} iconMap - Keys are your names; values are [IconComponent, cssColor, size?]
 * @returns {Promise<Object>} Same keys mapped to base64 PNG strings
 *
 * @example
 *   const icons = await preRenderIcons({
 *     rocketWhite: [FaRocket, "#FFFFFF"],
 *     rocketRed:   [FaRocket, "#C74634"],
 *     shield:      [FaShieldAlt, "#FFFFFF", 512],
 *   });
 *   // Then use: slide.addImage({ data: icons.rocketWhite, x, y, w, h })
 */
async function preRenderIcons(iconMap) {
  const result = {};
  await Promise.all(
    Object.entries(iconMap).map(async ([name, [IconComponent, color, size = 256]]) => {
      result[name] = await iconToBase64Png(IconComponent, color, size);
    })
  );
  return result;
}

module.exports = { renderIconSvg, iconToBase64Png, preRenderIcons };
