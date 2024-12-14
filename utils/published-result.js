var XLSX = require("xlsx"); // This is using the CommonJS build
var formidable = require("formidable");

require("http").createServer(function(req, res) {
  if(req.method !== "POST") return res.end("");

  /* parse body and implement logic in callback */
  (new formidable.IncomingForm()).parse(req, function(err, fields, files) {
    /* if successful, files is an object whose keys are param names */
    var file = files["upload"]; // <input type="file" id="upload" name="upload">
    /* file.path is a location in the filesystem, usually in a temp folder */
    var wb = XLSX.readFile(file.filepath);
    // print the first worksheet back as a CSV
    res.end(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
  });
}).listen(process.env.PORT || 3000);