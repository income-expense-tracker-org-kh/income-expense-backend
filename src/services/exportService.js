import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from '../utils/helpers';

export const exportService = {
  // Export to PDF
  exportToPDF: (data, filename = 'report.pdf') => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Financial Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${formatDate(new Date())}`, 14, 30);
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(11);
    doc.text(`Total Income: ${formatCurrency(data.totalIncome)}`, 14, 48);
    doc.text(`Total Expense: ${formatCurrency(data.totalExpense)}`, 14, 56);
    doc.text(`Balance: ${formatCurrency(data.balance)}`, 14, 64);
    
    // Add transactions table
    if (data.transactions && data.transactions.length > 0) {
      doc.autoTable({
        startY: 75,
        head: [['Date', 'Category', 'Description', 'Type', 'Amount']],
        body: data.transactions.map(t => [
          formatDate(t.date),
          t.category,
          t.description || '-',
          t.type,
          formatCurrency(t.amount),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233] },
      });
    }
    
    // Save PDF
    doc.save(filename);
  },

  // Export to Excel
  exportToExcel: (data, filename = 'report.xlsx') => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Financial Summary'],
      [''],
      ['Total Income', formatCurrency(data.totalIncome)],
      ['Total Expense', formatCurrency(data.totalExpense)],
      ['Balance', formatCurrency(data.balance)],
      [''],
      ['Generated', formatDate(new Date())],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Transactions sheet
    if (data.transactions && data.transactions.length > 0) {
      const transactionsData = data.transactions.map(t => ({
        Date: formatDate(t.date),
        Category: t.category,
        Description: t.description || '-',
        Type: t.type,
        Amount: t.amount,
        'Payment Method': t.paymentMethod || '-',
      }));
      
      const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
      XLSX.utils.book_append_sheet(wb, transactionsSheet, 'Transactions');
    }
    
    // Category breakdown
    if (data.categoryBreakdown) {
      const categoryData = Object.values(data.categoryBreakdown).map(cat => ({
        Category: cat.category,
        Count: cat.count,
        Total: formatCurrency(cat.total),
      }));
      
      const categorySheet = XLSX.utils.json_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, categorySheet, 'Category Breakdown');
    }
    
    // Save Excel file
    XLSX.writeFile(wb, filename);
  },

  // Export to CSV
  exportToCSV: (transactions, filename = 'transactions.csv') => {
    const headers = ['Date', 'Category', 'Description', 'Type', 'Amount', 'Payment Method'];
    
    const csvData = [
      headers.join(','),
      ...transactions.map(t => [
        formatDate(t.date),
        t.category,
        `"${t.description || '-'}"`,
        t.type,
        t.amount,
        t.paymentMethod || '-',
      ].join(',')),
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
