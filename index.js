// Importing necessary modules
const fs = require('fs');
const url = require('url');
const http = require('http');
const replaceTemplate = require('./modules/replaceTemplate');
// const slugify = require('slugify');

// These files will be read only once when the page loads
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data); //array of objects

// const slugs = dataObj.map(el=>slugify(el.productName,{lower:true}));
// console.log(slugs);

//SERVER
const server = http.createServer((req,res)=>{
    const {query, pathname} = url.parse(req.url,true);

    //Overview Page
    if(pathname==='/overview' || pathname=='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        const cardHtml = dataObj.map((el=>replaceTemplate(tempCard,el))).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%/g,cardHtml);
        res.end(output);
    }

    //Product Page
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-Type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }
    
    //API
    else if(pathname==='/api'){

        //__dirname specifies where the current file is located.
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(data);
        
    }
    
    //Not Found
    else{
        res.writeHead(404,{'Content-Type':'text/HTML',});
        res.end('<h1>PAGE NOT FOUND!!<h1>')
    }
    
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening on port 8000...');
});

