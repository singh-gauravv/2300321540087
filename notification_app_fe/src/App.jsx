import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'http://4.224.186.213/evaluation-service/notifications'
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
}

class MinHeap {
  constructor() {
    this.data = []
  }

  push(item) {
    this.data.push(item)
    let idx = this.data.length - 1
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2)
      if (this.data[parent].score <= this.data[idx].score) break
      ;[this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]]
      idx = parent
    }
  }

  pop() {
    if (this.data.length === 0) return null
    const top = this.data[0]
    const last = this.data.pop()
    if (this.data.length === 0) return top
    this.data[0] = last
    let idx = 0
    const length = this.data.length
    while (true) {
      let left = 2 * idx + 1
      let right = 2 * idx + 2
      let smallest = idx
      if (left < length && this.data[left].score < this.data[smallest].score) smallest = left
      if (right < length && this.data[right].score < this.data[smallest].score) smallest = right
      if (smallest === idx) break
      ;[this.data[idx], this.data[smallest]] = [this.data[smallest], this.data[idx]]
      idx = smallest
    }
    return top
  }

  peek() {
    return this.data[0] || null
  }

  size() {
    return this.data.length
  }
}

function normalizeNotification(raw) {
  return {
    id: raw.ID || raw.id || raw.notificationId || '',
    type: raw.Type || raw.type || 'Event',
    message: raw.Message || raw.message || '',
    timestamp: raw.Timestamp || raw.timestamp || '',
  }
}

function parseTimestamp(timestamp = '') {
  const value = Date.parse(timestamp)
  return Number.isFinite(value) ? value : 0
}

function computeScore(notification) {
  const weight = TYPE_WEIGHT[notification.type] || 0
  return weight * 1e12 - parseTimestamp(notification.timestamp)
}

function getTopNotifications(items, n) {
  const heap = new MinHeap()
  for (const item of items) {
    const score = computeScore(item)
    const node = { item, score }
    if (heap.size() < n) {
      heap.push(node)
      continue
    }
    if (score > heap.peek().score) {
      heap.pop()
      heap.push(node)
    }
  }
  const result = []
  while (heap.size()) {
    result.push(heap.pop().item)
  }
  return result.reverse()
}

function readViewed() {
  try {
    const raw = localStorage.getItem('viewedNotifications')
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function App() {
  const [notifications, setNotifications] = useState([])
  const [viewedIds, setViewedIds] = useState(() => readViewed())
  const [filterType, setFilterType] = useState('All')
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('viewedNotifications', JSON.stringify([...viewedIds]))
  }, [viewedIds])

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          page: String(page),
        })
        if (filterType !== 'All') params.set('notification_type', filterType)
        const response = await fetch(`${API_BASE}?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`Failed to load notifications (${response.status})`)
        }
        const data = await response.json()
        const list = (data.notifications || []).map(normalizeNotification)
        setNotifications(list)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filterType, page, limit])

  const priorityNotifications = useMemo(() => getTopNotifications(notifications, 10), [notifications])
  const displayedNotifications = tab === 'priority' ? priorityNotifications : notifications
  const newCount = notifications.reduce(
    (count, item) => (viewedIds.has(item.id) ? count : count + 1),
    0,
  )

  const markViewed = (id) => {
    setViewedIds((current) => new Set(current).add(id))
  }

  const markAllViewed = () => {
    setViewedIds((current) => {
      const next = new Set(current)
      notifications.forEach((item) => next.add(item.id))
      return next
    })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Notification dashboard</p>
          <h1>Student Notifications</h1>
          <p className="subtitle">
            View all notifications, filtered by type, and see top priority items.
          </p>
        </div>
        <div className="status-chip">
          <strong>{newCount}</strong> new
        </div>
      </header>

      <section className="controls">
        <div className="tabs">
          <button
            type="button"
            className={tab === 'all' ? 'active' : ''}
            onClick={() => setTab('all')}
          >
            All notifications
          </button>
          <button
            type="button"
            className={tab === 'priority' ? 'active' : ''}
            onClick={() => setTab('priority')}
          >
            Priority inbox
          </button>
        </div>

        <div className="filters">
          <label>
            Type
            <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
              <option>All</option>
              <option>Placement</option>
              <option>Result</option>
              <option>Event</option>
            </select>
          </label>
          <label>
            Page
            <input
              type="number"
              min="1"
              value={page}
              onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          <label>
            Limit
            <input
              type="number"
              min="1"
              max="50"
              value={limit}
              onChange={(event) => setLimit(Math.max(1, Number(event.target.value) || 10))}
            />
          </label>
          <button type="button" className="small" onClick={markAllViewed}>
            Mark all viewed
          </button>
        </div>
      </section>

      {error ? (
        <div className="alert">{error}</div>
      ) : loading ? (
        <div className="loading">Loading notifications…</div>
      ) : (
        <section className="notification-list">
          {displayedNotifications.length === 0 ? (
            <div className="empty-state">No notifications available.</div>
          ) : (
            displayedNotifications.map((notification) => {
              const isNew = !viewedIds.has(notification.id)
              return (
                <article key={notification.id} className={`notification-card ${isNew ? 'new' : ''}`}>
                  <div className="notification-meta">
                    <span className={`badge badge-${notification.type.toLowerCase()}`}>{notification.type}</span>
                    {isNew && <span className="pill">NEW</span>}
                  </div>
                  <p className="message">{notification.message}</p>
                  <div className="footer-row">
                    <span className="timestamp">{notification.timestamp}</span>
                    <button type="button" onClick={() => markViewed(notification.id)}>
                      Mark viewed
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </section>
      )}
    </div>
  )
}

export default App
