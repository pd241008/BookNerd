ThisBuild / scalaVersion := "3.3.3"
ThisBuild / version      := "0.1.0"
ThisBuild / organization := "com.biblio"

lazy val root = (project in file("."))
  .settings(
    name := "biblio-source-aggregator",
    libraryDependencies ++= Seq(
      // HTTP Server
      "org.http4s"  %% "http4s-ember-server" % "0.23.27",
      "org.http4s"  %% "http4s-dsl"          % "0.23.27",
      "org.http4s"  %% "http4s-circe"        % "0.23.27",

      // JSON
      "io.circe" %% "circe-generic" % "0.14.9",
      "io.circe" %% "circe-parser"  % "0.14.9",

      // HTTP Client (for fetching from external sources)
      "org.http4s" %% "http4s-ember-client" % "0.23.27",

      // Logging
      "org.typelevel" %% "log4cats-slf4j" % "2.7.0",
      "ch.qos.logback" % "logback-classic" % "1.5.6",

      // Testing
      "org.scalameta" %% "munit" % "1.0.0" % Test,
    ),
  )
