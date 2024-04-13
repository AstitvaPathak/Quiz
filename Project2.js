const http = require('http');
const url = require('url');
const fs = require('fs').promises;

const serverHandler = (req, res) => {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }


    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    req.query = parsedUrl.query;
    let body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', async () => {
        req.body = body;
        if (routes[path] && routes[path][req.method]) 
        {
            routes[path][req.method](req, res); 
        } 
        else 
        {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Route not found');
        }
    });
};

const server = http.createServer(serverHandler);

const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server listening on : http://localhost:" + PORT);
});

function postFormate(task){
    const obj1={
        "difficulty":"",
        "questions":"",
        "options":[],
        "answer":""
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(task);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
    }
    return true;
}

const routes = {
    '/tasks': {
        'GET': async (req, res) => {
            try 
            {
                let tasks = JSON.parse(await fs.readFile('./quizData.json', 'utf-8'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tasks));
            } 
            catch (error) 
            {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal GET Server Error');
            }
        },
        'POST': async (req, res) => {
            try 
            {
                const tasks = JSON.parse(await fs.readFile('./quizData.json', 'utf-8'));
                const task = JSON.parse(req.body);       
                if(postFormate(task))
                {  
                    task["flag"]=1;
                    tasks.push(task); 
                    await fs.writeFile('./quizData.json', JSON.stringify(tasks));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(task));
                }
                else{
                    res.end("Invalid JSON Send");
                }
                
            } 
            catch (error) 
            {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal POST Server Error');
            }
        },
        'DELETE': async (req, res) => {
            try 
            {
                let tasks = JSON.parse(await fs.readFile('./quizData.json', 'utf-8'));
                const { id } = JSON.parse(req.body);
                var del=0;
                for (let i = 0; i < tasks.length; i++){
                    const taskid=tasks[i].id;
                    const requestid=id;
                    if(taskid===requestid)
                    {
                        tasks[i].flag=0;
                        del=1;
                    }
                };
                if(del==0)
                {
                    res.end("ID not found");
                }
                else{
                    await fs.writeFile('./quizData.json', JSON.stringify(tasks));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    tasks=tasks.filter(s=>s.flag!==0);
                    res.end(JSON.stringify(tasks));
                }
            } 
            catch (error) 
            {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal DELETE Server Error');
            }
        },
        'PUT': async (req, res) => {
            try 
            {
                const tasks = JSON.parse(await fs.readFile('./quizData.json', 'utf-8'));
                const body = JSON.parse(req.body);
                const { id } = JSON.parse(req.body);
                const indexToChange = tasks.findIndex(task => task.id === id);
                tasks[indexToChange] = body;
                await fs.writeFile('./tasks.json', JSON.stringify(tasks));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tasks));
            } 
            catch (error) 
            {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal PUT Server Error');
            }
        }
    },
    '/logIn':{
        'GET':async (req, res) => {
            try 
            {
                let ids = JSON.parse(await fs.readFile('./LogIn.json', 'utf-8'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(ids));
            } 
            catch (error) 
            {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal GET Server Error');
            }
        },
    }
};
