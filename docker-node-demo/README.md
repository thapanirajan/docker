# Docker MVP — Command Cheat Sheet

A quick reference for the Docker commands covered so far.

## 1. Docker Setup & Verification

| Command | Description |
|---|---|
| `docker --version` | Shows the installed Docker version |
| `docker compose version` | Shows the installed Docker Compose version |
| `docker run hello-world` | Verifies that Docker can pull an image and run a container |

## 2. Docker Images

| Command | Description |
|---|---|
| `docker images` | Lists images stored locally |
| `docker pull <imagename>` | Downloads an existing image from a registry such as Docker Hub |
| `docker pull <imagename>:<tag>` | Downloads a specific image tag |
| `docker build -t <imagename> .` | Builds an image using the Dockerfile in the current directory |
| `docker history <imagename>` | Shows the layers that make up an image |
| `docker rmi <imagename>` | Removes an image |

### `pull` vs `build`

```bash
docker pull <imagename>
```

Gets an **existing image**.

```bash
docker build -t <imagename> .
```

**Builds your own image** from a Dockerfile.

## 3. Run Containers

```bash
docker run <imagename>
```

Creates and starts a new container from an image.

```bash
docker run -d <imagename>
```

Runs the container in detached/background mode.

```bash
docker run -d --name <containername> <imagename>
```

Creates a container with a custom name.

```bash
docker run -d -p <hostport>:<containerport> <imagename>
```

Maps a host port to a container port.

Example:

```bash
docker run -d --name <containername> -p 8080:80 <imagename>
```

Meaning:

```text
Host port 8080  →  Container port 80
```

### Common `docker run` options

| Option | Description |
|---|---|
| `-d` | Detached/background mode |
| `--name <containername>` | Gives the container a custom name |
| `-p <host>:<container>` | Maps ports |

## 4. View Containers

```bash
docker ps
```

Shows currently running containers.

```bash
docker ps -a
```

Shows all containers, including stopped/exited containers.

### Remember

```text
docker ps
    ↓
Running containers only

docker ps -a
    ↓
All containers
```

## 5. Container Lifecycle

```bash
docker stop <containername>
```

Stops a running container. The container still exists.

```bash
docker start <containername>
```

Starts an existing stopped container.

```bash
docker restart <containername>
```

Restarts an existing container.

```bash
docker rm <containername>
```

Removes a stopped container.

```bash
docker rm -f <containername>
```

Force-removes a container, including a running one.

### Lifecycle

```text
docker run
    ↓
NEW container
    ↓
RUNNING
    ↓
docker stop
    ↓
STOPPED
    ↓
docker start
    ↓
RUNNING
    ↓
docker rm
    ↓
DELETED
```

## 6. Logs & Debugging

```bash
docker logs <containername>
```

Displays the container's logs.

```bash
docker logs -f <containername>
```

Continuously follows the logs.

`-f` means **follow**.

### Enter a running container

```bash
docker exec -it <containername> sh
```

Opens a shell inside the running container.

Inside the container:

```bash
ls
```

Lists files.

```bash
pwd
```

Shows the current directory.

```bash
exit
```

Leaves the container shell.

### Execute a command without opening a shell

```bash
docker exec <containername> ls
```

Runs `ls` inside the container.

### Inspect a container

```bash
docker inspect <containername>
```

Shows detailed container information such as configuration, networking, mounts, and environment settings.

## 7. Build an Image

```bash
docker build -t <imagename> .
```

Breakdown:

```text
docker build
    ↓
Build an image

-t <imagename>
    ↓
Give the image a name

.
    ↓
Use the current directory as the build context
```

## 8. Node.js Project Setup Commands

These are not Docker commands, but they were used to create the demo Node.js application.

```bash
mkdir <project-directory>
```

Creates a directory.

```bash
cd <project-directory>
```

Moves into the directory.

```bash
npm init -y
```

Creates a `package.json`.

```bash
npm install express
```

Installs Express.

```bash
touch Dockerfile
```

Creates an empty Dockerfile.

## 9. Dockerfile Instructions Covered

```dockerfile
FROM node:22-alpine
```

Sets the base image.

```dockerfile
WORKDIR /app
```

Sets the working directory inside the image/container.

```dockerfile
COPY package*.json ./
```

Copies `package.json` and `package-lock.json`.

```dockerfile
RUN npm install
```

Runs a command during image building.

```dockerfile
COPY . .
```

Copies files from the build context into the image.

```dockerfile
EXPOSE 3000
```

Documents that the application uses port 3000. It does **not** publish the port by itself.

```dockerfile
CMD ["npm", "start"]
```

Defines the default command executed when the container starts.

## 10. `.dockerignore`

Create:

```text
.dockerignore
```

Example:

```text
node_modules
.git
.env
dist
coverage
.DS_Store
```

This prevents unnecessary or sensitive files from being included in the Docker build context.

## 11. Core Workflow

### Using an existing image

```text
Registry
   ↓
docker pull <imagename>
   ↓
Local Image
   ↓
docker run <imagename>
   ↓
Container
```

### Creating your own image

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
Container
```

## 12. Most Important Commands

If you only want a short list to memorize:

```bash
# Images
docker images
docker pull <imagename>
docker build -t <imagename> .

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
docker exec -it <containername> sh
docker inspect <containername>
```
