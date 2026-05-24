package source_engine.cache

import cats.effect.IO
import scala.collection.concurrent.TrieMap
import scala.concurrent.duration.*

/**
 * Simple in-memory cache for development.
 * Replace with Redis when going to production.
 *
 * TODO: Add TTL-based expiration
 * TODO: Replace with Redis client (e.g., redis4cats)
 */
class InMemoryCache:

  private val store: TrieMap[String, (String, Long)] = TrieMap.empty

  def get(key: String): IO[Option[String]] = IO:
    store.get(key).flatMap: (value, expiresAt) =>
      if System.currentTimeMillis() < expiresAt then Some(value)
      else
        store.remove(key)
        None

  def set(key: String, value: String, ttl: FiniteDuration = 5.minutes): IO[Unit] = IO:
    store.put(key, (value, System.currentTimeMillis() + ttl.toMillis))
    ()

  def invalidate(key: String): IO[Unit] = IO:
    store.remove(key)
    ()
