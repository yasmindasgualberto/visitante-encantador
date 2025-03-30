
import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const url = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Erro ao gerar QR code');
  }
};
