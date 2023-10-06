# [Glue](https://sean.fish)

<https://sean.fish>

Acts a landing page/connects all of my projects.

The home page is a GUI interface, where each 'page' is a window, inspired by old atari/compaq machines.

The `./development_server` and `./production_server` run this locally/in prod/have a couple extra commands to help me manage approving comments for the guestbook. All run with [`supervisor`](https://github.com/Supervisor/supervisor) by some code [here](https://github.com/seanbreckenridge/vps).

![](./assets/screenshot.png)

Before this iteration of the design, this [sort of looked like a geocities website](https://www.cameronsworld.net/), I extracted a version out of the git history [available here](https://github.com/seanbreckenridge/glue_geocities)

#### Dashboard

To password protect phoenix dashboard for production; using nginx (after installing `apache2-utils`)

To generate a password:

`sudo htpasswd -c /etc/nginx/.htpasswd sean`

To protect the route:

```
location /dashboard/ {
  # should include nginx pheonix params
  # include /etc/nginx/pheonix_params;
  proxy_pass http://127.0.0.1:8082/dashboard/;
  auth_basic "for glue dashboard!";
  auth_basic_user_file /etc/nginx/.htpasswd;
}
```
