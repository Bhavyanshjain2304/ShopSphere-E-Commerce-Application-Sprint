@echo off
echo === Building all services ===

echo Building eureka-server...
cd eureka-server && mvn clean package -DskipTests && cd ..

echo Building config-server...
cd config-server && mvn clean package -DskipTests && cd ..

echo Building auth-service...
cd auth-service && mvn clean package -DskipTests && cd ..

echo Building catalog-service...
cd catalog-service && mvn clean package -DskipTests && cd ..

echo Building order-service...
cd order-service && mvn clean package -DskipTests && cd ..

echo Building admin-service...
cd admin-service && mvn clean package -DskipTests && cd ..

echo Building notification-service...
cd notification-service && mvn clean package -DskipTests && cd ..

echo Building api-gateway...
cd api-gateway && mvn clean package -DskipTests && cd ..

echo === Building Docker images ===
docker build --pull=false -t shopsphere/eureka-server:latest ./eureka-server
docker build --pull=false -t shopsphere/config-server:latest ./config-server
docker build --pull=false -t shopsphere/auth-service:latest ./auth-service
docker build --pull=false -t shopsphere/catalog-service:latest ./catalog-service
docker build --pull=false -t shopsphere/order-service:latest ./order-service
docker build --pull=false -t shopsphere/admin-service:latest ./admin-service
docker build --pull=false -t shopsphere/notification-service:latest ./notification-service
docker build --pull=false -t shopsphere/api-gateway:latest ./api-gateway

echo === Done! Run: docker-compose up -d ===
