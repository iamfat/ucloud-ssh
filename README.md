# ucloud-ssh

> UCloud SSH 是一个从浏览器访问, 方便对UCloud云主机进行管理的基于Vue/Nuxt/Express的SSR前端应用

## 如何使用
### 1. 建立自己的Docker镜像
``` bash
# build docker image
$ docker build -t genee/ucloud-ssh .
```
### 2. 准备 `docker-compose.yml` 文件
```yaml
version: "3"
services:
  ucloud-ssh:
    container_name: ucloud-ssh
    image: genee/ucloud-ssh
    ports:
      - 3000:3000/tcp
    restart: always
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /tmp:/tmp
      - ./ssh/config:/usr/local/share/ucloud-ssh/config
      - ./ssh/id_rsa:/usr/local/share/ucloud-ssh/id_rsa
      - ../../dev/log:/dev/log
```
### 3. 准备 `ssh_config` 和 `ssh_identity`
```bash
# sample of ssh_config
Host 10.10.*
  ProxyCommand /usr/bin/ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i /usr/local/share/ucloud-ssh/id_rsa -W %h:%p genee@vpn.genee.cn
  User genee
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  IdentityFile /usr/local/share/ucloud-ssh/id_rsa
  IdentitiesOnly yes
```

### 3. 运行
```bash
docker-compose up -d
```