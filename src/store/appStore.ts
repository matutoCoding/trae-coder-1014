import { ReinforceTask } from '@/types';
import { initialReinforceTasks } from '@/data/inventory';

const STORAGE_KEY = 'mariculture_reinforce_tasks';

class Store {
  private reinforceTasks: ReinforceTask[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    try {
      if (typeof Taro !== 'undefined' && Taro.getStorageSync) {
        const cached = Taro.getStorageSync(STORAGE_KEY);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          this.reinforceTasks = cached;
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    this.reinforceTasks = JSON.parse(JSON.stringify(initialReinforceTasks));
  }

  private saveTasks() {
    try {
      if (typeof Taro !== 'undefined' && Taro.setStorageSync) {
        Taro.setStorageSync(STORAGE_KEY, this.reinforceTasks);
      }
    } catch (e) {
      // ignore
    }
  }

  getReinforceTasks(): ReinforceTask[] {
    return this.reinforceTasks;
  }

  updateTaskStatus(id: string, status: 'pending' | 'doing' | 'done') {
    this.reinforceTasks = this.reinforceTasks.map(t => t.id === id ? { ...t, status } : t);
    this.saveTasks();
    this.emit();
  }

  getTaskStats() {
    const total = this.reinforceTasks.length;
    const done = this.reinforceTasks.filter(t => t.status === 'done').length;
    const doing = this.reinforceTasks.filter(t => t.status === 'doing').length;
    const pending = this.reinforceTasks.filter(t => t.status === 'pending').length;
    return { total, done, doing, pending, progress: Math.round((done / total) * 100) };
  }

  getAreaTaskStats() {
    const map: Record<string, { total: number; done: number; doing: number; pending: number; tasks: ReinforceTask[] }> = {};
    this.reinforceTasks.forEach(t => {
      if (!map[t.area]) {
        map[t.area] = { total: 0, done: 0, doing: 0, pending: 0, tasks: [] };
      }
      map[t.area].total += 1;
      map[t.area].tasks.push(t);
      if (t.status === 'done') map[t.area].done += 1;
      else if (t.status === 'doing') map[t.area].doing += 1;
      else map[t.area].pending += 1;
    });
    return Object.entries(map).map(([area, stats]) => ({
      area,
      ...stats,
      progress: Math.round((stats.done / stats.total) * 100)
    })).sort((a, b) => a.progress - b.progress);
  }

  subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private emit() {
    this.listeners.forEach(fn => fn());
  }
}

export const appStore = new Store();
