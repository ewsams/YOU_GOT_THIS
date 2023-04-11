import { Component, inject, OnInit } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { ThemeService } from '../../services/theme.service';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { PdfService } from '../../services/pdf.service';
import { SubResolver } from '../../helpers/sub-resolver';
import { takeUntil } from 'rxjs';
import { PdfMetrics } from '../../models/pdf-metrics.model';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
})
export class PdfUploadComponent extends SubResolver implements OnInit {
  protected themeService = inject(ThemeService);
  private _pdfService = inject(PdfService);
  protected selectedEncoding = 'cl100k_base';
  protected file: File | null = null;
  protected metrics: PdfMetrics = {};
  protected loading = false;
  protected progress = 0;

  ngOnInit(): void {}

  public onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
      this.readPDF(this.file);
    }
  }

  public async readPDF(file: File): Promise<void> {
    GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';
    this.loading = true;
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const pdfBytes = new Uint8Array(fileReader.result as ArrayBuffer);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      this.metrics = {
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        fileSize: (file.size / 1024).toFixed(2),
      };

      const pdfJsDoc = await getDocument({ data: pdfBytes }).promise;
      const textContent = await this.extractTextContent(pdfJsDoc);
      this.metrics.wordCount = this.countWords(textContent);

      const encoding_name = this.selectedEncoding;
      this._pdfService
        .countTokensWithEncoding(textContent, encoding_name)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.metrics.tokenCount = result.token_count;
            this.metrics.cost = result.cost;
            this.metrics.encodingName = encoding_name;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching token count:', error);
            this.loading = false;
          },
        });
    };
    fileReader.onprogress = (event) => {
      if (event.lengthComputable) {
        this.progress = Math.round((event.loaded / event.total) * 100);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  public async extractTextContent(pdfDoc: any): Promise<string> {
    const totalPages = pdfDoc.numPages;
    const pageTextPromises = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str);
      const textStr = textItems.join(' ');
      pageTextPromises.push(textStr);
    }

    const allPagesText = await Promise.all(pageTextPromises);
    return allPagesText.join('\n');
  }

  private countWords(text: string): number {
    const words = text.match(/\b(\w+)\b/g);
    return words ? words.length : 0;
  }

  protected resetMetrics(): void {
    this.metrics = {};
    this.file = null;
    this.progress = 0;
  }
}
