# Docker Commands — MVP Notes

A quick reference for the Docker commands covered so far.

---

## Table of Contents

- [Docker Setup](#docker-setup)
- [Docker Images](#docker-images)
- [Docker Containers](#docker-containers)
- [Container Lifecycle](#container-lifecycle)
- [Logs and Debugging](#logs-and-debugging)
- [Environment Variables](#environment-variables)
- [Build Arguments](#build-arguments)
- [Node.js Setup Commands](#nodejs-setup-commands)
- [Dockerfile Commands](#dockerfile-commands)
- [.dockerignore](#dockerignore)
- [Most Important Commands](#most-important-commands)
- [Docker Workflow](#docker-workflow)

---

# Docker Setup

## Check Docker Version

```bash
docker --version
```

Shows the installed Docker version.

---

## Check Docker Compose Version

```bash
docker compose version
```

Shows the installed Docker Compose version.

---

## Test Docker Installation

```bash
docker run hello-world
```

Downloads and runs the `hello-world` image.

If you see:

```text
Hello from Docker!
```

Docker is working correctly.

---

# Docker Images

## List Images

```bash
docker images
```

Shows all Docker images stored locally.

---

## Pull an Image

```bash
docker pull <imagename>
```

Downloads an existing image from a Docker registry such as Docker Hub.

Example:

```bash
docker pull node
```

---

## Pull a Specific Image Tag

```bash
docker pull <imagename>:<tag>
```

Example:

```bash
docker pull node:22-alpine
```

---

## Build an Image

```bash
docker build -t <imagename> .
```

Builds a Docker image using the `Dockerfile` in the current directory.

### Breakdown

```text
docker build
    ↓
Build an image

-t <imagename>
    ↓
Give the image a name

.
    ↓
Current directory = build context
```

---

## List Image History

```bash
docker history <imagename>
```

Shows the layers that make up an image.

---

## Remove an Image

```bash
docker rmi <imagename>
```

Removes an image from the local machine.

---

# Docker Containers

## Run a Container

```bash
docker run <imagename>
```

Creates and starts a new container from an image.

---

## Run in Background

```bash
docker run -d <imagename>
```

`-d` means detached mode.

The container runs in the background.

---

## Give Container a Name

```bash
docker run --name <containername> <imagename>
```

Example:

```bash
docker run --name <containername> <imagename>
```

---

## Map Ports

```bash
docker run -p <hostport>:<containerport> <imagename>
```

Maps a host port to a container port.

Example:

```bash
docker run -p 3000:3000 <imagename>
```

Means:

```text
Host Port 3000
      ↓
Container Port 3000
```

---

## Run with Name and Port

```bash
docker run -d \
  --name <containername> \
  -p <hostport>:<containerport> \
  <imagename>
```

This is a common command for running backend applications.

---

# View Containers

## Running Containers

```bash
docker ps
```

Shows only currently running containers.

---

## All Containers

```bash
docker ps -a
```

Shows all containers, including:

- Running
- Stopped
- Exited

Remember:

```text
docker ps
    ↓
Running containers

docker ps -a
    ↓
All containers
```

---

# Container Lifecycle

## Stop

```bash
docker stop <containername>
```

Stops a running container.

The container still exists.

---

## Start

```bash
docker start <containername>
```

Starts an existing stopped container.

---

## Restart

```bash
docker restart <containername>
```

Restarts a container.

---

## Remove

```bash
docker rm <containername>
```

Deletes a stopped container.

---

## Force Remove

```bash
docker rm -f <containername>
```

Force-removes a container.

---

## Container Lifecycle Diagram

```text
docker run
    ↓
Created + Started
    ↓
Running
    ↓
docker stop
    ↓
Stopped
    ↓
docker start
    ↓
Running
    ↓
docker rm
    ↓
Deleted
```

---

# Logs and Debugging

## View Logs

```bash
docker logs <containername>
```

Displays the logs/output of a container.

---

## Follow Logs

```bash
docker logs -f <containername>
```

Continuously displays new logs.

`-f` means **follow**.

---

## Enter a Running Container

```bash
docker exec -it <containername> sh
```

Opens a shell inside the running container.

Example:

```bash
docker exec -it <containername> sh
```

Inside the container:

```bash
ls
```

List files.

```bash
pwd
```

Show current directory.

```bash
env
```

Show environment variables.

```bash
exit
```

Leave the container.

---

## Execute a Command Inside Container

```bash
docker exec <containername> ls
```

Runs `ls` inside the container without opening a shell.

---

## Inspect Container

```bash
docker inspect <containername>
```

Displays detailed information about a container.

It can show:

- Configuration
- Networking
- Environment variables
- Mounts
- Image information
- Runtime configuration

---

# Environment Variables

Docker can pass environment variables to containers.

Node.js can access them through:

```javascript
process.env.PORT
```

---

## Pass One Variable

```bash
docker run -e KEY=value <imagename>
```

Example:

```bash
docker run -e NODE_ENV=production <imagename>
```

---

## Pass Multiple Variables

```bash
docker run \
  -e PORT=3000 \
  -e NODE_ENV=production \
  <imagename>
```

---

## Use `.env` File

```bash
docker run --env-file .env <imagename>
```

Example:

```bash
docker run -d \
  --name <containername> \
  -p 3000:3000 \
  --env-file .env \
  <imagename>
```

The `.env` file remains on the host and its values are passed to the container.

---

# Build Arguments

Build arguments are variables available during image building.

## Dockerfile

```dockerfile
ARG NODE_VERSION=22
```

## Build

```bash
docker build \
  --build-arg NODE_VERSION=22 \
  -t <imagename> .
```

Remember:

```text
ARG
 ↓
Build time
```

while:

```text
-e / --env-file
 ↓
Container runtime
```

---

# Node.js Setup Commands

These are not Docker commands, but were used while preparing the Node.js Docker example.

## Create Directory

```bash
mkdir <project-directory>
```

---

## Enter Directory

```bash
cd <project-directory>
```

---

## Initialize Node.js Project

```bash
npm init -y
```

Creates:

```text
package.json
```

---

## Install Express

```bash
npm install express
```

---

## Install Express + dotenv

```bash
npm install express dotenv
```

---

## Create Dockerfile

```bash
touch Dockerfile
```

---

# Dockerfile Commands

## FROM

```dockerfile
FROM node:22-alpine
```

Defines the base image.

---

## WORKDIR

```dockerfile
WORKDIR /app
```

Sets the working directory inside the image.

---

## COPY

```dockerfile
COPY package*.json ./
```

Copies package files into the image.

```dockerfile
COPY . .
```

Copies files from the build context into the image.

---

## RUN

```dockerfile
RUN npm install
```

Runs a command during image building.

---

## EXPOSE

```dockerfile
EXPOSE 3000
```

Documents the port used by the application.

> `EXPOSE` does not publish the port.

Port publishing happens with:

```bash
-p <hostport>:<containerport>
```

---

## CMD

```dockerfile
CMD ["npm", "start"]
```

Defines the default command executed when the container starts.

---

# `.dockerignore`

Create:

```text
.dockerignore
```

Typical Node.js example:

```text
node_modules
.git
.env
.env.*
dist
coverage
.DS_Store
```

This prevents unnecessary or sensitive files from being sent to the Docker build context.

---

# Most Important Commands

If you only want to remember the core commands:

```bash
# Docker
docker --version
docker run hello-world

# Images
docker images
docker pull <imagename>
docker build -t <imagename> .
docker rmi <imagename>

# Containers
docker run <imagename>
docker run -d <imagename>
docker ps
docker ps -a

# Lifecycle
docker start <containername>
docker stop <containername>
docker restart <containername>
docker rm <containername>

# Debugging
docker logs <containername>
docker logs -f <containername>
docker exec -it <containername> sh
docker inspect <containername>

# Environment
docker run -e KEY=value <imagename>
docker run --env-file .env <imagename>
```

---

# Docker Workflow

## Existing Image

```text
Docker Registry
      ↓
docker pull <imagename>
      ↓
Local Image
      ↓
docker run <imagename>
      ↓
Container
```

## Build Your Own Image

```text
Project
   ↓
Dockerfile
   ↓
docker build -t <imagename> .
   ↓
Docker Image
   ↓
docker run <imagename>
   ↓
Docker Container
   ↓
Running Application
```

---

# Quick Reference

```text
Dockerfile
    ↓ docker build
Image
    ↓ docker run
Container
    ↓
Application
```

```text
docker pull
    ↓
Download image
```

```text
docker build
    ↓
Create image
```

```text
docker run
    ↓
Create + start container
```

```text
docker stop
    ↓
Stop container
```

```text
docker rm
    ↓
Delete container
```

```text
docker rmi
    ↓
Delete image
```