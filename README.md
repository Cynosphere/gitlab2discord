# gitlab2discord
Gitlab webhook formatter for Discord

## Instal
- `git clone` this repo
- Run `npm install`

## Usage
- Set port on first line to whatever (perfered not 80 if you're running other webservers)
  - If you're using anything thats not express, proxy pass the port to a (sub)domain
- `node main.js`
- Setup webhook in Gitlab and Discord
  - The URL for Gitlab is `http://yourdomain.com/gitlab2discord`
    - Paramaters:
      - `cid` - Channel ID of your webhook (first thing after `/api/webhook/`)
      - `token` - Token of your webhook (second thing after `/api/webhook/`)
      - Example: `http://yourdomain.com/gitlab2discord?cid=12345&token=N0T-ar34l_t0k3n`
  - Events supported
    - Push
    - MergeRequest
    - Issues
    - Notes/Comments
- (Optional but recommended) Test webhook

## Resources
**Example nginx config:**
```nginx
server {
    listen 80;
    server_name g2d.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
    }
}
```
