package biblio

import cats.effect.{IO, IOApp}
import org.http4s.ember.server.EmberServerBuilder
import com.comcast.ip4s.*
import org.typelevel.log4cats.LoggerFactory
import org.typelevel.log4cats.slf4j.Slf4jFactory

import biblio.routes.SourceRoutes

object Main extends IOApp.Simple:

  given LoggerFactory[IO] = Slf4jFactory.create[IO]

  override def run: IO[Unit] =
    EmberServerBuilder
      .default[IO]
      .withHost(host"0.0.0.0")
      .withPort(port"8081")
      .withHttpApp(SourceRoutes.routes.orNotFound)
      .build
      .useForever
