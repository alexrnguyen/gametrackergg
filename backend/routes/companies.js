const express = require("express");
const router = express.Router();
const headers = require("../headers");

// Get names of companies from IDs provided as query parameters
router.get("/", async (req, res) => {
    const companies = req.query.company;
    const companiesTuple = `(${companies})`;
  
    if (companies === null) {
      res.status(400).send({message: "Must include company IDs as query parameters (e.g. 'company=1&company=2&company=3' for companies with IDs 1, 2, and 3)."})
    }
  
    const url = "https://api.igdb.com/v4/companies/";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name; where id=${companiesTuple};`,
    });
    const data = await response.json();
  
    const companyNames = []
    for (const company of data) {
      companyNames.push({name: company.name});
    }
  
    res.status(200).json(companyNames);
});

module.exports = router;