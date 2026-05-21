package biblio.clients

import cats.effect.IO

import biblio.models.Source.*

/**
 * MangaDex API client.
 * Docs: https://api.mangadex.org/docs
 * Base URL: https://api.mangadex.org
 *
 * TODO: Implement using http4s ember client
 */
class MangaDexClient extends SourceClient:

  override val providerId: String = "mangadex"
  override val providerName: String = "MangaDex"

  override def search(query: String): IO[List[SearchResult]] =
    // TODO: GET https://api.mangadex.org/manga?title={query}&limit=20
    IO.pure(List.empty)

  override def getDetail(itemId: String): IO[ItemDetail] =
    // TODO: GET https://api.mangadex.org/manga/{itemId}
    //       GET https://api.mangadex.org/manga/{itemId}/feed
    IO.raiseError(new NotImplementedError("MangaDex getDetail not implemented"))

  override def getPageUrls(chapterId: String): IO[List[String]] =
    // TODO: GET https://api.mangadex.org/at-home/server/{chapterId}
    IO.raiseError(new NotImplementedError("MangaDex getPageUrls not implemented"))
