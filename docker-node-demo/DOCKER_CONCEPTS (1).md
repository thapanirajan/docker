# Docker MVP — Concepts & Theory Notes

## 1. What is Docker?

Docker is a platform for packaging and running applications in isolated environments called **containers**.

The main problem Docker solves is environment inconsistency:

> "It works on my machine, but not on yours."

An application may depend on a particular runtime version, library, system package, or configuration. Docker packages the application and its required environment into a repeatable container image.

### Main idea

```text
Application
+ Runtime
+ Dependencies
+ Required configuration
        ↓
     Container
```

---

# 2. Why Use Docker?

Docker helps with:

- Environment consistency
- Application portability
- Dependency isolation
- Reproducible deployments
- Easier development setup
- Running multiple services independently
- CI/CD and production deployment

For a backend project, you might eventually run:

```text
Node.js API
PostgreSQL
Redis
```

as separate containers.

---

# 3. Docker vs Virtual Machine

A virtual machine normally contains a complete guest operating system.

```text
Host OS
   ↓
Virtual Machine
   ↓
Guest OS
   ↓
Application
```

Containers are lighter because they share the host operating system's kernel through the container runtime.

```text
Host OS
   ↓
Docker
   ├── Container
   ├── Container
   └── Container
```

Containers are generally faster to start and use fewer resources than full virtual machines.

---

# 4. Docker Image

An **image** is a packaged, immutable template used to create containers.

An image can contain:

- Application code
- Runtime
- Libraries
- Dependencies
- Files
- Metadata
- Startup configuration

Example:

```text
<imagename>
├── Node.js
├── npm dependencies
├── Application
└── Runtime configuration
```

An image is not the same thing as a running application.

---

# 5. Docker Container

A **container** is a created/running instance of an image.

```text
Image
  ↓
Container
```

One image can be used to create multiple containers:

```text
              <imagename>
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
   Container  Container  Container
       1          2          3
```

A container has its own isolated filesystem, processes, networking configuration, and other runtime settings.

---

# 6. Dockerfile

A **Dockerfile** is a text file containing instructions used to build an image.

Relationship:

```text
Dockerfile
    ↓ docker build
Docker Image
    ↓ docker run
Docker Container
```

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 7. Important Dockerfile Instructions

## FROM

```dockerfile
FROM node:22-alpine
```

Defines the base image.

Instead of manually installing Node.js, we start from an image that already provides Node.js.

---

## WORKDIR

```dockerfile
WORKDIR /app
```

Sets the working directory inside the image.

It is similar in concept to:

```bash
cd /app
```

Subsequent Dockerfile instructions operate relative to this directory.

---

## COPY

```dockerfile
COPY package*.json ./
```

Copies files from the build context into the image.

```dockerfile
COPY . .
```

Copies the project files from the build context into the image.

---

## RUN

```dockerfile
RUN npm install
```

Executes a command **during image building**.

Important:

```text
RUN
 ↓
Image build time
```

---

## EXPOSE

```dockerfile
EXPOSE 3000
```

Documents the port used by the application.

It does **not** publish the port to the host.

Publishing is done when running the container:

```bash
docker run -p <hostport>:<containerport> <imagename>
```

---

## CMD

```dockerfile
CMD ["npm", "start"]
```

Defines the default command executed when a container starts.

Important:

```text
CMD
 ↓
Container runtime
```

---

# 8. RUN vs CMD

This distinction is very important.

```dockerfile
RUN npm install
```

Runs while building the image.

```dockerfile
CMD ["npm", "start"]
```

Runs when the container starts.

```text
docker build
    ↓
RUN
    ↓
Image created
    ↓
docker run
    ↓
CMD
    ↓
Application starts
```

---

# 9. Docker Registry

A registry stores Docker images.

The most common public registry is Docker Hub.

Conceptually:

```text
Docker Hub
    ↓ docker pull
Local machine
```

You can also push your own images:

```text
Local machine
    ↓ docker push
Registry
```

---

# 10. Docker Pull

```bash
docker pull <imagename>
```

Downloads an existing image from a registry.

For example:

```bash
docker pull nginx
```

If no tag is specified, Docker commonly uses the `latest` tag:

```text
nginx
  ↓
nginx:latest
```

Tags identify image variants/versions.

Examples:

```text
node:22
node:22-alpine
nginx:1.29
```

---

# 11. Docker Run

```bash
docker run <imagename>
```

Creates and starts a new container from an image.

Conceptually:

```text
Image
  ↓
Create container
  ↓
Start container
```

If the image isn't available locally, Docker may pull it automatically.

---

# 12. Detached Mode

```bash
docker run -d <imagename>
```

`-d` means detached mode.

The container runs in the background instead of keeping the current terminal attached to it.

---

# 13. Container Naming

```bash
docker run --name <containername> <imagename>
```

Gives a container a human-readable name.

Without a custom name, Docker generates one automatically.

Names make commands easier:

```bash
docker stop <containername>
docker logs <containername>
docker exec -it <containername> sh
```

---

# 14. Port Mapping

Containers have their own network namespace.

Suppose an application listens on port `3000` inside a container.

To expose it through port `3000` on the host:

```bash
docker run -p 3000:3000 <imagename>
```

General format:

```text
-p <hostport>:<containerport>
```

Example:

```bash
docker run -p 8080:80 <imagename>
```

means:

```text
Host port 8080
      ↓
Container port 80
```

---

# 15. Container Lifecycle

A typical lifecycle is:

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

Important distinction:

```text
docker stop
    ↓
Container still exists
```

while:

```text
docker rm
    ↓
Container is deleted
```

---

# 16. docker ps vs docker ps -a

```bash
docker ps
```

Shows running containers.

```bash
docker ps -a
```

Shows all containers, including stopped/exited containers.

```text
docker ps
    ↓
Running only

docker ps -a
    ↓
All containers
```

---

# 17. Container Logs

```bash
docker logs <containername>
```

Displays the container's output/logs.

```bash
docker logs -f <containername>
```

Follows the logs continuously.

This is one of the most useful commands when debugging a backend running inside Docker.

---

# 18. docker exec

```bash
docker exec -it <containername> sh
```

Opens a shell inside a running container.

Useful for inspecting the container filesystem and debugging.

Example:

```bash
docker exec -it <containername> sh
```

Then:

```bash
ls
pwd
exit
```

---

# 19. docker inspect

```bash
docker inspect <containername>
```

Shows detailed information about a container.

It can reveal:

- Container configuration
- Networking
- Mounts
- Environment settings
- Image information
- Runtime configuration

---

# 20. Build Context

When you run:

```bash
docker build -t <imagename> .
```

the final `.` means:

> Use the current directory as the Docker build context.

The build context is the set of files Docker can access during the build.

Example:

```text
project/
├── Dockerfile
├── package.json
├── package-lock.json
└── src/
```

Running:

```bash
docker build -t <imagename> .
```

makes `project/` the build context.

---

# 21. `.dockerignore`

`.dockerignore` specifies files that should not be included in the Docker build context.

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

### Why ignore `node_modules`?

Dependencies should normally be installed inside the container:

```dockerfile
COPY package*.json ./
RUN npm install
```

This avoids copying host-specific dependencies into the image.

### Why ignore `.env`?

Secrets should not normally be baked into an image.

Examples:

```text
DATABASE_URL
JWT_SECRET
API_KEY
```

These should be supplied at runtime through appropriate configuration mechanisms.

---

# 22. Image Layers

Docker images are built from layers.

A simplified example:

```text
┌──────────────────────────┐
│ Application source       │
├──────────────────────────┤
│ npm install              │
├──────────────────────────┤
│ package files            │
├──────────────────────────┤
│ Node.js base image       │
└──────────────────────────┘
```

Docker can reuse unchanged layers through its build cache.

This makes subsequent builds faster.

---

# 23. Dockerfile Ordering and Cache

For a Node.js application, prefer:

```dockerfile
COPY package*.json ./

RUN npm install

COPY . .
```

rather than:

```dockerfile
COPY . .

RUN npm install
```

Why?

If only application source code changes:

```text
src/controller.ts changed
```

the dependency files may remain unchanged:

```text
package.json
package-lock.json
```

Docker can reuse the cached dependency-installation layer.

Conceptually:

```text
package files unchanged
        ↓
npm install layer cached
        ↓
only application layer rebuilt
```

---

# 24. The Complete Docker Workflow

## Existing image

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

## Your own application

```text
Application
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
      ↓
Running Application
```

---

# 25. Core Mental Model

Keep this model in your head:

```text
Dockerfile
    │
    │ docker build
    ↓
Image
    │
    │ docker run
    ↓
Container
    │
    ├── docker logs
    ├── docker exec
    ├── docker inspect
    │
    ├── docker stop
    │       ↓
    │    Stopped
    │       ↓
    │    docker start
    │
    └── docker rm
            ↓
         Deleted
```

## The key distinctions

```text
Dockerfile
→ Instructions for building an image

Image
→ Packaged template

Container
→ Instance of an image

Registry
→ Place where images are stored/shared

Build context
→ Files available during image build

.dockerignore
→ Files excluded from the build context

Layer
→ Reusable part of an image

RUN
→ Executes during image build

CMD
→ Default command when container starts
```
