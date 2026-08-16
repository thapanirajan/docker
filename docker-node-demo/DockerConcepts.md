# Docker — Theory & Concepts

Complete theory notes for the Docker MVP course covered so far.

---

# Table of Contents

- [What is Docker](#what-is-docker)
- [Why Docker](#why-docker)
- [Docker Architecture](#docker-architecture)
- [Docker Image](#docker-image)
- [Docker Container](#docker-container)
- [Dockerfile](#dockerfile)
- [Docker Registry](#docker-registry)
- [Docker Build Context](#docker-build-context)
- [Docker Layers](#docker-layers)
- [Docker Build Cache](#docker-build-cache)
- [Dockerfile Instructions](#dockerfile-instructions)
- [RUN vs CMD](#run-vs-cmd)
- [EXPOSE vs Port Mapping](#expose-vs-port-mapping)
- [Container Lifecycle](#container-lifecycle)
- [Environment Variables](#environment-variables)
- [ARG vs Environment Variables](#arg-vs-environment-variables)
- [.dockerignore](#dockerignore)
- [Docker Security](#docker-security)
- [Image vs Container](#image-vs-container)
- [Complete Docker Workflow](#complete-docker-workflow)
- [Core Mental Model](#core-mental-model)

---

# What is Docker?

Docker is a platform used to build, package, distribute, and run applications inside containers.

Docker solves a common development problem:

> "It works on my machine, but not on yours."

An application may depend on:

- Specific programming language versions
- Libraries
- Frameworks
- Operating system packages
- Environment configuration
- External dependencies

Docker packages the application environment in a repeatable way.

Conceptually:

```text
Application
     +
Runtime
     +
Dependencies
     +
Required Files
     ↓
Docker Image
     ↓
Docker Container
```

---

# Why Docker?

Docker provides several important benefits.

## 1. Environment Consistency

The same image can be used across:

```text
Developer Machine
       ↓
Testing
       ↓
CI/CD
       ↓
Production
```

---

## 2. Dependency Isolation

Different applications can use different versions of dependencies.

Example:

```text
Application A
    ↓
Node.js 20

Application B
    ↓
Node.js 22
```

They can run in separate containers.

---

## 3. Reproducibility

The same Dockerfile can repeatedly produce the same application environment.

---

## 4. Portability

A Dockerized application can run wherever a compatible container runtime is available.

---

## 5. Easier Development

Instead of manually installing:

```text
Node.js
PostgreSQL
Redis
MongoDB
```

Docker can be used to run these services consistently.

---

# Docker Architecture

A simplified Docker architecture:

```text
Developer
    │
    │ Docker CLI
    ↓
Docker Engine
    │
    ├── Images
    ├── Containers
    ├── Networks
    └── Volumes
```

The Docker CLI sends commands to the Docker daemon/engine.

Example:

```bash
docker run <imagename>
```

Conceptually:

```text
Docker CLI
    ↓
Docker Engine
    ↓
Create container
    ↓
Container runs
```

---

# Docker Image

A Docker image is a packaged, immutable template used to create containers.

An image can contain:

- Application code
- Runtime
- Dependencies
- Libraries
- Files
- Metadata
- Startup configuration

Example:

```text
<imagename>
├── Node.js
├── npm dependencies
├── Application code
└── Configuration
```

An image is **not** the same as a running application.

---

# Docker Container

A container is a runtime instance of an image.

```text
Image
  ↓
Container
```

One image can create multiple containers:

```text
              <imagename>
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
   Container  Container  Container
       1          2          3
```

Containers provide isolation for:

- Processes
- Filesystems
- Networking
- Environment
- Runtime configuration

---

# Dockerfile

A Dockerfile is a text file containing instructions for building a Docker image.

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

# Docker Registry

A Docker registry stores and distributes Docker images.

A common public registry is Docker Hub.

The workflow is:

```text
Registry
    ↓ docker pull
Local Machine
    ↓
Docker Image
```

And images can later be uploaded:

```text
Local Machine
    ↓ docker push
Registry
```

---

# Image Tags

Images can have tags.

Examples:

```text
node:22
node:22-alpine
nginx:1.29
```

General format:

```text
<imagename>:<tag>
```

For example:

```text
node:22-alpine
```

where:

```text
node
 ↓
Image name

22-alpine
 ↓
Tag
```

---

# Docker Build Context

When running:

```bash
docker build -t <imagename> .
```

the final:

```text
.
```

means:

> Use the current directory as the Docker build context.

Example:

```text
project/
├── Dockerfile
├── package.json
├── package-lock.json
├── src/
└── README.md
```

If you run:

```bash
docker build -t <imagename> .
```

then:

```text
project/
```

is the build context.

Dockerfile instructions such as:

```dockerfile
COPY . .
```

copy files from this context.

---

# Docker Layers

Docker images are built using layers.

For example:

```text
┌─────────────────────────────┐
│ Application Source Code     │
├─────────────────────────────┤
│ npm install                 │
├─────────────────────────────┤
│ package.json                │
├─────────────────────────────┤
│ Node.js Base Image          │
└─────────────────────────────┘
```

Each layer represents part of the image's filesystem/build history.

Layers help Docker:

- Reuse existing work
- Save storage
- Speed up builds
- Share common image components

---

# Docker Build Cache

Docker can reuse unchanged layers.

For Node.js applications, prefer:

```dockerfile
COPY package*.json ./

RUN npm install

COPY . .
```

Instead of:

```dockerfile
COPY . .

RUN npm install
```

Why?

Suppose only:

```text
src/controller.ts
```

changes.

But:

```text
package.json
package-lock.json
```

remain unchanged.

Docker can reuse the dependency layer:

```text
package files unchanged
        ↓
npm install layer cached
        ↓
Only application layer rebuilt
```

This makes builds faster.

---

# Dockerfile Instructions

## FROM

```dockerfile
FROM node:22-alpine
```

Defines the base image.

It provides the starting environment for the new image.

---

## WORKDIR

```dockerfile
WORKDIR /app
```

Sets the working directory inside the image/container.

It is conceptually similar to:

```bash
cd /app
```

---

## COPY

```dockerfile
COPY package*.json ./
```

Copies package files from the build context into the image.

Another example:

```dockerfile
COPY . .
```

Copies project files from the build context.

---

## RUN

```dockerfile
RUN npm install
```

Executes a command during image building.

Important:

```text
RUN
 ↓
Build time
```

---

## EXPOSE

```dockerfile
EXPOSE 3000
```

Documents the port used by the application inside the container.

Important:

`EXPOSE` does **not** publish the port.

Port publishing is done with:

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
Runtime
```

---

# RUN vs CMD

This is one of the most important Docker concepts.

## RUN

```dockerfile
RUN npm install
```

Runs during:

```text
docker build
```

---

## CMD

```dockerfile
CMD ["npm", "start"]
```

Runs when:

```text
docker run
```

starts the container.

Complete flow:

```text
docker build
     ↓
RUN commands
     ↓
Docker Image
     ↓
docker run
     ↓
CMD
     ↓
Application starts
```

Remember:

```text
RUN → Build time
CMD → Runtime
```

---

# EXPOSE vs Port Mapping

These are different.

## EXPOSE

```dockerfile
EXPOSE 3000
```

Documents that the application uses port 3000 inside the container.

---

## Port Mapping

```bash
docker run -p 3000:3000 <imagename>
```

Actually maps:

```text
Host
3000
 ↓
Container
3000
```

General format:

```text
-p <hostport>:<containerport>
```

---

# Container Lifecycle

A container typically follows this lifecycle:

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

Important:

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

# Environment Variables

Environment variables provide configuration to an application.

Node.js accesses them using:

```javascript
process.env.PORT
```

Docker can provide them when the container starts.

Example:

```bash
docker run -e PORT=3000 <imagename>
```

Flow:

```text
docker run -e PORT=3000
          ↓
Container Environment
          ↓
process.env.PORT
          ↓
3000
```

---

# `-e`

The `-e` option passes an environment variable.

Example:

```bash
docker run -e NODE_ENV=production <imagename>
```

Multiple variables:

```bash
docker run \
  -e PORT=3000 \
  -e NODE_ENV=production \
  <imagename>
```

---

# `.env` and `--env-file`

Instead of passing many variables individually:

```bash
docker run --env-file .env <imagename>
```

Docker reads variables from the `.env` file on the host.

Example `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=...
```

Flow:

```text
.env
  ↓
--env-file
  ↓
Container Environment
  ↓
process.env
```

The `.env` file does not need to be copied into the container.

---

# ARG vs Environment Variables

## ARG

```dockerfile
ARG NODE_VERSION=22
```

`ARG` is available during image building.

Example:

```bash
docker build \
  --build-arg NODE_VERSION=22 \
  -t <imagename> .
```

Flow:

```text
ARG
 ↓
Build time
```

---

## Runtime Environment

```bash
docker run -e NODE_ENV=production <imagename>
```

Flow:

```text
-e / --env-file
        ↓
Container runtime
```

Main distinction:

```text
ARG
 ↓
Build time

-e / --env-file
 ↓
Runtime
```

---

# `.dockerignore`

A `.dockerignore` file specifies files that should not be included in the Docker build context.

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

---

# Why Ignore `node_modules`?

Host `node_modules` may contain platform-specific binaries.

For example:

```text
Mac
  ↓
node_modules
```

should not necessarily be copied into:

```text
Linux Docker Container
```

Instead:

```dockerfile
COPY package*.json ./

RUN npm install
```

installs dependencies inside the image's environment.

---

# Why Ignore `.env`?

`.env` often contains sensitive information:

```env
DATABASE_URL=...
JWT_SECRET=...
API_KEY=...
```

You generally do not want these secrets baked into your Docker image.

Instead:

```bash
docker run --env-file .env <imagename>
```

provides them at runtime.

---

# Docker Security

Avoid putting secrets directly into a Dockerfile.

Do not do:

```dockerfile
COPY .env .
```

or:

```dockerfile
ENV JWT_SECRET=real-secret
```

Instead, provide configuration at runtime:

```bash
docker run --env-file .env <imagename>
```

For production environments, use the environment-variable or secret-management mechanism provided by your deployment platform.

---

# Image vs Container

This distinction is fundamental.

## Image

```text
Packaged template
```

## Container

```text
Running instance of the image
```

Relationship:

```text
IMAGE
  ↓ docker run
CONTAINER
```

One image can create many containers:

```text
            IMAGE
              │
       ┌──────┼──────┐
       ↓      ↓      ↓
      C1     C2     C3
```

---

# Dockerfile vs Image vs Container

```text
Dockerfile
    ↓
Instructions
    ↓ docker build
Image
    ↓
Packaged Template
    ↓ docker run
Container
    ↓
Running Instance
```

---

# Complete Docker Workflow

## Existing Image

```text
Docker Registry
      ↓
docker pull <imagename>
      ↓
Local Docker Image
      ↓
docker run <imagename>
      ↓
Docker Container
```

---

## Your Own Application

```text
Application
      ↓
Dockerfile
      +
.dockerignore
      ↓
Build Context
      ↓
docker build
      ↓
Docker Image
      ↓
docker run
      ↓
Docker Container
      ↓
Running Application
```

---

# Docker Mental Model

Keep this model in your head:

```text
                  Dockerfile
                      │
                      │
                 docker build
                      │
                      ↓
                    IMAGE
                      │
                      │
                  docker run
                      │
                      ↓
                  CONTAINER
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
        logs         exec       inspect
```

Environment configuration:

```text
                  .env
                    │
                    │ --env-file
                    ↓
               Container
                    │
                    ↓
              process.env
```

---

# Key Concepts to Remember

| Concept | Meaning |
|---|---|
| Docker | Platform for building and running containers |
| Image | Packaged template used to create containers |
| Container | Runtime instance of an image |
| Dockerfile | Instructions for building an image |
| Registry | Stores and distributes images |
| Docker Hub | Popular public Docker registry |
| Tag | Identifies an image variant/version |
| Build Context | Files available during a Docker build |
| `.dockerignore` | Excludes files from the build context |
| Layer | Reusable part of an image |
| Build Cache | Reuses unchanged build layers |
| Port Mapping | Connects host port to container port |
| Environment Variable | Runtime configuration |
| `ARG` | Build-time variable |
| `RUN` | Build-time command |
| `CMD` | Default runtime command |
| `.env` | Local environment configuration file |
| `--env-file` | Loads environment variables into a container |

---

# Knowledge Checklist

Before moving to the next Docker stage, you should understand:

- [x] What Docker is
- [x] Why Docker is used
- [x] Docker image
- [x] Docker container
- [x] Dockerfile
- [x] Docker registry
- [x] `docker pull`
- [x] `docker build`
- [x] `docker run`
- [x] Container lifecycle
- [x] Port mapping
- [x] `docker logs`
- [x] `docker exec`
- [x] `docker inspect`
- [x] Build context
- [x] `.dockerignore`
- [x] Image layers
- [x] Build caching
- [x] `RUN` vs `CMD`
- [x] `EXPOSE` vs port mapping
- [x] Environment variables
- [x] `-e`
- [x] `--env-file`
- [x] `ARG`
- [x] Basic Docker security

---

# Next Stage

The next step is to move from Docker fundamentals to a real backend project:

```text
Docker Fundamentals
        ↓
Dockerize Node.js Application
        ↓
Production Dockerfile
        ↓
Docker Compose
        ↓
Node.js + PostgreSQL
        ↓
Volumes
        ↓
Networks
        ↓
Health Checks
        ↓
Multi-stage Builds
        ↓
Optimization & Security
        ↓
Docker + CI/CD
```