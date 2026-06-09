const apiUrl = 'http://4.224.186.213/evaluation-service/notifications';
const TOP_N = 10;

const typeWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

class MinHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    let idx = this.data.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.data[parent].score <= this.data[idx].score) break;
      [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];
      idx = parent;
    }
  }

  pop() {
    if (this.data.length === 0) return null;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length === 0) return top;
    this.data[0] = last;
    let idx = 0;
    const length = this.data.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;
      if (left < length && this.data[left].score < this.data[smallest].score) smallest = left;
      if (right < length && this.data[right].score < this.data[smallest].score) smallest = right;
      if (smallest === idx) break;
      [this.data[idx], this.data[smallest]] = [this.data[smallest], this.data[idx]];
      idx = smallest;
    }
    return top;
  }

  peek() {
    return this.data[0] || null;
  }

  size() {
    return this.data.length;
  }
}

function parseTimestamp(timestamp) {
  return new Date(timestamp).getTime();
}

function computeScore(notification) {
  const weight = typeWeight[notification.Type] || 0;
  const ageSeconds = Math.floor(parseTimestamp(notification.Timestamp) / 1000);
  // higher weight and newer timestamps should rank higher
  return weight * 1e12 - ageSeconds;
}

async function fetchNotifications() {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }
  const data = await response.json();
  return data.notifications || [];
}

async function topPriorityNotifications(n = TOP_N) {
  const notifications = await fetchNotifications();
  const heap = new MinHeap();

  for (const notification of notifications) {
    const score = computeScore(notification);
    const item = { notification, score };

    if (heap.size() < n) {
      heap.push(item);
      continue;
    }

    if (score > heap.peek().score) {
      heap.pop();
      heap.push(item);
    }
  }

  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop().notification);
  }

  return result.reverse();
}

(async () => {
  try {
    const topNotifications = await topPriorityNotifications();
    console.log('Top 10 priority notifications:');
    topNotifications.forEach((item, index) => {
      console.log(`${index + 1}. [${item.Type}] ${item.Message} (${item.Timestamp})`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
