import { describe, it, expect } from 'vitest';
import ticketsApi from '../services/api/tickets.api';
import mockStorage from '../services/mock/mockStorage';

describe('Tickets API & Filter Engine', () => {
  it('returns all seed complaints when no filter is applied', async () => {
    const tickets = await ticketsApi.getTickets();
    expect(tickets.length).toBeGreaterThan(0);
  });

  it('filters complaints by category accurately', async () => {
    const roadTickets = await ticketsApi.getTickets({ category: 'roads_potholes' });
    expect(roadTickets.length).toBeGreaterThan(0);
    roadTickets.forEach((t) => {
      expect(t.category).toBe('roads_potholes');
    });
  });

  it('filters complaints by status accurately', async () => {
    const resolvedTickets = await ticketsApi.getTickets({ status: 'resolved' });
    resolvedTickets.forEach((t) => {
      expect(t.status).toBe('resolved');
    });
  });

  it('searches complaints by text keyword', async () => {
    const searchResults = await ticketsApi.getTickets({ search: 'Market Street' });
    expect(searchResults.length).toBeGreaterThan(0);
  });
});
