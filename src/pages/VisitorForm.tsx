
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CameraCapture from '@/components/CameraCapture';
import { addVisitor } from '@/services/mockData';
import { toast } from 'sonner';
import VisitorFormHeader from '@/components/visitor/VisitorFormHeader';
import VisitorFormFields from '@/components/visitor/VisitorFormFields';

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
      <VisitorFormHeader 
        title="Cadastrar Novo Visitante"
        description="Preencha os dados para cadastrar um novo visitante no sistema."
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Dados do Visitante</CardTitle>
            <CardDescription>
              Os campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <VisitorFormFields
              formData={formData}
              handleChange={handleChange}
              handleCameraOpen={handleCameraOpen}
            />
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
