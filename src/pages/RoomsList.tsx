
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit } from 'lucide-react';
import { getRooms } from '@/services/mockData';
import { Room } from '@/types';
import { toast } from 'sonner';

const RoomsList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
        setFilteredRooms(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        toast.error('Erro ao carregar a lista de salas');
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = rooms.filter(
        room =>
          room.name.toLowerCase().includes(term) ||
          room.floor.toLowerCase().includes(term) ||
          (room.description && room.description.toLowerCase().includes(term))
      );
      setFilteredRooms(filtered);
    }
  }, [searchTerm, rooms]);

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salas</h1>
          <p className="text-muted-foreground">
            Gerencie os locais e salas do prédio.
          </p>
        </div>
        <Button asChild>
          <Link to="/salas/nova" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar Nova Sala
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Salas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, andar ou descrição..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando salas...</div>
          ) : filteredRooms.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Andar/Localização</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/salas/editar/${room.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? 'Nenhuma sala encontrada para esta busca.'
                : 'Nenhuma sala cadastrada ainda.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomsList;
