const fs = require("fs");
//File System module
const http = require("http");
// http server
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");
//////////////////////////////////////////////
//// FILES

// // // Blocking, synchronous way
// // const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// // //1| .readFileSync() takes buffer
// // const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// // console.log(textOut);

// // fs.writeFileSync("./txt/output.txt", textOut);
// // //2| .writeFileSync() path variable creates files
// // console.log("File written!");

// // Non-blocking, asynchronous way
// // We can call  "data" as we like
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log(err);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("file has been written");
//       });
//     });
//   });
// });
// console.log("Will read file!");

//////////////////////////////////////////////
//// SERVER

//Replacing funcion

//Importing templates html files
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

//Importing data.json files
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

//Parsing json data from data variable
const dataObj = JSON.parse(data);

//ACTUAL SERVERr
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map(eachObject => replaceTemplate(templateCard, eachObject))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    //Product api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world"
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server started on port 8000");
});
//127.0.0.1 - standard IP adrres for local host
