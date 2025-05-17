login: `vanilla`, password: `vanilla`

### Prerequisites:
#####
* java 8+
* maven 3.6+
* node.js 14.4+
* npm 6.14+
* git
* docker
* docker-compose

## Getting started locally
* change proxy for backend to localhost
```
target: 'http://localhost:8080'
```
* install dependencies and build front-end
```
mvn clean install -PUI_NO_SSO
```
* start environment
```
docker-compose up -d
```
* run application
```
press green button in Application.java
```