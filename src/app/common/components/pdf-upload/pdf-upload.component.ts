import { Component, inject, OnInit } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { Store } from '@ngrx/store';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { PdfService } from '../../services/pdf.service';
import { SubResolver } from '../../helpers/sub-resolver';
import { takeUntil } from 'rxjs';
import { PdfMetrics } from '../../models/pdf-metrics.model';
import { selectIsDarkTheme } from '../../store/theme/theme.selectors';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
})
export class PdfUploadComponent extends SubResolver implements OnInit {
  private _pdfService = inject(PdfService);

  protected selectedEncoding = 'cl100k_base';
  protected file: File | null = null;
  protected metrics: PdfMetrics = {};
  protected loading = false;
  protected progress = 0;
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);

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
        fileSize: this._pdfService.formatFileSize(file.size),
      };

      const pdfJsDoc = await getDocument({ data: pdfBytes }).promise;
      const textContent = await this._pdfService.extractTextContent(pdfJsDoc);
      this.metrics.wordCount = this._pdfService.countWords(textContent);

      const encoding_name = this.selectedEncoding;
      this._pdfService
        .countTokensWithEncoding(textContent, encoding_name)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.metrics.tokenCount = result.token_count;
            this.metrics.encodingName = encoding_name;
            this.metrics.cost = result.cost;
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

  protected resetMetrics(): void {
    this.metrics = {};
    this.file = null;
    this.progress = 0;
  }

  public get metricEntries(): Array<{
    key: string;
    value: string | number;
    explanation: string;
  }> {
    return Object.entries(this.metrics).map(([key, value]) => {
      const convertedKey = this.toTitleCase(this.splitCamelCase(key));
      const explanation = this._pdfService.getMetricExplanation(key);
      return { key: convertedKey, value, explanation };
    });
  }

  private splitCamelCase(key: string): string {
    return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
