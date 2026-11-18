FROM maven:3.9.11-eclipse-temurin-17 AS soundcloud-plugin

WORKDIR /build

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates tar \
  && rm -rf /var/lib/apt/lists/*

# Pinned upstream commit containing the AAC/fMP4 SoundCloud source extension.
ARG DIZZYBOT_SOURCES_COMMIT=5e1489d492f5809856e579b392c0cde1e67cb6fe

RUN curl -fsSL "https://codeload.github.com/john-9474/dizzybot/tar.gz/${DIZZYBOT_SOURCES_COMMIT}" -o /tmp/dizzybot.tar.gz \
  && mkdir -p /src \
  && tar -xzf /tmp/dizzybot.tar.gz --strip-components=1 -C /src \
  && mvn -B -ntp -f /src/deploy/lavalink/sources-plugin/pom.xml verify \
  && mkdir -p /out \
  && cp /src/deploy/lavalink/sources-plugin/target/dizzybot-sources.jar /out/dizzybot-sources.jar

FROM eclipse-temurin:21-jre

WORKDIR /opt/lavalink

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && curl -fsSL https://github.com/lavalink-devs/Lavalink/releases/download/4.2.2/Lavalink.jar -o Lavalink.jar

COPY application.yml ./application.yml
COPY --from=soundcloud-plugin /out/dizzybot-sources.jar ./plugins/dizzybot-sources.jar

EXPOSE 2333

CMD ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "Lavalink.jar"]
