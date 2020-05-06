# Glue

Glue all the webapps together!

Acts a landing page/connects all of my projects. `fish` is the name of the umbrella project, frontend is done in [`apps/glue`](./apps/glue)

---

Install Steps (for myself):

Run [bootstrap](https://github.com/seanbreckenridge/bootstrap)

Setup git credentials, run (one) ssh-agent on interactive shell login ([source](https://unix.stackexchange.com/questions/90853/how-can-i-run-ssh-add-automatically-without-a-password-prompt/217223#217223)):

```sh
# add github key
if [ ! -S ~/.ssh/ssh_auth_sock ]; then
  eval `ssh-agent`
  ln -sf "$SSH_AUTH_SOCK" ~/.ssh/ssh_auth_sock
fi
export SSH_AUTH_SOCK=~/.ssh/ssh_auth_sock
ssh-add -l > /dev/null || ssh-add ~/.ssh/github
```

Run the `vps_install` script from my [vps](https://github.com/seanbreckenridge/vps) repo to setup everything.

Run `./production_server.sh <secret_file>`
