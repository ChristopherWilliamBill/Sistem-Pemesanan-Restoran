"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/signin";
exports.ids = ["pages/api/signin"];
exports.modules = {

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "(api)/./lib/pg.ts":
/*!*******************!*\
  !*** ./lib/pg.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"conn\": () => (/* binding */ conn)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n\nlet conn;\nif (!conn) {\n    conn = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n        user: \"christopher\",\n        host: \"localhost\",\n        port: 5432,\n        database: \"christopher\"\n    });\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvcGcudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRTFCLElBQUlDLElBQUk7QUFFUixJQUFJLENBQUNBLElBQUksRUFBRTtJQUNUQSxJQUFJLEdBQUcsSUFBSUQsb0NBQUksQ0FBQztRQUNkRSxJQUFJLEVBQUUsYUFBYTtRQUNuQkMsSUFBSSxFQUFFLFdBQVc7UUFDakJDLElBQUksRUFBRSxJQUFJO1FBQ1ZDLFFBQVEsRUFBRSxhQUFhO0tBQ3hCLENBQUMsQ0FBQztDQUNKO0FBRWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2JhLXNrcmlwc2kvLi9saWIvcGcudHM/OTY3NiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5cbmxldCBjb25uOiBhbnk7XG5cbmlmICghY29ubikge1xuICBjb25uID0gbmV3IFBvb2woe1xuICAgIHVzZXI6IFwiY2hyaXN0b3BoZXJcIixcbiAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxuICAgIHBvcnQ6IDU0MzIsXG4gICAgZGF0YWJhc2U6IFwiY2hyaXN0b3BoZXJcIixcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGNvbm4gfTsiXSwibmFtZXMiOlsiUG9vbCIsImNvbm4iLCJ1c2VyIiwiaG9zdCIsInBvcnQiLCJkYXRhYmFzZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./lib/pg.ts\n");

/***/ }),

/***/ "(api)/./pages/api/signin.js":
/*!*****************************!*\
  !*** ./pages/api/signin.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lib_pg_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/pg.ts */ \"(api)/./lib/pg.ts\");\n// Next.js API route support: https://nextjs.org/docs/api-routes/introduction\n// export default function handler(req, res) {\n//   res.status(200).json({ name: 'John Doe' })\n// }\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{\n    if (req.method !== \"POST\") {\n        res.status(405);\n        return;\n    }\n    const request = JSON.parse(req.body);\n    const query = `SELECT * FROM \"Admin\" WHERE \"username\" = '${request.username}' AND \"password\" = '${request.password}'`;\n    const result = await _lib_pg_ts__WEBPACK_IMPORTED_MODULE_0__.conn.query(query);\n    const user = result.rows;\n    //user = array, user.length ngecek ada user atau ga\n    if (user.length) {\n        res.status(200).json(user);\n        return;\n    }\n    res.status(405).send({\n        message: \"username salah\"\n    });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc2lnbmluLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkVBQTZFO0FBRTdFLDhDQUE4QztBQUM5QywrQ0FBK0M7QUFDL0MsSUFBSTtBQUtpQztBQUdyQyxpRUFBZSxPQUFPQyxHQUFHLEVBQUVDLEdBQUcsR0FBSztJQUNqQyxJQUFHRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxNQUFNLEVBQUM7UUFDdkJELEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLE9BQU07S0FDUDtJQUVELE1BQU1DLE9BQU8sR0FBR0MsSUFBSSxDQUFDQyxLQUFLLENBQUNOLEdBQUcsQ0FBQ08sSUFBSSxDQUFDO0lBRXBDLE1BQU1DLEtBQUssR0FBRyxDQUFDLDBDQUEwQyxFQUFFSixPQUFPLENBQUNLLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRUwsT0FBTyxDQUFDTSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JILE1BQU1DLE1BQU0sR0FBRyxNQUFNWixrREFBVSxDQUFDUyxLQUFLLENBQUM7SUFDdEMsTUFBTUksSUFBSSxHQUFHRCxNQUFNLENBQUNFLElBQUk7SUFFeEIsbURBQW1EO0lBQ25ELElBQUdELElBQUksQ0FBQ0UsTUFBTSxFQUFDO1FBQ2JiLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDWSxJQUFJLENBQUNILElBQUksQ0FBQztRQUMxQixPQUFNO0tBQ1A7SUFFRFgsR0FBRyxDQUFDRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNhLElBQUksQ0FBQztRQUFFQyxPQUFPLEVBQUUsZ0JBQWdCO0tBQUUsQ0FBQztDQUNwRCIsInNvdXJjZXMiOlsid2VicGFjazovL2NvYmEtc2tyaXBzaS8uL3BhZ2VzL2FwaS9zaWduaW4uanM/NmRlMiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOZXh0LmpzIEFQSSByb3V0ZSBzdXBwb3J0OiBodHRwczovL25leHRqcy5vcmcvZG9jcy9hcGktcm91dGVzL2ludHJvZHVjdGlvblxuXG4vLyBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4vLyAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgbmFtZTogJ0pvaG4gRG9lJyB9KVxuLy8gfVxuXG5cblxuXG5pbXBvcnQge2Nvbm59IGZyb20gJy4uLy4uL2xpYi9wZy50cyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIGlmKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKXtcbiAgICByZXMuc3RhdHVzKDQwNSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHJlcXVlc3QgPSBKU09OLnBhcnNlKHJlcS5ib2R5KVxuXG4gIGNvbnN0IHF1ZXJ5ID0gYFNFTEVDVCAqIEZST00gXCJBZG1pblwiIFdIRVJFIFwidXNlcm5hbWVcIiA9ICcke3JlcXVlc3QudXNlcm5hbWV9JyBBTkQgXCJwYXNzd29yZFwiID0gJyR7cmVxdWVzdC5wYXNzd29yZH0nYFxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb25uLnF1ZXJ5KHF1ZXJ5KVxuICBjb25zdCB1c2VyID0gcmVzdWx0LnJvd3NcblxuICAvL3VzZXIgPSBhcnJheSwgdXNlci5sZW5ndGggbmdlY2VrIGFkYSB1c2VyIGF0YXUgZ2FcbiAgaWYodXNlci5sZW5ndGgpe1xuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHVzZXIpXG4gICAgcmV0dXJuXG4gIH1cblxuICByZXMuc3RhdHVzKDQwNSkuc2VuZCh7IG1lc3NhZ2U6ICd1c2VybmFtZSBzYWxhaCcgfSlcbn0iXSwibmFtZXMiOlsiY29ubiIsInJlcSIsInJlcyIsIm1ldGhvZCIsInN0YXR1cyIsInJlcXVlc3QiLCJKU09OIiwicGFyc2UiLCJib2R5IiwicXVlcnkiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwicmVzdWx0IiwidXNlciIsInJvd3MiLCJsZW5ndGgiLCJqc29uIiwic2VuZCIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/signin.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/signin.js"));
module.exports = __webpack_exports__;

})();