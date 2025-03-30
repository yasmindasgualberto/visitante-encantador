
import { Room, Visitor, Visit, Companion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock rooms data
export const mockRooms: Room[] = [
  { id: '1', name: 'Sala de Reuniões 1', floor: 'Térreo', description: 'Capacidade para 8 pessoas' },
  { id: '2', name: 'Sala de Reuniões 2', floor: '1º Andar', description: 'Capacidade para 4 pessoas' },
  { id: '3', name: 'Escritório Administrativo', floor: '2º Andar', description: 'Diretoria' },
  { id: '4', name: 'Auditório', floor: 'Térreo', description: 'Capacidade para 50 pessoas' },
  { id: '5', name: 'Sala de Treinamento', floor: '3º Andar', description: 'Equipada com projetor' },
];

// Mock visitors data
export const mockVisitors: Visitor[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    document: '123.456.789-00', 
    photo: null, 
    phone: '(11) 98765-4321', 
    email: 'ana.silva@email.com',
    company: 'Empresa ABC',
    createdAt: new Date(2023, 1, 15) 
  },
  { 
    id: '2', 
    name: 'Carlos Ferreira', 
    document: '987.654.321-00', 
    photo: null, 
    phone: '(11) 91234-5678', 
    email: 'carlos@email.com',
    company: 'Consultoria XYZ',
    createdAt: new Date(2023, 2, 20) 
  },
  { 
    id: '3', 
    name: 'Mariana Costa', 
    document: '456.789.123-00', 
    photo: null, 
    phone: '(11) 95555-9999', 
    email: 'mariana@email.com',
    createdAt: new Date(2023, 3, 5) 
  },
];

// Mock visits data
export const mockVisits: Visit[] = [
  { 
    id: '1', 
    visitorId: '1', 
    visitor: mockVisitors[0],
    roomId: '3', 
    room: mockRooms[2],
    responsible: 'Roberto Santos', 
    badgeCode: 'V00123', 
    entryTime: new Date(2023, 4, 10, 9, 30), 
    exitTime: new Date(2023, 4, 10, 11, 45), 
    companions: [], 
    status: 'completed' 
  },
  { 
    id: '2', 
    visitorId: '2', 
    visitor: mockVisitors[1],
    roomId: '1', 
    room: mockRooms[0],
    responsible: 'Juliana Mendes', 
    badgeCode: 'V00124', 
    entryTime: new Date(2023, 4, 12, 14, 0), 
    exitTime: null, 
    companions: [
      { id: '1', name: 'Eduardo Souza', document: '111.222.333-44', visitId: '2' }
    ], 
    status: 'active' 
  },
  { 
    id: '3', 
    visitorId: '3', 
    visitor: mockVisitors[2],
    roomId: '4', 
    room: mockRooms[3],
    responsible: 'Marcelo Lima', 
    badgeCode: 'V00125', 
    entryTime: new Date(2023, 4, 15, 10, 0), 
    exitTime: new Date(2023, 4, 15, 16, 30), 
    companions: [], 
    status: 'completed' 
  },
];

// Mock service functions
let visitors = [...mockVisitors];
let rooms = [...mockRooms];
let visits = [...mockVisits];

// Visitor service
export const getVisitors = () => {
  return Promise.resolve([...visitors]);
};

export const getVisitorById = (id: string) => {
  const visitor = visitors.find(v => v.id === id);
  return Promise.resolve(visitor || null);
};

export const addVisitor = (visitor: Omit<Visitor, 'id' | 'createdAt'>) => {
  const newVisitor: Visitor = {
    ...visitor,
    id: uuidv4(),
    createdAt: new Date()
  };
  visitors.push(newVisitor);
  return Promise.resolve(newVisitor);
};

export const updateVisitor = (id: string, data: Partial<Visitor>) => {
  const index = visitors.findIndex(v => v.id === id);
  if (index >= 0) {
    visitors[index] = { ...visitors[index], ...data };
    return Promise.resolve(visitors[index]);
  }
  return Promise.reject(new Error('Visitante não encontrado'));
};

// Room service
export const getRooms = () => {
  return Promise.resolve([...rooms]);
};

export const getRoomById = (id: string) => {
  const room = rooms.find(r => r.id === id);
  return Promise.resolve(room || null);
};

export const addRoom = (room: Omit<Room, 'id'>) => {
  const newRoom: Room = {
    ...room,
    id: uuidv4()
  };
  rooms.push(newRoom);
  return Promise.resolve(newRoom);
};

// Visit service
export const getVisits = () => {
  return Promise.resolve([...visits]);
};

export const getActiveVisits = () => {
  return Promise.resolve(visits.filter(v => v.status === 'active'));
};

export const getVisitById = (id: string) => {
  const visit = visits.find(v => v.id === id);
  return Promise.resolve(visit || null);
};

export const addVisit = (visit: Omit<Visit, 'id' | 'status'>) => {
  const newVisit: Visit = {
    ...visit,
    id: uuidv4(),
    status: 'active'
  };
  visits.push(newVisit);
  return Promise.resolve(newVisit);
};

export const checkoutVisit = (id: string) => {
  const index = visits.findIndex(v => v.id === id);
  if (index >= 0) {
    visits[index] = {
      ...visits[index],
      exitTime: new Date(),
      status: 'completed'
    };
    return Promise.resolve(visits[index]);
  }
  return Promise.reject(new Error('Visita não encontrada'));
};

export const addCompanion = (visitId: string, companion: Omit<Companion, 'id' | 'visitId'>) => {
  const index = visits.findIndex(v => v.id === visitId);
  if (index >= 0) {
    const newCompanion: Companion = {
      ...companion,
      id: uuidv4(),
      visitId
    };
    visits[index].companions.push(newCompanion);
    return Promise.resolve(newCompanion);
  }
  return Promise.reject(new Error('Visita não encontrada'));
};

// Generate badge code
export const generateBadgeCode = () => {
  const prefix = 'V';
  const number = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${number}`;
};
