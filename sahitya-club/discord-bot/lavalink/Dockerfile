FROM eclipse-temurin:21-jre

WORKDIR /opt/lavalink

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && curl -fsSL https://github.com/lavalink-devs/Lavalink/releases/download/4.2.2/Lavalink.jar -o Lavalink.jar

COPY application.yml ./application.yml

EXPOSE 2333

CMD ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "Lavalink.jar"]
