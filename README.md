# GoGetYourGreen: E-commerce Platform

이 프로젝트는 식물 판매 E-commerce 플랫폼을 Microservice Architecture (MSA)로 구현한 샘플 프로젝트입니다. Docker를 사용하여 로컬 환경에서 전체 서비스를 손쉽게 실행할 수 있으며, Kubernetes(EKS) 배포를 위한 가이드를 포함하고 있습니다.

## 1. 서비스 아키텍처 (Service Architecture)

이 프로젝트는 Frontend, API Gateway, 그리고 여러 Backend 서비스들로 구성된 마이크로서비스 아키텍처를 따릅니다.

![Architecture Diagram](https://i.imgur.com/r6v5AAS.png)

-   **Frontend**: 사용자가 직접 상호작용하는 웹 애플리케이션입니다. React로 구현되었으며 Nginx 웹 서버를 통해 정적 파일로 제공됩니다.
-   **API Gateway**: 프론트엔드의 모든 API 요청을 받는 단일 진입점입니다. 요청 경로에 따라 적절한 백엔드 서비스로 요청을 라우팅합니다.
-   **Backend Services**: 각자 고유의 기능을 책임지는 독립적인 서비스들입니다 (`Product`, `Order`).
-   **Database**: `order-service`가 사용하는 데이터베이스로, 주문 정보를 영구적으로 저장합니다.

## 2. 각 서비스의 기능 설명

| 서비스명              | 주요 기술              | 포트 (컨테이너) | 설명                                                                                                                                                              |
| --------------------- | ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend-service`    | React, Nginx           | 80              | 사용자 인터페이스(UI)를 제공합니다. Nginx는 빌드된 React 정적 파일을 서빙하며, `/products`, `/orders`와 같은 API 요청을 API Gateway로 전달하는 리버스 프록시 역할도 수행합니다. |
| `api-gateway`         | Node.js, Express       | 3000            | 프론트엔드와 백엔드 서비스 사이의 중개자입니다. 모든 API 요청을 받아 적절한 서비스로 라우팅합니다. (예: `/products` -> `product-service`)                               |
| `product-service`     | Node.js, Express       | 3001            | 상품 정보(목록, 상세)를 제공하는 API 서버입니다. 현재는 하드코딩된 JSON 데이터를 사용하며, 상품 이미지는 외부 S3 버킷 URL을 사용합니다.                               |
| `order-service`       | Node.js, Express, MySQL | 3002            | 주문 생성, 조회, 삭제 기능을 담당하는 API 서버입니다. MySQL 데이터베이스에 주문 내역을 저장하고 관리합니다.                                                        |
| `mysqldb`             | MySQL 8.0              | 3306            | 주문 데이터를 저장하는 관계형 데이터베이스입니다. Docker의 영구 볼륨(persistent volume)을 사용하여 컨테이너가 재시작되어도 데이터가 유지됩니다.                            |

## 3. 로컬 환경에서 실행하기 (Local Development)

### 사전 준비 사항

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치 및 실행

### 실행 방법

1.  **환경 변수 파일 설정**

    프로젝트의 최상위 루트 디렉터리에 있는 `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다. 이 파일은 `docker-compose`가 데이터베이스 컨테이너를 설정하는 데 사용됩니다.

    ```bash
    cp .env.example .env
    ```

    `.env` 파일의 내용은 다음과 같습니다. 로컬 개발 환경에서는 기본값을 그대로 사용해도 무방합니다.

    ```
    # .env
    DB_USER=root
    DB_PASSWORD=rootpassword
    DB_NAME=gogetyourgreen
    ```

    > **참고**: `.env` 파일은 민감한 정보를 담고 있으므로 `.gitignore`에 의해 Git 추적에서 제외됩니다.

2.  **Docker Compose 실행**

    프로젝트의 최상위 루트 디렉터리에서 아래 명령어를 실행합니다. 이 명령어는 모든 서비스의 Docker 이미지를 빌드하고 컨테이너를 실행시킵니다. 처음 실행 시에는 의존성 설치 등으로 인해 시간이 다소 소요될 수 있습니다.

    ```bash
    docker-compose up --build
    ```

3.  **애플리케이션 접속**

    모든 컨테이너가 성공적으로 실행되면, 웹 브라우저에서 `http://localhost:8080` 주소로 접속하여 애플리케이션을 확인할 수 있습니다.

4.  **서비스 종료**

    터미널에서 `Ctrl + C`를 누른 후, 아래 명령어를 실행하여 모든 컨테이너와 네트워크를 깔끔하게 종료합니다.

    ```bash
    docker-compose down
    ```

### 사용자가 변경해야 할 사항

-   **데이터베이스**: 로컬 MySQL 비밀번호 등을 변경하고 싶다면, 최상위 루트의 `.env` 파일 값을 수정하면 됩니다.
-   **MySQL 포트 충돌**: 만약 로컬 PC에 이미 3306 포트를 사용하는 MySQL이 설치되어 있다면, `docker-compose.yml` 파일에서 `mysqldb` 서비스의 포트 매핑을 ` "3307:3306" ` 과 같이 다른 포트로 변경하여 충돌을 피할 수 있습니다. (현재 이미 `3307`로 설정되어 있습니다.)

## 4. Amazon EKS 배포 가이드 (EKS Deployment)

이 애플리케이션을 AWS의 관리형 Kubernetes 서비스인 EKS에 배포하는 과정은 다음과 같습니다.

### 1단계: 컨테이너 이미지 빌드 및 ECR에 푸시

각 서비스(`frontend-service`, `api-gateway`, `product-service`, `order-service`)의 이미지를 빌드하고, AWS의 Private Container Registry인 ECR에 푸시해야 합니다.

각 서비스 디렉터리에서 아래와 유사한 명령어를 실행합니다. (`<ACCOUNT_ID>`, `<REGION>`, `<REPO_NAME>`은 실제 값으로 대체해야 합니다.)

```bash
# 1. ECR 로그인
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

# 2. Docker 이미지 빌드
docker build -t <REPO_NAME> .

# 3. ECR 리포지토리 주소로 태그 지정
docker tag <REPO_NAME>:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>:latest

# 4. ECR로 푸시
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>:latest
```

### 2단계: 데이터베이스를 Amazon RDS로 이전

프로덕션 환경에서는 컨테이너로 DB를 직접 운영하는 대신, 관리형 데이터베이스 서비스인 Amazon RDS를 사용하는 것이 안정성과 확장성 면에서 권장됩니다.

1.  MySQL용 Amazon RDS 인스턴스를 생성합니다.
2.  RDS의 보안 그룹(Security Group)을 설정하여, EKS 클러스터의 워커 노드(Worker Node)들이 RDS의 3306 포트로 접근할 수 있도록 허용합니다.

### 3단계: Kubernetes Manifest 작성 및 배포

아래 예시와 같은 Kubernetes 설정 파일(`.yaml`)들을 작성하여 클러스터에 배포합니다.

#### 1. 데이터베이스 접속 정보 (Secret)

RDS 접속 정보를 `Secret`으로 만들어 안전하게 관리합니다. `stringData` 안의 값들을 실제 RDS 정보로 채워야 합니다.

`k8s/db-secret.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_HOST: <your-rds-endpoint>
  DB_USER: <your-rds-username>
  DB_PASSWORD: <your-rds-password>
  DB_NAME: gogetyourgreen
```

#### 2. 배포 (Deployment) 및 서비스 (Service)

각 마이크로서비스에 대해 `Deployment`와 `Service`를 정의합니다. 아래는 `order-service`의 예시이며, 다른 서비스들도 유사하게 작성할 수 있습니다. `spec.template.spec.containers.image` 필드에는 1단계에서 푸시한 ECR 이미지 주소를 넣어야 합니다.

`k8s/order-service.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/order-service:latest
        ports:
        - containerPort: 3002
        envFrom:
        - secretRef:
            name: db-secret
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
  - protocol: TCP
    port: 3002
    targetPort: 3002
```

#### 3. 인그레스 (Ingress)

외부 트래픽을 클러스터 내부의 `api-gateway`로 전달하기 위해 `Ingress`를 설정합니다. EKS 클러스터에 [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)가 미리 설치되어 있어야 합니다.

`k8s/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gogetyourgreen-ingress
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  ingressClassName: alb
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /products
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 3000
      - path: /orders
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 3000
```

#### 4. 배포 명령어

작성한 YAML 파일들을 `kubectl`을 사용하여 클러스터에 적용합니다.

```bash
# Secret 배포
kubectl apply -f k8s/db-secret.yaml

# 각 서비스 배포
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend-service.yaml

# Ingress 배포
kubectl apply -f k8s/ingress.yaml
```

이 가이드를 통해 팀원들이 프로젝트를 이해하고 배포하는 데 도움이 되기를 바랍니다.
