import { ReinforceTask } from '@/types';
import { initialReinforceTasks } from '@/data/inventory';

class Store {
  private reinforceTasks: ReinforceTask[] = JSON.parse(JSON.stringify(initialReinforceTasks));
  private listeners: Array<() => void> = [];

  getReinforceTasks(): ReinforceTask[] {
    return this.reinforceTasks;
  }

  updateTaskStatus(id: string, status: 'pending' | 'doing' | 'done') {
    this.reinforceTasks = this.reinforceTasks.map(t => t.id === id ? { ...t, status } : t);
    this.emit();
  }

  getTaskStats() {
    const total = this.reinforceTasks.length;
    const done = this.reinforceTasks.filter(t => t.status === 'done').length;
    const doing = this.reinforceTasks.filter(t => t.status === 'doing').length;
    const pending = this.reinforceTasks.filter(t => t.status === 'pending').length;
    return { total, done, doing, pending, progress: Math.round((done / total) * 100) };
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
