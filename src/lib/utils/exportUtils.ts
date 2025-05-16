import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportAsImage = async (elementId: string, fileName = 'export') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = imgData;
  link.click();
};

export const exportAsPDF = async (elementId: string, fileName = 'export') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};

export const exportAsDoc = (elementId: string, fileName = 'export') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const html = element.innerHTML;
  const blob = new Blob([html], {
    type: 'application/msword',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.doc`;
  link.click();
};
