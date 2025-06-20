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

## 3. Amazon EKS 배포 가이드 (EKS Deployment)

이 애플리케이션을 AWS의 관리형 Kubernetes 서비스인 EKS에 배포하는 과정은 다음과 같습니다. `Kustomize`를 사용하여 설정을 편리하게 관리합니다.

### 1단계: 사전 준비 사항

-   [AWS CLI](https://aws.amazon.com/cli/) 설치 및 설정 완료
-   [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 설치 완료
-   EKS 클러스터에 연결 완료 (`aws eks update-kubeconfig ...`)
-   EKS 클러스터에 [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) 애드온 설치 완료
-   애플리케이션 컨테이너 이미지를 저장할 [Amazon ECR](https://aws.amazon.com/ecr/) 리포지토리 4개 생성 완료 (예: `gogetyourgreen-frontend`, `gogetyourgreen-api-gateway` 등)
-   데이터베이스로 사용할 [Amazon RDS](https://aws.amazon.com/rds/) (MySQL) 인스턴스 생성 완료

### 2단계: 컨테이너 이미지 빌드 및 ECR에 푸시

로컬 시스템에 있는 각 서비스의 소스 코드를 Docker 이미지로 빌드하여 ECR에 푸시합니다.

`<ACCOUNT_ID>`, `<REGION>`, `<REPO_NAME>`, `<TAG>`는 실제 환경에 맞게 변경해야 합니다.

```bash
# 각 서비스 디렉터리로 이동합니다. 예시는 frontend-service 입니다.
cd frontend-service

# 1. ECR 로그인
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

# 2. Docker 이미지 빌드
docker build -t <REPO_NAME>:<TAG> .

# 3. ECR 리포지토리 주소로 태그 지정
docker tag <REPO_NAME>:<TAG> <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>:<TAG>

# 4. ECR로 푸시
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>:<TAG>

# 5. 다른 서비스(api-gateway, product-service, order-service)에 대해서도 위 과정을 반복합니다.
```

### 3단계: Kubernetes 설정 수정

`k8s/kustomization.yaml` 파일을 열어 `images` 섹션을 실제 ECR 리포지토리 정보로 수정합니다. `newTag`에는 2단계에서 푸시한 이미지의 태그를 정확히 기입합니다.

`k8s/kustomization.yaml` 수정 예시:
```yaml
# ...
images:
  - name: <ECR_IMAGE_URI_FOR_API_GATEWAY>
    newName: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/gogetyourgreen-api-gateway
    newTag: v1.1.0
  - name: <ECR_IMAGE_URI_FOR_FRONTEND>
    newName: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/gogetyourgreen-frontend
    newTag: v1.1.0
  # ... 나머지 서비스도 동일하게 수정 ...
```

### 4단계: Kubernetes 배포

1.  **데이터베이스 접속 정보 생성 (최초 1회)**

    RDS 접속 정보를 담은 Kubernetes Secret을 생성합니다. 아래 내용을 담은 `db-secret.yaml` 파일을 임시로 생성한 후, `< >` 안의 값들을 실제 RDS 정보로 채워 실행하고 파일을 삭제하는 것을 권장합니다.

    `db-secret.yaml`:
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

    ```bash
    kubectl apply -f db-secret.yaml
    ```

2.  **애플리케이션 배포**

    `k8s` 디렉터리에서 아래 `kustomize` 명령어를 실행하면, `kustomization.yaml`에 정의된 모든 리소스가 수정된 이미지 태그와 함께 클러스터에 배포됩니다.

    ```bash
    cd k8s
    kubectl apply -k .
    ```

3.  **배포 확인 및 접속**

    배포가 완료되면 Ingress가 생성한 외부 로드 밸런서의 주소로 접속하여 애플리케이션을 확인할 수 있습니다.

    ```bash
    kubectl get ingress gogetyourgreen-ingress
    ```

이 가이드를 통해 팀원들이 프로젝트를 이해하고 EKS에 보다 쉽게 배포하는 데 도움이 되기를 바랍니다.
