FROM eclipse-temurin:21-jdk AS build

WORKDIR /app
COPY . .
RUN ./sbt assembly

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/scala-3.3.3/*.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
