
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CameraCapture from '@/components/CameraCapture';
import { addVisitor } from '@/services/mockData';
import { toast } from 'sonner';

const VisitorForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    phone: '',
    email: '',
    company: '',
    photo: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCameraOpen = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handlePhotoCapture = (photoData: string) => {
    setFormData(prev => ({ ...prev, photo: photoData }));
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.document) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addVisitor(formData);
      toast.success('Visitante cadastrado com sucesso!');
      navigate('/visitantes');
    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
      toast.error('Erro ao cadastrar visitante');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-enter">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/visitantes')} 
          className="flex items-center gap-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Cadastrar Novo Visitante</h1>
        <p className="text-muted-foreground">
          Preencha os dados para cadastrar um novo visitante no sistema.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Dados do Visitante</CardTitle>
            <CardDescription>
              Os campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/visitantes')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Cadastro
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-md">
          <CameraCapture
            onCapture={handlePhotoCapture}
            onClose={handleCameraClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitorForm;
