import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { imageToBase64, resizeImage, PDFGenerator } from '@/lib/pdf-utils';
import { useToast } from '../ui/use-toast';

interface PDFHeaderConfigProps {
  onConfigChange?: (config: any) => void;
  defaultConfig?: {
    companyName: string;
    clientName: string;
    footerText?: string;
  };
}

export function PDFHeaderConfig({ onConfigChange, defaultConfig }: PDFHeaderConfigProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    companyName: defaultConfig?.companyName || '',
    clientName: defaultConfig?.clientName || '',
    footerText: defaultConfig?.footerText || '',
    systemOwnerLogo: null as any,
    clientLogo: null as any,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'systemOwnerLogo' | 'clientLogo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await imageToBase64(file);
      const resizedLogo = await resizeImage(base64, 500, 200);
      
      setConfig(prev => ({
        ...prev,
        [type]: resizedLogo
      }));

      if (onConfigChange) {
        onConfigChange({
          ...config,
          [type]: resizedLogo
        });
      }

      toast({
        title: "Logo actualizado",
        description: "El logo se ha actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error al cargar el logo",
        description: "Hubo un problema al procesar la imagen. Intente con otra imagen.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));

    if (onConfigChange) {
      onConfigChange({
        ...config,
        [name]: value
      });
    }
  };

  const handlePreview = () => {
    try {
      const pdfGenerator = new PDFGenerator({
        ...config,
        reportTitle: "Vista Previa del Reporte"
      });
      
      // Agregar contenido de ejemplo
      const pdf = pdfGenerator.getPDF();
      const startY = pdfGenerator.startY();
      
      pdf.setFontSize(11);
      pdf.text("Este es un ejemplo de cómo se verá el encabezado en sus reportes.", 20, startY);
      
      // Agregar pie de página
      pdfGenerator.addFooter(1);
      
      // Abrir en una nueva pestaña
      window.open(URL.createObjectURL(pdf.output('blob')));
      
      toast({
        title: "Vista previa generada",
        description: "Se ha generado una vista previa del encabezado del reporte.",
      });
    } catch (error) {
      toast({
        title: "Error al generar vista previa",
        description: "Hubo un problema al generar la vista previa del PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Encabezado de Reportes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="systemOwnerLogo">Logo de la Empresa del Sistema</Label>
            <Input
              id="systemOwnerLogo"
              type="file"
              accept="image/*"
              onChange={e => handleLogoUpload(e, 'systemOwnerLogo')}
            />
            {config.systemOwnerLogo && (
              <div className="mt-2">
                <img
                  src={config.systemOwnerLogo.imageData}
                  alt="Logo de la empresa"
                  className="max-h-20 object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientLogo">Logo del Cliente</Label>
            <Input
              id="clientLogo"
              type="file"
              accept="image/*"
              onChange={e => handleLogoUpload(e, 'clientLogo')}
            />
            {config.clientLogo && (
              <div className="mt-2">
                <img
                  src={config.clientLogo.imageData}
                  alt="Logo del cliente"
                  className="max-h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la Empresa del Sistema</Label>
          <Input
            id="companyName"
            name="companyName"
            value={config.companyName}
            onChange={handleInputChange}
            placeholder="Ej: Sistema de Gestión de Noticias"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientName">Nombre del Cliente</Label>
          <Input
            id="clientName"
            name="clientName"
            value={config.clientName}
            onChange={handleInputChange}
            placeholder="Ej: Banco XYZ"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerText">Texto del Pie de Página</Label>
          <Input
            id="footerText"
            name="footerText"
            value={config.footerText}
            onChange={handleInputChange}
            placeholder="Ej: Confidencial - Solo para uso interno"
          />
        </div>

        <Button onClick={handlePreview} className="w-full">
          Previsualizar Encabezado
        </Button>
      </CardContent>
    </Card>
  );
}
