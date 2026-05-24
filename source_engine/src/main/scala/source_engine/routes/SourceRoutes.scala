package source_engine.routes

import cats.effect.IO
import org.http4s.*
import org.http4s.dsl.io.*
import org.http4s.circe.CirceEntityCodec.*

import source_engine.models.Source.*

object SourceRoutes:

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO]:

    // List all registered source providers
    case GET -> Root / "api" / "sources" =>
      Ok(List.empty[SourceProvider]) // TODO: Return registered providers

    // Search a specific source
    case GET -> Root / "api" / "sources" / sourceId / "search" :? QMatcher(query) =>
      Ok(List.empty[SearchResult]) // TODO: Implement search delegation

    // Get detail for a specific item from a source
    case GET -> Root / "api" / "sources" / sourceId / "item" / itemId =>
      Ok("{}") // TODO: Fetch item detail

    // Proxy external images to avoid CORS
    case GET -> Root / "api" / "proxy" / "image" :? UrlMatcher(imageUrl) =>
      Ok("") // TODO: Fetch and relay the image bytes

    // Health check
    case GET -> Root / "api" / "health" =>
      Ok("""{"status": "ok", "service": "source_engine-source-aggregator"}""")

  object QMatcher extends QueryParamDecoderMatcher[String]("q")
  object UrlMatcher extends QueryParamDecoderMatcher[String]("url")
