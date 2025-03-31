
import React from 'react';

interface ClientStatusBadgeProps {
  status: string;
}

export const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'blocked':
        return 'Bloqueado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};
