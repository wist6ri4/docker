# ECR リポジトリ

## １．ECR リポジトリの作成

```bash
# aws ecr create-repository --repository-name [リポジトリ名] --region ap-northeast-1
aws ecr create-repository --repository-name react-practice-ecs --region ap-northeast-1
```

## ２．ECR リポジトリへのログインと Docker イメージのプッシュ

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com

# 本番用Dockerfileでビルド
# docker build -f Dockerfile.prod -t [Dcokerイメージ名] .
docker build -f Dockerfile.prod -t react-practice-ecr .
# タグ付け
# docker tag [Dcokerイメージ名]:latest [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/[リポジトリ名]:latest
docker tag react-practice-ecr:latest [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/react-practice-ecr:latest
# プッシュ
# docker push [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/[リポジトリ名]:latest
docker push [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/react-practice-ecr:latest
```

## ３．ECS クラスターの作成

```bash
# aws ecs create-cluster --cluster-name [クラスター名] --capacity-providers FARGATE
aws ecs create-cluster --cluster-name react-practice-ecs-cluster --capacity-providers FARGATE
```

## ４．ECS タスク定義の作成

```json:task-definition.json
{
    "family": "react-practice-ecs-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::[アカウントID]:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "react-practice-ecs-container",
            "image": "[アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/react-practice-ecs:latest",
            "portMappings": [
                {
                    "containerPort": 80,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/react-practice-ecs-task",
                    "awslogs-region": "ap-northeast-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
```

```bash
aws ecs register-task-definition --cli-input-json file://aws/task-definition.json
```

## ５．セキュリティグループの作成

```bash
# セキュリティグループ作成
aws ec2 create-security-group --group-name react-practice-sg --description "Security group for React-Practice"

# 以下のようなレスポンスが返ってくる
{
    "GroupId": "sg-xxxxxxxxx",
    "SecurityGroupArn": "arn:aws:ec2:ap-northeast-1:[アカウントID]:security-group/sg-xxxxxxxxx"
}

# HTTP許可
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxxx --protocol tcp --port 80 --cidr 0.0.0.0/0
```

## ６．ECS サービスの作成

```bash
# サービス作成
aws ecs create-service \
  --cluster react-practice-ecs-cluster \
  --service-name react-practice-ecs-service \
  --task-definition react-practice-ecs-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxxx],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}"
  ```
