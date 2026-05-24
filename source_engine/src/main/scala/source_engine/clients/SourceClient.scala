package source_engine.clients

import cats.effect.IO

import source_engine.models.Source.*

/**
 * Trait that every source provider must implement.
 * This is the contract that makes it trivial to add new sources —
 * just create a new class that extends SourceClient.
 */
trait SourceClient:
  def providerId: String
  def providerName: String
  def search(query: String): IO[List[SearchResult]]
  def getDetail(itemId: String): IO[ItemDetail]
  def getPageUrls(chapterId: String): IO[List[String]]