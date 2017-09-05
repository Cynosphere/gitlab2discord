let _port = 8000;

let express = require("express");
let request = require("request");
let app = express();
let bp = require("body-parser");

app.get("/gitlab2discord",function(req,res){
    res.status(400);
    res.send("Cannot use GET for gitlab2discord, please resend using POST.");
});

app.use(bp.urlencoded({extended:true}));
app.post("/gitlab2discord",function(req,res){
    let args = req.query;
    if(!args.cid || !args.token){
        res.status(400);
        res.send("Token or Channel ID not found. Usage: /gitlab2discord?cid=<channel id>&token=<token>");
    }else{
        let data = "";

        req.on('data', function (d) {
            data += d;
        });

        req.on('end', function () {
            let d = JSON.parse(data);

            let embed = {};

            switch(d.object_kind){
                case "push":
                    let commit = d.commits[0];

                    embed = {embeds:[{
                        title:`New commit on project: \`${d.project.namespace}/${d.project.name}\``,
                        url:d.project.web_url,
                        description:`[\`${commit.id.substr(0,6)}\`](${commit.url}) - ${commit.message}`,
                        author:{
                            name:`${d.user_name} (${d.user_username})`
                        },
                        color:(0x008800).toString()
                    }]};

                    request.post(`https://discordapp.com/api/webhooks/${args.cid}/${args.token}`,{headers:{'Content-Type': 'application/json'},json:embed},function(err,r,body){
                        res.status(r.statusCode);
                        res.send(body);
                    });

                    break;
                case "issue":
                    let issue = d.object_attributes;

                    embed = {embeds:[{
                        title:`New issue on project: \`${d.project.namespace}/${d.project.name}\``,
                        url:d.project.web_url,
                        description:`[__${issue.title}__](${d.project.web_url}/issues/${issue.iid})\n${issue.description ? issue.description : "*No description provided*"}`,
                        author:{
                            name:`${d.user.name} (${d.user.username})`
                        },
                        fields:[{name:"State",value:issue.state}],
                        color:(0x880000).toString()
                    }]};

                    request.post(`https://discordapp.com/api/webhooks/${args.cid}/${args.token}`,{headers:{'Content-Type': 'application/json'},json:embed},function(err,r,body){
                        res.status(r.statusCode);
                        res.send(body);
                    });

                    break;
                case "merge_request":
                    let pr = d.object_attributes;

                    embed = {embeds:[{
                        title:`New PR on project: \`${d.project.namespace}/${d.project.name}\``,
                        url:d.project.web_url,
                        description:`[__${pr.title}__](${d.project.web_url}/issues/${pr.iid})\n${pr.description ? pr.description : "*No description provided*"}`,
                        author:{
                            name:`${d.user.name} (${d.user.username})`
                        },
                        fields:[{name:"State",value:pr.state}],
                        color:(0x880088).toString()
                    }]};

                    request.post(`https://discordapp.com/api/webhooks/${args.cid}/${args.token}`,{headers:{'Content-Type': 'application/json'},json:embed},function(err,r,body){
                        res.status(r.statusCode);
                        res.send(body);
                    });

                    break;
                case "note":
                    let cdata = d.object_attributes;

                    embed = {embeds:[{
                        title:`New \`${cdata.noteable_type}\` comment on project: \`${d.project.namespace}/${d.project.name}\``,
                        url:d.project.web_url,
                        description:cdata.note,
                        author:{
                            name:`${d.user.name} (${d.user.username})`
                        },
                        color:(0xFFFFFF).toString()
                    }]};

                    request.post(`https://discordapp.com/api/webhooks/${args.cid}/${args.token}`,{headers:{'Content-Type': 'application/json'},json:embed},function(err,r,body){
                        res.status(r.statusCode);
                        res.send(body);
                    });

                    break;
            }
        });
    }
});

app.listen(_port, function () {
    console.log(`gitlab2discord running on port ${_port}, at /gitlab2discord.`);
});