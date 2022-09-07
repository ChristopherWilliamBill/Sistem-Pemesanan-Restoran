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
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/credentials":
/*!**************************************************!*\
  !*** external "next-auth/providers/credentials" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ "(api)/./pages/api/auth/[...nextauth].js":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"next-auth/providers/credentials\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    providers: [\n        next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default()({\n            name: \"username and password\",\n            credentials: {\n                username: {\n                    label: \"Username\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            authorize: async (credentials)=>{\n                const res = await fetch(\"http://localhost:3000/api/signin\", {\n                    method: \"POST\",\n                    body: JSON.stringify(credentials)\n                });\n                const hasil = await res.json();\n                if (res.ok && hasil) {\n                    console.log(\"NEXTAUTH: \", hasil[0]);\n                    return {\n                        id: hasil[0].id,\n                        name: hasil[0].username\n                    };\n                }\n                return null;\n            }\n        })\n    ],\n    callbacks: {\n        jwt: async ({ token , user  })=>{\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        },\n        session: ({ token , session  })=>{\n            if (token) {\n                session.id = token.id;\n            }\n            return session;\n        }\n    },\n    secret: \"test\",\n    jwt: {\n        encryption: true\n    }\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWlDO0FBQ2lDO0FBRWxFLGlFQUFlQSxnREFBUSxDQUFDO0lBQ3BCRSxTQUFTLEVBQUU7UUFDUEQsc0VBQW9CLENBQUM7WUFDakJFLElBQUksRUFBRSx1QkFBdUI7WUFDN0JDLFdBQVcsRUFBRTtnQkFDVEMsUUFBUSxFQUFFO29CQUFDQyxLQUFLLEVBQUUsVUFBVTtvQkFBRUMsSUFBSSxFQUFFLE1BQU07aUJBQUM7Z0JBQzNDQyxRQUFRLEVBQUU7b0JBQUNGLEtBQUssRUFBRSxVQUFVO29CQUFFQyxJQUFJLEVBQUUsVUFBVTtpQkFBQzthQUNsRDtZQUNERSxTQUFTLEVBQUUsT0FBT0wsV0FBVyxHQUFLO2dCQUM5QixNQUFNTSxHQUFHLEdBQUcsTUFBTUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFDO29CQUN2REMsTUFBTSxFQUFFLE1BQU07b0JBQ2RDLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUNYLFdBQVcsQ0FBQztpQkFDcEMsQ0FBQztnQkFFRixNQUFNWSxLQUFLLEdBQUcsTUFBTU4sR0FBRyxDQUFDTyxJQUFJLEVBQUU7Z0JBRTlCLElBQUdQLEdBQUcsQ0FBQ1EsRUFBRSxJQUFJRixLQUFLLEVBQUM7b0JBQ2ZHLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFlBQVksRUFBRUosS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxPQUFPO3dCQUNISyxFQUFFLEVBQUVMLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0ssRUFBRTt3QkFDZmxCLElBQUksRUFBRWEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDWCxRQUFRO3FCQUMxQixDQUFDO2lCQUNMO2dCQUVELE9BQU8sSUFBSTthQUNkO1NBQ0osQ0FBQztLQUNMO0lBQ0RpQixTQUFTLEVBQUU7UUFDUEMsR0FBRyxFQUFFLE9BQU0sRUFBQ0MsS0FBSyxHQUFFQyxJQUFJLEdBQUMsR0FBSztZQUN6QixJQUFHQSxJQUFJLEVBQUM7Z0JBQ0pELEtBQUssQ0FBQ0gsRUFBRSxHQUFHSSxJQUFJLENBQUNKLEVBQUU7YUFDckI7WUFFRCxPQUFPRyxLQUFLO1NBQ2Y7UUFDREUsT0FBTyxFQUFFLENBQUMsRUFBQ0YsS0FBSyxHQUFFRSxPQUFPLEdBQUMsR0FBSztZQUMzQixJQUFHRixLQUFLLEVBQUM7Z0JBQ0xFLE9BQU8sQ0FBQ0wsRUFBRSxHQUFHRyxLQUFLLENBQUNILEVBQUU7YUFDeEI7WUFFRCxPQUFPSyxPQUFPO1NBQ2pCO0tBQ0o7SUFDREMsTUFBTSxFQUFFLE1BQU07SUFDZEosR0FBRyxFQUFFO1FBQ0RLLFVBQVUsRUFBRSxJQUFJO0tBQ25CO0NBQ0osQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvYmEtc2tyaXBzaS8uL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0uanM/NTI3ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXJzIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCJcblxuZXhwb3J0IGRlZmF1bHQgTmV4dEF1dGgoe1xuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBDcmVkZW50aWFsc1Byb3ZpZGVycyh7XG4gICAgICAgICAgICBuYW1lOiBcInVzZXJuYW1lIGFuZCBwYXNzd29yZFwiLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZToge2xhYmVsOiBcIlVzZXJuYW1lXCIsIHR5cGU6IFwidGV4dFwifSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDoge2xhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRob3JpemU6IGFzeW5jIChjcmVkZW50aWFscykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3NpZ25pbicse1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscylcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzaWwgPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHJlcy5vayAmJiBoYXNpbCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTkVYVEFVVEg6IFwiLCBoYXNpbFswXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBoYXNpbFswXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGhhc2lsWzBdLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICBdLFxuICAgIGNhbGxiYWNrczoge1xuICAgICAgICBqd3Q6IGFzeW5jKHt0b2tlbiwgdXNlcn0pID0+IHtcbiAgICAgICAgICAgIGlmKHVzZXIpe1xuICAgICAgICAgICAgICAgIHRva2VuLmlkID0gdXNlci5pZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdG9rZW5cbiAgICAgICAgfSxcbiAgICAgICAgc2Vzc2lvbjogKHt0b2tlbiwgc2Vzc2lvbn0pID0+IHtcbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmlkID0gdG9rZW4uaWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlc3Npb25cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VjcmV0OiBcInRlc3RcIixcbiAgICBqd3Q6IHtcbiAgICAgICAgZW5jcnlwdGlvbjogdHJ1ZVxuICAgIH1cbn0pIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiQ3JlZGVudGlhbHNQcm92aWRlcnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJ1c2VybmFtZSIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImhhc2lsIiwianNvbiIsIm9rIiwiY29uc29sZSIsImxvZyIsImlkIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJ1c2VyIiwic2Vzc2lvbiIsInNlY3JldCIsImVuY3J5cHRpb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/[...nextauth].js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/auth/[...nextauth].js"));
module.exports = __webpack_exports__;

})();