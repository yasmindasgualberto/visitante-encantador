
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface VisitorFormFieldsProps {
  formData: {
    name: string;
    document: string;
    phone: string;
    email: string;
    company: string;
    photo: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCameraOpen: () => void;
}

const VisitorFormFields: React.FC<VisitorFormFieldsProps> = ({
  formData,
  handleChange,
  handleCameraOpen,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="document">Documento (CPF/RG) *</Label>
          <Input
            id="document"
            name="document"
            value={formData.document}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Empresa/Organização</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Foto</Label>
        <div className="flex items-start gap-4">
          <div className="border rounded-md p-1 w-32 h-32 flex items-center justify-center bg-muted/20">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Foto do visitante"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                Sem foto
              </div>
            )}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCameraOpen}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Capturar Foto
          </Button>
        </div>
      </div>
    </>
  );
};

export default VisitorFormFields;
