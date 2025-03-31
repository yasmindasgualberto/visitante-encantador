import { Room, Visitor, Visit, Companion, Company, VisitReport, VisitsByRoom } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock rooms data
export const mockRooms: Room[] = [
  { id: '1', name: 'Sala de Reuniões 1', floor: 'Térreo', description: 'Capacidade para 8 pessoas', companyId: '1' },
  { id: '2', name: 'Sala de Reuniões 2', floor: '1º Andar', description: 'Capacidade para 4 pessoas', companyId: '1' },
  { id: '3', name: 'Escritório Administrativo', floor: '2º Andar', description: 'Diretoria', companyId: '2' },
  { id: '4', name: 'Auditório', floor: 'Térreo', description: 'Capacidade para 50 pessoas', companyId: '2' },
  { id: '5', name: 'Sala de Treinamento', floor: '3º Andar', description: 'Equipada com projetor', companyId: '3' },
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
    companyId: '1',
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
    companyId: '2',
    createdAt: new Date(2023, 2, 20) 
  },
  { 
    id: '3', 
    name: 'Mariana Costa', 
    document: '456.789.123-00', 
    photo: null, 
    phone: '(11) 95555-9999', 
    email: 'mariana@email.com',
    companyId: '3',
    createdAt: new Date(2023, 3, 5) 
  },
];

// Mock companies data
export const mockCompanies: Company[] = [
  {
    id: '1',
    companyName: 'Empresa ABC',
    responsibleName: 'João Silva',
    plan: 'professional',
    status: 'active',
    createdAt: '15/01/2023',
    email: 'joao@empresaabc.com',
    password: 'senha123'
  },
  {
    id: '2',
    companyName: 'Empresa XYZ',
    responsibleName: 'Maria Oliveira',
    plan: 'basic',
    status: 'blocked',
    createdAt: '02/03/2023',
    email: 'maria@empresaxyz.com',
    password: 'senha456'
  },
  {
    id: '3',
    companyName: 'Empresa 123',
    responsibleName: 'Carlos Santos',
    plan: 'enterprise',
    status: 'active',
    createdAt: '10/11/2022',
    email: 'carlos@empresa123.com',
    password: 'senha789'
  },
];

// Mock visits data with companyId
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
    status: 'completed',
    companyId: '1'
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
    status: 'active',
    companyId: '2'
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
    status: 'completed',
    companyId: '3'
  },
  { 
    id: '4', 
    visitorId: '1', 
    visitor: mockVisitors[0],
    roomId: '1', 
    room: mockRooms[0],
    responsible: 'Roberto Santos', 
    badgeCode: 'V00126', 
    entryTime: new Date(), 
    exitTime: new Date(), 
    companions: [], 
    status: 'completed',
    companyId: '1'
  },
  { 
    id: '5', 
    visitorId: '2', 
    visitor: mockVisitors[1],
    roomId: '2', 
    room: mockRooms[1],
    responsible: 'Juliana Mendes', 
    badgeCode: 'V00127', 
    entryTime: new Date(new Date().setDate(new Date().getDate() - 2)), 
    exitTime: new Date(new Date().setDate(new Date().getDate() - 2)),
    companions: [], 
    status: 'completed',
    companyId: '1'
  },
  { 
    id: '6', 
    visitorId: '3', 
    visitor: mockVisitors[2],
    roomId: '1', 
    room: mockRooms[0],
    responsible: 'Marcelo Lima', 
    badgeCode: 'V00128', 
    entryTime: new Date(new Date().setDate(new Date().getDate() - 10)), 
    exitTime: new Date(new Date().setDate(new Date().getDate() - 10)),
    companions: [], 
    status: 'completed',
    companyId: '1'
  },
];

// Mock service functions
let visitors = [...mockVisitors];
let rooms = [...mockRooms];
let visits = [...mockVisits];
let companies = [...mockCompanies];

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

// Company service
export const getCompanies = () => {
  return Promise.resolve([...companies]);
};

export const getCompanyById = (id: string) => {
  const company = companies.find(c => c.id === id);
  return Promise.resolve(company || null);
};

export const addCompany = (company: Omit<Company, 'id' | 'createdAt'>) => {
  const newCompany: Company = {
    ...company,
    id: uuidv4(),
    createdAt: new Date().toLocaleDateString('pt-BR')
  };
  companies.push(newCompany);
  return Promise.resolve(newCompany);
};

export const updateCompany = (id: string, data: Partial<Company>) => {
  const index = companies.findIndex(c => c.id === id);
  if (index >= 0) {
    companies[index] = { ...companies[index], ...data };
    return Promise.resolve(companies[index]);
  }
  return Promise.reject(new Error('Empresa não encontrada'));
};

export const deleteCompany = (id: string) => {
  const index = companies.findIndex(c => c.id === id);
  if (index >= 0) {
    const deleted = companies.splice(index, 1)[0];
    return Promise.resolve(deleted);
  }
  return Promise.reject(new Error('Empresa não encontrada'));
};

// Report service
export const getCompanyVisits = (companyId: string) => {
  return Promise.resolve(visits.filter(v => v.companyId === companyId));
};

export const getCompanyRooms = (companyId: string) => {
  return Promise.resolve(rooms.filter(r => r.companyId === companyId));
};

export const getCompanyVisitReport = (companyId: string): Promise<VisitReport> => {
  const companyVisits = visits.filter(v => v.companyId === companyId);
  const companyRooms = rooms.filter(r => r.companyId === companyId);
  
  // Data atual para cálculos de período
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Filtrar visitas por período
  const dailyVisits = companyVisits.filter(v => new Date(v.entryTime) >= today);
  const weeklyVisits = companyVisits.filter(v => new Date(v.entryTime) >= weekStart);
  const monthlyVisits = companyVisits.filter(v => new Date(v.entryTime) >= monthStart);
  
  // Função para calcular contagem de visitas por sala
  const calculateVisitsByRoom = (periodVisits: Visit[]): VisitsByRoom[] => {
    const visitsByRoom: Record<string, number> = {};
    
    // Inicializar contador para cada sala
    companyRooms.forEach(room => {
      visitsByRoom[room.id] = 0;
    });
    
    // Contabilizar visitas por sala
    periodVisits.forEach(visit => {
      if (visitsByRoom[visit.roomId] !== undefined) {
        visitsByRoom[visit.roomId]++;
      }
    });
    
    // Converter para o formato de retorno
    return Object.keys(visitsByRoom).map(roomId => {
      const room = companyRooms.find(r => r.id === roomId);
      return {
        roomId,
        roomName: room ? room.name : 'Sala desconhecida',
        count: visitsByRoom[roomId]
      };
    });
  };
  
  return Promise.resolve({
    daily: calculateVisitsByRoom(dailyVisits),
    weekly: calculateVisitsByRoom(weeklyVisits),
    monthly: calculateVisitsByRoom(monthlyVisits)
  });
};

// Generate badge code
export const generateBadgeCode = () => {
  const prefix = 'V';
  const number = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${number}`;
};
