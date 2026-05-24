package source_engine.models

import io.circe.{Encoder, Decoder}
import io.circe.generic.semiauto.*

object Source:

  /** A registered source provider (e.g., MangaDex, Open Library, Gutenberg) */
  case class SourceProvider(
    id: String,
    name: String,
    baseUrl: String,
    description: String,
    enabled: Boolean
  ) derives Encoder.AsObject, Decoder

  /** A single search result from any source */
  case class SearchResult(
    sourceId: String,
    itemId: String,
    title: String,
    description: Option[String],
    coverUrl: Option[String],
    author: Option[String],
    relevanceScore: Double // Used to rank results across multiple sources
  ) derives Encoder.AsObject, Decoder

  /** Detailed view of a specific item */
  case class ItemDetail(
    sourceId: String,
    itemId: String,
    title: String,
    description: Option[String],
    coverUrl: Option[String],
    author: Option[String],
    chapters: List[Chapter],
    metadata: Map[String, String]
  ) derives Encoder.AsObject, Decoder

  /** A chapter or section of a source item */
  case class Chapter(
    id: String,
    title: String,
    number: Option[Double],
    pageCount: Option[Int],
    publishedAt: Option[String]
  ) derives Encoder.AsObject, Decoder
