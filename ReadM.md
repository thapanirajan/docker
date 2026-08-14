# Docker Basics

A beginner-friendly guide to Docker images, containers, port mapping, building images, and common Docker commands.

---

## Table of Contents

* [Dockerfile](#dockerfile)
* [Docker Image](#docker-image)
* [Docker Container](#docker-container)
* [Docker Pull](#docker-pull)
* [Docker Run](#docker-run)
* [Run a Container in the Background](#run-a-container-in-the-background)
* [List Docker Containers](#list-docker-containers)
* [Port Mapping](#port-mapping)
* [Create Your Own Docker Image](#create-your-own-docker-image)
* [Naming Containers](#naming-containers)
* [View Container Logs](#view-container-logs)
* [Common Docker Commands](#common-docker-commands)

---

## Dockerfile

A **Dockerfile** contains instructions that Docker uses to build a Docker image.

For example:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

A Dockerfile describes how your application environment should be created.

---

## Docker Image

A **Docker image** is a ready-to-use package or blueprint that contains everything needed to create and run a container.

An image can contain:

* Application code
* Runtime
* Libraries
* Dependencies
* Configuration
* Required system files

Examples:

```text
nginx
node
ubuntu
postgres
redis
```

---

## Docker Container

A **Docker container** is a created and/or running instance of a Docker image.

Think about the relationship like this:

```text
Docker Image
     ↓
Docker Container
```

For example:

```text
nginx image
     ↓
nginx container
```

You can create multiple containers from the same image.

```text
        nginx image
        /         \
       ↓           ↓
container 1    container 2
```

---

# Docker Pull

The `docker pull` command downloads an image from a container registry such as Docker Hub.

```bash
docker pull nginx
```

This downloads the `nginx` image to your machine.

---

# Docker Run

The `docker run` command creates **and starts** a new container from an image.

```bash
docker run nginx
```

If the `nginx` image does not already exist locally, Docker will normally pull it automatically.

Conceptually:

```text
docker run nginx
       ↓
Is nginx image available locally?
       ↓
     No
       ↓
Pull nginx image
       ↓
Create container
       ↓
Start container
```

So you don't normally need to do this first:

```bash
docker pull nginx
```

You can simply run:

```bash
docker run nginx
```

---

# Run a Container in the Background

By default, `docker run` attaches your terminal to the container.

To run a container in the background, use detached mode:

```bash
docker run -d nginx
```

### `-d`

`-d` means **detached mode**.

The container continues running in the background while you get your terminal back.

Example:

```bash
docker run -d nginx
```

---

# List Docker Containers

## Show Running Containers

```bash
docker ps
```

This shows currently running containers.

## Show All Containers

```bash
docker ps -a
```

This shows both running and stopped containers.

For example:

```text
CONTAINER ID   IMAGE   COMMAND   STATUS
abc123         nginx   ...       Up 2 minutes
def456         nginx   ...       Exited
```

---

# Port Mapping

Suppose an application inside a Docker container listens on port `3000`.

You can map your machine's port `3000` to the container's port `3000`:

```bash
docker run -d -p 3000:3000 my-app
```

The format is:

```text
-p HOST_PORT:CONTAINER_PORT
```

For example:

```bash
docker run -d -p 8080:80 nginx
```

This means:

```text
Your machine              Container
localhost:8080  ────────→  port 80
```

You can then access nginx through:

```text
localhost:8080
```

---

## Why Do We Need Port Mapping?

A port exposed by a process inside a container is not automatically published to the host.

For example, suppose your Express application listens on:

```text
0.0.0.0:3000
```

inside the container.

To make it accessible through your machine, publish the port:

```bash
docker run -d -p 3000:3000 my-app
```

Now:

```text
Mac/Host
localhost:3000
      ↓
Docker
      ↓
Container
port 3000
      ↓
Express app
```

> Note: The application should generally listen on `0.0.0.0` inside the container, not only `localhost`/`127.0.0.1`.

---

# Create Your Own Docker Image

You can create a Docker image from a Dockerfile using:

```bash
docker build -t my-app .
```

### `-t`

`-t` means **tag**.

It gives the image a name and optionally a tag.

Example:

```bash
docker build -t my-app .
```

This creates an image named:

```text
my-app
```

You can also specify a version:

```bash
docker build -t my-app:1.0 .
```

### `.`

The `.` means:

> Use the current directory as the build context.

Docker will look for the `Dockerfile` in that context by default.

---

# Naming Containers

You can give a container a custom name using `--name`.

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

Now instead of using the automatically generated container name or ID, you can refer to it as:

```text
my-nginx
```

For example:

```bash
docker logs my-nginx
```

or:

```bash
docker stop my-nginx
```

---

# View Container Logs

To see running containers:

```bash
docker ps
```

You will see a container ID:

```text
CONTAINER ID   IMAGE   STATUS
abc123         nginx   Up 2 minutes
```

Then view its logs:

```bash
docker logs abc123
```

You can also use the container name:

```bash
docker logs my-nginx
```

### Follow Logs

To continuously watch logs:

```bash
docker logs -f my-nginx
```

`-f` means **follow**.

---

# Execute Commands Inside a Container

The `docker exec` command allows you to execute a command inside a running container.

For example:

```bash
docker exec my-nginx ls
```

To open a shell inside a container:

```bash
docker exec -it my-nginx sh
```

If the container has Bash:

```bash
docker exec -it my-nginx bash
```

### `-it`

* `-i` → interactive
* `-t` → allocate a terminal

Together, `-it` gives you an interactive terminal inside the container.

---

# Common Docker Commands

| Command          | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `docker pull`    | Download an image                               |
| `docker build`   | Build an image from a Dockerfile                |
| `docker run`     | Create and start a new container                |
| `docker ps`      | Show running containers                         |
| `docker ps -a`   | Show all containers                             |
| `docker start`   | Start an existing stopped container             |
| `docker stop`    | Stop a running container                        |
| `docker restart` | Restart a container                             |
| `docker rm`      | Remove a container                              |
| `docker logs`    | View container logs                             |
| `docker exec`    | Execute a command inside a running container    |
| `docker inspect` | Show detailed information about a Docker object |

---

# Basic Docker Workflow

A typical workflow looks like this:

```text
              Dockerfile
                   │
                   │ docker build
                   ↓
              Docker Image
                   │
                   │ docker run
                   ↓
             Docker Container
                   │
          ┌────────┴────────┐
          ↓                 ↓
     docker logs        docker exec
          │                 │
          ↓                 ↓
       Logs            Inside container
```

For example:

```bash
# 1. Build an image
docker build -t my-app .

# 2. Create and start a container
docker run -d --name my-app-container -p 3000:3000 my-app

# 3. Check running containers
docker ps

# 4. View logs
docker logs my-app-container

# 5. Enter the container
docker exec -it my-app-container sh

# 6. Stop the container
docker stop my-app-container

# 7. Start it again
docker start my-app-container

# 8. Remove the container
docker rm my-app-container
```

---

# Quick Mental Model

The easiest way to remember Docker is:

```text
Dockerfile
    │
    │ docker build
    ↓
Docker Image
    │
    │ docker run
    ↓
Docker Container
```

### In simple words

* **Dockerfile** → Instructions for creating an image
* **Docker Image** → Blueprint/package
* **Docker Container** → Instance created from an image
* **`docker build`** → Create an image
* **`docker run`** → Create + start a container
* **`docker ps`** → See running containers
* **`docker stop`** → Stop a container
* **`docker start`** → Start a stopped container
* **`docker logs`** → See container output
* **`docker exec`** → Run commands inside a running container
* **`-p`** → Publish/map a container port to a host port
* **`-d`** → Run in the background
* **`--name`** → Give a container a custom name
